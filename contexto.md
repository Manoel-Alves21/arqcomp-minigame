CORE --- Contexto de Implementação
Projeto: CORE --- Central de Processamento
Disciplina: Arquitetura Computacional
Instituição: SPTech
Tipo: Jogo educativo para navegador
Tecnologias obrigatórias: HTML5, CSS3 e JavaScript puro
1. Objetivo do projeto
Desenvolver um jogo educativo com temática de uma central de
processamento de computadores. O jogador deverá solucionar uma
cruzadinha com conceitos de Arquitetura Computacional para restaurar
visualmente os componentes de um sistema.

A proposta visual e narrativa pode ser criativa, mas a mecânica
principal deve continuar sendo uma cruzadinha, pois esse é um
requisito obrigatório da atividade avaliativa. Não substituir a
cruzadinha por caça-palavras, quiz ou outro formato.

O projeto deve ser compreensível, organizado e compatível com o nível de
um estudante do primeiro semestre de Análise e Desenvolvimento de
Sistemas.
2. Conceito aprovado
Nome
CORE --- Central de Processamento
Premissa
O jogador acessa uma central tecnológica e precisa resolver desafios de
Arquitetura Computacional para recuperar os componentes e restaurar o
funcionamento do sistema.
Experiência prevista
1. Tela inicial: apresenta o nome CORE, uma breve descrição da
   missão e o botão "Iniciar missão".
2. Painel principal: apresenta indicadores do sistema, progresso,
   pontuação, componentes computacionais, cruzadinha e pistas.
3. Desafio: o jogador seleciona as casas e digita as letras
   diretamente no tabuleiro.
4. Progressão: respostas corretas atualizam a pontuação, o
   progresso e o estado visual dos componentes.
5. Conclusão: quando todas as palavras forem resolvidas, o jogo
   apresenta o resultado e permite jogar novamente.
A temática de restauração dos componentes é um recurso de ambientação e
gamificação. Ela não deve prejudicar a clareza nem o funcionamento da
cruzadinha.
3. Requisitos obrigatórios da atividade
Conforme o PDF da atividade avaliativa:
3.1 Palavras
O tabuleiro deve utilizar no mínimo 12 das 16 palavras abaixo. A
grafia indicada é a que deve aparecer nas casas: letras maiúsculas, sem
acentos e sem espaços.
Nº Termo                                  Grafia no tabuleiro

 1 CPU                                    `CPU`
 2 ULA                                    `ULA`
 3 UC (Unidade de Controle)               `UC`
 4 registradores                          `REGISTRADORES`
 5 RAM                                    `RAM`
 6 ROM                                    `ROM`
 7 EEPROM                                 `EEPROM`
 8 Flash                                  `FLASH`
 9 cache                                  `CACHE`
10 memória de massa (armazenamento)       `MEMORIADEMASSA`
11 DMA                                    `DMA`
12 address bus (barramento de endereço)   `ADDRESSBUS`
13 data bus (barramento de dados)         `DATABUS`
14 microcontrolador                       `MICROCONTROLADOR`
15 dual core                              `DUALCORE`
16 quad core                              `QUADCORE`
3.2 Regras das pistas
- Cada pista deve ter no máximo 15 palavras.
- A pista não pode conter a resposta, parte dela ou a sigla por
  extenso.
- A pista deve estar correta segundo o material didático da
  disciplina.
- Cada pista deve conduzir a uma única resposta.
Importante: não inventar definições técnicas nem afirmar que foram
conferidas no e-book se o material não tiver sido fornecido. Se for
necessário validar o conteúdo conceitual e o e-book não estiver
disponível, solicitar o material ao usuário.
3.3 Requisitos do jogo
1. Tabuleiro com pelo menos 12 palavras da lista, cruzadas entre si.
2. Cada palavra deve cruzar pelo menos uma outra.
3. Pistas numeradas e separadas em Horizontais e Verticais.
4. O jogador digita as letras diretamente nas casas.
5. Botão Conferir, que mostra quais palavras estão certas e
   erradas.
6. Contador de acertos, por exemplo: "8 de 12 palavras".
7. Botão Reiniciar, que limpa o tabuleiro.
8. Desenvolvimento em HTML, CSS e JavaScript puros.
9. index.html na raiz do projeto.
3.4 GitHub e entrega
- Repositório público chamado arqcomp-cruzadinha.
- No mínimo 6 commits reais.
- Os commits devem ocorrer em pelo menos 2 dias diferentes.
- Mensagens curtas seguindo tipos como feat, fix, style e
  docs.
- README com nome do jogo, instruções, palavras utilizadas com pistas
  e link publicado.
- Não incluir RA, e-mail, telefone ou outros dados pessoais no
  repositório.
- Publicar pelo GitHub Pages usando a branch main e a pasta
  / (root).
- Testar o link em janela anônima.
- A entrega no Moodle é somente o link do site publicado.
Não simular commits, datas ou testes. Cada commit deve corresponder a
alterações reais feitas e verificadas.
4. Estrutura de arquivos
Manter a estrutura simples, com os arquivos principais na raiz:
CORE/
├── index.html
├── style.css
├── script.js
└── README.md
Responsabilidades:
- index.html: estrutura semântica das telas, painel, tabuleiro,
  pistas e controles.
