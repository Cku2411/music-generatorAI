import CreateSong from "@/components/create";
import SongPannel from "@/components/create/song-pannel";
import React from "react";

type Props = {};

const CreatePage = (props: Props) => {
  return (
    <div className="flex h-full flex-col lg:flex-row">
      <SongPannel />
    </div>
  );
};

export default CreatePage;
