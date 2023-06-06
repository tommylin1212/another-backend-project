import { crawlSpotifyTracks } from "@/spotify/operations"
import { getSpotifyAccessToken } from "@/spotify/operations"

export async function POST(request: Request,{params}: {params: { id: string }}) {
    try {
        const body = await request.json()
        const { userId } = body
        crawlSpotifyTracks(params.id, 10, await getSpotifyAccessToken(userId))
        return new Response('POST request', { status: 200 })
    } catch (error: unknown) {
        console.error(error);
        return new Response(`Invalid JSON input: ${error}`, { status: 400 });
    }
}