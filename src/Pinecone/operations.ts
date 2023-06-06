// operations.ts
'use server'

import { pineconeInit } from "@/Pinecone/pinecone";
import { UpsertRequest, UpsertOperationRequest, Vector, VectorOperationsApi, QueryRequest, QueryOperationRequest } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";

export async function initPinecone() {
  const pinecone = await pineconeInit();
  return pinecone.Index("tracks");
}

export async function upsertTracks(trackIndex: VectorOperationsApi, trackFeaturesVector: Array<Vector>) {
  const request: UpsertOperationRequest = {
    upsertRequest: {
      vectors: trackFeaturesVector,
      namespace: "tracks"
    }
  };
  const res=await trackIndex.upsert(request);
}

export async function queryTracks(trackIndex: VectorOperationsApi, vector: Array<number>, topK: number, includeValues: boolean) {
  const qrequest: QueryOperationRequest = {
    queryRequest: {
      vector,
      topK,
      includeValues,
      namespace:"tracks"
    }
  };
  return trackIndex.query(qrequest);
}
