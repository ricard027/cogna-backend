/**
 * @fileoverview Product model for MongoDB operations
 */

const { ObjectId } = require("mongodb");
const database = require("../config/database");

class Product {
  constructor() {
    this.collectionName = "products";
  }

  /**
   * Get products collection
   * @returns {Collection}
   */
  getCollection() {
    const db = database.getDb();
    return db.collection(this.collectionName);
  }

  /**
   * Get all products with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>}
   */
  async findAll(filters = {}) {
    try {
      const collection = this.getCollection();
      const query = {};

      // Category filter
      if (filters.category) {
        query.category = { $regex: new RegExp(filters.category, "i") };
      }

      // Search filter
      if (filters.search) {
        query.$or = [
          { name: { $regex: new RegExp(filters.search, "i") } },
          { description: { $regex: new RegExp(filters.search, "i") } },
          { category: { $regex: new RegExp(filters.search, "i") } },
        ];
      }

      const products = await collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      return products.map(this.formatProduct);
    } catch (error) {
      console.error("Error finding products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  /**
   * Find product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const collection = this.getCollection();
      const product = await collection.findOne({ _id: new ObjectId(id) });

      return product ? this.formatProduct(product) : null;
    } catch (error) {
      console.error("Error finding product by ID:", error);
      throw new Error("Failed to fetch product");
    }
  }

  /**
   * Create new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>}
   */
  async create(productData) {
    try {
      const collection = this.getCollection();

      const product = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(product);
      const createdProduct = await collection.findOne({
        _id: result.insertedId,
      });

      return this.formatProduct(createdProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product");
    }
  }

  /**
   * Update product by ID
   * @param {string} id - Product ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object|null>}
   */
  async updateById(id, updateData) {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const collection = this.getCollection();

      const update = {
        ...updateData,
        updatedAt: new Date(),
      };

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: "after" }
      );

      return result.value ? this.formatProduct(result.value) : null;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }
  }

  /**
   * Delete product by ID
   * @param {string} id - Product ID
   * @returns {Promise<boolean>}
   */
  async deleteById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        return false;
      }

      const collection = this.getCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }
  }

  /**
   * Get products count
   * @returns {Promise<number>}
   */
  async count() {
    try {
      const collection = this.getCollection();
      return await collection.countDocuments();
    } catch (error) {
      console.error("Error counting products:", error);
      throw new Error("Failed to count products");
    }
  }

  /**
   * Get unique categories
   * @returns {Promise<Array>}
   */
  async getCategories() {
    try {
      const collection = this.getCollection();
      return await collection.distinct("category");
    } catch (error) {
      console.error("Error getting categories:", error);
      throw new Error("Failed to get categories");
    }
  }

  /**
   * Format product for API response
   * @param {Object} product - Raw product from database
   * @returns {Object}
   */
  formatProduct(product) {
    return {
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      inStock: product.inStock,
      rating: product.rating,
      reviews: product.reviews,
      specifications: product.specifications,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}

module.exports = new Product();
