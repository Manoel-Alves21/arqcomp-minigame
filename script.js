// script.js — navegação simples entre telas do protótipo CORE
document.addEventListener('DOMContentLoaded', function(){
  const startBtn = document.getElementById('start-btn');
  const backToStartBtn = document.getElementById('back-to-start');
  const restartBtn = document.getElementById('restart-btn');
  const toStartBtn = document.getElementById('to-start-btn');

  const startScreen = document.getElementById('start-screen');
  const gameScreen  = document.getElementById('game-screen');
  const endScreen   = document.getElementById('end-screen');

  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const integrityEl = document.getElementById('integrity');
  const finalProgress = document.getElementById('final-progress');
  const checkBtn = document.getElementById('check-btn');
  const resetBtn = document.getElementById('reset-btn');

  function showScreen(name){
    startScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    if(name === 'start') startScreen.classList.remove('hidden');
    if(name === 'game')  gameScreen.classList.remove('hidden');
    if(name === 'end')   endScreen.classList.remove('hidden');
  }

  // Inicializa mostrando diretamente a cruzadinha (modo somente cruzadinha)
  showScreen('game');

  // Eventos de navegação
  startBtn.addEventListener('click', function(){
    // ao entrar na tela de jogo, mostramos os indicadores iniciais
    progressBar.style.width = '0%';
    progressText.textContent = `${0} de ${crosswordConfig.words.length} palavras`;
    integrityEl.textContent = '100%';
    integrityEl.classList.remove('warn');
    showScreen('game');
    // ensure board reset when starting
    resetBoard();
  });

  backToStartBtn.addEventListener('click', function(){ showScreen('start'); });

  // (simulateComplete removed in crossword-only mode)

  // End screen: reiniciar experiência — volta para o jogo com estado limpo
  restartBtn.addEventListener('click', function(){
    resetBoard();
    // show game directly so player can play again
    showScreen('game');
  });

  toStartBtn.addEventListener('click', function(){ showScreen('start'); });

});

/* -----------------------
   Estrutura da cruzadinha
   ----------------------- */

