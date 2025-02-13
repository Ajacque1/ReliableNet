import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    )
  }

  try {
    const { data: tests, error } = await supabase
      .from("speed_tests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ tests })
  } catch (error) {
    console.error("Failed to fetch speed tests:", error)
    return NextResponse.json(
      { error: "Failed to fetch speed tests" },
      { status: 500 }
    )
  }
} 