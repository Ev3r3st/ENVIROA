import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    // Načteme tokeny z localStorage při inicializaci
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      email,
      password,
    });

    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  public async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, {
      email,
      password,
      name,
    });

    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  public async refreshTokens(): Promise<RefreshResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<RefreshResponse>(`${API_URL}/auth/refresh`, {
      refreshToken: this.refreshToken,
    });

    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken && !!this.refreshToken;
  }
}

export const authService = AuthService.getInstance(); 