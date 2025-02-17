import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import bcrypt from 'bcrypt'

import { generateToken } from '../utils/token'
import { validateEmail, validatePassword } from '../utils/validation'
import { AuthenticatedRequest } from '../middlewares/auth'
import { HttpStatusCodes } from '../constants'
import { SimpleResponse } from '../utils/ApiResponse'
import { UserModel } from '../models/userModel'

/**
 * Create/Register new user
 */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return next(
      createHttpError(HttpStatusCodes.BAD_REQUEST, 'All fields are required')
    )
  }

  if (!validateEmail(email)) {
    return next(
      createHttpError(HttpStatusCodes.BAD_REQUEST, 'Invalid email format')
    )
  }

  if (!validatePassword(password)) {
    return next(
      createHttpError(
        HttpStatusCodes.BAD_REQUEST,
        'Password must be 8-15 characters long, include at least one number and one special character'
      )
    )
  }

  try {
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return next(
        createHttpError(
          HttpStatusCodes.BAD_REQUEST,
          'User already exists with this email'
        )
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await UserModel.create({
      username,
      email,
      password: hashedPassword,
    })

    res
      .status(HttpStatusCodes.CREATED)
      .json(
        SimpleResponse.success(
          HttpStatusCodes.CREATED,
          'New user created successfully'
        )
      )
  } catch (error) {
    return next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error while creating user'
      )
    )
  }
}

/**
 * Login User
 */
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(
      createHttpError(HttpStatusCodes.BAD_REQUEST, 'All fields are required')
    )
  }

  try {
    const user = await UserModel.findOne({ email })
    if (!user) {
      return next(
        createHttpError(HttpStatusCodes.NOT_FOUND, 'User does not exist')
      )
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return next(
        createHttpError(HttpStatusCodes.BAD_REQUEST, 'Incorrect password')
      )
    }

    const token = generateToken(user._id)
    res.status(HttpStatusCodes.OK).json({ accessToken: token })
  } catch (error) {
    return next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error while signing JWT token'
      )
    )
  }
}

/**
 * Get User Profile
 */
const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      return next(
        createHttpError(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          'Error authenticating user'
        )
      )

    const user = await UserModel.findById(req.user.id).select('-password')

    if (!user) {
      return next(createHttpError(HttpStatusCodes.NOT_FOUND, 'User not found'))
    }

    res
      .status(HttpStatusCodes.OK)
      .json(
        SimpleResponse.success(
          HttpStatusCodes.CREATED,
          'User Profile fetch success',
          user
        )
      )
  } catch (error) {
    return next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error while fetching user profile'
      )
    )
  }
}

/**
 * Edit User Profile - Only owner can edit their username
 */
const editProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body
  const userId = req.user?.id

  if (!userId) {
    return next(
      createHttpError(HttpStatusCodes.UNAUTHORIZED, 'User not authenticated')
    )
  }

  if (!username) {
    return next(
      createHttpError(
        HttpStatusCodes.BAD_REQUEST,
        'Username is required to update'
      )
    )
  }

  try {
    const user = await UserModel.findById(userId)

    if (!user) {
      return next(createHttpError(HttpStatusCodes.NOT_FOUND, 'User not found'))
    }

    // Ensure the user can only edit their own profile
    if (userId !== String(user._id)) {
      return next(
        createHttpError(
          HttpStatusCodes.FORBIDDEN,
          'You are not allowed to edit this profile'
        )
      )
    }

    user.username = username

    await user.save()

    res
      .status(HttpStatusCodes.OK)
      .json(
        SimpleResponse.success(
          HttpStatusCodes.OK,
          'Username updated successfully',
          user
        )
      )
  } catch (error) {
    return next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error while updating username'
      )
    )
  }
}

export { createUser, loginUser, getProfile, editProfile }