- style.css: identidade visual, layout, responsividade, estados
  visuais e animações.
- script.js: dados da cruzadinha, interação, validação, pontuação,
  progresso, reinício e fluxo das telas.
- README.md: documentação do projeto e instruções de execução.
Não inserir CSS ou JavaScript diretamente no HTML, salvo se houver uma
justificativa aprovada. Não criar várias páginas HTML sem necessidade; a
proposta inicial é alternar as telas dentro de um único index.html.
5. Direção visual
Criar uma interface tecnológica, moderna e legível, inspirada em uma
central de processamento, placas-mãe, circuitos e componentes
computacionais.

Paleta sugerida:
- Azul-marinho ou quase preto para o fundo.
- Azul elétrico e ciano para destaques.
- Branco ou tons claros para textos.
- Verde para respostas corretas e indicadores positivos.
- Vermelho para respostas incorretas e alertas.
Diretrizes:
- Aparência de jogo digital, não de atividade escolar genérica.
- Evitar estética infantil e excesso de efeitos.
- Usar animações discretas e transições suaves.
- Garantir contraste e legibilidade.
- Criar layout responsivo para computador e celular.
- Não deixar que efeitos visuais prejudiquem a usabilidade.
6. Regras de implementação da cruzadinha
Esta é uma das partes mais importantes do projeto.

Antes de implementar a interface final do tabuleiro:
1. Escolher pelo menos 12 palavras.
2. Montar uma grade com coordenadas.
3. Definir orientação horizontal ou vertical para cada palavra.
4. Validar que letras de cruzamento são iguais.
5. Confirmar que cada palavra cruza pelo menos uma outra.
6. Numerar as palavras conforme a convenção de início das palavras.
7. Relacionar cada número à pista correta.
8. Apresentar uma representação textual ou visual da grade para
   revisão.
Não posicionar palavras apenas próximas umas das outras: é necessário
haver compartilhamento real de casas/letras.

A lógica deve ter uma única fonte de verdade para a posição das
palavras. A grade, as casas e as pistas devem ser derivadas desses dados
sempre que possível, evitando divergências entre o desenho e a
validação.

Para cada palavra, manter dados suficientes para identificar: -
resposta; - orientação; - coordenada inicial; - número da pista; - texto
da pista.

As coordenadas e o algoritmo de montagem devem ser testados. Não
declarar o tabuleiro validado sem verificar os cruzamentos.
7. Interações e mecânicas planejadas
7.1 Entrada de letras
- Permitir selecionar uma casa válida e digitar diretamente nela.
- Permitir navegação entre casas.
- Permitir apagar letras.
- Destacar a palavra selecionada e sua pista.
- Tratar corretamente casas compartilhadas por palavras horizontais e
  verticais.
- Não permitir digitação em casas bloqueadas.
7.2 Conferência
- O botão Conferir verifica as palavras.
- Respostas corretas e incorretas devem receber estados visuais
  distintos.
- Respostas incompletas não podem ser consideradas corretas.
- A conferência deve respeitar letras compartilhadas.
- Uma palavra correta não pode gerar pontos repetidamente em
  conferências posteriores.
7.3 Progresso e pontuação
- Exibir acertos no formato "X de N palavras".
- Atualizar a pontuação de forma consistente.
- Atualizar a barra ou indicador de progresso.
- A integridade do sistema é um elemento temático; definir claramente
  como ela reage às respostas e não confundir o jogador.
- Associar visualmente respostas corretas à restauração de
  componentes, sem criar regras que contrariem a atividade.
7.4 Reiniciar
O botão Reiniciar deve: - limpar as letras digitadas; - remover
estados de acerto e erro; - zerar pontuação e progresso; - restaurar os
indicadores e componentes; - retornar o jogo a um estado inicial
consistente.

Se houver confirmação antes de apagar o progresso, manter a interação
simples.
7.5 Conclusão
Quando todas as palavras forem resolvidas: - mostrar uma mensagem de
missão concluída; - exibir pontuação final; - exibir percentual de
conclusão; - permitir reiniciar o jogo.
8. Tecnologias e limites
Utilizar somente:
- HTML5;
- CSS3;
- JavaScript puro.
Não utilizar React, Angular, Vue, Bootstrap ou frameworks. Evitar
bibliotecas externas desnecessárias.

O código deve ser simples, organizado e explicável por um estudante
iniciante de ADS. Evitar abstrações, padrões ou estruturas
excessivamente sofisticadas sem necessidade.

Usar nomes claros para variáveis, funções, classes e IDs. Comentar
trechos quando isso ajudar a compreensão, sem comentar cada linha.
9. Plano de implementação e commits
O desenvolvimento está dividido em seis tarefas, com três commits em
cada um de dois dias diferentes. A divisão é um plano de trabalho: os
commits só devem ser feitos depois que a alteração correspondente
existir e tiver sido testada.
Dia 1 --- Estrutura e interface
Tarefa 01 --- Protótipo inicial
Entregas: - criar index.html, style.css e script.js; - criar tela
inicial, painel principal e tela de conclusão; - implementar a navegação
inicial entre telas; - reservar as áreas para tabuleiro, pistas e
indicadores.

