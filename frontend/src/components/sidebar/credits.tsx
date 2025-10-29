import { getUserCredits } from "@/actions/user";
import React from "react";

const Credits = async () => {
  const credits = await getUserCredits();
  return (
    <>
      <p>{credits}</p>
      <p>Credits</p>
    </>
  );
};

export default Credits;
