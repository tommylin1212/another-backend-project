'use server'

import { crawlSpotifyTracks, getSpotifyAccessToken } from "@/spotify/operations"

export async function crawlTracksAction(trackId:string,userId:string){
    crawlSpotifyTracks(trackId, 3, await getSpotifyAccessToken(userId))
}