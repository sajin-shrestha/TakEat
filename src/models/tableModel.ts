import mongoose from 'mongoose'
import { ITable } from '../types/tableTypes'

const tableSchema = new mongoose.Schema<ITable>(
  {
    tablename: {
      type: String,
      required: [true, 'Username is required'],
    },
    status: {
      type: String,
      enum: ['available', 'occupied'],
      default: 'available',
    },
  },
  { timestamps: true }
)

export const TableModel = mongoose.model<ITable>('Table', tableSchema)
