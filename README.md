# ⭐ Star Karaoke Acervo

Catálogo digital de músicas de caraokê com busca avançada, responsivo e otimizado para mobile. Perfeito para gerar QR codes e compartilhar músicas!

## 🎵 Características

- **Busca Fuzzy Avançada**: Encontra músicas mesmo com erros de digitação e sem acentos
  - Busca em: artista, título, código e trecho
  - Remove acentos automaticamente (`Machão` = `machao`)
  - Ordem por relevância
  
- **Interface Mobile-First**: Totalmente responsivo
  - Design limpo e intuitivo
  - Dark mode com toggle
  - Scroll infinito com carregamento progressivo (50 músicas por vez)
  
- **Modal Detalhado**: Clique em qualquer música para ver:
  - Código
  - Título
  - Artista
  - Trecho/Letra
  - Idioma
  - Catálogo
  - QR Code (bitly.com/karaoke/CODIGO)

- **Sem Dependências Externas**: HTML, CSS e JavaScript puro

## 📁 Estrutura do Projeto

```
star-karaoke-acervo/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos (light/dark mode)
├── js/
│   └── script.js          # Lógica da aplicação
├── data/
│   └── lista-musicas.csv  # Catálogo (14.128+ músicas)
├── README.md              # Este arquivo
├── LICENSE                # MIT License
└── .gitignore             # Configuração Git
```

## 🚀 Como Usar

### 1. Clonar o Repositório

```bash
git clone https://github.com/playkaraoke/star-karaoke-acervo.git
cd star-karaoke-acervo
```

### 2. Abrir Localmente

Simplesmente abra o arquivo `index.html` em um navegador:

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Ou use um servidor local (recomendado para desenvolvimento):

```bash
# Python 3
python -m http.server 8000

# Node.js (com http-server)
npx http-server

# PHP
php -S localhost:8000
```

Acesse `http://localhost:8000` no navegador.

### 3. GitHub Pages (Produção)

O repositório está configurado para usar GitHub Pages automaticamente:

1. Vá em **Settings** do repositório
2. Role até **GitHub Pages**
3. Selecione branch `main` como fonte
4. A página estará disponível em: `https://playkaraoke.github.io/star-karaoke-acervo`

## 📝 Atualizar o Catálogo

Para adicionar ou atualizar músicas:

1. **Preparar o CSV**
   - Mantenha as colunas: `Interprete`, `Codigo`, `Nome`, `Trecho`, `Idioma`, `Catalogo`
   - Salve como UTF-8 sem BOM

2. **Colocar em `data/lista-musicas.csv`**
   ```bash
   cp sua-lista.csv data/lista-musicas.csv
   ```

3. **Fazer commit e push**
   ```bash
   git add data/lista-musicas.csv
   git commit -m "Atualizar catálogo de músicas"
   git push origin main
   ```

4. **GitHub Pages atualizará automaticamente em ~1 minuto**

## 🔍 Como Funciona a Busca

A busca é **fuzzy** e **forgiving**:

| Busca | Encontra | Explicação |
|-------|----------|-----------|
| `machao` | `Machão` | Remove acentos |
| `coco voce` | `Eu Coço Você` | Busca parcial, ordem livre |
| `1001` | Código 1001 | Busca por código também |
| `asa` | `Asa de Águia`, `Farraué` (no trecho) | Busca em todos os campos |
| `sangalo ivete` | `Ivete Sangalo` | Ordem não importa |

## 🎨 Personalizações

### Mudar Cores

Edite `/css/style.css` e procure por `:root`:

```css
:root {
  --color-primary: #3b82f6;        /* Azul principal */
  --color-primary-light: #60a5fa;  /* Azul claro */
  --color-success: #10b981;        /* Verde (unused) */
}
```

### Mudar Dark Mode Padrão

Em `/js/script.js`, na função `loadTheme()`:

```javascript
loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark'; // Padrão: dark
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
}
```

### Mudar Items por Página

Em `/js/script.js`, procure por:

```javascript
this.itemsPerPage = 50;  // Alterar número aqui
```

## 🔗 QR Code

Cada música exibe um QR code mockado apontando para:

```
bitly.com/karaoke/CODIGO
```

Para usar QR codes reais:
1. Crie uma cuenta em bitly.com
2. Configure URLs para cada código manualmente
3. Ou integre com a API do Bitly (requer Node.js backend)

## 📱 Responsividade

Testado em:
- iPhone SE (375px)
- iPhone 12 (390px)
- iPad (768px)
- Desktop (1920px+)

## ⚡ Performance

- **Carregamento**: ~2-3 segundos (14k+ músicas)
- **Busca**: Resultado em tempo real (<50ms)
- **Scroll**: 60fps com scroll infinito

## 🐛 Troubleshooting

### CSV não carrega
- Certifique-se que o arquivo está em `data/lista-musicas.csv`
- Verifique se está em UTF-8 encoding
- Teste localmente com `python -m http.server`

### Busca muito lenta
- Reduz o número de items (`itemsPerPage`)
- Aumenta o número de músicas por página

### Dark mode não funciona
- Limpe o cache do navegador (Ctrl+Shift+Delete / Cmd+Shift+Delete)
- Verifique DevTools (F12) → Console

## 📄 Licença

MIT License - veja `LICENSE` para detalhes

## 👨‍💻 Desenvolvido por

**PlayKaraoke**
- YouTube: [PlayKaraoke](https://youtube.com/@playkaraoke)
- Repositório: [star-karaoke-acervo](https://github.com/playkaraoke/star-karaoke-acervo)

## 📞 Suporte

Para problemas, sugestões ou contribuições, abra uma [issue no GitHub](https://github.com/playkaraoke/star-karaoke-acervo/issues)

---

**Versão 1.0** | Setembro 2026