// Definição das palavras e posições (linha, coluna) 0-indexadas
// Orientação: 'across' (horizontal) ou 'down' (vertical)
// Full set of 16 words required by a especificação. Each word includes
// an official clue and a complementary hint (complementary hints should
// be validated against o material didático; veja README para itens a validar).
const crosswordConfig = {
  rows: 16,
  cols: 16,
  words: [
    {id:'MICROCONTROLADOR', word: 'MICROCONTROLADOR', clue: 'Unidade que integra processamento e periféricos em um único chip.', hint: 'Usado em sistemas embarcados e integra CPU, memória e I/O.'},
    {id:'MEMORIADEMASSA', word: 'MEMORIADEMASSA', clue: 'Armazenamento permanente em grande capacidade usado para dados.', hint: 'Exemplos: SSD e HDD.'},
    {id:'REGISTRADORES', word: 'REGISTRADORES', clue: 'Pequenas áreas de armazenamento dentro da CPU usadas em operações.', hint: 'Armazenam operandos e resultados temporários.'},
    {id:'DATABUS', word: 'DATABUS', clue: 'Conjunto de linhas que transferem bits entre componentes.', hint: 'Transporta os dados propriamente ditos.'},
    {id:'ADDRESSBUS', word: 'ADDRESSBUS', clue: 'Canal que transporta endereços de memória entre componentes.', hint: 'Usado para indicar posições na RAM ou memória de massa.'},
    {id:'RAM', word: 'RAM', clue: 'Memória volátil usada para armazenar dados temporariamente.', hint: 'Perde o conteúdo quando o sistema é desligado.'},
    {id:'ROM', word: 'ROM', clue: 'Memória não volátil que contém firmware ou dados permanentes.', hint: 'Normalmente lida apenas para leitura.'},
    {id:'CPU', word: 'CPU', clue: 'Unidade central que executa instruções do programa.', hint: 'Também chamada de processador.'},
    {id:'ULA', word: 'ULA', clue: 'Parte do processador responsável por operações aritméticas e lógicas.', hint: 'Executa somas, subtrações e operações lógicas.'},
    {id:'DMA', word: 'DMA', clue: 'Mecanismo que permite transferência direta entre periféricos e memória.', hint: 'Reduz a carga da CPU em transferências grandes.'},
    {id:'FLASH', word: 'FLASH', clue: 'Memória não volátil regravável usada em armazenamento removível e embutido.', hint: 'Comum em pendrives e cartões.'},
    {id:'UC', word: 'UC', clue: 'Unidade que coordena e controla as operações do processador.', hint: 'Responsável por buscar e interpretar instruções.'},
    {id:'EEPROM', word: 'EEPROM', clue: 'Memória não volátil regravável eletricamente em pequenas unidades.', hint: 'Usada para armazenar configurações em sistemas embarcados.'},
    {id:'CACHE', word: 'CACHE', clue: 'Memória pequena e rápida usada para reduzir latência de acesso.', hint: 'Armazena cópias temporárias de dados acessados frequentemente.'},
    {id:'DUALCORE', word: 'DUALCORE', clue: 'Configuração com dois núcleos de processamento em um único chip.', hint: 'Permite execução paralela de threads.'},
    {id:'QUADCORE', word: 'QUADCORE', clue: 'Configuração com quatro núcleos de processamento em um único chip.', hint: 'Oferece mais paralelismo que dual-core.'}
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

// Tenta posicionar palavras na grade: algoritmo simples e determinístico.
// Estratégia: ordenar por tamanho decrescente e tentar encontrar cruzamentos
// com palavras já colocadas; caso não encontre, inserir em next-fit.
function placeWords(config){
  const grid = createEmptyGrid(config.rows, config.cols);
  const placed = [];

  // helper: check if can place word at r,c with orient
  function canPlace(word, r, c, orient){
    if(orient==='across'){
      if(c + word.length > config.cols) return false;
    } else {
      if(r + word.length > config.rows) return false;
    }
    for(let i=0;i<word.length;i++){
      const rr = orient==='across' ? r : r + i;
      const cc = orient==='across' ? c + i : c;
      const ch = word[i];
      const cell = grid[rr][cc];
      if(cell.ch && cell.ch !== ch) return false;
      // also ensure neighbors don't create adjacent-letter conflicts (simple rule)
      // allow overlap only when matching
    }
    return true;
  }

  // write word into grid
  function writeWord(item, r, c, orient){
    const w = item.word;
    for(let i=0;i<w.length;i++){
      const rr = orient==='across' ? r : r + i;
      const cc = orient==='across' ? c + i : c;
      grid[rr][cc].ch = w[i];
      grid[rr][cc].blocks = false;
    }
    const placedItem = Object.assign({}, item, {orient, row:r, col:c, word:item.word});
    placed.push(placedItem);
    return placedItem;
  }

  // place longest first
  const words = config.words.slice().sort((a,b)=>b.word.length - a.word.length);

  for(const item of words){
    const w = item.word;
    let placedItem = null;

    // try to cross with already placed words: find any matching letter
    for(const p of placed){
      for(let i=0;i<p.word.length;i++){
        for(let j=0;j<w.length;j++){
          if(p.word[i] !== w[j]) continue;
          // compute candidate coordinates so w[j] aligns with p[i]
          let r,c,orient;
          if(p.orient === 'across'){
            // p is across; candidate is down crossing at (p.row, p.col + i)
            orient = 'down';
            r = p.row - j;
            c = p.col + i;
          } else {
            // p is down; candidate is across crossing at (p.row + i, p.col)
            orient = 'across';
            r = p.row + i;
            c = p.col - j;
          }
          if(r < 0 || c < 0) continue;
          if(canPlace(w, r, c, orient)){
            placedItem = writeWord(item, r, c, orient);
            break;
          }
        }
        if(placedItem) break;
      }
      if(placedItem) break;
    }

    // if not placed by crossing, try to find first free spot horizontal then vertical
    if(!placedItem){
      outer:
      for(let r=0;r<config.rows;r++){
        for(let c=0;c<config.cols;c++){
          if(canPlace(w,r,c,'across')){ placedItem = writeWord(item,r,c,'across'); break outer; }
        }
      }
    }
    if(!placedItem){
      outer2:
      for(let c=0;c<config.cols;c++){
        for(let r=0;r<config.rows;r++){
          if(canPlace(w,r,c,'down')){ placedItem = writeWord(item,r,c,'down'); break outer2; }
        }
      }
    }
    if(!placedItem){
      console.error('Não foi possível posicionar a palavra:', w);
    }
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
  // We'll compute column size dynamically based on available container width

  // Prepare map of cell elements for later interaction
  const cellEls = Array.from({length:config.rows},()=>Array(config.cols).fill(null));
  const cellToWords = {}; // 'r-c' -> [placedIndex,...]

  // create cells first (we'll set inline sizes after measuring)
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

  // Replace container contents and wrap grid into a scrollable wrapper
  container.innerHTML = '';
  // create a persistent inner container so we can move it to an overlay without losing listeners
  const inner = document.createElement('div'); inner.id = 'crossword-container';
  const boardHeader = document.createElement('div');
  boardHeader.className = 'board-meta';
  boardHeader.innerHTML = `<div class="board-size">Grade: ${config.rows} x ${config.cols}</div>`;
  inner.appendChild(boardHeader);

  const wrap = document.createElement('div'); wrap.className = 'crossword-wrap';
  // measure available width and compute optimal cell size (min 20, max 34)
  const availableWidth = Math.max(200, container.clientWidth - 24); // avoid zero on hidden elements
  const gap = 4; // must match CSS
  let cellSize = Math.floor((availableWidth - (config.cols-1)*gap) / config.cols);
  if(cellSize > 64) cellSize = 64;
  if(cellSize < 40) cellSize = 40;
  // set grid template columns accordingly
  gridEl.style.gridTemplateColumns = `repeat(${config.cols}, ${cellSize}px)`;
  // set each cell inline size to ensure consistent rendering and no overlap
  const cellNodes = gridEl.querySelectorAll('.cell');
  cellNodes.forEach(n=>{ n.style.width = cellSize + 'px'; n.style.height = cellSize + 'px'; });

  wrap.appendChild(gridEl);
  inner.appendChild(wrap);
  container.appendChild(inner);

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
    config, grid, placed, numbers, crossings, cellEls, cellToWords,
    // track resolution state and hints used
    solvedWords: Array(placed.length).fill(false),
    revealUsed: Array(placed.length).fill(false),
    compHintShown: Array(placed.length).fill(false)
  };
  // expose grid element and wrapper for resizing adjustments
  window.crosswordState.gridEl = gridEl;
  window.crosswordState.gridWrap = wrap;

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

  // Add hint controls below clues
  const boardContainer = document.getElementById('crossword-container');
  if(boardContainer){
    const hintWrap = document.createElement('div');
    hintWrap.style.marginTop = '8px';
    hintWrap.innerHTML = `
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <button id="hint-comp" class="btn">Pista complementar</button>
        <button id="hint-reveal" class="btn">Revelar letra</button>
        <div id="hint-output" style="color:var(--muted-2);font-size:13px"></div>
      </div>`;
    boardContainer.appendChild(hintWrap);
    document.getElementById('hint-comp').addEventListener('click', function(){ showComplementaryHint(); });
    document.getElementById('hint-reveal').addEventListener('click', function(){ revealOneLetter(); });
  }

  // Select first word by default
  if(placed.length>0) selectWordByIndex(0);

  // Adjust grid sizing on window resize so it never overflows container
  let resizeTimer = null;
  function adjustGridSize(){
    const state = window.crosswordState;
    if(!state) return;
    const containerEl = document.querySelector('.board-placeholder');
    const gridElLocal = state.gridEl;
    if(!containerEl || !gridElLocal) return;
    const availableWidth = Math.max(160, containerEl.clientWidth - 24);
    const gap = 4;
    let cellSize = Math.floor((availableWidth - (state.config.cols-1)*gap) / state.config.cols);
    if(cellSize > 64) cellSize = 64;
    if(cellSize < 36) cellSize = 36;
    gridElLocal.style.gridTemplateColumns = `repeat(${state.config.cols}, ${cellSize}px)`;
    gridElLocal.querySelectorAll('.cell').forEach(n=>{ n.style.width = cellSize + 'px'; n.style.height = cellSize + 'px'; });
  }
  window.addEventListener('resize', function(){ if(resizeTimer) clearTimeout(resizeTimer); resizeTimer = setTimeout(adjustGridSize, 120); });
  // initial adjust (in case container size changed after render)
  setTimeout(adjustGridSize, 50);
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

// Show complementary hint (level 1) for the selected word
function showComplementaryHint(){
  const state = window.crosswordState; if(!state) return;
  const idx = state.currentWordIndex; if(idx==null) return;
  const out = document.getElementById('hint-output');
  const p = state.placed[idx];
  if(!p) return;
  out.textContent = p.hint || 'Sem pista complementar disponível.';
  state.compHintShown[idx] = true;
}

// Reveal one letter in the selected word (level 2). Marks revealUsed to avoid duplicate penalties.
function revealOneLetter(){
  const state = window.crosswordState; if(!state) return;
  const idx = state.currentWordIndex; if(idx==null) return;
  const p = state.placed[idx]; if(!p) return;
  // find empty cells in this word
  const empties = p.cells.filter(cell=>{ const v = state.cellEls[cell.r][cell.c].input.value; return !v; });
  if(empties.length === 0) return;
  // pick first empty that won't conflict: since grid already validated, filling it is safe
  const chosen = empties[0];
  const letter = p.word[p.cells.findIndex(c=>c.r===chosen.r&&c.c===chosen.c)];
  state.cellEls[chosen.r][chosen.c].input.value = letter;
  state.revealUsed[idx] = true;
  // visual flash on the cell
  const cellEl = state.cellEls[chosen.r][chosen.c].cell;
  cellEl.classList.add('cell-word');
  setTimeout(()=>cellEl.classList.remove('cell-word'),800);
  // show short message
  const out = document.getElementById('hint-output'); if(out) out.textContent = 'Uma letra foi revelada.';
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
  // prepare an empty collection UI
  const controlPanel = document.querySelector('.control-panel');
  if(controlPanel){
    const collTitle = document.createElement('div'); collTitle.style.marginTop='8px'; collTitle.innerHTML = '<strong>Coleção</strong>';
    const coll = document.createElement('div'); coll.className = 'collection';
    controlPanel.appendChild(collTitle); controlPanel.appendChild(coll);
  }
});

// --- Validation, scoring and reset logic ---
function getCurrentState(){
  return window.crosswordState;
}

function checkAllWords(){
  const state = getCurrentState();
  if(!state) return;
  const placed = state.placed;
  const total = placed.length;
  let correctCount = 0;

  // For each word, read letters from inputs and compare to expected
  for(let idx=0; idx<placed.length; idx++){
    const p = placed[idx];
    let assembled = '';
    let complete = true;
    for(const cellPos of p.cells){
      const inp = state.cellEls[cellPos.r][cellPos.c].input;
      const v = (inp && inp.value) ? inp.value.toUpperCase() : '';
      if(!v) complete = false;
      assembled += v || '';
    }
    const isCorrect = complete && assembled === p.word;

    // Visual feedback per cell
    for(const cellPos of p.cells){
      const cellEl = state.cellEls[cellPos.r][cellPos.c].cell;
      cellEl.classList.remove('cell-correct','cell-incorrect');
      if(isCorrect) cellEl.classList.add('cell-correct');
      else if(!isCorrect) cellEl.classList.add('cell-incorrect');
    }

    // Clue feedback
    const clueLis = document.querySelectorAll(`#clues-horizontal li[data-word-index='${idx}'], #clues-vertical li[data-word-index='${idx}']`);
    clueLis.forEach(li=>{
      li.classList.remove('clue-correct','clue-incorrect');
      if(isCorrect) li.classList.add('clue-correct');
      else li.classList.add('clue-incorrect');
    });

    if(isCorrect){
      correctCount++;
      // award component if not yet awarded
      if(!state.solvedWords[idx]){
        state.solvedWords[idx] = true;
        awardComponentForWord(idx);
      }
    }
  }

  // Update indicators
  const progressText = document.getElementById('progress-text');
  const progressBar = document.getElementById('progress-bar');
  const integrityEl = document.getElementById('integrity');
  progressText.textContent = `${correctCount} de ${total} palavras`;
  const pct = Math.round((correctCount/total)*100);
  progressBar.style.width = pct + '%';
  integrityEl.textContent = pct + '%';
  if(pct < 50) integrityEl.classList.add('warn'); else integrityEl.classList.remove('warn');

// If all correct, show end screen
  if(correctCount === total){
    const finalProgress = document.getElementById('final-progress');
    finalProgress.textContent = '100%';
    // update end screen summary with final score
    const endMsg = document.querySelector('.result-text');
    if(endMsg) endMsg.textContent = 'Missão concluída — todas as palavras foram resolvidas.';
    const summary = document.querySelector('.summary');
    if(summary){
      summary.querySelector('p') && (summary.querySelector('p').textContent = `Pontuação final: ${correctCount} de ${total}`);
    }
    // final activation animation placeholder (no farm in crossword-only mode)
    showScreen('end');
  }
}

// Overlay and farm interaction removed for crossword-only mode

// Award visual component in farm and collection for a solved word
function awardComponentForWord(idx){
  const state = window.crosswordState; if(!state) return;
  const p = state.placed[idx]; if(!p) return;
  // mark in collection UI
  const compId = 'comp-' + (p.number || idx);
  let compEl = document.getElementById(compId);
  if(!compEl){
    // create if not present
    const collection = document.querySelector('.collection');
    if(collection){
      compEl = document.createElement('div'); compEl.id = compId; compEl.className = 'component';
      compEl.innerHTML = `<div class="icon"></div><div style="font-size:11px;margin-top:6px;text-align:center">${p.word}</div>`;
      collection.appendChild(compEl);
    }
  }
  if(compEl && !compEl.classList.contains('recovered')){
    compEl.classList.add('recovered');
    // brief visual feedback on the component element
    compEl.style.transition = 'transform 260ms ease';
    compEl.style.transform = 'scale(1.06)';
    setTimeout(()=>{ compEl.style.transform = ''; },300);
  }
}

function resetBoard(){
  const state = getCurrentState();
  if(!state) return;
  const placed = state.placed;
  // clear inputs and feedback classes
  for(let r=0;r<state.config.rows;r++){
    for(let c=0;c<state.config.cols;c++){
      const entry = state.cellEls[r][c];
      if(!entry) continue;
      entry.input.value = '';
      const cellEl = entry.cell;
      cellEl.classList.remove('cell-correct','cell-incorrect');
    }
  }
  // clear clue classes
  document.querySelectorAll('#clues-horizontal li,#clues-vertical li').forEach(li=>li.classList.remove('clue-correct','clue-incorrect'));

  // reset indicators
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const integrityEl = document.getElementById('integrity');
  progressBar.style.width = '0%';
  progressText.textContent = `${0} de ${placed.length} palavras`;
  integrityEl.textContent = '100%';
  integrityEl.classList.remove('warn');

  // select first word again
  if(placed.length>0) selectWordByIndex(0);

  // clear collection
  const collection = document.querySelector('.collection');
  if(collection) collection.innerHTML = '';
  // reset solved state
  if(state){ state.solvedWords = Array(placed.length).fill(false); state.revealUsed = Array(placed.length).fill(false); state.compHintShown = Array(placed.length).fill(false); }
}

// Hook buttons (may be added after DOMContentLoaded)
document.addEventListener('DOMContentLoaded', function(){
  const checkBtn = document.getElementById('check-btn');
  const resetBtn = document.getElementById('reset-btn');
  if(checkBtn) checkBtn.addEventListener('click', function(){ checkAllWords(); });
  if(resetBtn) resetBtn.addEventListener('click', function(){ resetBoard(); });
  // Farm and overlay code removed: crossword-only mode
});
