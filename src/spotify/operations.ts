// spotifyOperations.ts
'use server'
import { initPinecone, upsertTracks } from "@/Pinecone/operations";
import { findMissingVectors } from "@/utils/upsertFlow";
import { clerkClient } from "@clerk/nextjs";
import Logger from 'pino'

const logger = Logger()

export async function getSpotifyAccessToken(userId: string) {
  logger.info(`Fetching access token for user ${userId}`);
  const token = await clerkClient.users.getUserOauthAccessToken(userId, "oauth_spotify");
  logger.info(`Access token fetched for user ${userId}`);
  return token[0].token;
}

async function fetchFromSpotify(url: string, accessToken: string) {
  logger.info(`Fetching from Spotify API: ${url}`);
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-cache",
  });
  logger.info(`Spotify fetch response code: ${response.status}`)
  const jsonData = await response.json();
  logger.info(`Fetched data from Spotify API: ${url}`);
  return jsonData;
}

export const getTopTracks = async (accessToken: string) => fetchFromSpotify("https://api.spotify.com/v1/me/top/tracks", accessToken);

export const getTrackFeatures = async (accessToken: string, trackIds: string) => fetchFromSpotify(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, accessToken);

export async function createTrackFeaturesVector(trackFeatures: SpotifyApi.MultipleAudioFeaturesResponse) {
  logger.info(`Creating track features vector`);
  const vector = trackFeatures.audio_features.map((track: SpotifyApi.AudioFeaturesObject) => ({
    id: track.id,
    values: [
      track.acousticness,
      track.danceability,
      track.energy,
      track.instrumentalness,
      track.liveness,
      track.speechiness,
      track.valence,
      track.loudness,
      track.tempo,
      track.key,
      track.mode,
    ],
  }));
  logger.info(`Track features vector created`);
  return vector;
}

export async function crawlSpotifyTracks(seedTrackId: string, limit: number, token: string) {
  logger.info(`Crawling Spotify tracks. Seed track ID: ${seedTrackId}, limit: ${limit}`);
  const recommendationsUrl = `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_tracks=${seedTrackId}`;
  const recommendations = await fetchFromSpotify(recommendationsUrl, token);
  logger.debug(`Recommendations: ${JSON.stringify(recommendations)}`);
  let trackIds = recommendations.tracks.map((track: SpotifyApi.TrackObjectFull) => track.id);
  trackIds.push(seedTrackId)
  trackIds = await findMissingVectors(trackIds)
  for (const trackId of trackIds) {
    logger.info(`Crawling track ${trackId}`);
    const trackFeatures = await getTrackFeatures(token, trackId);
    const trackFeaturesVector = createTrackFeaturesVector(trackFeatures);
    await upsertTracks(await initPinecone(), await trackFeaturesVector);
  }

  const nextSeedTrackId = trackIds[Math.floor(Math.random() * trackIds.length)];
  logger.info(`Next seed track ID selected: ${nextSeedTrackId}`);
  return nextSeedTrackId;
}

export const searchTracksByQuery = async (query: string, token: string) => fetchFromSpotify(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, token);

export const getTracksById = async (trackIds: string[], token: string) => fetchFromSpotify(`https://api.spotify.com/v1/tracks?ids=${trackIds.join(",")}`, token);
