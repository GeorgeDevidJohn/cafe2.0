import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema(
  {
    productid: {
      type: String,
      required: true,
    },  
    productName: {
      type: String,
      required: true,
    },
    count: {
        type: Number,
        required: true,
      },
    createdAt:{
      type:String
    }  
  } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.models.Sales || mongoose.model("Sales", SalesSchema);
