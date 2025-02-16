import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { TableModel } from "../models/tableModel";
import { HttpStatusCodes } from "../constants";
import { SimpleResponse } from "../utils/ApiResponse";

// Create new table
const createTable = async (req: Request, res: Response, next: NextFunction) => {
  const { tablename, status } = req.body;
  if (!tablename) {
    return next(
      createHttpError(HttpStatusCodes.BAD_REQUEST, "Table name is required")
    );
  }

  try {
    const exsistingTable = await TableModel.findOne({ tablename });
    if (exsistingTable) {
      return next(
        createHttpError(HttpStatusCodes.BAD_REQUEST, "Table already exists")
      );
    }
    await TableModel.create({
      tablename,
      status,
    });
    res
      .status(HttpStatusCodes.CREATED)
      .json(
        SimpleResponse.success(
          HttpStatusCodes.CREATED,
          "New Table Created Successfully"
        )
      );
  } catch (error) {
    return next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create table"
      )
    );
  }
};

const getAllTables = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tables = await TableModel.find();
    res.status(200).json(tables);
  } catch (error) {
    return next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "Error while fetching tables"
      )
    );
  }
};

const updateTable = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedTable = await TableModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTable) {
      return next(
        createHttpError(HttpStatusCodes.NOT_FOUND, "Table not found")
      );
    }
    res
      .status(HttpStatusCodes.CREATED)
      .json(
        SimpleResponse.success(
          HttpStatusCodes.CREATED,
          "Table Updated Successfully"
        )
      );
  } catch (error) {
    return next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update table"
      )
    );
  }
};

const deleteTable = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deletedTable = await TableModel.findByIdAndDelete(id);
    if (!deletedTable) {
      return next(
        createHttpError(HttpStatusCodes.NOT_FOUND, "Table not found")
      );
    }
    res
      .status(HttpStatusCodes.CREATED)
      .json(
        SimpleResponse.success(
          HttpStatusCodes.CREATED,
          "Table Deleted Successfully"
        )
      );
  } catch (error) {
    return next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to delete table"
      )
    );
  }
};

export { createTable, getAllTables, updateTable, deleteTable };
