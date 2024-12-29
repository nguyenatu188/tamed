import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"

const useRegister = () => {
  const [isLoading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const register = async (inputs: { fullname: string, username: string, password: string, confirmPassword: string, gender: string }) => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputs)
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error)
      }
      setAuthUser(data)
    } catch (error:any) {
      toast.error(error.message)
    } finally {
    setLoading(false)
    }
  }
  return { isLoading, register }
  }

export default useRegister