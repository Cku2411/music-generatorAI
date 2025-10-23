"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { generateSong } from "@/actions/generation";
import { toast } from "sonner";

type Props = {};

const CreateSong = (props: Props) => {
  return (
    <Button
      onClick={() => {
        toast.message("creating the song...");
      }}
    >
      CreateSong
    </Button>
  );
};

export default CreateSong;
