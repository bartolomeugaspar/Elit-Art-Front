/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores baseadas no ícone Elit'arte
        'elit-red': '#DC2626',      // Vermelho vibrante do ícone
        'elit-orange': '#EA580C',   // Laranja/vermelho alaranjado
        'elit-yellow': '#F59E0B',   // Amarelo dourado
        'elit-green': '#16A34A',    // Verde da bandeira angolana
        'elit-blue': '#2563EB',     // Azul complementar
        'elit-dark': '#1F2937',     // Cinza escuro para textos
        'elit-light': '#F9FAFB',    // Cinza claro para backgrounds
        
        // Cores originais mantidas para compatibilidade
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
      },
    },
  },
  plugins: [],
}
