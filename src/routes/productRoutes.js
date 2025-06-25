/**
 * @fileoverview Product routes with full CRUD operations
 */

const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/produtos", productController.getAllProducts);

router.get("/produtos/:id", productController.getProductById);

router.post("/produtos", productController.createProduct);

router.put("/produtos/:id", productController.updateProduct);

router.delete("/produtos/:id", productController.deleteProduct);

router.get("/categorias", productController.getCategories);

module.exports = router;
