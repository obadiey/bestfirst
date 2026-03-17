"use client";

import { useState } from "react";

type Props = {
  photos: { url: string }[];
  fallbackPhoto?: string;
  className?: string;
  aspectRatio?: "portrait" | "square";
};

export default function PhotoCarousel({
  photos,
  fallbackPhoto,
  className = "",
  aspectRatio = "portrait",
}: Props) {
  const [current, setCurrent] = useState(0);
  const allPhotos = photos.length > 0 ? photos.map((p) => p.url) : fallbackPhoto ? [fallbackPhoto] : [];

  if (allPhotos.length === 0) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${
        aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
      } ${className}`}>
        <span className="text-gray-300 text-4xl">+</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${
      aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
    } ${className}`}>
      <img
        src={allPhotos[current]}
        alt=""
        className="w-full h-full object-cover"
      />

      {/* Photo indicators */}
      {allPhotos.length > 1 && (
        <>
          <div className="absolute top-3 left-0 right-0 flex justify-center gap-1.5 px-4">
            {allPhotos.map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-all ${
                  i === current ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Tap zones */}
          <button
            className="absolute inset-y-0 left-0 w-1/3"
            onClick={() => setCurrent((c) => (c > 0 ? c - 1 : allPhotos.length - 1))}
            aria-label="Previous photo"
          />
          <button
            className="absolute inset-y-0 right-0 w-1/3"
            onClick={() => setCurrent((c) => (c < allPhotos.length - 1 ? c + 1 : 0))}
            aria-label="Next photo"
          />
        </>
      )}
    </div>
  );
}
