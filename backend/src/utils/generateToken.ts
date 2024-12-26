import jwt from 'jsonwebtoken'
import { Response } from 'express'

const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '15d' })
  res.cookie('jwt', token, {
    httpOnly: true, //prevent xss attack (cross site scripting)
    maxAge: 15 * 24 * 60 * 60 * 1000, // milliseconds
    secure: process.env.NODE_ENV !== 'development', // dev: cookie được gửi qua http, môi trường kp dev (như prod) : chỉ được gửi qua https.
    sameSite: 'strict' // prevent csrf attack (cross site request forgery)
  })
  return token
}

export default generateToken