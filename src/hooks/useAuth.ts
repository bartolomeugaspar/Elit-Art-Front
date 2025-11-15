import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall, apiCallWithAuth } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'Arteist' | 'user';
}

export function useAuth(onLogout?: (message: string) => void) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('[useAuth] Verificando token:', token ? 'Token encontrado' : 'Sem token');
        
        if (!token) {
          console.log('[useAuth] Nenhum token encontrado');
          setLoading(false);
          return;
        }

        console.log('[useAuth] Buscando dados do usuário com token');
        
        // Adicionar timeout para evitar que fique preso
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
          const response = await apiCallWithAuth('auth/me', token);

          if (response.ok) {
            const data = await response.json();
            console.log('[useAuth] Usuário autenticado:', data.user);
            setUser(data.user);
          } else {
            console.log('[useAuth] Token inválido, removendo. Status:', response.status);
            const errorData = await response.json().catch(() => ({}));
            console.log('[useAuth] Erro da API:', errorData);
            localStorage.removeItem('token');
            setUser(null);
          }
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error('[useAuth] Erro ao verificar autenticação:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Verificar autenticação imediatamente
    checkAuth();

    // Listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      console.log('[useAuth] Storage mudou:', e.key);
      if (e.key === 'token') {
        if (e.newValue) {
          console.log('[useAuth] Novo token detectado, verificando autenticação');
          checkAuth();
        } else {
          console.log('[useAuth] Token removido');
          setUser(null);
        }
      }
    };

    // Listener para evento customizado de login
    const handleUserLoggedIn = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('[useAuth] Evento userLoggedIn recebido:', customEvent.detail);
      setUser(customEvent.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiCall('auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha no login. Verifique suas credenciais.');
    }

    const data = await response.json();
    
    if (!data.token) {
      throw new Error('Token não encontrado na resposta do servidor');
    }
    
    console.log('[useAuth] Login bem-sucedido, salvando token');
    localStorage.setItem('token', data.token);
    
    // Se o usuário veio na resposta, usar os dados dele
    if (data.user) {
      console.log('[useAuth] Definindo usuário do login:', data.user);
      setUser(data.user);
      
      // Disparar evento customizado para sincronizar entre abas
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: data.user }));
      
      return data;
    }
    
    // Se o usuário não veio na resposta inicial, buscar os dados do usuário
    console.log('[useAuth] Buscando dados do usuário após login');
    const userResponse = await apiCallWithAuth('auth/me', data.token);
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('[useAuth] Dados do usuário obtidos:', userData.user);
      setUser(userData.user);
      data.user = userData.user;
      
      // Disparar evento customizado para sincronizar entre abas
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userData.user }));
    } else {
      // If we can't get user data, still proceed but log the error
      console.error('Failed to fetch user data after login');
      throw new Error('Falha ao carregar dados do usuário');
    }
    
    return data;
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Chamar endpoint de logout no backend para registrar
      if (token) {
        try {
          await apiCallWithAuth('auth/logout', token, {
            method: 'POST',
          });
        } catch (error) {
          console.error('[useAuth] Erro ao fazer logout no backend:', error);
          // Continuar mesmo se houver erro
        }
      }
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      if (onLogout) {
        onLogout('Você foi desconectado com sucesso!');
      }
      router.push('/');
    }
  };

  return { user, loading, login, logout };
}
