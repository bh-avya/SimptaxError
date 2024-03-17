import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const addProduct = asyncHandler(async(req,res)=>{
    try {
        const {name, description, price, category, quantity, company} = req.fields;
    
        if(!name || !description || !price || !category || !quantity || !company){
            return res.json({message : "Enter valid field value!"})
        }
        const product = new Product({...req.fields});
        await product.save();
        res.json({
            message : "Product added successfully",
            product
        });
    } 


    catch (error) {
        res.status(400).json({message : "Couldn't add product"});
    }
})

const updateProduct = asyncHandler(async(req,res)=>{
    try {
        const {name, description, price, category, quantity, company} = req.fields;
    
        if(!name || !description || !price || !category || !quantity || !company){
            return res.json({message : "Enter valid field value!"})
        }

        const prod = await Product.findByIdAndUpdate(req.params.id,{...req.fields}, {new:true});
        await prod.save();
        res.json({
            message : "Product has been updated",
            prod
        })

    } catch (error) {
        res.status(400).json({message : "Couldn't update the product"});
    }
})

const deleteProduct  = asyncHandler(async(req,res)=>{

    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.json({
            message : "Product has been deleted successfully"
        })
    } catch (error) {
        res.status(400).json({message : "Couldn't delete the product"});
    }
})

const getProducts = asyncHandler(async(req,res)=>{
    try {

        const size = 6;
        const keyword = req.query.keyword 
         ? {name : {$regex : req.query.keyword, $options : "i"} } 
         : {};
        const count = await Product.countDocuments({...keyword})
        const products = await Product.find({...keyword}).limit(size);

        res.json ({
            products, 
            page: 1, 
            pages: Math.ceil(count/size), 
            hasMore: false
        });
    } catch (error) {
        res.status(400).json({message : "Couldn't get all products"});

    }
})

const getProductByID = asyncHandler(async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            return res.json(product);
        }
        else{
            res.status(404).json({message: "Product not found"});
        }
    } catch (error) {
        res.status(400).json({message : "Couldn't find product"});

    }
})


const getAllProducts = asyncHandler(async(req,res)=>{

    try {
        const products = await Product.find({})
          .populate("category")
          .limit(12)
          .sort({ createAt: -1 });
    
        res.json(products);
      } 
      catch (error) {
        res.status(400).json(error.message);;
      }
});

const addProductReview = asyncHandler(async(req,res)=>{

    try {
        const {rating, comment} = req.body;
        const product = await Product.findById(req.params.id);

        if(product){
            const prevReview = product.reviews.find(r => r.user.toString() == req.user._id.toString());
            if(prevReview) {
                res.status(400).json({message : "Product already reviewed"})
            }

            const review = {
                name : req.user.username,
                rating : Number(rating),
                comment, 
                user : req.user._id
            }

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item)=>item.rating + acc, 0)/product.reviews.length;

            await product.save();
            res.status(201).json({message : "Review added"})
        }
        else{
            res.status(404).json({message : "Product not found "}); 
        }

      } 
      catch (error) {
        res.status(400).json(error.message);;
      }
});

const getTop = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
    } 
    catch (error) {
        res.status(400).json(error.message);
    }
  });

const getLatest = asyncHandler(async (req,res)=>{
    try {
        const products = await Product.find().sort({ _id: -1 }).limit(5);
        res.json(products);
    } 
    catch (error) {
        res.status(400).json(error.message);
    }
})

const filterProducts = asyncHandler(async (req,res)=>{
    try {
        const {check, radio} = req.body;
        let args ={};
        if(check.length >0  ){
            args.category = check;
        }
        if(radio.length > 0){
            args.price = {$gte: radio[0], $lte : radio[1]};
        }
        const products = await Product.find(args);
        res.json(products);
    } 
    catch (error) {
        res.status(500).json(error.message);
    }
})

export {addProduct, updateProduct, deleteProduct, getProducts, getProductByID, getAllProducts,filterProducts, addProductReview, getTop, getLatest};