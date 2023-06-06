'use server'

import { getSpotifyAccessToken } from "@/spotify/operations"

export async function getTokenAction(userId:string){
    return await getSpotifyAccessToken(userId)
}