"use client";
import { Loader2, RefreshCcw, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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

const TrackList = (props: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

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
            <Button>
              {isRefreshing ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackList;
