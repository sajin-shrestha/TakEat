import { Document } from 'mongoose'

export interface ITable extends Document {
  _id: string
  tablename: string
  status: 'available' | 'occupied'
}
