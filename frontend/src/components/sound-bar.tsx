"use client";
import { userPlayerStore } from "@/store/use-player-store";
import {
  Download,
  MoreHorizontal,
  Music,
  Pause,
  Play,
  Volume2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Props = {};

const SoundBar = (props: Props) => {
  const { track } = userPlayerStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeValue, setVolumeValue] = useState([33]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  //   Function
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number[]) => {
    // TODO
  };

  useEffect(() => {
    if (audioRef.current && track?.url) {
      setCurrentTime(0);
      setDuration(0);
      audioRef.current.src = track.url;
      audioRef.current.load();

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Playback failed: ", error);
            setIsPlaying(false);
          });
      }
    }
  }, [track]);

  const togglePlay = () => {
    if (!track?.url || !audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="px-4 pb-2">
      <Card className="bg-background/60 relative w-full shrink-0 border-1 py-0 backdrop-blur-lg">
        <div className="space-y-2 p-3">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-500">
                {track?.artwork ? (
                  <img
                    src={track.artwork}
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <Music className="size-4 text-white" />
                )}
              </div>
              <div className="max-w-24 min-w-0 flex-1 md:max-w-full">
                <div className="truncate text-sm font-medium">
                  {track?.title || "Untitle"}
                </div>
                <p className="text-muted-foreground truncate text-xs">
                  {track?.createdByUsername}
                </p>
              </div>
            </div>

            {/* Centered controls */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Button variant={"ghost"} size={"icon"} onClick={togglePlay}>
                {isPlaying ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
              </Button>
            </div>

            {/* Addittional controls */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-2">
                <Volume2 className="size-4" />
                <Slider
                  max={100}
                  step={1}
                  value={volumeValue}
                  onValueChange={setVolumeValue}
                  className="w-40"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => {
                      if (!track?.url) return;
                      window.open(track?.url, "_blank");
                    }}
                  >
                    <Download className="mr-2 size-4" /> Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Full width process bar for song */}
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground w-8 text-right text-[10px]">
              {formatTime(currentTime)}
            </span>
            <Slider
              className="flex-1"
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
            />
            <span className="text-muted-foreground w-8 text-right text-[10px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <audio ref={audioRef} src={track?.url ?? "null"} preload="metadata" />
      </Card>
    </div>
  );
};

export default SoundBar;
