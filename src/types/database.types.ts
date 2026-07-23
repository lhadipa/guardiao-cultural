// Tipos manuais espelhando supabase/migrations/*.sql.
// Substituir por `supabase gen types typescript` assim que o projeto remoto existir.

export type Role = "master" | "user";
export type ProfileStatus = "ativo" | "inativo";
export type MuseumStatus = "ativo" | "inativo";
export type AssetStatus = "seguro" | "alerta";
export type ConservationStatus = "bom" | "regular" | "ruim" | "em_risco";
export type AlertPriority = "baixa" | "media" | "alta" | "critica";

export interface Database {
  public: {
    Tables: {
      museums: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          color_hex: string;
          status: MuseumStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          color_hex?: string;
          status?: MuseumStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["museums"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: Role;
          avatar_url: string | null;
          museum_id: string | null;
          must_change_password: boolean;
          status: ProfileStatus;
          last_password_change_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: Role;
          avatar_url?: string | null;
          museum_id?: string | null;
          must_change_password?: boolean;
          status?: ProfileStatus;
          last_password_change_at?: string | null;
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
          museum_id: string | null;
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
          museum_id?: string | null;
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
