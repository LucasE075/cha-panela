# Convenções de Código - Cha Panela

## 📋 Índice

- [Componentes](#componentes)
- [Hooks](#hooks)
- [Imports](#imports)
- [Estado](#estado)
- [Naming](#naming)
- [CSS](#css)
- [Commit Messages](#commit-messages)

## Componentes

### Estrutura Básica

```jsx
import { useState } from 'react';
import { useGuest } from '@/context';
import './MyComponent.css';

/**
 * Descrição breve do componente
 */
function MyComponent() {
  const [state, setState] = useState(null);

  return <div className="my-component">Content</div>;
}

export default MyComponent;
```

### Naming
- Nomes de componentes em **PascalCase**: `MyComponent.jsx`
- Props com valores booleanos começam com `is` ou `has`: `isLoading`, `hasError`
- Handlers começam com `handle`: `handleClick`, `handleChange`

### Props
```jsx
// ❌ Evitar números mágicos e props sem validação
<Button onClick={() => doSomething()} />

// ✅ Preferir props nomeadas
<Button onClick={handleClick} label="Clique aqui" />
```

## Hooks

### Customizados
- Sempre comece com `use`: `useForm`, `useSupabase`
- Localize em `src/hooks/`
- Exporte pelo `index.js`

```javascript
import { useForm } from '@/hooks';
const { values, errors, handleChange } = useForm(initial);
```

### Rules of Hooks
- Não chame hooks dentro de condições
- Não chame hooks dentro de loops
- Chame apenas em componentes React ou custom hooks

## Imports

### Ordem
```javascript
// 1. React e dependências externas
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Context e Hooks
import { useGuest } from '@/context';
import { useForm } from '@/hooks';

// 3. Componentes locais
import MyComponent from '@/components/MyComponent';

// 4. Utils
import { validatePhone } from '@/utils/validators';

// 5. CSS
import './styles.css';
```

### Path Alias
Sempre use `@` para imports de `src/`:

```javascript
// ❌ Evitar
import { constants } from '../../../utils';

// ✅ Preferir
import { constants } from '@/utils';
```

## Estado

### useState
```javascript
// ❌ Múltiplos states para informações relacionadas
const [nome, setNome] = useState('');
const [celular, setCelular] = useState('');
const [email, setEmail] = useState('');

// ✅ Agrupar em um objeto
const [formData, setFormData] = useState({
  nome: '',
  celular: '',
  email: '',
});
```

### Context
Use `useGuest()` para dados do convidado:

```javascript
import { useGuest } from '@/context';

function MyComponent() {
  const { guest, setCurrentGuest } = useGuest();
  
  return <div>{guest?.nome}</div>;
}
```

## Naming

### Variáveis e Funções
- Use **camelCase**: `myVariable`, `handleClick`
- Nomes descritivos: `isLoading`, `errorMessage`
- Booleanos: `is*`, `has*`, `should*`, `can*`

```javascript
// ❌ Genérico
const x = true;
const data = { a: 1 };

// ✅ Descritivo
const isLoading = true;
const userCredentials = { id: 1 };
```

### Constantes
- Use **SCREAMING_SNAKE_CASE**: `MAX_PHONE_LENGTH`
- Localize em `src/utils/constants.js`

```javascript
export const MAX_NAME_LENGTH = 100;
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
};
```

## CSS

### Naming
- Use **kebab-case**: `my-component`, `button-primary`
- Escopo com classe de componente:

```css
/* ✅ Bom */
.identification-page { }
.identification-page__input { }
.identification-page__button { }

/* ❌ Evitar */
.input { }
.button { }
```

### Organização
```css
/* 1. Display e layout */
.my-component {
  display: flex;
  flex-direction: column;
}

/* 2. Box model */
.my-component {
  margin: 1rem;
  padding: 1rem;
  width: 100%;
}

/* 3. Tipografia */
.my-component {
  font-size: 1rem;
  color: var(--text);
}

/* 4. Outros */
.my-component {
  transition: all 0.3s ease;
}
```

## Commit Messages

### Formato
```
<tipo>: <descrição breve>

<descrição detalhada (opcional)>

<rodapé com referências (opcional)>
```

### Tipos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `refactor`: Refatoração sem mudança funcional
- `style`: Mudanças de formatação/CSS
- `docs`: Documentação
- `chore`: Dependências, build, etc

### Exemplos
```bash
# ✅ Bom
git commit -m "feat: adicionar validação de telefone"
git commit -m "fix: corrigir erro ao salvar convidado"
git commit -m "refactor: simplificar componente de formulário"

# ❌ Evitar
git commit -m "Update files"
git commit -m "Fix bug lol"
git commit -m "WIP"
```

## Boas Práticas Gerais

✅ **DO**
- Componentes pequenos e focados
- Reutilizar componentes e hooks
- Validar inputs do usuário
- Tratar erros adequadamente
- Usar const em vez de let/var
- Adicionar comentários para lógica complexa

❌ **DON'T**
- Componentes muito grandes (>200 linhas)
- Logica complexa em componentes
- Hardcoding valores mágicos
- Ignorar erros do console
- console.log sem remover depois
- Modificar props diretamente

## Recursos Úteis

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com)
- [Supabase Docs](https://supabase.com/docs)
