"use client";
import React, { useState } from "react";
import { Tabs, TabsTrigger, TabsList } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2Icon, Music, Music2Icon, Plus } from "lucide-react";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { generateSong, type GenerateRequest } from "@/actions/generation";
import { useRouter } from "next/navigation";

type Props = {};
const enum TabMode {
  SIMPLE = "simple",
  CUSTOME = "custom",
}

const enum LyricMode {
  write = "write",
  auto = "auto",
}

const inspirationTags = [
  "80s synth-pop",
  "Acoustic ballad",
  "Epic movie score",
  "Lo-fi hip hop",
  "Driving rock anthem",
  "Summer beach vibe",
];

const styleTags = [
  "Industrial rave",
  "Heavy bass",
  "Orchestral",
  "Electronic beats",
  "Funky guitar",
  "Soulful vocals",
  "Ambient pads",
];

const SongPannel = (props: Props) => {
  const [mode, setMode] = useState<TabMode>(TabMode.SIMPLE);
  const [description, setDescription] = useState("");
  const [instrumental, setInstrumental] = useState(false);
  const [lyricsMode, setLyricsMode] = useState<LyricMode>(LyricMode.write);
  const [lyrics, setLyrics] = useState("");
  const [styleInput, setStyleInput] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleInspirationTagClick = (tag: string) => {
    // find the current tagss in description
    // eg: "logi, accoustic, hiphop" => [lofi, accountics, hiphop]
    const currentTags = description
      .split(",")
      .map((string) => string.trim())
      .filter((string) => string);

    // if tag not in currentag => setDescription(description + , tag)

    if (!currentTags.includes(tag)) {
      if (description.trim() === "") {
        setDescription(tag);
      } else {
        setDescription(description + ", " + tag);
      }
    }
  };

  const handleStyleInputTagClick = (tag: string) => {
    // find the current tagss in description
    // eg: "logi, accoustic, hiphop" => [lofi, accountics, hiphop]
    const currentTags = styleInput
      .split(",")
      .map((string) => string.trim())
      .filter((string) => string);

    // if tag not in currentag => setDescription(description + , tag)

    if (!currentTags.includes(tag)) {
      if (styleInput.trim() === "") {
        setStyleInput(tag);
      } else {
        setStyleInput(styleInput + ", " + tag);
      }
    }
  };

  const handleClick = async () => {
    if (mode === TabMode.SIMPLE && !description.trim()) {
      toast.error("Please describe your song before creating.");
      return;
    }

    if (mode === TabMode.CUSTOME && !styleInput.trim()) {
      toast.error("Please add some style for your song");
      return;
    }
  };

  // generate Song
  const handleCreate = async () => {
    let requestBody: GenerateRequest = {};
    if (mode === TabMode.SIMPLE) {
      requestBody = {
        fullDesribedSong: description,
        instrumental: instrumental,
      };
    } else {
      const prompt = styleInput;
      if (lyricsMode === LyricMode.write) {
        requestBody = {
          prompt,
          lyrics,
          instrumental,
        };
      } else {
        requestBody = {
          prompt,
          describedLyrics: lyrics,
          instrumental,
        };
      }
    }

    try {
      setIsLoading(true);
      toast.loading("Creating new song, please wait ...", {
        id: "create-song",
      });
      await generateSong(requestBody);
      setDescription("");
      setLyrics("");
      setStyleInput("");

      setTimeout(() => router.refresh(), 2000);
    } catch (error) {
      toast.error("Something went wrong ...");
      console.log(error);
      setIsLoading(false);
    } finally {
      toast.success("Creating song successfully!", {
        id: "create-song",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-muted/30 w-full flex-col border-r p-3 lg:w-80">
      <div className="flex-1 overflow-y-auto">
        <Tabs value={mode} onValueChange={(value) => setMode(value as TabMode)}>
          <TabsList>
            <TabsTrigger value={TabMode.SIMPLE}>Simple</TabsTrigger>
            <TabsTrigger value={TabMode.CUSTOME}>Custom</TabsTrigger>
          </TabsList>
          <TabsContent value={TabMode.SIMPLE} className="mt-6 space-y-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Describe your song</label>
              <Textarea
                placeholder="A dreamy lofi hip hop song, perfect for study and relax "
                className="min-h-[120px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {/* Lyrics button an instrumental toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setMode(TabMode.CUSTOME)}
              >
                <Plus className="mr-2 size-4" />
                Lyrics
              </Button>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Instrumental</label>
                <Switch
                  checked={instrumental}
                  onCheckedChange={setInstrumental}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Inspiration</label>
              <div className="w-full overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 pb-2">
                  {inspirationTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={"outline"}
                      size={"sm"}
                      className="h-7 flex-shrink-0 bg-transparent text-xs"
                      onClick={() => handleInspirationTagClick(tag)}
                    >
                      <Plus className="mr-1" />
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value={TabMode.CUSTOME} className="mt-6 space-y-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor="" className="text-sm font-medium">
                  Lyrics
                </label>
                <div className="flex items-center gap-1">
                  <Button
                    variant={
                      lyricsMode === LyricMode.auto ? "secondary" : "ghost"
                    }
                    className="h-7 text-xs"
                    size={"sm"}
                    onClick={() => {
                      setLyricsMode(LyricMode.auto);
                      setLyrics("");
                    }}
                  >
                    Auto
                  </Button>

                  <Button
                    variant={
                      lyricsMode === LyricMode.write ? "secondary" : "ghost"
                    }
                    className="h-7 text-xs"
                    size={"sm"}
                    onClick={() => {
                      setLyricsMode(LyricMode.write);
                      setLyrics("");
                    }}
                  >
                    Write
                  </Button>
                </div>
              </div>

              <Textarea
                className="min-h-[100px] resize-none"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder={
                  lyricsMode === LyricMode.write
                    ? "Add your own lyrics here"
                    : "Describe your lyrics, e.g , a sad song about lost love"
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="" className="text-sm">
                Instrumental
              </label>
              <Switch
                checked={instrumental}
                onCheckedChange={setInstrumental}
              />
            </div>

            {/* Styles */}
            <div className="flex flex-col gap-3">
              <label htmlFor="" className="text-sm font-medium">
                Styles
              </label>

              <Textarea
                placeholder="Enter style tags"
                value={styleInput}
                onChange={(e) => setStyleInput(e.target.value)}
                className="min-h-[60px] resize-none"
              />
              <div className="w-full overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 pb-2">
                  {styleTags.map((tag) => (
                    <Badge
                      variant={"secondary"}
                      key={tag}
                      className="hover:bg-secondary/80 flex-shirk-0 cursor-pointer text-xs"
                      onClick={() => handleStyleInputTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="border-t p-4">
        <Button
          onClick={() => handleCreate()}
          disabled={isloading}
          className="w-full cursor-pointer bg-gradient-to-r from-orange-500 to-pink-600 font-medium text-white hover:from-orange-600 hover:to-pink-600"
        >
          {isloading ? (
            <Loader2Icon className="size-6 animate-spin" />
          ) : (
            <Music />
          )}
          {isloading ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
};

export default SongPannel;
