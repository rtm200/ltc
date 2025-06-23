"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";

type Favorite = {
  id: string;
  images: { [key: string]: string };
};

export default function Archive({
  onClose,
  onSelectFavorite,
}: {
  onClose: Dispatch<SetStateAction<boolean>>;
  onSelectFavorite: (images: { [key: string]: string }) => void;
}) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  return (
    <div
      onClick={() => onClose(false)}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-72 md:w-96 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-lg flex flex-col p-4 relative"
      >
        <button
          onClick={() => onClose(false)}
          className="text-black p-2 font-bold text-sm absolute top-2 right-2"
        >
          <CgClose size={20} cursor={"pointer"} />
        </button>

        <h2 className="text-center font-semibold mb-4 text-black">
          Your Archive
        </h2>

        {favorites.length === 0 ? (
          <p className="text-center text-black">No favorites saved yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {favorites.map((fav) => (
              <button
                key={fav.id}
                className="text-black cursor-pointer bg-gray-100 p-2 rounded hover:bg-gray-200 text-left"
                onClick={() => {
                  onSelectFavorite(fav.images);
                  onClose(false);
                }}
              >
                Favorite ID: {fav.id}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
