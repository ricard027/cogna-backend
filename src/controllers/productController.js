/**
 * @fileoverview Product controller with MongoDB integration
 */

const productService = require("../services/productService");

class ProductController {
  async getAllProducts(req, res) {
    try {
      const { category, search } = req.query;
      const filters = {};

      if (search) filters.search = search;
      if (category) filters.category = category;

      const products = await productService.getAllProducts(filters);

      res.json({
        success: true,
        data: products,
        total: products.length,
        filters: { category, search },
      });
    } catch (error) {
      console.error("ProductController.getAllProducts error:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar produtos",
        message: error.message,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID do produto é obrigatório",
        });
      }

      const product = await productService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Produto não encontrado",
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("ProductController.getProductById error:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar produto",
        message: error.message,
      });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;

      if (!productData.name || !productData.price) {
        return res.status(400).json({
          success: false,
          error: "Nome e preço são obrigatórios",
        });
      }

      const product = await productService.createProduct(productData);

      res.status(201).json({
        success: true,
        data: product,
        message: "Produto criado com sucesso",
      });
    } catch (error) {
      console.error("ProductController.createProduct error:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao criar produto",
        message: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID do produto é obrigatório",
        });
      }

      const product = await productService.updateProduct(id, updateData);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Produto não encontrado",
        });
      }

      res.json({
        success: true,
        data: product,
        message: "Produto atualizado com sucesso",
      });
    } catch (error) {
      console.error("ProductController.updateProduct error:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao atualizar produto",
        message: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID do produto é obrigatório",
        });
      }

      const deleted = await productService.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Produto não encontrado",
        });
      }

      res.json({
        success: true,
        message: "Produto deletado com sucesso",
      });
    } catch (error) {
      console.error("ProductController.deleteProduct error:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao deletar produto",
        message: error.message,
      });
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await productService.getCategories();

      res.json({
        success: true,
        data: categories,
        total: categories.length,
      });
    } catch (error) {
      console.error("ProductController.getCategories error:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar categorias",
        message: error.message,
      });
    }
  }
}

module.exports = new ProductController();
