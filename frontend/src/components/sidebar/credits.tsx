import { getUserCredits } from "@/actions/user";
import React from "react";

type Props = {};

const Credits = async (props: Props) => {
  const credits = await getUserCredits();
  return (
    <>
      <p>{credits}</p>
      <p>Credits</p>
    </>
  );
};

export default Credits;
