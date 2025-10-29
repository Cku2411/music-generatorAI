"use client";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

const CustomerPortalRedirect = () => {
  useEffect(() => {
    const portal = async () => {
      await authClient.customer.portal();
    };
    portal();
  });
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="size-5 animate-spin" />
        <span className="text-muted-foreground">
          Loading customer portal...
        </span>
      </div>
    </div>
  );
};

export default CustomerPortalRedirect;
