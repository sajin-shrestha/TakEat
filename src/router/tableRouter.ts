import express from 'express'
import {
  createTable,
  deleteTable,
  getAllTables,
  updateTable,
} from '../controllers/tableController'
import authMiddleware from '../middlewares/auth'

const tableRouter = express.Router()
/**
 * @swagger
 * /api/tables:
 *   get:
 *     tags:
 *       - Tables
 *     summary: Retrieve all tables
 *     responses:
 *       200:
 *         description: A list of tables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   tablename:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [available, occupied]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Failed to retrieve tables
 */
tableRouter.get('/', getAllTables)

/**
 * @swagger
 * /api/tables:
 *   post:
 *     tags:
 *       - Tables
 *     summary: Create a new table
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tablename:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [available, occupied]
 *     responses:
 *       201:
 *         description: New table created successfully
 *       400:
 *         description: Table name is required
 *       500:
 *         description: Failed to create table
 */
tableRouter.post('/', authMiddleware, createTable)

/**
 * @swagger
 * /api/tables/{id}:
 *   patch:
 *     tags:
 *       - Tables
 *     summary: Update a table by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the table to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tablename:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [available, occupied]
 *     responses:
 *       200:
 *         description: Table updated successfully
 *       404:
 *         description: Table not found
 *       500:
 *         description: Failed to update table
 */
tableRouter.patch('/:id', authMiddleware, updateTable)

/**
 * @swagger
 * /api/tables/{id}:
 *   delete:
 *     tags:
 *       - Tables
 *     summary: Delete a table by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the table to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Table deleted successfully
 *       404:
 *         description: Table not found
 *       500:
 *         description: Failed to delete table
 */
tableRouter.delete('/:id', authMiddleware, deleteTable)

export default tableRouter
