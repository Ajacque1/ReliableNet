import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('photos') as File[]

    if (!files.length) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      )
    }

    const urls = []
    for (const file of files) {
      const buffer = await file.arrayBuffer()
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `review-photos/${fileName}`

      const { error: uploadError } = await supabaseAdmin
        .storage
        .from('public')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from('public')
        .getPublicUrl(filePath)

      urls.push(publicUrl)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Failed to upload photos:', error)
    return NextResponse.json(
      { error: 'Failed to upload photos' },
      { status: 500 }
    )
  }
} 