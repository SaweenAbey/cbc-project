import Item from "../models/item.js";

export function getAllItems(req,res){
    Item.find().then(
        (items)=>{
            res.json(items);
        }
    ).catch(
        (error) => {
            res.status(500).json({
                message: "Error retrieving items",
                error: error.message
            });
        }
    );
}
export function saveItem(req,res){
    console.log(req.user);

    if(req.user.role != "admin"){
        res.status(403).json({
            message: "You are cannot access add items"
        })
        return;
    }
    const item = new Item(req.body)
    item.save().then(
        () => {
            res.status(201).json({
                message: "Item saved successfully",
            });
        }
    ).catch(
        (error) => {
            res.status(500).json({
                message: "Error saving item",
                error: error.message
            });
        }
    );
}
export function searchItem(req,res){
    //const itemName = req.body.name;
    const itemName = req.params.name; // Get the item name from the URL parameter

    Item.find(
        {
            name : itemName
        }
    ).then(
        (items) => {
            if (items.length > 0) {
                res.json(items);
            } else {
                res.status(404).json({
                    message: "Item not found"
                });
            }
        }
    ).catch(
        (error) => {
            res.status(500).json({
                message: "Error searching for item",
                error: error.message
            });
        }
    );
}