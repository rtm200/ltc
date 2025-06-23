"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { BiExport, BiHeart, BiSolidHeart } from "react-icons/bi";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";

const layerOrder: { [key: string]: number } = {
  body: 0,
  dress: 1,
  mouth: 2,
  eyes: 3,
  hair: 4,
  hands: 5,
};

export default function Centerside({
  selectedImages,
}: {
  selectedImages: { [key: string]: string };
}) {
  const [hovered, setHovered] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 3, // higher resolution
      });
      saveAs(dataUrl, "character.png");
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-6 flex-4/4">
      <div
        ref={previewRef}
        className="relative w-full md:h-full min-h-[400px] bg-white p-6 text-black bg-[url('/t2.jpg')] bg-cover bg-center overflow-hidden"
      >
        {Object.entries(selectedImages).map(([folder, src]) => (
          <Image
            key={folder}
            src={src}
            alt={folder}
            width={400}
            height={400}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: layerOrder[folder] ?? 0 }}
          />
        ))}
      </div>

      <div className="w-full flex justify-start gap-6">
        <div
          className="min-w-[80px] h-[50px] cursor-pointer p-2 flex items-center justify-center bg-white text-black"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered ? (
            <BiSolidHeart size={20} color="red" />
          ) : (
            <BiHeart size={20} color="red" />
          )}
        </div>

        <div
          className="min-w-[80px] h-[50px] cursor-pointer p-2 flex items-center justify-center bg-white text-black"
          onClick={handleExport}
        >
          <BiExport size={20} />
        </div>

        <div className="">Click export to save image</div>
      </div>
    </div>
  );
}
