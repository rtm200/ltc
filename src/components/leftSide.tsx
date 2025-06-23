"use client";

export default function Leftside({ onSelect }: { onSelect: (folder: string) => void }) {
  const folderNames = ["body", "eyes", "hands", "dress", "hair", "mouth"];
  return (
    <div className="flex flex-row md:flex-col gap-6 md:h-full md:min-h-full min-h-[90px] text-black overflow-auto w-full flex-1/5 md:no-scrollbar">
      {folderNames.map((name) => (
        <div
          key={name}
          className="min-w-[80px] aspect-square bg-white flex items-center justify-center cursor-pointer capitalize"
          onClick={() => onSelect(name)}
        >
          {name}
        </div>
      ))}
    </div>
  );
}
