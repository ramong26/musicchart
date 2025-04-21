// /app/page.tsx
import getTopTracks from '@/lib/spotify'; // default import

const HomePage = async () => {
  const tracks = await getTopTracks();
  return (
    <div>
      <h1>Top Tracks</h1>
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            <img src={track.imageUrl} alt={track.name} width={100} />
            <p>
              {track.name} by {track.artist}
            </p>
            {track.previewUrl && <audio controls src={track.previewUrl} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
