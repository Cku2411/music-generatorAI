"use client";

import React, { useState } from "react";
import type { Track } from "./tracklist";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

type RenameResult = { success: boolean; newTitle?: string } | any;

type Props = {
  track: Track;
  onClose: () => void;
  // onRename is async and returns a promise when called from the client
  onRename: (trackId: string, newTitle: string) => Promise<RenameResult>;
};

const RenameDialog = ({ track, onClose, onRename }: Props) => {
  const [title, setTitle] = useState(track.title ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = "change-name";
    if (!title.trim()) {
      toast.error("Title cannot be empty", { id: toastId });
      return;
    }

    toast.loading("Changing name...", { id: toastId });

    try {
      const res = await onRename(track.id, title.trim());

      if (res && res.success) {
        toast.success("Name changed", { id: toastId });
      } else {
        toast.error("Rename failed", { id: toastId });
      }

      // only close after rename completes
      onClose();
    } catch (err) {
      toast.error("Rename failed", { id: toastId });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Song</DialogTitle>
            <DialogDescription>
              Enter a new name for your song. Click save when you're done
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-5 items-center gap-4">
              <label htmlFor="name" className="items-center">
                Title
              </label>
              <Input
                id="name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-4"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"} type="button">
                Cancle
              </Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameDialog;
