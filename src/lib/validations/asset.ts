import { z } from "zod";

export const ASSET_CATEGORIES = [
  "Arte Sacra",
  "Arquitetônico",
  "Arqueológico",
  "Imaterial",
  "Documental",
  "Natural",
] as const;

export const CONSERVATION_STATUSES = [
  { value: "bom", label: "Bom" },
  { value: "regular", label: "Regular" },
  { value: "ruim", label: "Ruim" },
  { value: "em_risco", label: "Em risco" },
] as const;

export const assetSchema = z.object({
  name: z.string().min(2, "Informe o nome do bem"),
  category: z.enum(ASSET_CATEGORIES),
  conservationStatus: z.enum(["bom", "regular", "ruim", "em_risco"]),
  technicalDescription: z.string().optional(),
  address: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export type AssetInput = z.infer<typeof assetSchema>;
