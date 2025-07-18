import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  tableId: { type: String, required: true, unique: true },
  name: { type: String }, // Optional (like Table near Window etc.)
  capacity: { type: Number } // Optional
}, { timestamps: true });

export default mongoose.model("Table", TableSchema);
