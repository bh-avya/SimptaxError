import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

function calPrices(orderItems){
    const itemPrice = orderItems.reduce((acc, item)=> acc + item.price*item.quantity, 0)
    const shippingPrice = itemPrice > 100 ?0 :10;
    const taxRate = 0.2;
    const taxPrice = (itemPrice * taxRate).toFixed(2);
    const totalPrice = (
        (itemPrice + shippingPrice + parseFloat(taxPrice)).toFixed(2)
    )

    return{
        itemPrice  : itemPrice.toFixed(2),
        shippingPrice : shippingPrice.toFixed(2),
        taxPrice,
        totalPrice
    }

}

const createOrder  = async(req,res) =>{
    try {  
        const {orderItems, shippingAddress, paymentMethod} = req.body;
        if(orderItems && orderItems.length==0){
            res.status(400);
            throw new Error("No Items");
        }

        const itemExisting = await Product.find({
             _id: { $in: orderItems.map((i) => i._id) },
        });
      
        const orderItemsDB = orderItems.map((itemFromClient) => {
            const itemMatch = itemExisting.find(
                (itemFromDB) => itemFromDB._id.toString() == itemFromClient._id
            );
      
            if (!itemMatch) {
                res.status(404);
                throw new Error("Product not found");
            }
      
            return {
                ...itemFromClient,
                product: itemFromClient._id,
                price: itemMatch.price,
                _id: undefined,
            };
        });
      
        const { itemPrice, taxPrice, shippingPrice, totalPrice } = calPrices(orderItemsDB);
      
        const order = new Order({
            orderItems: orderItemsDB,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
      
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } 
    catch (error) {
        res.status(500).json({error: error.message})
    }
}

const getAllOrders = async(req,res)=>{
    try {
        const orders = await Order.find({}).populate("user", "id username");
        res.json(orders);
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

const userOrders  = async(req,res) =>{
    try {
        const orders = await Order.find({user : req.user._id})
        res.json(orders);
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

const totalOrders = async(req,res) =>{
    try {
        const totalOrders = await Order.countDocuments();
        res.json({totalOrders});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

const calcTotalSales = async(req,res)=>{
    try {
        const orders = await Order.find();
        const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        res.json({totalSales});

    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

const calcTotalSalesByDate = async(req,res)=>{
    try {
        const salesByDate = await Order.aggregate([
        {
            $match: {
                paid: true,
            },
        },
        {
            $group: {
                _id: {$dateToString: { format: "%Y-%m-%d", date: "$paidAt" }},
                totalSales: { $sum: "$totalPrice" },
            },
        },
    ]);
    res.json(salesByDate);
}
    catch (error) {
        res.status(500).json({error : error.message});
    }
}

const orderByID = async(req,res)=>{
    try {
        const order = await Order.findById(req.params.id).populate("user", "username email");
        if(order){
            res.json(order);
        }
        else{
            res.status(404);
            throw new Error("Order not found ");
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

const markOrderAsPaid  = async (req,res)=>{
    try {
        const order = await Order.findById(req.pramas.id);
        if(order){
            order.paid = true;
            order.paidAt = Date.now();
            order.paymentResult  = {
                id : req.body.id,
                stauts : req.body.status,
                update_time : req.body.update_time,
                email_address : req.body.email_address
            }

            const updateOrder = await order.save();
            res.status(200).json(updateOrder);
        }
        else{
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

const markOrderAsDelivered  = async (req,res) => {
    try {
        const order = await Order.findById(req.params.id);
        if(order){
            order.delivered = true;
            order.deliverDate = Date.now();
            const updateOrder = await order.save();
            res.json(updateOrder);
        }
        else{
            res.status(404);
            throw new Error ("Order not found");
        }

    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

export {createOrder, getAllOrders, userOrders, totalOrders, calcTotalSales, calcTotalSalesByDate, orderByID, markOrderAsPaid, markOrderAsDelivered};