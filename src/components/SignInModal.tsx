"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid credentials")
        return
      }

      onClose()
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>
            Enter your email and password to sign in
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link 
              href="/auth/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link 
            href="/auth/register"
            className="text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
} 