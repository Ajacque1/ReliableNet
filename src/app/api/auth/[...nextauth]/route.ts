import { NextRequest } from "next/server"
import { handleAuth } from "next-auth/next"
import { authConfig } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  return handleAuth(request, authConfig)
}

export async function POST(request: NextRequest) {
  return handleAuth(request, authConfig)
} 