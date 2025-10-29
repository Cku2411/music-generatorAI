"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CreateSong = () => {
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
