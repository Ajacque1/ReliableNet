import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

const handler = auth

export const GET = handler
export const POST = handler 