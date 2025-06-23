"use client";
import { useState } from "react";
import Centerside from "@/components/centerSide";
import Leftside from "@/components/leftSide";
import Rightside from "@/components/rightSide";

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState("body");

  const [selectedImages, setSelectedImages] = useState<{
    [layer: string]: string;
  }>({});

  const handleImageSelect = (folder: string, image: string) => {
    setSelectedImages((prev) => ({
      ...prev,
      [folder]: image,
    }));
  };

  const handleDeleteImage = (folder: string) => {
    setSelectedImages((prev) => {
      const copy = { ...prev };
      delete copy[folder];
      return copy;
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-12 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="md:w-4xl min-w-xs flex gap-6 flex-col md:h-[500px] h-full md:flex-row items-center sm:items-start">
        <Leftside onSelect={setSelectedFolder} />
        <Centerside selectedImages={selectedImages} onSelectImages={setSelectedImages}/>
        <Rightside folder={selectedFolder} onDeleteImage={handleDeleteImage} onSelectImage={handleImageSelect} />
      </main>
    </div>
  );
}
