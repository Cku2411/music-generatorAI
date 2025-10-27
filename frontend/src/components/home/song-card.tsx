"use client";

import { getPlayUrl } from "@/actions/generation";
import { toggleLikeSong } from "@/actions/song";
import { cn } from "@/lib/utils";
import { userPlayerStore } from "@/store/use-player-store";
import type { Category, Like, Song } from "@prisma/client";
import { Heart, Loader2, Music, Play } from "lucide-react";
import React, { useState } from "react";

type SongWithRelation = Song & {
  user: { name: string | null };
  _count: {
    likes: number;
  };

  categories?: Category[];
  thumbnailUrl?: string | null;
  likes?: Like[];
};

type Props = {
  song: SongWithRelation;
};

const SongCard = ({ song }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setTrack } = userPlayerStore();

  const [isLiked, setIsLiked] = useState(
    song.likes ? song.likes.length > 0 : false,
  );
  const [likesCount, setLikesCount] = useState(song._count.likes);

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

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleLikeSong(song.id);
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
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

        <h3 className="mt-2 truncate text-sm font-medium text-gray-900">
          {song.title}
        </h3>
        <p className="text-xs text-gray-500">{song.user.name}</p>

        <div className="mt-1 flex items-center justify-between text-xs text-gray-900">
          <span>{song.listenCount} listens</span>
          <button
            className="flex cursor-pointer items-center gap-1"
            onClick={handleLike}
          >
            <Heart
              className={cn(
                "size-4",
                isLiked ? "fill-red-500 text-red-500" : "",
              )}
            />
            {likesCount} likes count
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
