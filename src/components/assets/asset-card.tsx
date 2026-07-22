import Link from "next/link";
import Image from "next/image";
import { MapPin, ShieldCheck } from "lucide-react";
import { RgcBadge } from "./rgc-badge";
import { AssetStatusBadge } from "./asset-status-badge";
import { getAssetPhotoUrl } from "@/lib/storage";
import type { AssetStatus } from "@/types/database.types";

export interface AssetCardProps {
  id: string;
  name: string;
  category: string;
  address: string | null;
  rgcCode: string;
  status: AssetStatus;
  coverPhotoPath: string | null;
}

export function AssetCard({
  id,
  name,
  category,
  address,
  rgcCode,
  status,
  coverPhotoPath,
}: AssetCardProps) {
  return (
    <Link
      href={`/bens/${id}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-36 w-full bg-gradient-to-br from-amber-200 to-amber-400">
        {coverPhotoPath ? (
          <Image
            src={getAssetPhotoUrl(coverPhotoPath)}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShieldCheck className="h-10 w-10 text-amber-700/60" />
          </div>
        )}
        <div className="absolute right-2 top-2">
          <AssetStatusBadge status={status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="font-medium leading-tight group-hover:text-primary">
          {name}
        </p>
        <p className="text-xs text-muted-foreground">{category}</p>
        {address && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {address}
          </p>
        )}
        <RgcBadge code={rgcCode} className="mt-1 w-fit" />
      </div>
    </Link>
  );
}
