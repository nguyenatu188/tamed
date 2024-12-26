import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import prisma from '../db/prisma.js'

interface DecodedToken extends jwt.JwtPayload {
  userId: string
}

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string
      }
    }
  }
}

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken
    
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' })
    }
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId },
      select: { id: true, username: true, fullname: true, profilePic: true } 
    })
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - User not found' })
    }
    req.user = user
    next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export default protectRoute