export interface User {
  uid: string;
  email: string;
  display_name: string;
  phone_number?: string;
  farm_name?: string;
  location?: string;
  created_at: string;
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
