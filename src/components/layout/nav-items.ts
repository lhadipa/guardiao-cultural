import {
  LayoutDashboard,
  Landmark,
  Map,
  Bell,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bens", label: "Bens Culturais", icon: Landmark },
  { href: "/mapa", label: "Mapa & Geofencing", icon: Map },
  { href: "/notificacoes", label: "Notificações", icon: Bell },
  { href: "/relatorios", label: "Relatórios", icon: FileText },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];
