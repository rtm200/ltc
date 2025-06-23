"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Rightside({
  folder,
  onSelectImage,
  onDeleteImage,
}: {
  folder: string;
  onSelectImage: (folder: string, src: string) => void;
  onDeleteImage: (folder: string) => void;
}) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const max = 30;
      const loaded: string[] = [];

      for (let i = 1; i <= max; i++) {
        const path = `/${folder}/${i}.png`;
        const exists = await imageExists(path);
        if (!exists) break;
        loaded.push(path);
      }

      setImages(loaded);
    };

    if (folder) loadImages();
  }, [folder]);

  return (
    <div className="grid grid-cols-2 flex-1/2 max-h-full  w-full overflow-auto bg-neutral-400 max-h-full text-white gap-2 p-2">
      <div
        onClick={()=>onDeleteImage(folder)}
        className="aspect-square bg-white flex items-center justify-center cursor-pointer text-black"
      >
        delete
      </div>
      {images.map((src, i) => (
        <div
          key={i}
          className="aspect-square bg-white flex items-center justify-center cursor-pointer"
          onClick={() => onSelectImage(folder, src)}
        >
          <Image src={src} alt={`${folder}-${i}`} width={80} height={80} />
        </div>
      ))}
    </div>
  );
}

async function imageExists(src: string): Promise<boolean> {
  try {
    const res = await fetch(src, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}
