"use client";
import { Loader2, RefreshCcw, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { GENERATE_SONG_STATUS } from "@/lib/types/types";

export interface Track {
  id: string;
  title: string;
  createdAt: Date;
  instrumetal: boolean;
  prompt: string | null;
  lyrics: string | null;
  describedLyrics: string | null;
  fullDescribeSong: string | null;
  thumbnailUrl: string | null;
  playUrl: string | null;
  status: string;
  published: boolean;
}

type Props = {
  tracks: Track[];
};

const TrackList = ({ tracks }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // fileter
  const filteredTracks = tracks.filter((track) =>
    track.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={searchQuery}
              className="pl-10"
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            disabled={isRefreshing}
            variant={"outline"}
            size={"sm"}
            onClick={() => {}}
          >
            {isRefreshing ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2" />
            )}
            Refresh
          </Button>
        </div>

        {/* Tracklist */}
        <div>
          {filteredTracks.length > 0
            ? filteredTracks.map((track) => {
                switch (track.status) {
                  case GENERATE_SONG_STATUS.FAILED:
                    return <div key={track.id}></div>;
                }
              })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default TrackList;
