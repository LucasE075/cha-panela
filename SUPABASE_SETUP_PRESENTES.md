# Configuração do Supabase - Tabela Presentes

## 📋 Alterações Necessárias na Tabela `presentes`

Para que o fluxo de confirmação de presentes com diferentes tipos (físico, PIX) funcione corretamente, você precisa adicionar dois campos à tabela `presentes`:

### 1. Campo `tipo` (string/text)
- **Nome da coluna**: `tipo`
- **Tipo**: `text`
- **Valores possíveis**:
  - `'fisico'` - Presente físico
  - `'pix_fechado'` - PIX com valor fixo
  - `'pix_livre'` - PIX com valor livre (sugestão)
- **Padrão**: `'fisico'`
- **Obrigatório**: Não

## 🔧 Como adicionar via SQL (Supabase Dashboard)

Acesse seu painel do Supabase → SQL Editor e execute:

```sql
-- Adicionar coluna 'tipo'
ALTER TABLE presentes ADD COLUMN tipo TEXT DEFAULT 'fisico';

-- Criar índices (opcional, para melhor performance)
CREATE INDEX idx_presentes_tipo ON presentes(tipo);
```

## 📝 Exemplo de dados

Depois de adicionar a coluna, você pode inserir presentes assim:

```sql
-- Presente Físico
INSERT INTO presentes (nome, descricao, preco, imagem, tipo)
VALUES (
  'Toalha de Banho',
  'Toalha 100% algodão premium',
  150.00,
  '/src/assets/images/toalha.png',
  'fisico'
);

-- Presente PIX Fechado (valor fixo)
INSERT INTO presentes (nome, descricao, preco, imagem, tipo)
VALUES (
  'PIX - Cozinha',
  'Contribuição para cozinha',
  500.00,
  '/src/assets/images/cozinha.png',
  'pix_fechado'
);

-- Presente PIX Livre (valor sugerido)
INSERT INTO presentes (nome, descricao, preco, imagem, tipo)
VALUES (
  'PIX - Livre',
  'Contribuição livre',
  100.00,  -- valor sugerido
  '/src/assets/images/pix.png',
  'pix_livre'
);
```

> 📌 Importante: O QR code é um arquivo único (`qrcode.png`) localizado em `src/assets/images/` e **não** faz parte da tabela `presentes`.


## 🎯 Como usar no código

Após adicionar o campo, o fluxo funcionará assim:

1. **AreaConvidadoPage**: 
   - Busca o campo `tipo` junto com os dados do presente
   - Ao clicar "Confirmar Presente", passa os dados para AgradecimentoPresentePage

2. **AgradecimentoPresentePage**:
   - Verifica `presente.tipo`
   - Se `'fisico'`: mostra apenas mensagem de agradecimento
   - Se `'pix_fechado'` ou `'pix_livre'`: mostra QR code fixo (`qrcode.png`) + valor sugerido

## ✅ Checklist de Implementação

- [ ] Adicionar coluna `tipo` à tabela `presentes`
- [ ] Inserir dados de exemplo com o novo campo
- [ ] Atualizar query em `src/pages/AreaConvidado/AreaConvidadoPage.jsx` linha ~60 para incluir `tipo` na seleção de presentes:
  ```javascript
  presentes (
    id,
    nome,
    descricao,
    preco,
    imagem,
    tipo,        // ← Adicionar
  )
  ```
- [ ] Testar fluxo em AreaConvidadoPage
- [ ] Testar fluxo em AgradecimentoPresentePage
- [ ] Validar exibição de QR codes e valores

## 🐛 Troubleshooting

**P: Os campos não aparecem na query?**
- R: Verifique se a coluna foi criada corretamente. Teste: `SELECT * FROM presentes LIMIT 1;`

**P: O QR code não aparece?**
- R: Verifique se o path está correto e se a imagem existe em `src/assets/images/`

**P: A página redireciona mas não mostra os dados?**
- R: Verifique se o `presente` foi passado corretamente via `navigate(..., { state: { presente } })`
