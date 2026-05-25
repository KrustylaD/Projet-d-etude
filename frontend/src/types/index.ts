export interface User {
  uid: string;
  email: string;
  display_name: string;
  phone_number?: string;
  farm_name?: string;
  location?: string;
  photo_url?: string;
  role?: string;
  created_at: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  display_name: string;
  phone_number?: string;
  farm_name?: string;
  location?: string;
  photo_url?: string;
  role: string;
  created_at: string;
  diagnostic_count: number;
}

export interface AdminStatsOverview {
  total_users: number;
  total_diagnostics: number;
  total_messages: number;
  total_alerts: number;
}

export interface AdminDiagnosticItem {
  id: string;
  user_id: string;
  user_email: string;
  user_display_name: string;
  culture: string;
  symptoms: string;
  location?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface AdminUsersResponse {
  total: number;
  limit: number;
  offset: number;
  users: AdminUser[];
}

export interface Diagnostic {
  id: string;
  user_id: string;
  culture: string;
  symptoms: string;
  diagnosis?: string;
  probability?: number;
  treatment?: string;
  status: 'en cours' | 'traité' | 'surveillance';
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'diagnosis';
  content: string;
  image_base64?: string;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  type: 'maladie' | 'météo' | 'recommandation' | 'système';
  message: string;
  severity: 'info' | 'warning' | 'critical';
  read: boolean;
  created_at: string;
}

export interface Stats {
  total_diagnostics: number;
  status_breakdown: {
    en_cours: number;
    traité: number;
    surveillance: number;
  };
  unread_alerts: number;
  recent_diagnostics: Diagnostic[];
}
