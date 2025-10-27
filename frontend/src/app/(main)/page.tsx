import { getPresignedUrl } from "@/actions/generation";
import { getAllSongs } from "@/actions/song";
import SongCard from "@/components/home/song-card";
import { getDaysAgo } from "@/lib/date";
import { Music } from "lucide-react";

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

  // get Trending Songs (last 2 days)
  const twoDaysAgo = getDaysAgo(5);

  const trendingSongs = songsWithUrls
    .filter((song) => song.createdAt >= twoDaysAgo)
    .slice(0, 10);

  const trendingSongIds = new Set(trendingSongs.map((song) => song.id));
  // filer remains songs not included in trendingSongs and has categories and return

  const categorizedSong = songsWithUrls
    .filter(
      (song) => !trendingSongIds.has(song.id) && song.Categories.length > 0,
    )
    // return object {categoryName: [song1, song2,...]}
    .reduce(
      (acc, song) => {
        // set 1st category to primary
        const primaryCategory = song.Categories[0];
        if (primaryCategory) {
          // if not categor.name then categoryNmae = []
          if (!acc[primaryCategory.name]) {
            acc[primaryCategory.name] = [];
          }
          // each category should have max 10 songs
          if (acc[primaryCategory.name]!.length < 10) {
            acc[primaryCategory.name]!.push(song);
          }
        }

        return acc;
        //         {
        //   "Pop": [song1, song2, ..., song10],
        //   "Rock": [songA, songB, ..., song10],
        //   "Jazz": [songX, songY, ...]
        // }
      },
      {} as Record<string, Array<(typeof songsWithUrls)[number]>>,
    );

  if (trendingSongs.length == 0 && Object.keys(categorizedSong).length === 0) {
    // if (true) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <Music className="text-muted-foreground size-20" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          No music here
        </h1>
        <p className="text-muted-foreground mt-2">
          There are no public song available right now. Check back later
        </p>
      </div>
    );
  }

  // return <pre>{JSON.stringify(songsWithUrls, null, 4)}</pre>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold tracking-tight">Discover Music</h1>
      {/* Trending songs */}

      {trendingSongs.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Trending</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {trendingSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default HomePage;
