// script.js — navegação simples entre telas do protótipo CORE
document.addEventListener('DOMContentLoaded', function(){
  const startBtn = document.getElementById('start-btn');
  const backToStartBtn = document.getElementById('back-to-start');
  const simulateCompleteBtn = document.getElementById('simulate-complete');
  const restartBtn = document.getElementById('restart-btn');
  const toStartBtn = document.getElementById('to-start-btn');

  const startScreen = document.getElementById('start-screen');
  const gameScreen  = document.getElementById('game-screen');
  const endScreen   = document.getElementById('end-screen');

  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const integrityEl = document.getElementById('integrity');
  const finalProgress = document.getElementById('final-progress');

  function showScreen(name){
    startScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    if(name === 'start') startScreen.classList.remove('hidden');
    if(name === 'game')  gameScreen.classList.remove('hidden');
    if(name === 'end')   endScreen.classList.remove('hidden');
  }

  // Inicializa com a tela de início
  showScreen('start');

  // Eventos de navegação
  startBtn.addEventListener('click', function(){
    // ao entrar na tela de jogo, mostramos os indicadores iniciais
    progressBar.style.width = '0%';
    progressText.textContent = '0 de 12 palavras';
    integrityEl.textContent = '100%';
    integrityEl.style.color = '';
    showScreen('game');
  });

  backToStartBtn.addEventListener('click', function(){ showScreen('start'); });

  // Simula conclusão para testar a tela de fim sem implementar a lógica da cruzadinha
  simulateCompleteBtn.addEventListener('click', function(){
    progressBar.style.width = '100%';
    progressText.textContent = '12 de 12 palavras';
    integrityEl.textContent = '100%';
    finalProgress.textContent = '100%';
    showScreen('end');
  });

  restartBtn.addEventListener('click', function(){
    // reinicia o protótipo — não há estado da cruzadinha implementado aqui
    showScreen('start');
  });

  toStartBtn.addEventListener('click', function(){ showScreen('start'); });

});

/* -----------------------
   Estrutura da cruzadinha
   ----------------------- */

// Definição das palavras e posições (linha, coluna) 0-indexadas
// Orientação: 'across' (horizontal) ou 'down' (vertical)
const crosswordConfig = {
  rows: 16,
  cols: 16,
  // palavras selecionadas — ao menos 12
  words: [
    {word: 'MICROCONTROLADOR', orient: 'across', row: 0, col: 0, clue: 'Unidade que integra processamento e periféricos em um único chip.'},
    {word: 'MEMORIADEMASSA', orient: 'down', row: 0, col: 0, clue: 'Armazenamento permanente em grande capacidade usado para dados.'},
    {word: 'REGISTRADORES', orient: 'across', row: 4, col: 0, clue: 'Pequenas áreas de armazenamento dentro da CPU usadas em operações.'},
    {word: 'DATABUS', orient: 'down', row: 4, col: 8, clue: 'Conjunto de linhas que transferem bits entre componentes.'},
    {word: 'ADDRESSBUS', orient: 'across', row: 8, col: 1, clue: 'Canal que transporta endereços de memória entre componentes.'},
    {word: 'RAM', orient: 'down', row: 8, col: 4, clue: 'Memória volátil usada para armazenar dados temporariamente.'},
    {word: 'ROM', orient: 'down', row: 4, col: 10, clue: 'Memória não volátil que contém firmware ou dados permanentes.'},
    {word: 'CPU', orient: 'down', row: 0, col: 2, clue: 'Unidade central que executa instruções do programa.'},
    {word: 'ULA', orient: 'across', row: 1, col: 2, clue: 'Parte do processador responsável por operações aritméticas e lógicas.'},
    {word: 'DMA', orient: 'down', row: 0, col: 13, clue: 'Mecanismo que permite transferência direta entre periféricos e memória.'},
    {word: 'FLASH', orient: 'down', row: 1, col: 12, clue: 'Memória não volátil regravável usada em armazenamento removível e embutido.'},
    {word: 'UC', orient: 'across', row: 9, col: 8, clue: 'Unidade que coordena e controla as operações do processador.'}
  ]
};

