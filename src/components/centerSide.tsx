"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BiArchive, BiExport, BiHeart, BiSolidHeart } from "react-icons/bi";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import Archive from "@/components/Archive";

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
  onSelectImages,
}: {
  selectedImages: { [key: string]: string };
  onSelectImages: (images: { [key: string]: string }) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleSelectFavorite = (images: { [key: string]: string }) => {
    onSelectImages(images);
    setShowArchive(false); 
  };

  function normalizeImages(images: { [key: string]: string }): string {
    const sortedEntries = Object.entries(images).sort(([a], [b]) => a.localeCompare(b));
    return JSON.stringify(Object.fromEntries(sortedEntries));
  }

  useEffect(() => {
    console.log(selectedImages);
    
    const stored = localStorage.getItem("favorites");
    let favorites: Array<{ id: string; images: typeof selectedImages }> = [];

    if (stored) {
      try {
        favorites = JSON.parse(stored);
      } catch {
        favorites = [];
      }
    }

    const newFavoriteJson = normalizeImages(selectedImages);
    const isAlreadyFavorited = favorites.some(
      (fav) => normalizeImages(fav.images) === newFavoriteJson
    );

    setIsFavorited(isAlreadyFavorited);
  }, [JSON.stringify(selectedImages)]);



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

  const handleFavorited = () => {
    if (!selectedImages || Object.keys(selectedImages).length === 0) return;

    const stored = localStorage.getItem("favorites");
    let favorites: Array<{ id: string; images: typeof selectedImages }> = [];

    if (stored) {
      try {
        favorites = JSON.parse(stored);
      } catch {
        favorites = [];
      }
    }

    const normalizeImages = (images: { [key: string]: string }): string => {
      const sortedEntries = Object.entries(images).sort(([a], [b]) => a.localeCompare(b));
      return JSON.stringify(Object.fromEntries(sortedEntries));
    };

    const newFavoriteJson = normalizeImages(selectedImages);

    const existingIndex = favorites.findIndex(
      (fav) => normalizeImages(fav.images) === newFavoriteJson
    );

    if (existingIndex !== -1) {
      favorites.splice(existingIndex, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Favorite deleted!");
    } else {
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newFavorite = {
        id: uniqueId,
        images: selectedImages,
      };

      favorites.push(newFavorite);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Favorite saved!");
    }
  };



  return (
    <div className="flex flex-col w-full h-full gap-6 flex-4/4">
      {showArchive && (
        <Archive
          onClose={setShowArchive}
          onSelectFavorite={handleSelectFavorite}  // pass handler here
        />
      )}
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

      <div className="w-full flex-wrap lg:flex-nowrap flex justify-start gap-6">
        <div
          className="min-w-[80px] h-[50px] cursor-pointer p-2 flex items-center justify-center bg-white text-black"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleFavorited}
        >
          {isFavorited || hovered ? (
            <BiSolidHeart size={20} color="red" />
          ) : (
            <BiHeart size={20} color="red" />
          )}

        </div>
        <div
          className="min-w-[80px] h-[50px] cursor-pointer p-2 flex items-center justify-center bg-white text-black"
          onClick={ () => setShowArchive(true)}
        >
          <BiArchive size={20} />
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
