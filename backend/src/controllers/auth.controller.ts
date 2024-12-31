import { Request, Response } from 'express'
import prisma from '../db/prisma.js'
import bcryptjs from "bcryptjs"
import generateToken from '../utils/generateToken.js'

export const login = async (req: Request, res:Response) => {
  try {
    const { username, password } = req.body //destructuring
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      res.status(400).json({error: "Invalid credentials"})
      return
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password)

    if (!isPasswordCorrect) {
      res.status(400).json({error: "Invalid password"})
      return
    }

    generateToken(user.id, res)
    res.status(200).json({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic,
    })
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json({error: "Internal server error"})
  }
}

export const logout = async (req: Request, res:Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({message: "Logged out"})
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json({error: "Internal server error"})
    
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { fullname, username, password, confirmPassword, gender } = req.body
    if (!fullname || !username || !password || !confirmPassword || !gender) {
      res.status(400).json({error: "All fields are required"})
      return
    }
    if (password !== confirmPassword) {
      res.status(400).json({error: "Passwords do not match"})
      return
    }

    const user = await prisma.user.findUnique({ where: { username } })

    if (user) {
      res.status(400).json({error: "User already exists"})
      return
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)
    
    const boyProfile = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfile = `https://avatar.iran.liara.run/public/girl?username=${username}`
    
    const newUser = await prisma.user.create({
      data: {
        fullname,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfile : girlProfile,
      },
    })

    if (newUser) {
      generateToken(newUser.id, res)
      res.status(201).json({
        id: newUser.id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilePic: newUser.profilePic,
      })
    } else {
      res.status(400).json({error: "Invalid user data"})
    }
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json({error: "Internal server error"})
  }
}

//get the current user
export const getMe = async (req: Request, res:Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    
    if (!user) {
      res.status(404).json({message: "User not found"})
      return
    }

    res.status(200).json({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal server error"})
  }
}