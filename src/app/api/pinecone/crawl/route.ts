import { NextResponse } from "next/server"
import  {crawlSpotifyTracks} from "@/spotify/operations"
import { getSpotifyAccessToken } from "@/spotify/operations"

export async function GET(request: Request) {
    return new Response('GET request', { status: 200 })
}
export async function POST(request: Request) {
    const body = await request.json()
    const {trackId, userId} = body
    crawlSpotifyTracks(trackId, 3, await getSpotifyAccessToken(userId))
    return new Response('POST request', { status: 200 })
}