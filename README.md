# Cha Panela 🎉

Uma aplicação web para gerenciamento de convidados e gestão de presentes para eventos (cha panela, baby shower, etc).

## 🚀 Tecnologias

- **React 19** - UI library
- **Vite** - Build tool e dev server
- **React Router v7** - Routing
- **Supabase** - Backend e autenticação
- **ESLint** - Linter para código JavaScript

## 📋 Requisitos

- Node.js 16+
- npm ou yarn
- Conta no Supabase

## 🛠️ Setup

### 1. Clonar repositório

```bash
git clone <seu-repo>
cd cha-panela
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
# Copiar arquivo exemplo
cp .env.example .env.local

# Editar .env.local com suas credenciais do Supabase
```

### 4. Rodar dev server

```bash
npm run dev
```

Acesse `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button/
│   ├── Hero/
│   ├── Input/
│   └── Layout/
├── context/            # Context API
│   ├── GuestContext.jsx
│   └── useGuest.js
├── hooks/              # Hooks customizados
│   ├── useForm.js
│   └── useSupabase.js
├── pages/              # Páginas/Rotas
│   ├── Identificacao/
│   ├── Introducao/
│   ├── Presentes/
│   └── Confirmacao/
├── services/           # Serviços externos
│   └── supabase/
├── utils/              # Utilitários
│   ├── constants.js
│   └── validators.js
└── App.jsx             # Componente raiz
```

## 🎯 Funcionalidades

- ✅ Identificação de convidados por telefone
- ✅ Visualização de presentes
- ✅ Confirmação de presença
- ✅ Gestão de dados no Supabase

## 🔗 Importações com Alias

Use `@` como alias para `src/`:

```javascript
// ❌ Evitar
import { useGuest } from '../../../context';

// ✅ Preferir
import { useGuest } from '@/context';
```

## 📚 Hooks Customizados

### `useForm`
Gerencia estado de formulários com validação:

```javascript
import { useForm } from '@/hooks';

const { values, errors, handleChange, resetForm } = useForm({
  nome: '',
  celular: '',
});
```

### `useSupabase`
Wrapper para queries ao Supabase:

```javascript
import { useSupabase } from '@/hooks';

const { findByPhone, createGuest, loading, error } = useSupabase();
```

### `useGuest`
Acesso ao contexto do convidado:

```javascript
import { useGuest } from '@/context';

const { guest, setCurrentGuest, clearGuest } = useGuest();
```

## 📦 Scripts

```bash
npm run dev       # Inicia dev server
npm run build     # Cria build para produção
npm run preview   # Visualiza build localmente
npm run lint      # Verifica linting
npm run deploy    # Deploy para GitHub Pages
```

## 🚀 Deploy

O projeto está configurado para deploy no GitHub Pages:

```bash
npm run deploy
```

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📝 Notas de Desenvolvimento

- Use o path alias `@` para imports
- Mantenha componentes pequenos e focados
- Use hooks customizados para lógica compartilhada
- Valide dados com as funções em `utils/validators.js`

## 🔐 Variáveis de Ambiente

```
VITE_SUPABASE_URL      # URL do seu projeto Supabase
VITE_SUPABASE_ANON_KEY # Chave anônima do Supabase
VITE_DEV_MODE          # Modo desenvolvimento (true/false)
```

## 📄 Licença

Este projeto está sob licença privada.

---

Desenvolvido com ❤️
