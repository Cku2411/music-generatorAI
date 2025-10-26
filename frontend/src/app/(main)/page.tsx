import { getPresignedUrl } from "@/actions/generation";
import { getAllSongs } from "@/actions/song";

type Props = {};

const HomePage = async (props: Props) => {
  const songs = await getAllSongs();

  const songsWithUrls = await Promise.all(
    songs.map(async (song) => {
      const thumbnailUrl = song.thumbnailS3Key
        ? await getPresignedUrl(song.thumbnailS3Key)
        : null;

      return { ...song, thumbnailUrl };
    }),
  );

  return <pre>{JSON.stringify(songsWithUrls, null, 4)}</pre>;
  return <div className="flex h-full flex-col lg:flex-row"></div>;
};

export default HomePage;
