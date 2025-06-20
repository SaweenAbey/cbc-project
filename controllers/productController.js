import Product from "../models/product.js";

export async function createProduct(req,res){
    if(req.user == null){
        res.status(403).json({
            message: "You need logging first to create a product"
        })
        return;
    }
    if(req.user.role != "admin"){
        res.status(403).json({
            message: "You are not allowed to create a product"
        })
        return;
    }
   const product = new Product(req.body)

    try{
        await product.save();
        res.status(201).json({
            message: "Product created successfully",
        });
    }catch(error){
        res.status(500).json({
            message: "Error creating product",
        });
    }
    
}
export function getAllProducts(req,res){
    Product.find().then(
        (products) => {
            res.json(products)
        }
    ).catch(
        (error) => {
            res.status(500).json({
                message: "Error fetching products",
            });
        }
    );
}
export function deleteProduct(req,res){
    if(req.user == null){
        res.status(403).json({
            message: "You need logging first to delete a product"
        })
        return;
    }
    if(req.user.role != "admin"){
        res.status(403).json({
            message: "You are not allowed to delete a product"
        })
        return;
    }
    Product.findOneAndDelete({
        productId : req.params.productId
    }).then(
        (product) => {
            if(product == null){
                res.status(404).json({
                    message: "Product not found"
                });
            }else{
                res.json({
                    message: "Product deleted successfully",
                });
            }
        }
    ).catch(
        (error) => {
            res.status(500).json({
                message: "Error deleting product",
            });
        }
    );
}
export function updateProduct(req,res){
Product.findOneAndUpdate({
    productId : req.params.productId
}, req.body).then(
    (product) => {
        if(product == null){
            res.status(404).json({
                message: "Product not found"
            });
        }else{
            res.json({
                message: "Product updated successfully",
            });
        }
    }
).catch(
    (error) => {
        res.status(500).json({
            message: "Error updating product",
        });
    }
)
};