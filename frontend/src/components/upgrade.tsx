"use client";
import { authClient } from "@/lib/auth-client";
import React from "react";
import { Button } from "./ui/button";

type Props = {};

const UpgradePage = (props: Props) => {
  const upgrade = async () => {
    await authClient.checkout({
      products: [
        "92924f6e-f751-467b-bac0-599a30f24e60",
        "8fb266a2-aa86-4470-9307-18f399756119",
      ],
    });
  };
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="ml-2 cursor-pointer text-orange-400"
      onClick={upgrade}
    >
      UpgradePage
    </Button>
  );
};

export default UpgradePage;
