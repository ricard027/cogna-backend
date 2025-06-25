/**
 * @fileoverview Product service with MongoDB integration
 */

const Product = require("../models/product");

class ProductService {
  /**
   * Get all products with basic information
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>}
   */
  async getAllProducts(filters = {}) {
    try {
      const products = await Product.findAll(filters);

      // Return basic product info for listing
      return products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        category: product.category,
        inStock: product.inStock,
        rating: product.rating,
        reviews: product.reviews,
      }));
    } catch (error) {
      console.error("ProductService.getAllProducts error:", error);
      throw error;
    }
  }

  /**
   * Get product by ID with full details
   * @param {string} id - Product ID
   * @returns {Promise<Object|null>}
   */
  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      console.error("ProductService.getProductById error:", error);
      throw error;
    }
  }

  /**
   * Get products by category
   * @param {string} category - Product category
   * @returns {Promise<Array>}
   */
  async getProductsByCategory(category) {
    try {
      return await this.getAllProducts({ category });
    } catch (error) {
      console.error("ProductService.getProductsByCategory error:", error);
      throw error;
    }
  }

  /**
   * Search products by query string
   * @param {string} query - Search query
   * @returns {Promise<Array>}
   */
  async searchProducts(query) {
    try {
      return await this.getAllProducts({ search: query });
    } catch (error) {
      console.error("ProductService.searchProducts error:", error);
      throw error;
    }
  }

  /**
   * Create new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>}
   */
  async createProduct(productData) {
    try {
      return await Product.create(productData);
    } catch (error) {
      console.error("ProductService.createProduct error:", error);
      throw error;
    }
  }

  /**
   * Update product
   * @param {string} id - Product ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object|null>}
   */
  async updateProduct(id, updateData) {
    try {
      return await Product.updateById(id, updateData);
    } catch (error) {
      console.error("ProductService.updateProduct error:", error);
      throw error;
    }
  }

  /**
   * Delete product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>}
   */
  async deleteProduct(id) {
    try {
      return await Product.deleteById(id);
    } catch (error) {
      console.error("ProductService.deleteProduct error:", error);
      throw error;
    }
  }

  /**
   * Get available categories
   * @returns {Promise<Array>}
   */
  async getCategories() {
    try {
      return await Product.getCategories();
    } catch (error) {
      console.error("ProductService.getCategories error:", error);
      throw error;
    }
  }

  /**
   * Get products count
   * @returns {Promise<number>}
   */
  async getProductsCount() {
    try {
      return await Product.count();
    } catch (error) {
      console.error("ProductService.getProductsCount error:", error);
      throw error;
    }
  }
}

module.exports = new ProductService();
