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