// Cria grade vazia
function createEmptyGrid(rows, cols){
  const g = [];
  for(let r=0;r<rows;r++){
    const row = [];
    for(let c=0;c<cols;c++) row.push({ch: null, blocks: true, starts: []});
    g.push(row);
  }
  return g;
}

// Tenta posicionar palavras na grade e valida cruzamentos
function placeWords(config){
  const grid = createEmptyGrid(config.rows, config.cols);
  const placed = [];

  for(const item of config.words){
    const w = item.word.toUpperCase();
    const r0 = item.row; const c0 = item.col;
    let fits = true;

    // Verifica limites
    if(item.orient === 'across'){
      if(c0 + w.length > config.cols) fits = false;
    } else {
      if(r0 + w.length > config.rows) fits = false;
    }
    if(!fits){
      console.error('Palavra não cabe nos limites:', w);
      continue;
    }

    // Verifica conflitos e coloca letras
    for(let i=0;i<w.length;i++){
      const r = item.orient === 'across' ? r0 : r0 + i;
      const c = item.orient === 'across' ? c0 + i : c0;
      const ch = w[i];
      const cell = grid[r][c];
      // If cell already has a letter, must match
      if(cell.ch && cell.ch !== ch){ fits = false; break; }
    }
    if(!fits){ console.error('Conflito ao posicionar:', w); continue; }

    // Place letters
    for(let i=0;i<w.length;i++){
      const r = item.orient === 'across' ? r0 : r0 + i;
      const c = item.orient === 'across' ? c0 + i : c0;
      const ch = w[i];
      grid[r][c].ch = ch;
      grid[r][c].blocks = false;
      grid[r][c].starts = grid[r][c].starts || [];
    }

    placed.push(Object.assign({}, item, {word: w}));
  }

  return {grid, placed};
}

// Numera as palavras pela convenção (varredura top->down left->right)
function numberGrid(grid){
  const rows = grid.length; const cols = grid[0].length;
  const numbers = Array.from({length:rows},()=>Array(cols).fill(0));
  let next = 1;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      if(grid[r][c].blocks) continue;
      const startsAcross = (c===0 || grid[r][c-1].blocks) && (c+1<cols && !grid[r][c+1].blocks);
      const startsDown = (r===0 || grid[r-1][c].blocks) && (r+1<rows && !grid[r+1][c].blocks);
      if(startsAcross || startsDown){ numbers[r][c] = next++; }
    }
  }
  return numbers;
}

// Associa números às palavras conforme suas coordenadas iniciais
function assignNumbersToWords(placed, numbers){
  for(const p of placed){
    const num = numbers[p.row][p.col];
    p.number = num || null;
  }
}

// Conta cruzamentos (células compartilhadas)
function countCrossings(placed, grid){
  const crossings = {};
  // for each word, count cells where cell is part of more than one word
  // Build occupancy map: for each cell, how many words occupy it
  const rows = grid.length; const cols = grid[0].length;
  const occ = Array.from({length:rows},()=>Array(cols).fill(0));
  for(const p of placed){
    const w = p.word;
    for(let i=0;i<w.length;i++){
      const r = p.orient === 'across' ? p.row : p.row + i;
      const c = p.orient === 'across' ? p.col + i : p.col;
      occ[r][c]++;
    }
  }
  for(const p of placed){
    let cnt = 0;
    const w = p.word;
    for(let i=0;i<w.length;i++){
      const r = p.orient === 'across' ? p.row : p.row + i;
      const c = p.orient === 'across' ? p.col + i : p.col;
      if(occ[r][c] > 1) cnt++;
    }
    crossings[p.word] = cnt;
  }
  return crossings;
}

