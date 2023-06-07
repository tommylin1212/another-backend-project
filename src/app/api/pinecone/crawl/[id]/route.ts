import { crawlSpotifyTracks } from "@/spotify/operations"
import { getSpotifyAccessToken } from "@/spotify/operations"
import { access } from "fs"

export async function POST(request: Request,{params}: {params: { id: string }}) {
    try {
        const body = await request.json()
        const { userId } = body
        const accessToken = await getSpotifyAccessToken(userId)
        console.log(accessToken)
        crawlSpotifyTracks(params.id, 10, accessToken)
        return new Response('POST request', { status: 200 })
    } catch (error: unknown) {
        console.error(error);
        return new Response(`Invalid JSON input: ${error}`, { status: 400 });
    }
}