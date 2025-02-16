import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import tableModel from "../models/tableModel";

// Create new table
const createTable = async (req: Request, res: Response, next: NextFunction) => {
  const { tablename, status } = req.body;
  if (!tablename) {
    return next(createHttpError(400, "Table name is required"));
  }

  try {
    const exsistingTable = await tableModel.findOne({ tablename });
    if (exsistingTable) {
      return next(createHttpError(400, "Table already exists"));
    }
    await tableModel.create({
      tablename,
      status,
    });

    res.status(201).json({ message: "New Table Created Successfully" });
  } catch (error) {
    next(createHttpError(500, "Failed to create table"));
  }
};

const getAllTables = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tables = await tableModel.find();
    res.status(200).json(tables);
  } catch (error) {
    return next(createHttpError(500, "Error while fetching tables"));
  }
};

const updateTable = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedTable = await tableModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTable) {
      return next(createHttpError(404, "Table not found"));
    }

    res.status(200).json({ message: "Table Updated Successfully" });
  } catch (error) {
    next(createHttpError(500, "Failed to update table"));
  }
};

const deleteTable = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deletedTable = await tableModel.findByIdAndDelete(id);
    if (!deletedTable) {
      return next(createHttpError(404, "Table not found"));
    }
    res.status(200).json({ message: "Table Deleted Successfully" });
  } catch (error) {
    next(createHttpError(500, "Failed to delete table"));
  }
};

export { createTable, getAllTables, updateTable, deleteTable };