Commit sugerido:
git add index.html style.css script.js
git commit -m "feat: cria prototipo inicial do CORE"
Tarefa 02 --- Identidade visual
Entregas: - aplicar paleta e tipografia; - estilizar tela inicial,
painel, cards e botões; - implementar estados de hover e transições
discretas; - adaptar o layout para diferentes resoluções.

Commit sugerido:
git add index.html style.css
git commit -m "style: desenvolve identidade visual do CORE"
Tarefa 03 --- Estrutura da cruzadinha
Entregas: - escolher e posicionar pelo menos 12 palavras; - validar
matematicamente todos os cruzamentos; - criar casas e numeração; -
cadastrar pistas horizontais e verticais; - relacionar corretamente as
pistas ao tabuleiro.

Commit sugerido:
git add index.html style.css script.js
git commit -m "feat: implementa estrutura da cruzadinha"
Dia 2 --- Funcionalidades e finalização
Tarefa 04 --- Interação com o tabuleiro
Entregas: - seleção de casas e palavras; - digitação e exclusão de
letras; - navegação; - destaque da palavra e pista selecionadas; -
tratamento correto das letras compartilhadas.

Commit sugerido:
git add index.html style.css script.js
git commit -m "feat: implementa interacao com o tabuleiro"
Tarefa 05 --- Validação e pontuação
Entregas: - botão Conferir; - identificação de respostas certas e
erradas; - contador de acertos; - pontuação sem duplicidade; - progresso
e restauração visual dos componentes; - botão Reiniciar; - tela de
conclusão.

Commit sugerido:
git add index.html style.css script.js
git commit -m "feat: implementa validacao e pontuacao do jogo"
Tarefa 06 --- Revisão e documentação
Entregas: - revisar o funcionamento; - corrigir erros encontrados; -
testar responsividade; - criar README; - preparar publicação no GitHub
Pages; - listar pendências, se houver.

Commit sugerido:
git add README.md
git commit -m "docs: adiciona documentacao do projeto CORE"
Se a revisão modificar também HTML, CSS ou JavaScript, incluir esses
arquivos no git add do commit correspondente. Não deixar correções
reais fora do histórico.
10. Critérios de teste e aceite
Antes de considerar o projeto pronto, verificar:
Tabuleiro
- [ ] Pelo menos 12 palavras da lista.
- [ ] Cada palavra cruza pelo menos uma outra.
- [ ] Letras compartilhadas são consistentes.
- [ ] Numeração corresponde às pistas.
- [ ] Pistas respeitam o limite de 15 palavras.
- [ ] Pistas não entregam a resposta.
Jogo
- [ ] Digitação funciona em casas válidas.
- [ ] Navegação funciona.
- [ ] Exclusão de letras funciona.
- [ ] Palavra selecionada e pista correspondente são destacadas.
- [ ] Conferir identifica respostas certas e erradas.
- [ ] Respostas incompletas não são aceitas.
- [ ] Pontuação não duplica.
- [ ] Contador apresenta valores corretos.
- [ ] Reiniciar limpa todo o progresso.
- [ ] Conclusão aparece somente quando todas as palavras forem
  resolvidas.
Qualidade e publicação
- [ ] Interface responsiva.
- [ ] Caminhos dos arquivos corretos.
- [ ] Não há erros relevantes no console.
- [ ] O projeto abre sem servidor ou banco de dados.
- [ ] index.html está na raiz.
- [ ] README está completo.
- [ ] GitHub Pages funciona.
- [ ] Link foi testado em janela anônima.
Não marcar um item como testado sem realmente executá-lo ou
inspecioná-lo.
11. Forma de trabalho do agente
Trabalhar estritamente uma tarefa por vez.

Para cada tarefa:
1. Ler e analisar os arquivos atuais.
2. Identificar o que já existe.
3. Informar brevemente o que será alterado.
4. Implementar somente o escopo da tarefa atual.
5. Preservar o que já funciona.
6. Informar quais arquivos foram criados ou modificados.
7. Explicar como testar a alteração.
8. Apresentar pendências ou limitações.
9. Aguardar a aprovação do usuário antes de avançar.
Não recriar o projeto do zero em cada etapa. Não apagar funcionalidades
anteriores. Não avançar automaticamente para a próxima tarefa.

O usuário fará os commits manualmente depois de revisar e aprovar cada
entrega. Não simular commits nem afirmar que foram executados.
12. Prioridade geral
A ordem de prioridade é:
1. Cumprir integralmente a atividade avaliativa.
2. Garantir que a cruzadinha e suas regras estejam corretas.
3. Garantir que o jogo funcione.
4. Manter o código simples e compreensível.
5. Desenvolver uma identidade visual criativa e consistente.
6. Preparar documentação e publicação.
Comece pela Tarefa 01 --- Protótipo inicial do CORE. Não implemente as
tarefas seguintes até receber aprovação explícita.