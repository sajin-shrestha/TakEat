import mongoose from "mongoose";
import { ITable } from "../types/tableTypes";

const tableSchema = new mongoose.Schema<ITable>(
  {
    tablename: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["available", "occupied"],
      },
      default: "available",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITable>("Table", tableSchema);
