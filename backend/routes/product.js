const express = require("express");
const {
  getProducts,
  newProduct,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

const { isAuthenticatedUser} = require('../middleware/auth);
const router = express.Router();
router.route("/products").get(isAuthenticatedUser,getProducts);
router.route("/admin/product/new").post(newProduct);
router.route("/product/:id").get(getSingleProduct);
router.route("/admin/products/:id").put(updateProduct).delete(deleteProduct);
module.exports = router;
