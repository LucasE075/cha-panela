# Guia de Estilos - Projeto Chá de Panela

## 📐 Estrutura de Estilos

### Hierarquia de Imports
1. **variables.css** - Variáveis CSS globais (cores, fonts, espaçamentos)
2. **index.css** - Resetar CSS e estilos globais
3. **Estilos por componente** - CSS específico de cada página

```javascript
// main.jsx
import './styles/variables.css'  // Primeiro
import './index.css'             // Depois
import App from './App.jsx'
```

---

## 🎨 Sistema de Cores

### Usando Variáveis CSS

✅ **CORRETO:**
```css
.container {
  background: var(--color-bg-gradient-1);
  color: var(--color-text-dark);
  border: 1px solid var(--color-border-gold);
}
```

❌ **EVITAR:**
```css
.container {
  background: #E8EEF5;
  color: #3d3424;
  border: 1px solid #C0B070;
}
```

### Paleta de Cores
- **Primária**: `--color-primary` (#B8A660) - Headers, botões principais
- **Textos**: `--color-text-dark` (#3d3424) - Textos principais
- **Backgrounds**: `--color-bg-gradient-1/2` - Gradientes de fundo
- **Acentos**: `--color-success`, `--color-warning`, `--color-error`

---

## 📝 Tipografia

### Usando Variáveis de Font

✅ **CORRETO:**
```css
.titulo {
  font-family: var(--font-serif);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
}

.menu-item {
  font-family: var(--font-serif-mate);
  font-size: var(--text-xl);
}
```

### Font Families Disponíveis
- `--font-serif`: Playfair Display (headings)
- `--font-serif-mate`: Mate (menus, logos)
- `--font-custom-imprima`: Imprima (títulos especiais)

---

## 📏 Espaçamento e Layout

### Usando Variáveis de Spacing

✅ **CORRETO:**
```css
.container {
  padding: var(--padding-vertical) var(--padding-horizontal);
  gap: var(--spacing-2xl);
  margin-top: var(--header-height);
}
```

### Breakpoints
```css
@media (max-width: 1024px) { }
@media (max-width: 768px) { }
@media (max-width: 640px) { }
@media (max-width: 480px) { }
@media (max-width: 380px) { }
@media (max-width: 320px) { }
```

---

## 🚫 Caminhos de Imagens - REGRA IMPORTANTE

### Background Images

❌ **ERRADO - Não funciona no build!**
```css
background-image: url(/src/assets/images/bg.jpeg);
```

✅ **CORRETO - Usar caminho relativo:**
```css
/* Em src/pages/Presenca/presenca.css */
background-image: url(../../assets/images/backgroundpresenca.jpeg);
```

### Imports em Componentes

✅ **CORRETO - Usar alias @/:**
```javascript
import logo from '@/assets/images/header-logo.png';
import bg from '@/assets/images/background.jpg';
```

---

## 📦 Estrutura de Classes

### Nomenclatura
```
.{page}-{component}
.{page}-{component}__sub-element
.{page}-{component}--modifier
```

**Exemplo:**
```css
.presenca-container { }           /* Componente principal */
.presenca-container::before { }   /* Pseudo-elemento */
.presenca-header { }              /* Subcomponente */
.presenca-menu { }                /* Variação */
.presenca-menu.open { }           /* Modificador */
```

---

## 🎯 Padrão de Background + Overlay

### Implementação Recomendada

```css
.page {
  background: linear-gradient(135deg, var(--color-bg-gradient-1), var(--color-bg-gradient-2));
  position: relative;
}

.page::before {
  content: '';
  position: fixed;
  top: var(--header-height);
  inset: 0;
  background-image: url(../../assets/images/background.jpeg);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  opacity: 0.5;
  z-index: var(--z-base);
  pointer-events: none;
}

.content {
  position: relative;
  z-index: var(--z-content);
}
```

---

## 🔄 Componentes Reutilizáveis (TODO)

**Ideal criar:**
- Header componente (atualmente repetido em cada página)
- Button componentes padrão
- Form elementos (inputs, labels)

---

## ✅ Checklist para Novas Páginas

- [ ] Use `--color-*` em vez de cores hardcoded
- [ ] Use `--font-*` em vez de font-family hardcoded
- [ ] Use `--spacing-*` para gaps, margins, padding
- [ ] Use caminhos relativos para background-images
- [ ] Use `@/assets/` para imports em components
- [ ] Segua nomenclatura de classes
- [ ] Implemente media queries nos breakpoints listados
- [ ] Remova código duplicado
