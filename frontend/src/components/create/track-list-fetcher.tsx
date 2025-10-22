"use server";
import { getPresignedUrl } from "@/actions/generation";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import TrackList from "./tracklist";

type Props = {};

const TrackListFetcher = async (props: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  await new Promise((res) => setTimeout(res, 1000));

  const songs = await db.song.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const songWithThumbnails = await Promise.all(
    songs.map(async (song) => {
      const thumbnailUrl = song.thumbnailS3Key
        ? await getPresignedUrl(song.thumbnailS3Key)
        : null;

      return {
        id: song.id,
        title: song.title,
        createdAt: song.createdAt,
        instrumetal: song.instrumental,
        prompt: song.prompt,
        lyrics: song.lyrics,
        describedLyrics: song.describedLyrics,
        fullDescribeSong: song.fullDescribedSong,
        thumbnailUrl,
        playUrl: null,
        status: song.status,
        published: song.published,
      };
    }),
  );

  return <TrackList tracks={songWithThumbnails} />;
  return <pre>{JSON.stringify(songWithThumbnails, null, 4)}</pre>;
};

export default TrackListFetcher;
