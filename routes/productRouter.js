import express from 'express';

import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers/productController.js";


const productRouter = express.Router();

productRouter.post("/",createProduct);
productRouter.get("/",getAllProducts);
productRouter.delete("/:productId",deleteProduct);
productRouter.put("/:productId",updateProduct);



export default productRouter;
