"use client";
import React from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { env } from "@/env";

const Upgrade = () => {
  const upgrade = async () => {
    await authClient.checkout({
      products: [
        process.env.NEXT_PUBLIC_PRODUCT_LARGE!,
        process.env.NEXT_PUBLIC_PRODUCT_MEDIUM!,
      ],
    });
  };

  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="ml-2 cursor-pointer text-orange-400"
      onClick={() => upgrade()}
    >
      Upgrade
    </Button>
  );
};

export default Upgrade;
