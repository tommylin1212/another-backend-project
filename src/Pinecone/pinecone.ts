'use server'
import { PineconeClient } from "@pinecone-database/pinecone";

const pinecone = new PineconeClient();

export async function pineconeInit() {
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
  return pinecone;
}

export const getIndexes = (pinecone: PineconeClient) => pinecone.listIndexes();