// Renderiza tabuleiro e pistas no DOM
function renderCrossword(config){
  const container = document.querySelector('.board-placeholder');
  if(!container) return;
  const {grid, placed} = placeWords(config);
  const numbers = numberGrid(grid);
  assignNumbersToWords(placed, numbers);
  const crossings = countCrossings(placed, grid);

  // Build visual grid
  const gridEl = document.createElement('div');
  gridEl.className = 'crossword-grid';
  gridEl.style.gridTemplateColumns = `repeat(${config.cols}, 34px)`;

  // Prepare map of cell elements for later interaction
  const cellEls = Array.from({length:config.rows},()=>Array(config.cols).fill(null));
  const cellToWords = {}; // 'r-c' -> [placedIndex,...]

  for(let r=0;r<config.rows;r++){
    for(let c=0;c<config.cols;c++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      if(grid[r][c].blocks){ cell.classList.add('cell-block'); }
      else{
        const num = numbers[r][c];
        if(num) {
          const spanNum = document.createElement('div'); spanNum.className = 'cell-number'; spanNum.textContent = num;
          cell.appendChild(spanNum);
        }
        const letter = document.createElement('div'); letter.className = 'cell-letter';
        // empty input placeholder (not interactive yet)
        const input = document.createElement('input');
        input.type = 'text'; input.maxLength = 1; input.disabled = true;
        input.className = 'cell-input';
        // store coordinates for the element
        cell.dataset.r = r; cell.dataset.c = c;
        input.dataset.r = r; input.dataset.c = c;
        letter.appendChild(input);
        cell.appendChild(letter);
        cellEls[r][c] = {cell, input};
      }
      gridEl.appendChild(cell);
    }
  }

  // Replace container contents
  container.innerHTML = '';
  const boardHeader = document.createElement('div');
  boardHeader.className = 'board-meta';
  boardHeader.innerHTML = `<div class="board-size">Grade: ${config.rows} x ${config.cols}</div>`;
  container.appendChild(boardHeader);
  container.appendChild(gridEl);

  // Render pistas
  const horizEl = document.getElementById('clues-horizontal');
  const vertEl  = document.getElementById('clues-vertical');
  if(horizEl) horizEl.innerHTML = '';
  if(vertEl) vertEl.innerHTML = '';

  // Separate placed words into horizontals and verticals and sort by number
  const acrossWords = placed.filter(p=>p.orient==='across').sort((a,b)=>(a.number||0)-(b.number||0));
  const downWords   = placed.filter(p=>p.orient==='down').sort((a,b)=>(a.number||0)-(b.number||0));

  for(const p of acrossWords){
    const li = document.createElement('li');
    li.textContent = `${p.number || '-'} — ${p.clue}`;
    // mark which placed index this corresponds to
    li.dataset.wordIndex = placed.indexOf(p);
    horizEl && horizEl.appendChild(li);
  }
  for(const p of downWords){
    const li = document.createElement('li');
    li.textContent = `${p.number || '-'} — ${p.clue}`;
    li.dataset.wordIndex = placed.indexOf(p);
    vertEl && vertEl.appendChild(li);
  }

  // Log de verificação matemática (pode ser útil para revisão)
  console.log('Crossword placed words:', placed.map(p=>({word:p.word,orient:p.orient,row:p.row,col:p.col,number:p.number})));
  console.table(placed.map(p=>({Palavra:p.word,Orientacao:p.orient,Row:p.row,Col:p.col,Numero:p.number,Cruzamentos:crossings[p.word]})));

  // Build helper structures: for each placed word, list of cell coords
  for(let idx=0; idx<placed.length; idx++){
    const p = placed[idx];
    p.cells = [];
    const w = p.word;
    for(let i=0;i<w.length;i++){
      const r = p.orient === 'across' ? p.row : p.row + i;
      const c = p.orient === 'across' ? p.col + i : p.col;
      p.cells.push({r,c});
      const key = `${r}-${c}`;
      if(!cellToWords[key]) cellToWords[key] = [];
      cellToWords[key].push(idx);
    }
  }

  // Store state globally for interaction handlers
  window.crosswordState = {
    config, grid, placed, numbers, crossings, cellEls, cellToWords
  };

  // Enable inputs and attach event listeners
  for(let r=0;r<config.rows;r++){
    for(let c=0;c<config.cols;c++){
      const entry = cellEls[r][c];
      if(!entry) continue;
      const {cell,input} = entry;
      input.disabled = false;
      input.value = '';
      input.autocomplete = 'off';
      input.inputMode = 'text';

      // Click on cell selects a word
      cell.addEventListener('click', function(ev){
        const key = `${r}-${c}`;
        const wordsHere = cellToWords[key] || [];
        if(wordsHere.length === 0) return;
        // if current selected word includes this cell, and there are two words, toggle
        const state = window.crosswordState;
        const cur = state.currentWordIndex;
        let choose = wordsHere[0];
        if(cur != null && wordsHere.includes(cur)){
          if(wordsHere.length > 1){
            // pick the other word
            choose = wordsHere.find(i=>i!==cur) || wordsHere[0];
          } else choose = cur;
        }
        selectWordByIndex(choose);
        // focus the input
        input.focus();
      });

      // Key handling
      input.addEventListener('keydown', function(e){
        const state = window.crosswordState;
        const curIdx = state.currentWordIndex;
        const r0 = parseInt(this.dataset.r,10); const c0 = parseInt(this.dataset.c,10);
        // Allow navigation keys
        if(e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown'){
          e.preventDefault();
          handleArrowKey(e.key, r0, c0);
          return;
        }
        if(e.key === 'Backspace'){
          e.preventDefault();
          handleBackspace(r0,c0);
          return;
        }
        if(e.key === 'Delete'){
          e.preventDefault();
          this.value = '';
          return;
        }
        // Allow only letters
        if(e.key.length === 1 && !/^[a-zA-Z]$/.test(e.key)){
          e.preventDefault();
          return;
        }
        // For other keys, let input event handle
      });

      input.addEventListener('input', function(e){
        // Normalize to uppercase single letter
        let v = this.value.toUpperCase().replace(/[^A-Z]/g,'');
        this.value = v;
        if(v.length > 0){
          // move to next cell in current word
          moveToNextInWord(parseInt(this.dataset.r,10), parseInt(this.dataset.c,10));
        }
      });
      // Focus/blur visuals and selection sync
      input.addEventListener('focus', function(){
        const rr = parseInt(this.dataset.r,10), cc = parseInt(this.dataset.c,10);
        const cellEl = window.crosswordState && window.crosswordState.cellEls[rr] && window.crosswordState.cellEls[rr][cc] && window.crosswordState.cellEls[rr][cc].cell;
        if(cellEl) cellEl.classList.add('cell-active');
        // if focused cell is part of a word not currently selected, select it
        const key = `${rr}-${cc}`;
        const wordsHere = (window.crosswordState && window.crosswordState.cellToWords[key])||[];
        if(wordsHere.length>0){
          const cur = window.crosswordState.currentWordIndex;
          if(cur == null || !wordsHere.includes(cur)){
            // prefer across if available
            const pick = wordsHere.find(i=>window.crosswordState.placed[i].orient==='across') || wordsHere[0];
            selectWordByIndex(pick);
          }
        }
      });
      input.addEventListener('blur', function(){
        const rr = parseInt(this.dataset.r,10), cc = parseInt(this.dataset.c,10);
        const cellEl = window.crosswordState && window.crosswordState.cellEls[rr] && window.crosswordState.cellEls[rr][cc] && window.crosswordState.cellEls[rr][cc].cell;
        if(cellEl) cellEl.classList.remove('cell-active');
      });
    }
  }

  // Attach click handlers to clues
  const allClues = document.querySelectorAll('#clues-horizontal li, #clues-vertical li');
  allClues.forEach(li=>{
    li.addEventListener('click', function(){
      const idx = parseInt(this.dataset.wordIndex,10);
      if(!Number.isFinite(idx)) return;
      selectWordByIndex(idx);
      // focus first cell of the word
      const p = window.crosswordState.placed[idx];
      const cr = p.cells[0];
      const inp = window.crosswordState.cellEls[cr.r][cr.c].input;
      inp.focus();
    });
  });

  // Select first word by default
  if(placed.length>0) selectWordByIndex(0);
}

