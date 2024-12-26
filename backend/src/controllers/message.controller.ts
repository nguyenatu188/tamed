import { Request, Response } from "express"
import prisma from "../db/prisma.js";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body
    const { id:receiverId } = req.params
    const senderId = req.user.id

    let conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, receiverId],
        }
      }
    })

    // the first message being send, create a new conversation
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: {
            set: [senderId, receiverId]
          }
        }
      })
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conversation.id
      }
    })

    if(newMessage) {
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id
            },
          },
        },
      })
    }

    // Socket io will go here

    res.status(200).json(newMessage)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getMessage = async (req: Request, res: Response) => {
  try {
    const { id:userToChatId } = req.params
    const senderId = req.user.id

    const conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, userToChatId],
        }
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    })

    if (!conversation) {
      return res.status(200).json({});
    }

    res.status(200).json(conversation.messages)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const authUserId = req.user.id

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserId
        }
      },
      select: {
        id: true,
        fullname: true,
        profilePic: true
      }
    })
    res.status(200).json(users)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}