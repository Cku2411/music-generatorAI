import SongPannel from "@/components/create/song-pannel";
import TrackListFetcher from "@/components/create/track-list-fetcher";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";

const CreatePage = async () => {
  return (
    <div className="flex h-full flex-col lg:flex-row">
      <SongPannel />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="size-8 animate-spin" />
          </div>
        }
      >
        <TrackListFetcher />
      </Suspense>
    </div>
  );
};

export default CreatePage;