// Select a word by its placed index
function selectWordByIndex(idx){
  const state = window.crosswordState;
  if(!state) return;
  const placed = state.placed;
  if(idx < 0 || idx >= placed.length) return;
  state.currentWordIndex = idx;
  // Clear previous highlights
  document.querySelectorAll('.cell').forEach(el=>el.classList.remove('cell-active','cell-word'));
  document.querySelectorAll('#clues-horizontal li,#clues-vertical li').forEach(li=>li.classList.remove('selected-clue'));
  // Highlight clue
  const clueLis = document.querySelectorAll(`#clues-horizontal li[data-word-index='${idx}'], #clues-vertical li[data-word-index='${idx}']`);
  clueLis.forEach(li=>li.classList.add('selected-clue'));
  // Highlight cells in word
  const p = placed[idx];
  for(const cellPos of p.cells){
    const el = state.cellEls[cellPos.r][cellPos.c].cell;
    el.classList.add('cell-word');
  }
  // Mark active cell as first cell
  const first = p.cells[0];
  const input = state.cellEls[first.r][first.c].input;
  // Only focus if the game screen is visible to avoid stealing focus on page load
  const gameScreen = document.getElementById('game-screen');
  if(!gameScreen || !gameScreen.classList.contains('hidden')){
    input.focus();
    input.select && input.select();
  }
}

