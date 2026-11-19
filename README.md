# CORE — Central de Processamento

Projeto educacional: uma cruzadinha temática sobre Arquitetura Computacional construída com HTML, CSS e JavaScript puro.

--

Visão geral

- Nome: CORE — Central de Processamento
- Descrição: jogo de cruzadinha onde o jogador preenche termos de Arquitetura Computacional para recuperar a "integridade do sistema".
- Objetivo da atividade: implementar uma interface interativa com validação de respostas, pontuação e fluxo de início/conclusão/reinício.

Tecnologias

- HTML5
- CSS3
- JavaScript (ES6)

Como executar localmente

1. Clone ou descompacte este repositório em sua máquina.
2. Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge, Safari).
3. Não há servidor necessário — é um protótipo estático.

Como jogar

1. Clique em "Iniciar missão".
2. Clique em uma célula ou em uma pista para selecionar uma palavra.
3. Digite letras diretamente nas células; é permitido navegar com as setas e usar Backspace/Delete.
4. Quando desejar verificar as respostas, clique em "Conferir". Palavras corretas ficam destacadas em verde; incorretas em vermelho.
5. O painel à esquerda mostra o progresso ("X de N palavras") e a integridade (percentual). Quando todas as palavras estiverem corretas, a tela de conclusão será exibida.
6. Para zerar e reiniciar a partida, clique em "Reiniciar".

Palavras usadas na cruzadinha (12 palavras)

1. MICROCONTROLADOR — Unidade que integra processamento e periféricos em um único chip.
2. MEMORIADEMASSA — Armazenamento permanente em grande capacidade usado para dados.
3. REGISTRADORES — Pequenas áreas de armazenamento dentro da CPU usadas em operações.
4. DATABUS — Conjunto de linhas que transferem bits entre componentes.
5. ADDRESSBUS — Canal que transporta endereços de memória entre componentes.
6. RAM — Memória volátil usada para armazenar dados temporariamente.
7. ROM — Memória não volátil que contém firmware ou dados permanentes.
8. CPU — Unidade central que executa instruções do programa.
9. ULA — Parte do processador responsável por operações aritméticas e lógicas.
10. DMA — Mecanismo que permite transferência direta entre periféricos e memória.
11. FLASH — Memória não volátil regravável usada em armazenamento removível e embutido.
12. UC — Unidade que coordena e controla as operações do processador.

Pistas (dicas)

- Horizontais e Verticais são separadas automaticamente no jogo. As pistas completas estão presentes no arquivo `script.js` dentro do objeto `crosswordConfig.words`.

Link de publicação

- URL publicada: PENDENTE (preencher quando houver link de publicação)

Arquivos modificados nesta etapa

- index.html — adição dos botões de controle e estrutura do jogo (já existia como base).
- style.css — ajustes de layout para conter e centralizar a grade; adição de wrapper .crossword-wrap; estilos de feedback (células corretas/incorretas).
- script.js — lógica de renderização ajustada para dimensionamento dinâmico das células, criação de wrapper rolável, ajuste em resize; validação e reinício implementados.

Problemas encontrados e correções realizadas

- Problema: Grade era construída com colunas fixas de 34px e extrapolava o painel em larguras menores, invadindo áreas de dica e cabeçalho.
  - Solução: calculei cellSize dinamicamente baseado na largura disponível do contêiner e coloquei a grade dentro de um wrapper com overflow:auto. Adicionei listener de resize para ajustes.
- Problema: ausência de wrapper rolável fazia com que a grade extrapolasse o painel quando não cabia.
  - Solução: adicionado .crossword-wrap com overflow controlado e centralização da grade.
- Problema: feedback visual necessário para indicar correto/incorreto.
  - Solução: adicionei classes CSS (.cell-correct/.cell-incorrect e .clue-correct/.clue-incorrect) e a função de conferência que aplica as classes.
- Problema: reinício precisava limpar estado visual e inputs.
  - Solução: implementei resetBoard() que limpa inputs, classes e indicadores.

Tabela de conformidade com os requisitos da atividade

| Requisito | Status |
|---|---:|
| Utilização de pelo menos 12 dos 16 termos disponibilizados | atendido |
| Cruzamento de todas as palavras utilizadas | atendido |
| Dicas numeradas e separadas em horizontais e verticais | atendido |
| Dicas com no máximo 15 palavras | atendido |
| Ausência de respostas nas dicas | atendido |
| Digitação direta nas células | atendido |
| Botão de conferência | atendido |
| Indicação de palavras corretas e incorretas | atendido |
| Contagem de palavras corretas | atendido |
| Botão de reiniciar | atendido |

Observação: a tabela acima foi verificada com base na implementação atual e na configuração de palavras em `script.js`.

O que ainda precisa ser feito antes da publicação

- Revisão de acessibilidade: adicionar descrições ARIA mais completas para células, foco visível aprimorado e suporte a leitores de tela.
- Testes cross-browser em navegadores móveis e desktops reais para validar desempenho do redimensionamento e rolagem.
- Ajustes estéticos finos (tamanhos mínimos de célula, dicas longas em telas muito pequenas) conforme feedback de UX.

Licença / Créditos

Projeto educacional — código aberto para fins de aprendizado.
