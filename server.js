/**
 * @fileoverview Main server file with MongoDB integration
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const database = require("./src/config/database");
const productRoutes = require("./src/routes/productRoutes");

// Load environment variables
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: "Muitas tentativas. Tente novamente em 15 minutos.",
  },
});
app.use(limiter);

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api", productRoutes);

// Health check with database status
app.get("/health", async (req, res) => {
  try {
    const dbStatus = database.getStatus();

    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database: dbStatus,
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: "Database connection failed",
      message: error.message,
    });
  }
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    error: "Algo deu errado!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Erro interno do servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.originalUrl,
    method: req.method,
  });
});

// Start server with database connection
async function startServer() {
  try {
    // Só conecta ao banco se não estiver em ambiente de teste
    if (process.env.NODE_ENV !== "test") {
      await database.connect();
    }

    // Start server apenas se não estiver sendo importado para testes
    if (require.main === module) {
      const server = app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
        console.log(`📱 Health check: http://localhost:${PORT}/health`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
        if (process.env.NODE_ENV !== "test") {
          console.log(`📊 Database: ${database.getStatus().database}`);
        }
      });

      // Graceful shutdown
      process.on("SIGTERM", async () => {
        console.log("SIGTERM received. Shutting down gracefully...");
        server.close(async () => {
          if (process.env.NODE_ENV !== "test") {
            await database.close();
          }
          console.log("Process terminated");
          process.exit(0);
        });
      });

      process.on("SIGINT", async () => {
        console.log("SIGINT received. Shutting down gracefully...");
        server.close(async () => {
          if (process.env.NODE_ENV !== "test") {
            await database.close();
          }
          console.log("Process terminated");
          process.exit(0);
        });
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
}

// Start the application apenas se não for teste
if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;