function handleArrowKey(key, r, c){
  const state = window.crosswordState;
  if(!state) return;
  const curIdx = state.currentWordIndex;
  if(curIdx == null) return;
  const p = state.placed[curIdx];
  // find position in word
  let pos = p.cells.findIndex(cell=>cell.r===r && cell.c===c);
  if(pos === -1) return;
  let target = null;
  if(key === 'ArrowLeft'){
    if(p.orient === 'across' && pos > 0) target = p.cells[pos-1];
  } else if(key === 'ArrowRight'){
    if(p.orient === 'across' && pos < p.cells.length-1) target = p.cells[pos+1];
  } else if(key === 'ArrowUp'){
    // if there is a down word at current cell, switch to it; otherwise try moving within current word if vertical
    const keyStr = `${r}-${c}`;
    const wordsHere = state.cellToWords[keyStr]||[];
    const downIdx = wordsHere.find(i=>state.placed[i].orient==='down');
    if(downIdx != null){
      // switch selection
      selectWordByIndex(downIdx);
      // focus corresponding cell index in new word
      const newPos = state.placed[downIdx].cells.findIndex(cell=>cell.r===r && cell.c===c);
      target = state.placed[downIdx].cells[Math.max(0,newPos-1)];
    }
  } else if(key === 'ArrowDown'){
    const keyStr = `${r}-${c}`;
    const wordsHere = state.cellToWords[keyStr]||[];
    const downIdx = wordsHere.find(i=>state.placed[i].orient==='down');
    if(downIdx != null){
      selectWordByIndex(downIdx);
      const newPos = state.placed[downIdx].cells.findIndex(cell=>cell.r===r && cell.c===c);
      target = state.placed[downIdx].cells[Math.min(state.placed[downIdx].cells.length-1,newPos+1)];
    }
  }
  if(target){
    const inp = state.cellEls[target.r][target.c].input;
    inp.focus();
  }
}

function handleBackspace(r,c){
  const state = window.crosswordState;
  if(!state) return;
  const curIdx = state.currentWordIndex;
  if(curIdx == null) return;
  const p = state.placed[curIdx];
  let pos = p.cells.findIndex(cell=>cell.r===r && cell.c===c);
  if(pos === -1) return;
  const inp = state.cellEls[r][c].input;
  if(inp.value){
    inp.value = '';
    return;
  }
  // move to previous cell
  if(pos > 0){
    const prev = p.cells[pos-1];
    const prevInp = state.cellEls[prev.r][prev.c].input;
    prevInp.focus();
    prevInp.value = '';
  }
}

function moveToNextInWord(r,c){
  const state = window.crosswordState;
  if(!state) return;
  const curIdx = state.currentWordIndex;
  if(curIdx == null) return;
  const p = state.placed[curIdx];
  let pos = p.cells.findIndex(cell=>cell.r===r && cell.c===c);
  if(pos === -1) return;
  if(pos < p.cells.length-1){
    const next = p.cells[pos+1];
    const nextInp = state.cellEls[next.r][next.c].input;
    nextInp.focus();
  }
}

// Renderizar quando a tela de jogo for exibida
// Observação: showScreen('game') é chamado no carregamento; também chamamos renderCrossword para preparar a grade
document.addEventListener('DOMContentLoaded', function(){
  renderCrossword(crosswordConfig);
});
