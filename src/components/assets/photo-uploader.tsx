"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadedPhoto {
  path: string;
  previewUrl: string;
}

export function PhotoUploader() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const draftId = useRef(crypto.randomUUID());
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const path = `assets/${draftId.current}/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage
        .from("asset-photos")
        .upload(path, file);

      if (!error) {
        setPhotos((prev) => [
          ...prev,
          { path, previewUrl: URL.createObjectURL(file) },
        ]);
      }
    }

    setIsUploading(false);
  }

  function removePhoto(path: string) {
    setPhotos((prev) => prev.filter((p) => p.path !== path));
  }

  return (
    <div className="space-y-3">
      {photos.map((photo) => (
        <input key={photo.path} type="hidden" name="photoPaths" value={photo.path} />
      ))}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photos.map((photo) => (
          <div
            key={photo.path}
            className="relative aspect-square overflow-hidden rounded-md border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.previewUrl}
              alt="Foto do bem cultural"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(photo.path)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground hover:bg-muted",
            isUploading && "opacity-60"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImagePlus className="h-5 w-5" />
          )}
          <span className="text-xs">Adicionar fotos</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        Múltiplos ângulos
      </Button>
    </div>
  );
}
