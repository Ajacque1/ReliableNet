import { NextRequest } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

export const runtime = "nodejs"

const handler = NextAuth(authConfig)

export const GET = handler
export const POST = handler 