/**
 * @fileoverview Database configuration and connection management
 */

const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

class Database {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  /**
   * Connect to MongoDB
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      if (this.isConnected) {
        console.log("📦 Database already connected");
        return this.db;
      }

      const uri = process.env.MONGODB_URI;
      const dbName = process.env.DB_NAME || "product_showcase";

      if (!uri) {
        throw new Error("MONGODB_URI environment variable is not defined");
      }

      console.log("🔌 Connecting to MongoDB...");

      // Configuração atualizada do MongoDB driver
      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });

      await this.client.connect();
      this.db = this.client.db(dbName);
      this.isConnected = true;

      console.log("✅ Successfully connected to MongoDB");
      console.log(`📊 Database: ${dbName}`);

      // Test the connection
      await this.db.admin().ping();
      console.log("🏓 Database ping successful");

      return this.db;
    } catch (error) {
      console.error("❌ MongoDB connection error:", error.message);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Get database instance
   * @returns {Db} MongoDB database instance
   */
  getDb() {
    if (!this.isConnected || !this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }

  /**
   * Close database connection
   * @returns {Promise<void>}
   */
  async close() {
    try {
      if (this.client && this.isConnected) {
        await this.client.close();
        this.isConnected = false;
        console.log("🔌 Database connection closed");
      }
    } catch (error) {
      console.error("❌ Error closing database connection:", error.message);
      throw error;
    }
  }

  /**
   * Check if database is connected
   * @returns {boolean}
   */
  isConnectedToDb() {
    return this.isConnected;
  }

  /**
   * Get connection status
   * @returns {Object}
   */
  getStatus() {
    return {
      connected: this.isConnected,
      database: process.env.DB_NAME || "product_showcase",
      timestamp: new Date().toISOString(),
    };
  }
}

// Export singleton instance
module.exports = new Database();
