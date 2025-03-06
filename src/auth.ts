import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

export const { auth, handlers } = NextAuth(authConfig) 