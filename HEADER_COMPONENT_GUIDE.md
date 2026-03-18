# Como Usar o Header Reutilizável

## ✨ Benefícios

- **Redução de código**: ~60 linhas de HTML + CSS → 1 linha de componente
- **Manutenção**: Atualizações em um único lugar
- **Consistência**: Mesmo visual/comportamento em todas as páginas
- **Flexibilidade**: Suporta customização via props

---

## 🚀 Implementação

### 1. Remover o Header Antigo da Página

**ANTES (src/pages/Agradecimento/AgradecimentoPage.jsx):**
```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/header-logo.png';

export default function AgradecimentoPage() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="agradecimento-page">
      {/* HEADER - 40+ linhas de código */}
      <header className="agradecimento-header">
        <Link to="/introducao" style={{...}}>
          <div className="agradecimento-logo-area">
            <img src={logo} alt="logo" className="agradecimento-logo" />
            <p className="agradecimento-logo-text">Estella & Lucas</p>
          </div>
        </Link>

        <button
          className={`agradecimento-menu-toggle ${menuAberto ? 'active' : ''}`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`agradecimento-menu ${menuAberto ? 'open' : ''}`}>
          <Link to="/confirmacao" onClick={() => setMenuAberto(false)}>
            Confirmar presença
          </Link>
          {/* ... mais links ... */}
        </nav>
      </header>
      
      {/* resto da página */}
    </div>
  );
}
```

### 2. Usar o Componente Header

**DEPOIS:**
```jsx
import Header from '@/components/Header';
import btnPresentes from '@/assets/images/btn-presentes.png';
import './agradecimento.css';

export default function AgradecimentoPage() {
  const { guest } = useGuest();

  return (
    <div className="agradecimento-page">
      {/* Uma linha para o header! */}
      <Header />
      
      {/* resto da página */}
      <section className="agradecimento-container">
        {/* ... */}
      </section>
    </div>
  );
}
```

---

## 📋 Checklist - Refatorar Páginas

### Agradecimento
- [x] Header criado
- [ ] Remover HTML do header
- [ ] Remover import de `useState` (se só era usado para menu)
- [ ] Remover import de `logo`
- [ ] Remover CSS do header do `agradecimento.css`
- [ ] Adicionar `<Header />` no JSX
- [ ] Testar responsivo

### Presença
- [ ] Remover HTML do header
- [ ] Remover import de `useState` (se só era usado para menu)
- [ ] Remover import de `logo`
- [ ] Remover CSS do header do `presenca.css`
- [ ] Adicionar `<Header />` no JSX
- [ ] Testar responsivo

### Área do Convidado
- [ ] Remover HTML do header
- [ ] Remover import de `useState` (se só era usado para menu)
- [ ] Remover import de `logo`
- [ ] Remover CSS do header do `areaConvidado.css`
- [ ] Adicionar `<Header />` no JSX
- [ ] Testar responsivo

### Agradecimento Presente
- [ ] Remover HTML do header
- [ ] Remover import de `useState` (se só era usado para menu)
- [ ] Remover import de `logo`
- [ ] Remover CSS do header do `agradecimentoPresente.css`
- [ ] Adicionar `<Header />` no JSX
- [ ] Testar responsivo

### Introdução
- [ ] Remover HTML do header
- [ ] Remover import de `useState` (se só era usado para menu)
- [ ] Remover import de `logo`
- [ ] Remover CSS do header do `introducao.css`
- [ ] Adicionar `<Header />` no JSX
- [ ] Testar responsivo

### Presentes
- [ ] Remover HTML do header
- [ ] Remover import de `useState` (se só era usado para menu)
- [ ] Remover import de `logo`
- [ ] Remover CSS do header do `presentes.css`
- [ ] Adicionar `<Header />` no JSX
- [ ] Testar responsivo

---

## 🎨 Customização (Avançado)

Se uma página precisar de estilos específicos do header:

```jsx
<Header className="mypage-header" />
```

Depois em `mypage.css`:
```css
.mypage-header {
  /* estilos específicos que herdam de .header */
  background: var(--color-primary-dark); /* sobrescreve */
}
```

---

## 📊 Estatísticas de Redução

### Antes
- 6 páginas × ~50 linhas de header HTML = 300 linhas
- 6 páginas × ~200 linhas de header CSS = 1.200 linhas
- **Total: ~1.500 linhas ❌**

### Depois
- 1 componente = 30 linhas
- 1 arquivo CSS = 150 linhas
- 6 páginas × 1 linha = 6 linhas
- **Total: ~186 linhas ✅**

**Economia: ~87% de código duplicado!**

---

## 🔗 Arquivos Criados

```
src/
  components/
    Header/
      Header.jsx       ← Componente React
      header.css       ← Estilos genéricos
      index.js         ← Export (facilita import)
```

## 📦 Como Importar

```javascript
// Opção 1: Import padrão
import Header from '@/components/Header';

// Opção 2: Import nomeado
import { Header } from '@/components/Header';

// Ambas funcionam. Use a que preferir.
```
