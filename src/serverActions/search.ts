'use server'

import { getSpotifyAccessToken, searchTracksByQuery } from "@/spotify/operations"

export async function searchTracksAction(data:FormData){
   return searchTracksByQuery(data.get("query")as string, await getSpotifyAccessToken(data.get("user") as string))
}