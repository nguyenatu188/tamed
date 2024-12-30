import { useEffect } from "react"
import { useSocketContext } from "../context/SocketContext"
import useConversation from "../zustand/useConversation"
import notificationSounds from "../assets/sounds/notification.mp3"

const useListenMessages = () => {
  const { socket } = useSocketContext()
  const { messages, setMessages } = useConversation()

  useEffect(() => {
    if (socket) {
      socket?.on("newMessage", (newMessage) => {
        newMessage.shouldShake = true
        const sound = new Audio(notificationSounds)
        sound.play()
        setMessages([...messages, newMessage])
      })
    }
    return () => { socket?.off("newMessage") }
  }, [socket, messages ,setMessages])
}

export default useListenMessages