# Estrutura de Componentes - Elit'arte

Esta pasta contém todos os componentes React organizados de forma modular para facilitar a manutenção e reutilização.

## 📁 Estrutura de Pastas

```
components/
├── layout/           # Componentes de layout
│   ├── Header.tsx   # Cabeçalho com navegação
│   └── Footer.tsx   # Rodapé com informações de contato
├── sections/        # Seções da página principal
│   ├── HeroSection.tsx     # Seção hero principal
│   ├── AreasSection.tsx    # Áreas artísticas
│   ├── ProjectsSection.tsx # Projetos em destaque
│   └── ValuesSection.tsx   # Valores e missão
└── index.ts         # Arquivo de exportação centralizada
```

## 🎯 Benefícios da Organização

### **Modularidade**
- Cada componente tem uma responsabilidade específica
- Fácil de testar e manter individualmente
- Reutilização em outras páginas

### **Organização Clara**
- **layout/**: Componentes estruturais (Header, Footer)
- **sections/**: Seções específicas da página principal

### **Importações Simplificadas**
```typescript
// Antes (página monolítica)
// Todo código em um único arquivo de 300+ linhas

// Depois (componentes modulares)
import { Header, Footer, HeroSection } from '@/components'
```

## 🚀 Como Usar

### Importar Componentes Individuais
```typescript
import Header from '@/components/layout/Header'
import HeroSection from '@/components/sections/HeroSection'
```

### Importar Múltiplos Componentes
```typescript
import { 
  Header, 
  Footer, 
  HeroSection, 
  AreasSection 
} from '@/components'
```

## 📝 Convenções

- **Nomes**: PascalCase para componentes
- **Arquivos**: Extensão `.tsx` para componentes React
- **Exports**: Default export para cada componente
- **Imports**: Organizados alfabeticamente

## 🔧 Manutenção

Para adicionar novos componentes:

1. Crie o arquivo na pasta apropriada
2. Adicione a exportação no `index.ts`
3. Importe onde necessário

Esta estrutura torna o projeto mais escalável e profissional!
