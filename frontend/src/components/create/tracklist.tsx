"use client";
import {
  DownloadIcon,
  Edit2,
  Edit2Icon,
  Loader2,
  MoreHorizontal,
  Music,
  Pencil,
  Play,
  RefreshCcw,
  Rows4,
  SearchIcon,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { GENERATE_SONG_STATUS } from "@/lib/types/types";
import { getPlayUrl } from "@/actions/generation";
import { Badge } from "../ui/badge";
import { renameSong, setPublishedStatus } from "@/actions/song";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import RenameDialog from "./rename-dialog";
import { useRouter } from "next/navigation";
import { userPlayerStore } from "@/store/use-player-store";

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
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const [trackToRename, setTrackToRename] = useState<Track | null>(null);
  const { setTrack } = userPlayerStore();
  const router = useRouter();

  // fileter
  const filteredTracks = tracks.filter((track) =>
    track.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // handle function
  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleTrackSelect = async (track: Track) => {
    console.log("okie handle play");

    if (loadingTrackId) return;

    setLoadingTrackId(track.id);
    const playUrl = await getPlayUrl(track.id);
    setLoadingTrackId(null);
    console.log(playUrl);
    setTrack({
      id: track.id,
      title: track.title,
      artwork: track.thumbnailUrl,
      prompt: "",
      createdByUsername: "cku24",
      url: playUrl,
    });
  };

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
            onClick={handleRefresh}
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
        <div className="space-y-2">
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track) => {
              switch (track.status) {
                case GENERATE_SONG_STATUS.QUEUED:
                  return (
                    <div
                      key={track.id}
                      className="flex cursor-not-allowed items-center gap-4 rounded-lg"
                    >
                      <div className="bg-primary/10 flex size-12 flex-shrink-0 items-center justify-center rounded-md">
                        <Rows4 className="text-primary size-6" />
                        {/* {track.id} */}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-primary truncate text-sm font-medium">
                          Queued - {track.title}
                        </h3>
                        <p className="text-muted-foreground truncate text-xs">
                          Please wait for the song processing...
                        </p>
                      </div>
                    </div>
                  );

                case GENERATE_SONG_STATUS.FAILED:
                  return (
                    <div
                      key={track.id}
                      className="flex cursor-not-allowed items-center gap-4 rounded-lg"
                    >
                      <div className="bg-destructive/10 flex size-12 flex-shrink-0 items-center justify-center rounded-md">
                        <XCircle className="text-destructive size-6" />
                        {/* {track.id} */}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-destructive truncate text-sm font-medium">
                          Generation failed
                        </h3>
                        <p className="text-muted-foreground truncate text-xs">
                          Please try creating song again
                        </p>
                      </div>
                    </div>
                  );

                case "no credits":
                  return (
                    <div
                      key={track.id}
                      className="flex cursor-not-allowed items-center gap-4 rounded-lg"
                    >
                      <div className="bg-destructive/10 flex size-12 flex-shrink-0 items-center justify-center rounded-md">
                        <XCircle className="text-destructive size-6" />
                        {/* {track.id} */}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-destructive truncate text-sm font-medium">
                          Not enough credits
                        </h3>
                        <p className="text-muted-foreground truncate">
                          Please purchase more credits to generate this song.
                        </p>
                      </div>
                    </div>
                  );

                case GENERATE_SONG_STATUS.PROCESSING:
                  return (
                    <div
                      key={track.id}
                      className="flex cursor-not-allowed items-center gap-4 rounded-lg"
                    >
                      <div className="bg-muted flex size-12 flex-shrink-0 items-center justify-center rounded-md">
                        <Loader2 className="text-muted-foreground size-6 animate-spin" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-muted-foreground truncate text-sm font-medium">
                          Processing - {track.title}
                        </h3>
                        <p className="text-muted-foreground truncate text-xs">
                          Refresh to check the status.
                        </p>
                      </div>
                    </div>
                  );

                default:
                  return (
                    <div
                      key={track.id}
                      className="hover:bg-muted flex cursor-pointer gap-4 rounded-lg"
                      onClick={async () => await handleTrackSelect(track)}
                    >
                      {/* Thumbnail */}
                      <div className="group relative size-12 flex-shrink-0 overflow-hidden rounded-md">
                        {track.thumbnailUrl ? (
                          <img src={track.thumbnailUrl} />
                        ) : (
                          <div className="bg-muted flex h-full w-full items-center justify-center">
                            <Music className="text-muted-foreground size-6" />
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                          {loadingTrackId === track.id ? (
                            <Loader2 className="animate-spin text-white" />
                          ) : (
                            <Play className="fill-white text-white" />
                          )}
                        </div>
                      </div>
                      {/* Track info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-medium">
                            {track.title}
                          </h3>
                          {track.instrumetal && (
                            <Badge variant={"outline"}>Instrumental</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground truncate text-xs">
                          {track.prompt}
                        </p>
                      </div>
                      {/* Action */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={async (e) => {
                            e.stopPropagation();
                            const res = await setPublishedStatus(
                              track.id,
                              !track.published,
                            );

                            if (res.success) {
                              toast.success(
                                !res.published
                                  ? "song publised!"
                                  : "unpublish song successfully",
                              );
                            }
                          }}
                          variant={"outline"}
                          size={"sm"}
                          className={`cursor-pointer ${track.published && "border-red-200"}`}
                        >
                          {track.published ? "Unpublish" : "Published"}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} size={"icon"}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.stopPropagation();
                                const playUrl = await getPlayUrl(track.id);
                                window.open(playUrl, "_blank");
                              }}
                            >
                              <DownloadIcon className="mr-2" /> Download
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.stopPropagation();
                                setTrackToRename(track);
                              }}
                            >
                              <Edit2Icon className="mr-2" /> Rename
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
              }
            })
          ) : (
            <div className="flex flex-col items-center justify-center pt-20 text-center">
              <Music className="text-muted-foreground size-10" />
              <h2 className="mt-4 text-lg font-semibold">No music yet</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {searchQuery
                  ? "No tracks match your search."
                  : "Create your first song to get started"}
              </p>
            </div>
          )}
        </div>
      </div>

      {trackToRename && (
        <RenameDialog
          track={trackToRename}
          onClose={() => setTrackToRename(null)}
          onRename={renameSong}
        />
      )}
    </div>
  );
};

export default TrackList;
