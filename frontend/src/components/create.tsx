"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { queueSong } from "@/actions/generation";
import { toast } from "sonner";

type Props = {};

const CreateSong = (props: Props) => {
  return (
    <Button
      onClick={() => {
        toast.message("creating the song...");
        queueSong();
      }}
    >
      CreateSong
    </Button>
  );
};

export default CreateSong;
