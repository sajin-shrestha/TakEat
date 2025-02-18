import { NextFunction, Request, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/auth'
import createHttpError from 'http-errors'
import { HttpStatusCodes } from '../constants'
import { ResponseWithPagination, SimpleResponse } from '../utils/ApiResponse'
import { pagination } from '../utils/pagination'
import createFilter from '../utils/filter'
import { TableModel } from '../models/tableModel'
import { HandleError } from '../utils/handleError'

// Create new table
const createTable = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user)
    return next(createHttpError(HttpStatusCodes.NOT_FOUND, 'User Not Found'))

  const { tablename } = req.body

  try {
    const exsistingTable = await TableModel.findOne({ tablename })
    if (exsistingTable) {
      return next(
        createHttpError(HttpStatusCodes.BAD_REQUEST, 'Table already exists')
      )
    }
    await TableModel.create({
      tablename,
    })
    res
      .status(HttpStatusCodes.CREATED)
      .json(
        SimpleResponse.success(
          HttpStatusCodes.CREATED,
          'New Table Created Successfully'
        )
      )
  } catch (error) {
    HandleError(error, next)
  }
}

const getAllTables = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter = createFilter(req, ['tablename', 'status'])
    const { total_count, next_page_number, prev_page_number, data } =
      await pagination(req, TableModel, filter)

    res
      .status(HttpStatusCodes.OK)
      .json(
        ResponseWithPagination.success(
          HttpStatusCodes.OK,
          'Table fetched successfully',
          total_count,
          prev_page_number,
          next_page_number,
          data
        )
      )
  } catch (error) {
    HandleError(error, next)
  }
}

const updateTable = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user)
    return next(createHttpError(HttpStatusCodes.NOT_FOUND, 'User Not Found'))

  const { id } = req.params
  const updates = req.body

  try {
    const updatedTable = await TableModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })

    if (!updatedTable) {
      return next(createHttpError(HttpStatusCodes.NOT_FOUND, 'Table not found'))
    }
    res
      .status(HttpStatusCodes.CREATED)
      .json(
        SimpleResponse.success(HttpStatusCodes.OK, 'Table Updated Successfully')
      )
  } catch (error) {
    HandleError(error, next)
  }
}

const deleteTable = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user)
    return next(createHttpError(HttpStatusCodes.NOT_FOUND, 'User Not Found'))

  const { id } = req.params

  try {
    const deletedTable = await TableModel.findByIdAndDelete(id)
    if (!deletedTable) {
      return next(createHttpError(HttpStatusCodes.NOT_FOUND, 'Table not found'))
    }
    res
      .status(HttpStatusCodes.OK)
      .json(
        SimpleResponse.success(HttpStatusCodes.OK, 'Table Deleted Successfully')
      )
  } catch (error) {
    HandleError(error, next)
  }
}

export { createTable, getAllTables, updateTable, deleteTable }
