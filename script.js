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
