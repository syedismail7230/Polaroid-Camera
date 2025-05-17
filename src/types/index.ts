export interface Photo {
  id: string;
  src: string;
  filter: string;
  frame: string;
  caption: string;
  createdAt: Date;
}

export interface Venue {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
}

export interface PrinterDevice {
  id: string;
  name: string;
  type: 'bluetooth' | 'usb';
  status: 'connected' | 'disconnected' | 'connecting';
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export interface AnalyticsData {
  totalPrints: number;
  totalRevenue: number;
  printsByDay: { date: string; count: number }[];
  revenueByDay: { date: string; amount: number }[];
}