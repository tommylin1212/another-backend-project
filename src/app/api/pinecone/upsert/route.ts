import { NextResponse } from "next/server"
import  upsertTrackFlow from "@/utils/upsertFlow"

export async function GET(request: Request) {
    return new Response('GET request', { status: 200 })
}
export async function POST(request: Request) {
    const body = await request.json()
    const {trackId, userId} = body
    await upsertTrackFlow(trackId, userId)
    return new Response('POST request', { status: 200 })
}