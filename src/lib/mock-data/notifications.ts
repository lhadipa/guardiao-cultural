// Dados mockados — a Central de Notificações não é persistida no banco (ver PLANO.md).

export type NotificationPriority = "alerta" | "aviso" | "info";

export interface MockNotification {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  assetName: string;
  createdAt: string;
  isRead: boolean;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "1",
    title: "Bem cultural fora da zona de segurança",
    message:
      "O Cálice de Prata (RGC-MG-000003) foi detectado fora do raio de geofencing configurado.",
    priority: "alerta",
    assetName: "Cálice de Prata",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    isRead: false,
  },
  {
    id: "2",
    title: "Alteração no estado de conservação",
    message:
      "O Retábulo da Capela teve seu estado de conservação atualizado para 'regular'.",
    priority: "aviso",
    assetName: "Retábulo da Capela",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isRead: false,
  },
  {
    id: "3",
    title: "Novo bem cadastrado",
    message: "São Francisco de Assis foi adicionado ao acervo.",
    priority: "info",
    assetName: "São Francisco de Assis",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
  },
  {
    id: "4",
    title: "Relatório mensal disponível",
    message: "O relatório consolidado do mês anterior já pode ser exportado.",
    priority: "info",
    assetName: "—",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isRead: true,
  },
];
