"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LightboxPhoto {
  src: string;
  alt: string;
}

export function PhotoLightbox({ photos }: { photos: LightboxPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (index === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") {
        setIndex((i) => (i === null ? i : (i + 1) % photos.length));
        setZoomed(false);
      }
      if (e.key === "ArrowLeft") {
        setIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
        setZoomed(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length]);

  const current = index !== null ? photos[index] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => {
              setIndex(i);
              setZoomed(false);
            }}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-md border"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIndex(null)}
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={(e) => {
              e.stopPropagation();
              setIndex(null);
            }}
            className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i) =>
                    i === null ? i : (i - 1 + photos.length) % photos.length
                  );
                  setZoomed(false);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Próxima foto"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i) => (i === null ? i : (i + 1) % photos.length));
                  setZoomed(false);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="max-h-[85vh] max-w-[90vw] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              onClick={() => setZoomed((z) => !z)}
              className={cn(
                "select-none rounded-md transition-transform duration-200",
                zoomed
                  ? "max-w-none scale-150 cursor-zoom-out"
                  : "max-h-[85vh] max-w-[90vw] cursor-zoom-in"
              )}
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((z) => !z);
            }}
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
          >
            {zoomed ? (
              <ZoomOut className="h-4 w-4" />
            ) : (
              <ZoomIn className="h-4 w-4" />
            )}
            {zoomed ? "Reduzir" : "Ampliar"}
          </button>
        </div>
      )}
    </>
  );
}
