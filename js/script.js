class StarKaraokeApp {
  constructor() {
    this.songs = [];
    this.filteredSongs = [];
    this.currentPage = 0;
    this.itemsPerPage = 50;
    this.isLoadingMore = false;
    
    this.initElements();
    this.initEventListeners();
    this.loadCSV();
    this.loadTheme();
  }

  initElements() {
    this.themeToggle = document.getElementById('themeToggle');
    this.modal = document.getElementById('modal');
    this.closeBtn = document.getElementById('closeBtn');
    this.searchInput = document.getElementById('searchInput');
    this.content = document.getElementById('content');
    this.loadingState = document.getElementById('loadingState');
  }

  initEventListeners() {
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.closeBtn.addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });
    this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
    this.content.addEventListener('scroll', () => this.handleScroll());
  }

  removeAccents(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }

  fuzzySearch(query, data) {
    if (!query.trim()) return data;
    
    const cleanQuery = this.removeAccents(query)
      .split(/\s+/)
      .filter(Boolean);
    
    return data
      .map(item => {
        const searchText = this.removeAccents(
          `${item.Interprete} ${item.Nome} ${item.Codigo} ${item.Trecho}`
        );
        
        const matches = cleanQuery.filter(q => searchText.includes(q)).length;
        const score = matches > 0 ? matches : 0;
        
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  handleSearch(e) {
    const query = e.target.value;
    this.currentPage = 0;
    
    if (query.trim()) {
      this.filteredSongs = this.fuzzySearch(query, this.songs);
    } else {
      this.filteredSongs = [...this.songs];
    }
    
    this.renderSongs();
  }

  handleScroll() {
    if (this.isLoadingMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = this.content;
    
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (this.getNextPageCount() > 0) {
        this.loadMore();
      }
    }
  }

  getNextPageCount() {
    const endIdx = (this.currentPage + 1) * this.itemsPerPage;
    return Math.max(0, this.filteredSongs.length - endIdx);
  }

  loadMore() {
    this.isLoadingMore = true;
    this.currentPage++;
    this.renderSongs(false);
    this.isLoadingMore = false;
  }

  renderSongs(reset = true) {
    const startIdx = 0;
    const endIdx = (this.currentPage + 1) * this.itemsPerPage;
    const pageSongs = this.filteredSongs.slice(startIdx, endIdx);
    
    if (pageSongs.length === 0 && this.currentPage === 0) {
      this.content.innerHTML = '<div class="empty-state">Nenhuma música encontrada</div>';
      return;
    }

    let html = '';
    
    if (reset) {
      html = this.createSongHTML(pageSongs);
    } else {
      const newSongs = this.filteredSongs.slice(
        this.currentPage * this.itemsPerPage,
        endIdx
      );
      const existingHTML = this.content.innerHTML.replace(
        /<div class="search-info">.*?<\/div>/,
        ''
      );
      html = existingHTML + this.createSongHTML(newSongs);
    }

    this.content.innerHTML = html;

    const searchInfo = document.createElement('div');
    searchInfo.className = 'search-info';
    searchInfo.innerHTML = `<small>Mostrando ${Math.min(endIdx, this.filteredSongs.length)} de ${this.filteredSongs.length}</small>`;
    this.content.appendChild(searchInfo);
  }

  createSongHTML(songs) {
    return songs
      .map(song => `
        <div class="song-item" data-codigo="${this.escapeHTML(song.Codigo)}" role="button" tabindex="0">
          <div class="song-header">
            <span class="song-code">${this.escapeHTML(song.Codigo)}</span>
          </div>
          <div class="song-title">${this.escapeHTML(song.Nome)}</div>
          <div class="song-artist">${this.escapeHTML(song.Interprete)}</div>
        </div>
      `)
      .join('');
  }

  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  openModal(song) {
    const modalBody = document.getElementById('modalBody');
    
    const fields = [
      { label: 'Código', value: song.Codigo },
      { label: 'Música', value: song.Nome },
      { label: 'Artista', value: song.Interprete },
      { label: 'Trecho', value: song.Trecho },
      { label: 'Idioma', value: song.Idioma },
      { label: 'Catálogo', value: song.Catalogo },
    ];

    let html = fields
      .map(field => `
        <div class="modal-field">
          <label class="modal-label">${this.escapeHTML(field.label)}</label>
          <div class="modal-value">${this.escapeHTML(field.value)}</div>
        </div>
      `)
      .join('');

    html += `
      <button class="copy-btn" id="copyBtn">
        📋 Copiar Dados
      </button>
    `;

    modalBody.innerHTML = html;
    
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.addEventListener('click', () => {
      const texto = `Código\n${song.Codigo}\n\nMúsica\n${song.Nome}\n\nArtista\n${song.Interprete}\n\nTrecho\n${song.Trecho}\n\nIdioma\n${song.Idioma}\n\nCatálogo\n${song.Catalogo}`;
      
      navigator.clipboard.writeText(texto).then(() => {
        const textOriginal = copyBtn.textContent;
        copyBtn.textContent = '✅ Copiado!';
        setTimeout(() => {
          copyBtn.textContent = textOriginal;
        }, 2000);
      }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Erro ao copiar dados');
      });
    });

    this.modal.classList.add('active');
  }

  closeModal() {
    this.modal.classList.remove('active');
  }

  toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    this.themeToggle.textContent = isDarkMode ? '☀️ Light' : '🌙 Dark';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      this.themeToggle.textContent = '☀️ Light';
    }
  }

  async loadCSV() {
    try {
      const response = await fetch('./data/lista-musicas.csv');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const csv = await response.text();
      this.parseCSV(csv);
      this.filteredSongs = [...this.songs];
      this.renderSongs();
      this.attachSongItemListeners();
    } catch (error) {
      console.error('Erro ao carregar CSV:', error);
      this.content.innerHTML = `
        <div class="empty-state">
          Erro ao carregar o catálogo. Por favor, recarregue a página.
        </div>
      `;
    }
  }

  parseCSV(csv) {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return;

    const headers = lines[0].split(',').map(h => h.trim());
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const values = this.parseCSVLine(line);
      if (values.length >= headers.length) {
        const song = {};
        headers.forEach((header, idx) => {
          song[header] = values[idx] || '';
        });
        this.songs.push(song);
      }
    }
  }

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  attachSongItemListeners() {
    this.content.addEventListener('click', (e) => {
      const songItem = e.target.closest('.song-item');
      if (songItem) {
        const codigo = songItem.getAttribute('data-codigo');
        const song = this.filteredSongs.find(s => s.Codigo === codigo);
        if (song) this.openModal(song);
      }
    });

    this.content.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const songItem = e.target.closest('.song-item');
        if (songItem) {
          const codigo = songItem.getAttribute('data-codigo');
          const song = this.filteredSongs.find(s => s.Codigo === codigo);
          if (song) this.openModal(song);
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new StarKaraokeApp();
});
