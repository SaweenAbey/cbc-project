import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({

    productId :{
        type : String,
        required: true,
        unique: true
    },
    name :{
        type : String,
        required: true
    },
    altName : {
        type : [String],
        default: []
    },
    price : {
        type : Number,
        required: true
    },
    labelPrice : {
        type : Number,
        required: true
    },
    description : {
        type : String,
        required: true
    },
    image : {
        type : [String],
        required: true,
        default: ["https://th.bing.com/th/id/OIP.9qTo5MUPJzx3ak8kzRlJDQHaE4?w=278&h=182&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3"]
    },
    stock :{
        type : Number,
        required: true,
        default: 0
    }
})
const Product = mongoose.model("product", productSchema);
export default Product;

