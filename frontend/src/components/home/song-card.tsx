"use client";

import { getPlayUrl } from "@/actions/generation";
import { userPlayerStore } from "@/store/use-player-store";
import type { Category, Song } from "@prisma/client";
import { Loader2, Music, Play } from "lucide-react";
import React, { useState } from "react";

type SongWithRelation = Song & {
  user: { name: string | null };
  _count: {
    likes: number;
  };

  categories?: Category[];
  thumbnailUrl?: string | null;
};

type Props = {
  song: SongWithRelation;
};

const SongCard = ({ song }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setTrack } = userPlayerStore();

  const handlePlay = async () => {
    const playUrl = await getPlayUrl(song.id);
    setIsLoading(true);
    console.log(playUrl);
    setIsLoading(false);
    setTrack({
      id: song.id,
      title: song.title,
      artwork: song.thumbnailUrl,
      prompt: "",
      createdByUsername: song.user.name,
      url: playUrl,
    });
  };

  return (
    <div>
      <div className="cursor-pointer" onClick={handlePlay}>
        <div className="group relative aspect-square w-full overflow-hidden rounded-md bg-gray-200">
          {song.thumbnailUrl ? (
            <img
              className="h-full w-full object-cover object-center"
              src={song.thumbnailUrl}
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              <Music className="text-muted-foreground size-12" />
            </div>
          )}

          {/* loader */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 transition-transform group-hover:scale-105">
              {isLoading ? (
                <Loader2 className="size-6 animate-spin text-white" />
              ) : (
                <Play className="size-6 fill-white text-white" />
              )}
            </div>
          </div>
        </div>

        <h3>{song.title}</h3>
        <p className="text-xs text-gray-500">{song.user.name}</p>
      </div>
    </div>
  );
};

export default SongCard;
