import Order from "../models/order.js";

export function createOrder(req,res){
    if(req.user == null){
        res.status(401).json({
            message: "Unauthorized access"
        });
        return;
    }
    const body = req.body;
    const orderData ={
        orderId : "",
        email : req.user.email,
        name : body.name,
        address : body.address,
        phoneNumber : body.phoneNumber,
        billItems : [],
        total : 0
    }
    Order.find().sort({
        date :-1
    }).limit(1).then ((lastBills) => {
        if(lastBills.length == 0){
        orderData.orderId = "ORD001";
    }else{
        const lastBill = lastBills[0];
        const lastOrderId = lastBill.orderId;//"ORD0061"
        const lastOrderNumber = lastOrderId.replace("ORD", "");//"0061"
        const lastOrderNumberInt = parseInt(lastOrderNumber);//61
        const newOrderNumber = lastOrderNumberInt + 1;//62
        orderData.orderId = "ORD" + newOrderNumber.toString().padStart(4, '0');//addding ORD and "0061"

    }

    // for(let i=0;i<body.billItems.length;i++){
    //     const billItem = body.billItems[i];

    // }

    const order = new Order(orderData);

    order.save()
        .then(() => {
            res.status(201).json({
                message: "Order created successfully",
                orderId: orderData.orderId
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error creating order",
                error: error.message
            });
        });
    })

}
export function getOrders(req,res){
    if(req.user == null){
        res.status(401).json({
            message: "Unauthorized access"
        });
        return;
    }
    if(req.user.role == admin){
        Order.find().then(
            (orders)=>{
                res.json(orders)
            }
        ).catch(
            (err)=>{
                res.status(500).json({
                    message : "Order not found"
                })
            }
        )
    }else{
        Order.find({
            email : req.user.email
        }).then(
            (orders)=>{
                res.json(orders)
            }
        ).catch(
            (err)=>{
                res.status(500).json({
                    message : "Order not found"
                })
            }
        )
    }
}