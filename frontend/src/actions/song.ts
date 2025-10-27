"use server";

import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const setPublishedStatus = async (
  songId: string,
  published: boolean,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // throw new Error("Unauthorized");
    redirect("/auth/sign-in");
  }

  await db.song.update({
    where: {
      id: songId,
      userId: session.user.id,
    },
    data: {
      published: published,
    },
  });

  revalidatePath("/create");

  return { success: true, published };
};

export const renameSong = async (songId: string, newTitle: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // throw new Error("Unauthorized");
    redirect("/auth/sign-in");
  }

  await db.song.update({
    where: {
      id: songId,
      userId: session.user.id,
    },
    data: {
      title: newTitle,
    },
  });

  revalidatePath("/create");

  return { success: true, newTitle };
};

export const getAllSongs = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const songs = await db.song.findMany({
    where: {
      published: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },

      Categories: true,
      likes: session.user.id
        ? {
            where: {
              userId: session.user.id,
            },
          }
        : false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return songs;
};

export const toggleLikeSong = async (songId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const existingLike = await db.like.findUnique({
    where: {
      userId_songId: {
        userId: session.user.id,
        songId,
      },
    },
  });

  if (existingLike) {
    await db.like.delete({
      where: {
        userId_songId: {
          userId: session.user.id,
          songId,
        },
      },
    });
  } else {
    await db.like.create({
      data: {
        userId: session.user.id,
        songId,
      },
    });
  }

  revalidatePath("/");
};
