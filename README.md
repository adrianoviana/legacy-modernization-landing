# LegacyModern Landing Page

Landing page para consultoria de modernização de sistemas legados críticos.

## 🚀 Deploy no GitHub Pages

Este repositório está configurado para deploy automático no GitHub Pages via GitHub Actions.

### Configuração necessária:

1. Vá em **Settings** → **Pages** no repositório
2. Em **Source**, selecione **GitHub Actions**
3. O workflow será executado automaticamente a cada push na branch `main`

### URL da página:
Após o primeiro deploy: `https://adrianoviana.github.io/legacy-modernization-landing/`

## 📁 Estrutura

```
├── index.html          # Landing page principal
├── obrigado.html       # Página de agradecimento pós-formulário
├── styles.css          # Estilos completos
├── script.js           # JavaScript interativo
├── .github/
│   └── workflows/
│       └── deploy.yml  # Workflow de deploy
└── README.md
```

## 🛠️ Tecnologias

- HTML5 semântico
- CSS3 com Custom Properties (CSS Variables)
- JavaScript vanilla (ES6+)
- GitHub Actions para CI/CD
- GitHub Pages para hosting

## 🎨 Features

- ✅ Design responsivo (mobile-first)
- ✅ Tema escuro profissional
- ✅ Animações suaves (respeita `prefers-reduced-motion`)
- ✅ Acessibilidade (WCAG 2.1 AA)
- ✅ Formulário funcional (integração com Formspree)
- ✅ SEO otimizado (meta tags, Open Graph, Twitter Cards)
- ✅ Performance otimizada

## 📝 Personalização

### Cores (CSS Variables em `styles.css`):
```css
:root {
  --color-primary: #00D4AA;      /* Verde principal */
  --color-secondary: #3B82F6;    /* Azul secundário */
  --color-bg: #0A1628;           /* Background principal */
  /* ... mais variáveis */
}
```

### Conteúdo:
Edite `index.html` para alterar textos, posicionamento, depoimentos, etc.

### Formulário:
Configure o endpoint do Formspree no `action` do formulário em `index.html`:
```html
<form action="https://formspree.io/f/SEU_ID_AQUI" method="POST">
```

## 🚀 Deploy Manual (se necessário)

```bash
# Clone o repositório
git clone https://github.com/adrianoviana/legacy-modernization-landing.git
cd legacy-modernization-landing

# Faça suas alterações
# ...

# Commit e push
git add .
git commit -m "Atualizações na landing page"
git push origin main
```

O GitHub Actions fará o deploy automaticamente.

## 📄 Licença

Proprietário - LegacyModern