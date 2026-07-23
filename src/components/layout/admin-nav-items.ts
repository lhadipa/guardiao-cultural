import { Landmark, Building2, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/admin/museus", label: "Museus", icon: Building2 },
  { href: "/admin/bens", label: "Bens Culturais", icon: Landmark },
];
