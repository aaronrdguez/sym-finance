export type WidgetType =
  | 'balance'
  | 'reserves'
  | 'investments'
  | 'news'
  | 'quick_stats'
  | 'exchange_rates'
  | 'market'
  | 'crypto';

export interface WidgetConfig {
  type: WidgetType;
  size: 1 | 2 | 3;
}

export interface WidgetDefinition {
  type: WidgetType;
  label: string;
  description: string;
  icon: string;
  defaultSize: 1 | 2 | 3;
}

export const WIDGET_DEFINITIONS: WidgetDefinition[] = [
  { type: 'balance', label: 'Balance total', description: 'Saldo general con ingresos y gastos del mes', icon: '💰', defaultSize: 2 },
  { type: 'reserves', label: 'Reservas', description: 'Progreso de ahorros y reservas activas', icon: '🐷', defaultSize: 1 },
  { type: 'investments', label: 'Inversiones', description: 'Rendimiento de la cartera', icon: '📈', defaultSize: 1 },
  { type: 'news', label: 'Noticias financieras', description: 'Últimas novedades del mercado', icon: '📰', defaultSize: 1 },
  { type: 'quick_stats', label: 'Estadísticas rápidas', description: 'Cuentas y métricas clave', icon: '📊', defaultSize: 1 },
  { type: 'exchange_rates', label: 'Tipo de cambio', description: 'Cotización de divisas', icon: '💱', defaultSize: 1 },
  { type: 'market', label: 'Mercado', description: 'Acciones de Wall Street, BYMA y más', icon: '📈', defaultSize: 2 },
  { type: 'crypto', label: 'Cripto', description: 'Precios de criptomonedas', icon: '₿', defaultSize: 1 },
];

export function getDefaultWidgets(): WidgetConfig[] {
  return WIDGET_DEFINITIONS.map(w => ({ type: w.type, size: w.defaultSize }));
}

export function getWidgetDef(type: WidgetType): WidgetDefinition {
  return WIDGET_DEFINITIONS.find(w => w.type === type)!;
}

export interface Account {
  name: string;
  balance: number;
  type: string;
  icon: string;
  color: string;
  currency: string;
}

export interface Reserve {
  uuid: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  currency: string;
  deadline: string | null;
  completed: boolean;
}

export interface ResolvedWidgetData {
  accounts: Account[];
  reserves: Reserve[];
  CURRENCY_CONFIG: Record<string, { symbol: string; name: string; flag: string; perUSD: number }>;
  convertCurrency: (amount: number, from: string, to: string) => number;
  getCurrencySymbol: (currency: string) => string;
}
