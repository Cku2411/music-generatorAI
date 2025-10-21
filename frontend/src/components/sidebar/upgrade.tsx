"use client";
import React from "react";
import { Button } from "../ui/button";

type Props = {};

const Upgrade = (props: Props) => {
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="ml-2 cursor-pointer text-orange-400"
      onClick={() => {}}
    >
      Upgrade
    </Button>
  );
};

export default Upgrade;
