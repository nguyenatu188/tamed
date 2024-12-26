import { Request, Response } from 'express'
import prisma from '../db/prisma.js'
import bcryptjs from "bcryptjs"
import generateToken from '../utils/generateToken.js'

export const login = async (req: Request, res:Response) => {
  try {
    const { username, password } = req.body //destructuring
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return res.status(400).json({message: "Invalid credentials"})
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(400).json({message: "Invalid password"})
    }

    generateToken(user.id, res)
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

export const logout = async (req: Request, res:Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({message: "Logged out"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Internal server error"})
    
  }
}

export const register = async (req: Request, res:Response) => {
  try {
    const { fullname, username, password, confirmPassword, gender } = req.body
    if (!fullname || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({message: "All fields are required"})
    }

    if (password !== confirmPassword) {
      return res.status(400).json({message: "Passwords do not match"})
    }

    const user = await prisma.user.findUnique({ where: { username } })

    if (user) {
      return res.status(400).json({message: "User already exists"})
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
        profilePic: gender === "male" ? boyProfile : girlProfile
      }
    })

    if (newUser) {
      generateToken(newUser.id, res)
      return res.status(201).json({
        id: newUser.id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilePic: newUser.profilePic
      })
    } else {
      return res.status(400).json({message: "Invalid user data"})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Internal server error"})
  }
}

//get the current user
export const getMe = async (req: Request, res:Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    
    if (!user) {
      return res.status(404).json({message: "User not found"})
    }

    res.status(200).json({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Internal server error"})
  }
}