/**
 * @fileoverview Product API tests with MongoDB
 */

const request = require("supertest");
const { MongoClient } = require("mongodb");

// Mock do database para testes
jest.mock("../src/config/database", () => ({
  connect: jest.fn().mockResolvedValue(true),
  getDb: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              _id: "507f1f77bcf86cd799439011",
              name: "Smartphone Galaxy Pro",
              price: 2499.99,
              description: "Smartphone premium",
              category: "Eletrônicos",
              inStock: true,
              rating: 4.8,
              reviews: 1247,
            },
          ]),
        }),
      }),
      findOne: jest.fn().mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
        name: "Smartphone Galaxy Pro",
        price: 2499.99,
        description: "Smartphone premium",
        category: "Eletrônicos",
        inStock: true,
        rating: 4.8,
        reviews: 1247,
        specifications: {
          display: '6.7" AMOLED',
          camera: "108MP",
        },
      }),
      countDocuments: jest.fn().mockResolvedValue(6),
      distinct: jest.fn().mockResolvedValue(["Eletrônicos", "Computadores"]),
    }),
  }),
  close: jest.fn().mockResolvedValue(true),
  isConnectedToDb: jest.fn().mockReturnValue(true),
  getStatus: jest.fn().mockReturnValue({
    connected: true,
    database: "product_showcase_test",
    timestamp: new Date().toISOString(),
  }),
}));

// Importar app após o mock
const app = require("../server");

describe("Product API", () => {
  describe("GET /api/produtos", () => {
    it("should return all products", async () => {
      const response = await request(app).get("/api/produtos").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.total).toBe(response.body.data.length);
    });

    it("should filter products by category", async () => {
      const response = await request(app)
        .get("/api/produtos?category=Eletrônicos")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it("should search products by query", async () => {
      const response = await request(app)
        .get("/api/produtos?search=smartphone")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe("GET /api/produtos/:id", () => {
    it("should return a specific product", async () => {
      const response = await request(app)
        .get("/api/produtos/507f1f77bcf86cd799439011")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toHaveProperty("price");
    });

    it("should return 404 for non-existent product", async () => {
      // Mock para retornar null
      const database = require("../src/config/database");
      database.getDb.mockReturnValueOnce({
        collection: jest.fn().mockReturnValue({
          findOne: jest.fn().mockResolvedValue(null),
        }),
      });

      const response = await request(app)
        .get("/api/produtos/507f1f77bcf86cd799439999")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Produto não encontrado");
    });

    it("should return 400 for invalid product ID", async () => {
      const response = await request(app)
        .get("/api/produtos/invalid-id")
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body.status).toBe("OK");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("database");
    });
  });

  describe("GET /api/categorias", () => {
    it("should return categories", async () => {
      const response = await request(app).get("/api/categorias").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });
});
