"use client";

import { useRef, useState } from "react";
import { AlertCircle, ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { getAssetPhotoUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface UploadedPhoto {
  id: string;
  previewUrl: string;
  path: string | null;
  status: "uploading" | "done" | "error";
  existingId?: string;
}

export interface ExistingPhoto {
  id: string;
  storagePath: string;
}

export function PhotoUploader({
  existingPhotos = [],
}: {
  existingPhotos?: ExistingPhoto[];
}) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>(() =>
    existingPhotos.map((photo) => ({
      id: photo.id,
      previewUrl: getAssetPhotoUrl(photo.storagePath),
      path: photo.storagePath,
      status: "done" as const,
      existingId: photo.id,
    }))
  );
  const [removedExistingIds, setRemovedExistingIds] = useState<string[]>([]);
  const draftId = useRef(crypto.randomUUID());
  const inputRef = useRef<HTMLInputElement>(null);
  const isUploading = photos.some((p) => p.status === "uploading");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const id = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);

      setPhotos((prev) => [
        ...prev,
        { id, previewUrl, path: null, status: "uploading" },
      ]);

      const path = `assets/${draftId.current}/${id}-${file.name}`;
      const { error } = await supabase.storage
        .from("asset-photos")
        .upload(path, file);

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, path: error ? null : path, status: error ? "error" : "done" }
            : p
        )
      );
    }
  }

  function removePhoto(id: string) {
    const photo = photos.find((p) => p.id === id);
    if (photo?.existingId) {
      setRemovedExistingIds((prev) => [...prev, photo.existingId!]);
    }
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-3">
      {photos
        .filter((photo) => photo.status === "done" && photo.path && !photo.existingId)
        .map((photo) => (
          <input key={photo.id} type="hidden" name="photoPaths" value={photo.path!} />
        ))}
      {removedExistingIds.map((id) => (
        <input key={id} type="hidden" name="removedPhotoIds" value={id} />
      ))}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-md border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.previewUrl}
              alt="Foto do bem cultural"
              className={cn(
                "h-full w-full object-cover",
                photo.status === "uploading" && "opacity-50"
              )}
            />
            {photo.status === "uploading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            )}
            {photo.status === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 p-1 text-center text-white">
                <AlertCircle className="h-5 w-5" />
                <span className="text-[10px] leading-tight">Falha ao enviar</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => removePhoto(photo.id)}
              className="absolute right-1 top-1 cursor-pointer rounded-full bg-black/60 p-1 text-white"
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
            "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground hover:bg-muted",
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
