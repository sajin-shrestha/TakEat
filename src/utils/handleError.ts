import createHttpError from 'http-errors'
import { NextFunction } from 'express'
import { MONGOOSE_VALIDATION_ERROR, HttpStatusCodes } from '../constants'

export const HandleError = (error: any, next: NextFunction) =>
  next(
    createHttpError(
      error.name === MONGOOSE_VALIDATION_ERROR
        ? HttpStatusCodes.BAD_REQUEST
        : HttpStatusCodes.INTERNAL_SERVER_ERROR,
      error.message || 'Internal Server Error',
    ),
  )
