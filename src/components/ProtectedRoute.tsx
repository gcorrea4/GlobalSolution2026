import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  const userRole = sessionStorage.getItem('userRole') ?? '';

  if (!usuarioLogado || !allowedRoles.includes(userRole)) {
    console.warn('Acesso negado: faça login para acessar esta página.');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
