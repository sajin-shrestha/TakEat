import express from 'express'
import {
  createUser,
  editProfile,
  getProfile,
  loginUser,
} from './userController'
import authMiddleware from '../middlewares/auth'

const userRouter = express.Router()

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: 'string'
 *               email:
 *                 type: string
 *                 example: 'string'
 *               password:
 *                 type: string
 *                 example: 'string'
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: number
 *                 message:
 *                   type: string
 *                   example: "string"
 *                 data:
 *                   type: "null"
 *                   example: null
 */
userRouter.post('/register', createUser)

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'string'
 *               password:
 *                 type: string
 *                 example: 'string'
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User login successful and a JWT token is returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 */
userRouter.post('/login', loginUser)

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: number
 *                 message:
 *                   type: string
 *                   example: "string"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "string"
 *                     username:
 *                       type: string
 *                       example: "string"
 *                     email:
 *                       type: string
 *                       example: "string"
 *                     role:
 *                       type: string
 *                       example: "string"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-16T07:06:06.295Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-16T07:14:49.430Z"
 *
 *     security:
 *       - bearerAuth: []
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
userRouter.get('/profile', authMiddleware, getProfile)

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     tags:
 *       - Users
 *     description: Allows the authenticated user to update their username. Only the owner can edit their own username.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: 'newUsername'
 *             required:
 *               - username
 *     responses:
 *       200:
 *         description: Username updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: number
 *                 message:
 *                   type: string
 *                   example: 'Username updated successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 'string'
 *                     username:
 *                       type: string
 *                       example: 'string'
 *                     email:
 *                       type: string
 *                       example: 'string'
 *                     role:
 *                       type: string
 *                       example: 'string'
 *     security:
 *       - bearerAuth: []
 */
userRouter.patch('/profile', authMiddleware, editProfile)

export default userRouter
