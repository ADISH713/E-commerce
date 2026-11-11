import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:2,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:1
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    brand:{
        type:String,
        required:true,
        trim:true
    },
    images:{
        type:[String],
        required:true
    },
    stock:{
        type:Number,
        required:true,
        min:0,
        default:0
    },
    specs:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    },
    rating:{
        type:Number,
        required :true,
        min:0,
        max:5,
        default:0
    },
    reviewsCount:{
        type:Number,
        required:true,
        min:0,
        default:0
    },
    grade:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }

},{timestamps:true});

productSchema.index(
    { name: 1, category: 1 },
    { unique: true }
);

const Products = mongoose.model("Products",productSchema);
 export default Products