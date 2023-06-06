 'use server'
import { initPinecone, queryTracks, upsertTracks } from "@/Pinecone/operations"
import { getSpotifyAccessToken, getTrackFeatures, createTrackFeaturesVector } from "@/spotify/operations"
import { FetchRequest } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch"



export default async function upsertTrackFlow(trackId:string, userId:string){
    const accessToken = await getSpotifyAccessToken(userId)
    const trackFeatures = await getTrackFeatures(accessToken, trackId)
    const trackFeaturesVector = createTrackFeaturesVector(trackFeatures)
    const trackIndex = await initPinecone()
    upsertTracks(trackIndex, await trackFeaturesVector)
    
}

export async function fetchVector(trackId:string){
    const trackIndex = await initPinecone()
    const result = await trackIndex.fetch({ids:[trackId], namespace:"tracks"}as FetchRequest)
    return result
}

export async function queryVector(trackId:string){
    const vectorResult = await fetchVector(trackId)
    if(!vectorResult.vectors){
        return null
    }
    const vector = vectorResult.vectors[trackId].values
    const result=await queryTracks(await initPinecone(), vector, 10, true)
    return result
}

export async function fetchVectors(trackIds:string[]){
    const trackIndex = await initPinecone()
    const result = await trackIndex.fetch({ids:trackIds, namespace:"tracks"}as FetchRequest)
    return result
}





export async function findMissingVectors(trackIds:string[]){
    const vectorResult = await fetchVectors(trackIds)
    if (!vectorResult || !vectorResult.vectors){
        return null
    }
    //missingIds will contain all of the ids that are not in the vectorResult
    const missingIds = trackIds.filter((id) => !vectorResult.vectors[id])
    return missingIds
}