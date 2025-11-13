/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        // Outros breakpoints padrão: sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
      },
      colors: {
        // Cores idênticas ao logotipo Elit'Arte
        'elit-red': '#8B4513',      // Marrom/vermelho escuro do "arte"
        'elit-orange': '#D2691E',   // Laranja médio do logotipo
        'elit-yellow': '#F4A460',   // Dourado claro do "elit"
        'elit-brown': '#654321',    // Marrom escuro para contraste
        'elit-gold': '#DAA520',     // Dourado mais vibrante
        'elit-dark': '#2D1810',     // Marrom muito escuro para textos
        'elit-light': '#F5F5DC',    // Bege claro para backgrounds
        
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
