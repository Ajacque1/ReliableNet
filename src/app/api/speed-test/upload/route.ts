import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // This endpoint just needs to accept the upload and return quickly
  // We're measuring the time it takes to upload the data
  return NextResponse.json({ success: true })
} 