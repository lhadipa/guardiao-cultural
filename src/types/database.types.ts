// Tipos manuais espelhando supabase/migrations/0001_init.sql.
// Substituir por `supabase gen types typescript` assim que o projeto remoto existir.

export type Role = "admin" | "gestor" | "tecnico" | "visualizador";
export type AssetStatus = "seguro" | "alerta";
export type ConservationStatus = "bom" | "regular" | "ruim" | "em_risco";
export type AlertPriority = "baixa" | "media" | "alta" | "critica";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: Role;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: Role;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      cultural_assets: {
        Row: {
          id: string;
          rgc_code: string;
          name: string;
          category: string;
          conservation_status: ConservationStatus;
          technical_description: string | null;
          address: string | null;
          latitude: number;
          longitude: number;
          status: AssetStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          rgc_code?: string;
          name: string;
          category: string;
          conservation_status: ConservationStatus;
          technical_description?: string | null;
          address?: string | null;
          latitude: number;
          longitude: number;
          status?: AssetStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["cultural_assets"]["Insert"]
        >;
      };
      asset_photos: {
        Row: {
          id: string;
          asset_id: string;
          storage_path: string;
          is_cover: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          storage_path: string;
          is_cover?: boolean;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["asset_photos"]["Insert"]
        >;
      };
      alerts: {
        Row: {
          id: string;
          asset_id: string | null;
          title: string;
          message: string | null;
          priority: AlertPriority;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id?: string | null;
          title: string;
          message?: string | null;
          priority: AlertPriority;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["alerts"]["Insert"]>;
      };
    };
  };
}
