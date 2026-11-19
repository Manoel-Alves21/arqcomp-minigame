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
        letter.appendChild(input);
        cell.appendChild(letter);
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
    horizEl && horizEl.appendChild(li);
  }
  for(const p of downWords){
    const li = document.createElement('li');
    li.textContent = `${p.number || '-'} — ${p.clue}`;
    vertEl && vertEl.appendChild(li);
  }

  // Log de verificação matemática (pode ser útil para revisão)
  console.log('Crossword placed words:', placed.map(p=>({word:p.word,orient:p.orient,row:p.row,col:p.col,number:p.number})));
  console.table(placed.map(p=>({Palavra:p.word,Orientacao:p.orient,Row:p.row,Col:p.col,Numero:p.number,Cruzamentos:crossings[p.word]})));
}

// Renderizar quando a tela de jogo for exibida
// Observação: showScreen('game') é chamado no carregamento; também chamamos renderCrossword para preparar a grade
document.addEventListener('DOMContentLoaded', function(){
  renderCrossword(crosswordConfig);
});
