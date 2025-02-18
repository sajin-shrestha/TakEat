import mongoose, { CallbackError } from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser } from '../types/userTypes'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password Regex: 8-15 characters, at least one number, and one special character
const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,15}$/

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [emailRegex, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      match: [
        passwordRegex,
        'Password must be 8-15 characters long, include at least one number and one special character',
      ],
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
  },
  { timestamps: true }
)

/**
 * Mongoose Pre-save Hook for Password Hashing
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next() // skip if password is unchanged

  try {
    this.password = await bcrypt.hash(this.password, 10) // hash the password
    next()
  } catch (error) {
    next(error as CallbackError) // pass errors to next middleware
  }
})

export const UserModel = mongoose.model<IUser>('User', userSchema)
