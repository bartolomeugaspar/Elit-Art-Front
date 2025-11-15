import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Painel Administrativo',
  description: 'Área de login do painel administrativo',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
