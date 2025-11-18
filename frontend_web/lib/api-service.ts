/**
 * API Service for FastAPI Backend
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'debit' | 'credit';
  merchant?: string;
  category: string;
  raw_text: string;
}

export interface User {
  id: string;
  phone: string;
  name?: string;
  created_at: string;
}

export interface CategorySummary {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface SpendingSummary {
  total_spent: number;
  total_income: number;
  net_balance: number;
  transaction_count: number;
  categories: CategorySummary[];
  top_merchants: Array<{
    merchant: string;
    amount: number;
    count: number;
  }>;
  date_range: {
    start: string;
    end: string;
  };
}

export interface Insight {
  type: 'alert' | 'recommendation' | 'trend';
  title: string;
  message: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface AnalysisResponse {
  summary: SpendingSummary;
  insights: Insight[];
  trends: {
    period: string;
    data: Array<{ date?: string; week?: string; month?: string; amount: number }>;
  };
}

export interface ChatResponse {
  response: string;
  sources?: string[];
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || error.message || 'Request failed');
    }

    return response.json();
  }

  // Upload endpoints
  async uploadPDF(file: File): Promise<{ user: User; transaction_count: number; message: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/upload/pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
  }

  async uploadCSV(file: File): Promise<{ user: User; transaction_count: number; message: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/upload/csv`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
  }

  // Analysis endpoints
  async getAnalysis(userId: string, days: number = 30): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>(`/analysis/summary/${userId}?days=${days}`);
  }

  async getTrends(userId: string, period: 'daily' | 'weekly' | 'monthly' = 'monthly', days: number = 90): Promise<any> {
    return this.request(`/analysis/trends/${userId}?period=${period}&days=${days}`);
  }

  async getCategoryBreakdown(userId: string, days: number = 30): Promise<any> {
    return this.request(`/analysis/category/${userId}?days=${days}`);
  }

  // Chat endpoint
  async sendChatMessage(userId: string, message: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, message }),
    });
  }

  // User endpoints
  async getUser(userId: string): Promise<User> {
    return this.request<User>(`/user/${userId}`);
  }

  async getUserByPhone(phone: string): Promise<User> {
    return this.request<User>(`/user/phone/${phone}`);
  }

  async getUserTransactions(
    userId: string,
    limit: number = 100,
    days?: number
  ): Promise<{ user_id: string; count: number; transactions: Transaction[] }> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (days) params.append('days', days.toString());
    return this.request(`/user/${userId}/transactions?${params}`);
  }
}

export const apiService = new ApiService();

