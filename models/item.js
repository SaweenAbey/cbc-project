import mongoose from "mongoose";   

const itemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    Description: String
});
const Item = mongoose.model("items",itemSchema);
export default Item;

