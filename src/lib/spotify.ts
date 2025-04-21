import { Track } from '../types/track';
import { SpotifyTrackItem } from '@/types/spotify';
import { Buffer } from 'buffer'; // 추가 필요: npm install buffer

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_CHART_URL =
  'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF';

let accessToken: string | null = null;

async function getAccessToken(): Promise<string> {
  console.log('✅ getAccessToken called'); // 이거 터미널에 찍히는지 확인

  if (accessToken) return accessToken;

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const basicToken = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64',
  );

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + basicToken,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  if (data.access_token) {
    accessToken = data.access_token;
    console.log(accessToken);
    return accessToken!;
  } else {
    throw new Error('Failed to get access token');
  }
}

async function getTopTracks(): Promise<Track[]> {
  const token = await getAccessToken();

  const res = await fetch(SPOTIFY_CHART_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  console.log('ㄴㅇㅇRequest Headers:', {
    Authorization: `Bearer ${token}`,
  });
  console.log('Spotify API Response:', data);

  // 데이터가 제대로 오는지 확인
  if (data.error) {
    throw new Error(`Spotify API Error: ${data.error.message}`);
  }

  if (data && data.tracks && Array.isArray(data.tracks.items)) {
    const tracks: Track[] = data.tracks.items
      .slice(0, 10)
      .map((item: SpotifyTrackItem) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        imageUrl: item.track.album.images[0].url,
        previewUrl: item.track.preview_url,
      }));

    return tracks;
  } else {
    throw new Error('Invalid data format received from Spotify API');
  }
  console.log('끝');
}

export default getTopTracks;
