"use server";

import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const queueSong = async () => {
  console.log(`Start generating song...`);

  const sessiion = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessiion) {
    // throw new Error("Unauthorized");
    redirect("/auth/sign-in");
  }

  const song = await db.song.create({
    data: {
      userId: sessiion.user.id,
      title: "Test Song 1",
      //   prompt: "lofi piano song",
      fullDescribedSong: "lo fi song",
    },
  });

  console.log("Send event to inngest ...");

  await inngest.send({
    name: "generate-song-event",
    data: {
      songId: song.id,
      userId: song.userId,
    },
  });
};
