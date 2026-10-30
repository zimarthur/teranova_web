# Feature Specification: Plataforma web da terapeuta (v1)

**Feature Branch**: `001-therapist-web-v1`

**Created**: 2026-10-23

**Status**: Draft

**Input**: User description: "Especificar a v1 da plataforma web da terapeuta Teranova. Produto novo, separado do aplicativo, da página institucional e do portal administrativo. A terapeuta usa a mesma conta e os mesmos dados do aplicativo. A referência de comportamento é o aplicativo já existente. Onde esse comportamento for ambíguo, vale o que o aplicativo faz hoje. Interface em português (Brasil). Computador e tablet a partir de 768 pixels de largura; abaixo disso, só um aviso para usar o aplicativo Teranova. A web cobre as mesmas capacidades do aplicativo, sem gravação, sem reprodução de áudio e sem biometria. Inclui conta, onboarding, início, pacientes, sessões por escrito, leitura de sessão gravada no aplicativo, relatórios de jornada, documentos, clínica, convites, papéis e plano."

## Clarifications

### Session 2026-10-23

- Q: Quem pode editar o paciente e iniciar uma sessão a partir da ficha? → A: Só quem está na equipe de um paciente ativo. Acesso a todos os pacientes abre a ficha, sem editar e sem atender.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Criar a conta e entrar (Priority: P1)

A terapeuta cria a conta com e-mail e senha, confirma o código enviado ao e-mail, informa nome, sobrenome e especialidade, e só então usa o produto. Na próxima visita o navegador continua autenticado. Sair encerra a sessão só neste navegador.

**Why this priority**: Sem conta confirmada e onboarding completo não existe uso clínico. A mesma conta precisa valer no aplicativo e aqui.

**Independent Test**: Criar uma conta nova, confirmar, completar o onboarding e recarregar a página. A terapeuta continua dentro do produto. Sair e abrir de novo pede o acesso outra vez.

**Acceptance Scenarios**:

1. **Given** uma visitante sem conta, **When** ela informa e-mail, senha de pelo menos 6 caracteres e a confirmação igual à senha, **Then** a conta é criada e ela segue para informar o código de segurança enviado ao e-mail.
2. **Given** um e-mail que já tem conta, **When** ela tenta cadastrar de novo, **Then** a mensagem é "Este usuário já possui uma conta."
3. **Given** e-mail vazio, e-mail inválido, senha vazia, senha curta ou senhas diferentes, **When** ela tenta continuar, **Then** o formulário explica o problema em português e não cria a conta.
4. **Given** a conta ainda não confirmada, **When** ela informa o código válido, **Then** a conta fica confirmada e ela segue para o onboarding se nome, sobrenome ou especialidade ainda faltarem.
5. **Given** um código inválido ou expirado, **When** ela confirma a conta ou a recuperação de senha, **Then** vê "Código inválido ou expirado" ou "Código de recuperação inválido ou expirado", conforme o fluxo, e pode pedir o código de novo.
6. **Given** o onboarding aberto, **When** nome, sobrenome ou especialidade estão vazios, **Then** "Iniciar" permanece indisponível. **When** os três estão preenchidos e ela escolhe uma especialidade da lista já usada no aplicativo, **Then** o onboarding termina e o produto abre.
7. **Given** e-mail e senha corretos de uma conta já confirmada e com onboarding feito, **When** ela entra, **Then** vai para o início. Credencial errada mostra "Credenciais inválidas", sem dizer se o erro foi o e-mail ou a senha.
8. **Given** ela pede recuperação de senha, **When** informa um e-mail, **Then** o passo seguinte é o mesmo exista ou não essa conta. Com o código válido ela define a nova senha, com as mesmas regras de tamanho e confirmação.
9. **Given** ela já entrou, **When** recarrega a página, **Then** continua autenticada. **When** escolhe "Sair", **Then** este navegador deixa de estar autenticado e uma nova visita pede o acesso.
10. **Given** qualquer erro desses fluxos, **When** a mensagem aparece, **Then** está em português. O pedido de recuperação não revela se o e-mail existe. O cadastro revela e-mail já usado somente na frase que o aplicativo já usa.

---

### User Story 2 - No celular, só o aviso do aplicativo (Priority: P1)

Em uma janela com menos de 768 pixels de largura, a única tela é um aviso para usar o aplicativo Teranova. O restante do produto fica inacessível. De 768 pixels para cima, inclusive tablet, o produto completo funciona. Não existe uma versão reduzida das telas para celular.

**Why this priority**: A v1 não desenha o produto para celular. Sem esse portão, dado clínico apareceria numa tela que não foi feita para isso.

**Independent Test**: Abrir a plataforma abaixo de 768 pixels, autenticada ou não, e confirmar que só o aviso aparece e que nenhuma área clínica abre. Alargar para 768 pixels ou mais e confirmar que o produto correspondente ao estado da conta aparece.

**Acceptance Scenarios**:

1. **Given** a largura é menor que 768 pixels, **When** a terapeuta abre qualquer endereço da plataforma, **Then** vê somente o aviso para usar o aplicativo Teranova.
2. **Given** essa tela estreita, **When** ela tenta alcançar início, pacientes, sessões, relatórios, clínica ou configurações, **Then** essas áreas não aparecem e nenhum dado clínico é mostrado.
3. **Given** a largura passa a 768 pixels ou mais, **When** a tela se ajusta, **Then** o produto completo do estado atual (entrada, onboarding ou início) fica disponível.
4. **Given** a largura é de 768 pixels ou mais, **When** ela usa o produto, **Then** as telas são as de computador e tablet, sem uma versão própria de celular.

---

### User Story 3 - Ver o início do dia (Priority: P1)

Depois de entrar, a terapeuta vê quem ela é, a clínica atual, os primeiros passos enquanto a conta ainda não completou conta, primeiro paciente e primeira sessão, as sessões de hoje e as ações Nova sessão, Pacientes, Sessões e Relatórios com IA.

**Why this priority**: O início é a porta de cada trabalho do dia e o convite para escrever o primeiro atendimento, não para gravar.

**Independent Test**: Entrar com uma conta sem paciente e sem sessão e ver os primeiros passos. Cadastrar o paciente e escrever uma sessão e ver o bloco sumir quando os três passos estiverem feitos. Com sessões hoje, a lista continua quando houver mais.

**Acceptance Scenarios**:

1. **Given** a terapeuta entrou, **When** o início abre, **Then** o cabeçalho cumprimenta pelo primeiro nome, mostra a clínica selecionada e oferece configurações.
2. **Given** ela tem mais de uma clínica, **When** troca a clínica no cabeçalho, **Then** início, pacientes e sessões passam a mostrar a clínica escolhida.
3. **Given** conta, primeiro paciente ou primeira sessão ainda não foram concluídos, **When** o início abre, **Then** aparece "Primeiros passos" com o progresso "N de 3", os passos "Criar conta", "Adicionar paciente" e "Criar nova sessão", e o passo atual pode ser seguido.
4. **Given** o passo atual é a primeira sessão, **When** o convite aparece, **Then** ele pede para escrever o atendimento e não menciona gravar, microfone ou áudio.
5. **Given** os três passos estão concluídos, **When** o início abre, **Then** o bloco de primeiros passos não aparece.
6. **Given** há sessões hoje, **When** ela olha "Sessões de hoje", **Then** vê a lista e a quantidade, e a lista continua quando houver mais. Falha ao continuar oferece tentar de novo.
7. **Given** não há sessão hoje, **When** a lista carrega, **Then** aparece "Nenhuma sessão hoje".
8. **Given** o início está visível, **When** ela escolhe Nova sessão, Pacientes, Sessões ou Relatórios com IA, **Then** chega à área correspondente.

---

### User Story 4 - Cadastrar e abrir o paciente (Priority: P1)

A terapeuta lista, cadastra e edita pacientes com nome, sobrenome, data de nascimento, gênero, diagnóstico, condições adicionais e foto escolhida no computador. A ficha tem as mesmas abas do aplicativo. Editar o paciente e iniciar uma sessão escrita só aparecem quando ela está na equipe de cuidado e o paciente está ativo. No consultório pessoal, quem abre o próprio paciente conta como equipe de cuidado.

**Why this priority**: Não há sessão nem relatório sem paciente. A ficha é o lugar em que a equipe e o histórico se encontram.

**Independent Test**: Cadastrar um paciente com os campos obrigatórios e a foto, abrir a ficha, editar um dado e iniciar dali o fluxo de nova sessão já com esse paciente.

**Acceptance Scenarios**:

1. **Given** a lista de pacientes, **When** ela cadastra nome, sobrenome, data de nascimento válida, gênero, diagnóstico e, se quiser, condições adicionais, **Then** o paciente passa a aparecer na lista e na ficha.
2. **Given** o formulário, **When** ela escolhe gênero, diagnóstico ou condição, **Then** as opções são as mesmas já usadas no aplicativo: gênero masculino, feminino ou outro; diagnóstico TEA Nível 1, TEA Nível 2, TEA Nível 3, Suspeita de TEA, Em investigação, Neurotípico, Outro transtorno ou Não informado; condições TDAH, Ansiedade, Depressão, Deficiência Intelectual, Transtorno de Linguagem, Atraso no Desenvolvimento, Epilepsia, Distúrbio do Sono, Transtorno do Processamento Sensorial, Dificuldades Motoras, Comportamento Agressivo, Seletividade Alimentar e TOD.
3. **Given** a data de nascimento, **When** está vazia, fora do formato dia/mês/ano, é futura ou representa idade acima de 120 anos, **Then** o cadastro explica o problema e não salva.
4. **Given** ela escolhe uma foto no computador, **When** o arquivo é JPEG, PNG ou WebP de até 5 MB, **Then** a foto do paciente é salva. Outro arquivo ou arquivo maior explica que a foto deve ser JPEG, PNG ou WebP de até 5 MB.
5. **Given** a ficha, **When** a clínica não é compartilhada, **Then** as abas são Dados, Sessões e Documentos. **When** a clínica é compartilhada, **Then** também existe Equipe de cuidado. Documentos só aparece se ela está na equipe de cuidado daquele paciente.
6. **Given** a aba Dados, **When** ela abre, **Then** mostra os dados do paciente e o panorama das sessões. Ela pode alternar ativo e inativo quando o aplicativo já permite essa mudança.
7. **Given** a ficha de um paciente ativo e ela está na equipe de cuidado, **When** ela inicia uma nova sessão, **Then** o fluxo escrito começa já com esse paciente. Ela também pode editar o paciente.
8. **Given** ela tem acesso a todos os pacientes e não está na equipe daquele paciente, **When** abre a ficha, **Then** vê a ficha permitida por esse papel, sem a ação de editar e sem iniciar sessão.
9. **Given** o paciente está inativo, **When** ela abre a ficha, mesmo estando na equipe, **Then** editar e iniciar sessão não aparecem. Quem está na equipe ainda pode reativar o paciente, como o aplicativo já permite.
10. **Given** a lista está vazia, a busca não acha ninguém, o carregamento falha ou ela não tem acesso, **When** a lista responde, **Then** o estado explica o que aconteceu, em português, sem dado clínico de outro paciente. Falta de acesso diz que ela não tem acesso a estes pacientes e pede que um colega a vincule à equipe de cuidado.
11. **Given** o consultório pessoal chegou ao limite de pacientes do plano, **When** ela tenta cadastrar outro, **Then** a criação é bloqueada com a mesma comunicação de limite já usada no aplicativo, incluindo o nome do plano e o limite de pacientes.

---

### User Story 5 - Escrever uma sessão e reler outra (Priority: P1)

Não existe tela de gravação. A terapeuta escolhe o paciente, escreve a nota, revisa o resumo e salva. A sessão entra nos mesmos lugares de uma sessão feita no aplicativo. Abrir uma sessão mostra o resumo, "Suas anotações" e, quando existir, "Resumo estruturado". Cada bloco pode ser copiado. O áudio nunca é oferecido.

**Why this priority**: Escrever e reler o atendimento é o trabalho central desta versão.

**Independent Test**: Salvar uma sessão só com nota e encontrá-la no início, na lista de sessões e na ficha do paciente. Abrir uma sessão gravada no aplicativo e ver a transcrição e o resumo estruturado, sem arquivo de áudio.

**Acceptance Scenarios**:

1. **Given** Nova sessão, **When** ela ainda não escolheu o paciente, **Then** o próximo passo não começa. **When** escolhe o paciente, **Then** abre a nota, vazia.
2. **Given** a nota, **When** o texto está vazio ou só tem espaços, **Then** ela não avança e a tela explica que a nota precisa ser preenchida.
3. **Given** uma nota preenchida, **When** ela avança, **Then** o resumo mostra paciente, nota, data, horário de início e horário de fim. Data, início e fim podem ser alterados como no aplicativo. O fim permanece depois do início: se uma alteração inverter essa ordem, o outro horário se ajusta em uma hora, como o aplicativo já faz. Não há duração de áudio, microfone nem qualquer indício de que existe áudio.
4. **Given** o resumo acabou de abrir, **When** ela ainda não editou data e horários, **Then** a data é hoje. Se o minuto atual passou de 30, o início é a hora cheia atual e o fim é uma hora depois. Caso contrário, o início é a hora cheia anterior e o fim é a hora cheia atual.
5. **Given** ela salva, **When** a sessão é aceita, **Then** a sessão é criada sem arquivo de áudio. A nota digitada ocupa o lugar da nota do atendimento e segue o mesmo tratamento posterior, inclusive a interpretação que gera o resumo estruturado.
6. **Given** a sessão foi salva, **When** ela volta ao início, à lista de sessões ou à ficha do paciente, **Then** a sessão aparece nos mesmos lugares de uma sessão que veio do aplicativo.
7. **Given** o salvamento falha, **When** a resposta chega, **Then** ela permanece no resumo, a nota continua visível e a mensagem permite tentar de novo. **When** ela abandona o fluxo antes de salvar, **Then** nenhuma sessão é criada.
8. **Given** uma sessão aberta com permissão, **When** a tela carrega, **Then** mostra o resumo e "Suas anotações". Se houver resumo estruturado, ele aparece em bloco próprio. Cada bloco com texto oferece "Copiar notas" e, ao copiar, confirma "Notas copiadas".
9. **Given** a sessão foi gravada no aplicativo, **When** ela abre na web, **Then** vê a transcrição e, se existir, o resumo estruturado. O arquivo de áudio não é oferecido, nem duração, nem reprodução.
10. **Given** ela não tem permissão para a sessão, **When** abre, **Then** vê a mesma recusa já usada no aplicativo, "Você não tem acesso a esta sessão.", sem o conteúdo clínico.
11. **Given** a nota tem um tamanho que o aplicativo já aceita, **When** ela salva, **Then** a web aceita. A web não cria um limite novo de tamanho. Nota vazia ou só com espaços continua impedida.

---

### User Story 6 - Encontrar sessões (Priority: P2)

A terapeuta lista as sessões e filtra por terapeutas, pacientes e intervalo de datas, com os mesmos recortes do aplicativo.

**Why this priority**: A leitura de uma sessão já entrega valor. A lista filtrada é necessária para achar um atendimento antigo no meio de muitos.

**Independent Test**: Abrir a lista, aplicar cada filtro e conferir que o resultado muda. Limpar os filtros volta ao recorte padrão do aplicativo.

**Acceptance Scenarios**:

1. **Given** a lista de sessões, **When** ela filtra o período, **Then** pode escolher Hoje, Última semana, Últimos 15 dias ou Último mês.
2. **Given** os filtros, **When** ela escolhe terapeutas ou pacientes, **Then** pode selecionar mais de um. "Filtrar por mim" restringe às sessões dela e a lista pode mostrar o recorte "Minhas sessões".
3. **Given** um intervalo informado, **When** falta a data inicial ou a final, **Then** o filtro não é aplicado pela metade. As duas datas seguem juntas, como no aplicativo.
4. **Given** há mais sessões do que a primeira página, **When** ela continua a lista, **Then** as próximas aparecem. Falha ao continuar oferece tentar de novo.
5. **Given** o filtro não encontra sessões ou o carregamento falha, **When** a lista responde, **Then** o estado é compreensível e não mostra conteúdo clínico de uma sessão sem permissão.

---

### User Story 7 - Tratar documentos do paciente (Priority: P2)

Na ficha, quando ela está na equipe de cuidado, a terapeuta lista, envia, abre e remove documentos, com os mesmos limites e permissões do aplicativo.

**Why this priority**: O prontuário escrito e a sessão já funcionam sem documentos. O documento completa a ficha que o aplicativo já tem.

**Independent Test**: Na ficha de um paciente em que ela está na equipe, enviar um PDF válido, abri-lo, removê-lo e confirmar que um arquivo fora das regras é recusado com a mesma explicação do aplicativo.

**Acceptance Scenarios**:

1. **Given** ela está na equipe de cuidado e o paciente está ativo, **When** abre Documentos, **Then** vê a lista e pode enviar, abrir e remover.
2. **Given** o envio, **When** ela informa o nome de até 120 caracteres, escolhe o tipo e anexa PDF, JPEG, PNG ou WebP de até 20 MB, **Then** o documento entra na lista. Os tipos são Anamnese, Laudo, Parecer técnico, Relatório, Encaminhamento, Exame, Termo e autorização e Outro.
3. **Given** o arquivo, o tipo ou o nome está fora da regra, **When** ela tenta enviar, **Then** a explicação é a mesma já usada no aplicativo: arquivo PDF, JPEG, PNG ou WebP de até 20 MB; tipo obrigatório; nome de até 120 caracteres.
4. **Given** ela não está na equipe de cuidado, **When** abre a ficha, **Then** a aba Documentos não aparece.
5. **Given** o paciente está inativo, **When** ela tenta enviar ou remover documento, **Then** a alteração é recusada e a lista continua legível.
6. **Given** a lista está vazia, o carregamento falha ou ela não tem permissão, **When** a aba responde, **Then** o estado explica o que aconteceu, sem dado clínico de outro paciente.

---

### User Story 8 - Gerar e ler um relatório de jornada (Priority: P2)

A terapeuta lista os relatórios de jornada, cria um escolhendo o paciente e acompanhando a configuração até o detalhe, e abre um relatório já existente. Plano e permissões são os mesmos do aplicativo. Sem pacientes ou sem sessões suficientes, o estado vazio explica o que falta e não inventa um relatório.

**Why this priority**: O relatório depende de paciente e de sessões. Ele entrega a síntese depois que o atendimento já pode ser escrito e relido.

**Independent Test**: Com um paciente que tenha sessão elegível no período, gerar um relatório e abrir o detalhe. Sem sessão elegível, confirmar que a geração não segue e que a explicação diz o que falta.

**Acceptance Scenarios**:

1. **Given** não há relatórios, **When** ela abre Relatórios com IA, **Then** vê "Nenhum relatório gerado" e o convite para criar o primeiro, descrevendo uma síntese fundamentada nas sessões do paciente.
2. **Given** ela cria um relatório, **When** escolhe o paciente, **Then** configura período e profissionais, vê a prévia e só gera quando há ao menos uma sessão elegível no período e ao menos um profissional selecionado.
3. **Given** não há sessão elegível ou nenhum profissional com sessão no período, **When** ela configura, **Then** a tela explica o que falta e não cria um relatório.
4. **Given** ela gera, **When** o relatório é criado, **Then** ela acompanha até o detalhe, como no aplicativo, inclusive quando a geração falha e pode ser tentada de novo.
5. **Given** um relatório já existe, **When** ela abre a lista e escolhe o item, **Then** vê o detalhe. A lista continua quando houver mais.
6. **Given** o plano pessoal chegou ao limite mensal de relatórios, **When** ela tenta criar outro, **Then** a criação é bloqueada com a mesma comunicação do aplicativo, citando o plano e o limite mensal.
7. **Given** ela não tem pacientes, **When** tenta criar um relatório, **Then** o estado vazio explica que falta o paciente e não inventa um relatório.
8. **Given** o relatório é um apoio à análise, **When** a configuração está visível, **Then** a tela lembra que ele não substitui o julgamento clínico.

---

### User Story 9 - Cuidar da clínica e dos convites (Priority: P2)

Quando a clínica é compartilhada, as configurações mostram as informações da clínica e a gestão de terapeutas, incluindo convites pendentes. Convites recebidos ficam na conta, com a contagem pendente. As ações respeitam os papéis já existentes.

**Why this priority**: O consultório pessoal já atende a terapeuta sozinha. A clínica compartilhada importa para quem trabalha em equipe, sem criar papel novo.

**Independent Test**: Entrar numa clínica compartilhada com e sem cada papel e confirmar que a ação só aparece para quem tem o papel. Recusar um convite recebido diminui a contagem.

**Acceptance Scenarios**:

1. **Given** a clínica selecionada é compartilhada, **When** ela abre configurações, **Then** vê a seção da clínica com informações da clínica e gestão de terapeutas, inclusive convites pendentes.
2. **Given** a clínica selecionada é o consultório pessoal, **When** ela abre configurações, **Then** a seção de gestão da clínica compartilhada não aparece.
3. **Given** o plano permite clínica adicional, **When** ela cria uma clínica, **Then** informa nome, CNPJ e endereço, todos obrigatórios. **Given** o plano não inclui isso, **When** ela tenta criar, **Then** vê a comunicação de limite do aplicativo para clínicas adicionais.
4. **Given** ela tem o papel correspondente, **When** gere a equipe, **Then** pode convidar terapeuta, remover terapeuta, conceder e revogar permissões e vincular ou desvincular paciente de terapeuta na ficha.
5. **Given** ela não tem o papel, **When** olha a tela, **Then** a ação não aparece como disponível. **When** a recusa chega mesmo assim, **Then** a mensagem é de permissão, sem dado clínico.
6. **Given** os papéis existentes, **When** ela os vê, **Then** são somente estes, sem papel novo: Gerenciar permissões; Adicionar paciente; Adicionar terapeuta; Remover terapeuta; Vincular ou desvincular paciente de terapeuta; Acesso a todos os pacientes, que não permite editar nem atender por causa disso; Ver anotações de colegas apenas nos pacientes que a pessoa atende.
7. **Given** há convites recebidos, **When** ela abre a conta, **Then** "Convites recebidos" mostra a contagem pendente. Ela pode aceitar ou recusar. Sem convite pendente, a contagem não aparece e a lista explica que não há convite.
8. **Given** "Acesso a todos os pacientes" e ela não está na equipe, **When** ela abre a ficha, **Then** pode ver a ficha permitida por esse papel, sem editar e sem iniciar atendimento.
9. **Given** "Ver anotações de colegas", **When** ela está na equipe daquele paciente, **Then** pode ver sessões e anotações de colegas nesse paciente. Fora dos pacientes que ela atende, essas anotações não aparecem.

---

### User Story 10 - Ver a conta e o plano (Priority: P2)

Em configurações, a terapeuta vê os detalhes da conta, o plano e a saída. O plano Basic abre a comparação. Plus e Pro abrem a assinatura atual. Não há biometria.

**Why this priority**: A terapeuta já trabalha sem abrir o plano. A comparação e a assinatura precisam existir para o mesmo caminho de upgrade do aplicativo.

**Independent Test**: Abrir configurações nos três planos e confirmar o destino de cada um. Confirmar que não existe seção de biometria e que sair encerra a sessão deste navegador.

**Acceptance Scenarios**:

1. **Given** configurações, **When** ela abre Detalhes da conta, **Then** vê nome, e-mail, especialidade e a data em que a conta foi confirmada. Pode escolher a foto por arquivo no computador, com a mesma regra de JPEG, PNG ou WebP de até 5 MB, ou remover a foto. Pode excluir a conta depois de confirmar que a exclusão é permanente e irreversível.
2. **Given** o plano é Basic, **When** ela toca em Plano, **Then** abre a comparação dos planos Basic, Plus e Pro, com os mesmos ciclos mensal e anual, limites e caminho de contratação do aplicativo.
3. **Given** o plano é Plus ou Pro, **When** ela toca em Plano, **Then** abre a assinatura atual e o caminho para gerenciá-la, como no aplicativo.
4. **Given** a comparação, **When** ela lê os limites, **Then** Basic oferece até 5 pacientes particulares, 5 relatórios de jornada por mês e não inclui clínicas adicionais. Plus oferece pacientes e relatórios ilimitados no consultório pessoal e não inclui clínicas adicionais. Pro oferece o que o Plus oferece no consultório pessoal, o cadastro de clínicas adicionais e pacientes e relatórios ilimitados nas clínicas, com o plano da clínica valendo para toda a equipe. Preços e textos de comparação são os mesmos que o aplicativo mostra.
5. **Given** qualquer tela de configurações, **When** ela percorre a página, **Then** não existe seção, controle ou menção de biometria.
6. **Given** ela escolhe Sair, **When** a ação termina, **Then** a sessão deste navegador se encerra.

---

### Edge Cases

- Largura exatamente de 768 pixels mostra o produto completo. Um pixel a menos mostra só o aviso do aplicativo.
- Recarregar no meio do onboarding não abre o produto clínico. Recarregar depois de entrar mantém a terapeuta autenticada.
- Pedido de recuperação com e-mail desconhecido segue o mesmo passo de sucesso do e-mail conhecido.
- Nota só com espaços não avança e explica que a nota precisa ser preenchida. Abandonar antes de salvar não cria sessão. Falha ao salvar permanece no resumo com a nota visível.
- Sessão gravada no aplicativo abre sem oferecer o arquivo de áudio, a duração ou a reprodução.
- Lista vazia, falha de carregamento e falta de permissão em pacientes, sessões, documentos e relatórios explicam o estado e não vazam dado clínico de outra pessoa.
- Paciente inativo não aceita envio nem remoção de documento.
- Quem não tem o papel não vê a ação. Se a recusa chegar mesmo assim, a mensagem é de permissão e não traz conteúdo clínico.
- Acesso a todos os pacientes abre a ficha e não autoriza editar nem atender. Paciente inativo não oferece editar nem iniciar sessão; quem está na equipe pode reativá-lo. Ver anotações de colegas vale só nos pacientes que a pessoa atende.
- Limite de plano ao criar paciente no consultório pessoal, relatório de jornada ou clínica adicional usa a comunicação já usada no aplicativo. A criação de sessão não tem cota própria de quantidade, porque o produto atual não aplica essa cota.
- Nenhuma tela pede microfone, consentimento de gravação, envio de áudio, duração de gravação, reprodução de áudio ou biometria.
- Abaixo de 768 pixels, estar autenticada não revela o início nem dado clínico.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A plataforma MUST ser um produto separado do aplicativo Teranova, da página institucional e do portal administrativo, usando a mesma conta e os mesmos dados clínicos da terapeuta.
- **FR-002**: A interface MUST estar em português (Brasil).
- **FR-003**: Abaixo de 768 pixels de largura, a plataforma MUST mostrar somente um aviso para usar o aplicativo Teranova e MUST impedir o acesso ao restante do produto, inclusive dado clínico.
- **FR-004**: De 768 pixels de largura para cima, inclusive tablet, a plataforma MUST oferecer o produto completo em layout de computador e tablet, sem uma versão própria das telas para celular.
- **FR-005**: A terapeuta MUST poder criar conta, confirmar o código, entrar, pedir recuperação de senha, confirmar o token e redefinir a senha, com as mesmas regras de e-mail, senha mínima de 6 caracteres e confirmação de senha já usadas no aplicativo.
- **FR-006**: Mensagens de autenticação MUST estar em português. O login MUST usar "Credenciais inválidas" sem revelar se o e-mail existe. A recuperação de senha MUST seguir o mesmo passo de sucesso exista ou não a conta. O cadastro MUST revelar conta existente somente com "Este usuário já possui uma conta."
- **FR-007**: Antes de usar o produto, a terapeuta MUST completar o onboarding com nome, sobrenome e uma especialidade da lista já usada no aplicativo. Sem os três, ela não entra no produto clínico.
- **FR-008**: A sessão neste navegador MUST continuar depois de recarregar a página e MUST terminar quando ela escolhe Sair.
- **FR-009**: O início MUST mostrar a identidade dela, a clínica selecionada, os primeiros passos enquanto conta, primeiro paciente ou primeira sessão não estiverem concluídos, as sessões de hoje com continuação da lista, e as ações Nova sessão, Pacientes, Sessões e Relatórios com IA.
- **FR-010**: O passo de primeira sessão MUST convidar a escrever o atendimento e MUST NOT mencionar gravação, microfone ou áudio.
- **FR-011**: A terapeuta MUST poder trocar a clínica atual. Depois da troca, início, pacientes e sessões MUST mostrar a clínica escolhida.
- **FR-012**: A terapeuta MUST poder listar, buscar, cadastrar e editar pacientes com nome, sobrenome, data de nascimento, gênero, diagnóstico, condições adicionais e foto escolhida no computador, usando os mesmos catálogos e as mesmas validações do aplicativo.
- **FR-013**: A foto do paciente e a foto da terapeuta MUST ser um arquivo JPEG, PNG ou WebP de até 5 MB escolhido no computador. Arquivo fora dessa regra MUST ser recusado com a explicação já usada no aplicativo.
- **FR-014**: A ficha MUST ter Dados, com o panorama das sessões; Equipe de cuidado quando a clínica é compartilhada; Sessões; e Documentos quando a terapeuta está na equipe de cuidado daquele paciente. Editar o paciente e iniciar uma sessão escrita MUST aparecer somente quando ela está na equipe de cuidado e o paciente está ativo. No consultório pessoal, quem abre o próprio paciente conta como equipe de cuidado.
- **FR-015**: Lista vazia, falha de carregamento e falta de permissão MUST aparecer como estado compreensível, em português, sem dado clínico de outro paciente ou de outra sessão.
- **FR-016**: A nova sessão MUST ser somente por escrito, na ordem escolher paciente, escrever a nota e revisar o resumo. Nota vazia ou só com espaços MUST impedir o avanço e explicar que a nota precisa ser preenchida.
- **FR-017**: O resumo MUST mostrar paciente, nota, data, horário de início e horário de fim. Data, início e fim MUST ser editáveis como no aplicativo, mantendo o fim depois do início. O resumo MUST NOT mostrar duração de áudio nem indício de que existe áudio.
- **FR-018**: Salvar MUST criar a sessão sem arquivo de áudio. A nota digitada MUST ocupar o lugar da nota do atendimento e MUST seguir o mesmo tratamento posterior, inclusive a interpretação que gera o resumo estruturado. A sessão salva MUST aparecer nos mesmos lugares de uma sessão vinda do aplicativo.
- **FR-019**: Falha ao salvar MUST manter a terapeuta no resumo, com a nota visível e com mensagem que permite tentar de novo. Abandonar o fluxo antes de salvar MUST NOT criar sessão.
- **FR-020**: O tamanho aceito da nota MUST ser o mesmo que o produto atual já aceita. A plataforma MUST NOT criar um limite novo. O produto atual não impõe um teto próprio além de exigir nota preenchida.
- **FR-021**: Abrir uma sessão com permissão MUST mostrar o resumo, "Suas anotações" e, quando existir, "Resumo estruturado". Cada bloco com texto MUST poder ser copiado, com a confirmação "Notas copiadas".
- **FR-022**: Uma sessão gravada no aplicativo MUST aparecer só com a transcrição e o resumo estruturado quando ele existir. A plataforma MUST NOT oferecer o arquivo de áudio, a duração nem a reprodução.
- **FR-023**: Sessão sem permissão MUST mostrar "Você não tem acesso a esta sessão." e MUST NOT mostrar o conteúdo clínico.
- **FR-024**: A lista de sessões MUST oferecer os filtros do aplicativo: terapeutas, pacientes e período, com os recortes Hoje, Última semana, Últimos 15 dias e Último mês, inclusive "Filtrar por mim". Data inicial e data final MUST ser informadas juntas.
- **FR-025**: Documentos MUST poder ser listados, enviados, abertos e removidos com os mesmos tipos, o limite de 20 MB, o nome de até 120 caracteres e as permissões do aplicativo. A aba só existe para quem está na equipe de cuidado. Paciente inativo não aceita alteração de documento.
- **FR-026**: A terapeuta MUST poder listar relatórios de jornada, criar um escolhendo o paciente e acompanhando a configuração até o detalhe, e abrir um relatório existente. Sem paciente ou sem sessão elegível, o estado MUST explicar o que falta e MUST NOT inventar um relatório.
- **FR-027**: A geração de relatório MUST lembrar que o relatório apoia a análise profissional e não substitui o julgamento clínico.
- **FR-028**: Quando a clínica é compartilhada, as configurações MUST mostrar informações da clínica e gestão de terapeutas, incluindo convites pendentes. Convites recebidos MUST ficar na conta, com a contagem pendente, e MUST poder ser aceitos ou recusados.
- **FR-029**: A plataforma MUST respeitar somente os papéis já existentes: Gerenciar permissões, Adicionar paciente, Adicionar terapeuta, Remover terapeuta, Vincular ou desvincular paciente de terapeuta, Acesso a todos os pacientes e Ver anotações de colegas apenas nos pacientes que a pessoa atende. MUST NOT criar papel novo.
- **FR-030**: Acesso a todos os pacientes MUST NOT conceder permissão de editar nem de atender. Ver anotações de colegas MUST valer apenas nos pacientes que a pessoa atende.
- **FR-031**: Quem não tem o papel MUST NOT ver a ação como disponível. Se a ação for recusada, a mensagem MUST ser de permissão e MUST NOT vazar dado clínico.
- **FR-032**: Configurações da conta MUST incluir detalhes da conta, plano e sair. Basic MUST abrir a comparação de planos. Plus e Pro MUST abrir a assinatura atual. Planos, ciclos, limites, preços e o caminho de upgrade MUST ser os mesmos do aplicativo.
- **FR-033**: Limites de plano já aplicados pelo produto atual MUST bloquear a ação correspondente com a mesma comunicação do aplicativo: novos pacientes no consultório pessoal, relatórios de jornada por mês e clínicas adicionais. A criação de sessão MUST NOT ganhar uma cota de quantidade que o produto atual não tem.
- **FR-034**: A terapeuta MUST poder criar uma clínica adicional quando o plano já permite, com nome, CNPJ e endereço obrigatórios.
- **FR-035**: A plataforma MUST NOT oferecer gravação de áudio, pedido de microfone, consentimento de gravação, envio de áudio, duração de gravação, reprodução de áudio, biometria ou bloqueio biométrico.
- **FR-036**: A plataforma MUST NOT incluir a página institucional, o portal administrativo, métricas de fundador nem capacidade que o aplicativo não tem hoje, fora das três ausências já definidas.

### Key Entities *(include if feature involves data)*

- **Terapeuta**: A pessoa que usa a plataforma. Tem a mesma conta do aplicativo, com e-mail, senha, confirmação, nome, sobrenome, especialidade, foto opcional e plano.
- **Clínica**: O contexto do trabalho. Pode ser o consultório pessoal ou uma clínica compartilhada, com nome, CNPJ, endereço, membros, convites e a clínica selecionada no momento.
- **Papel na clínica**: Uma permissão já existente concedida a um membro. Não há papel novo. Acesso amplo a pacientes não significa permissão de atender.
- **Paciente**: A pessoa atendida, com nome, sobrenome, data de nascimento, gênero, diagnóstico, condições adicionais, foto opcional, situação ativo ou inativo e equipe de cuidado quando a clínica é compartilhada.
- **Sessão**: Um atendimento com paciente, nota, data, início e fim. A nota escrita ocupa o mesmo lugar da nota transcrita. Pode ter resumo estruturado. Não carrega arquivo de áudio nesta plataforma, mesmo quando a sessão nasceu de uma gravação no aplicativo.
- **Documento do paciente**: Arquivo clínico com nome, tipo, autor e data, visível a quem está na equipe de cuidado.
- **Relatório de jornada**: Síntese de um paciente a partir das sessões elegíveis de um período e dos profissionais escolhidos. Não substitui o julgamento clínico.
- **Plano**: Basic, Plus ou Pro, com ciclo mensal ou anual e os limites já conhecidos do aplicativo para pacientes particulares, relatórios mensais e clínicas adicionais.
- **Convite**: Pedido pendente para uma terapeuta entrar numa clínica, visível para quem convidou e para quem recebeu.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em computador ou tablet com pelo menos 768 pixels de largura, uma terapeuta nova conclui cadastro, confirmação, onboarding, primeiro paciente e uma sessão escrita sem precisar do aplicativo, e essa sessão aparece no início, na lista de sessões e na ficha do paciente.
- **SC-002**: Abaixo de 768 pixels de largura, 100% das visitas mostram só o aviso para usar o aplicativo Teranova, e nenhum dado clínico fica acessível.
- **SC-003**: Nenhuma tela oferece microfone, gravação, duração de áudio, reprodução de áudio ou biometria.
- **SC-004**: Uma terapeuta que já conhece o aplicativo escolhe o paciente, escreve a nota, revisa o resumo e salva a sessão em menos de 3 minutos.
- **SC-005**: 100% das tentativas com nota vazia ou só com espaços permanecem na nota e explicam que ela precisa ser preenchida. Abandonar antes de salvar cria zero sessões.
- **SC-006**: Uma sessão gravada no aplicativo abre com a transcrição e, quando existir, o resumo estruturado, e o arquivo de áudio não é oferecido. Cada bloco com texto pode ser copiado, com confirmação.
- **SC-007**: Sem pacientes ou sem sessões suficientes, o relatório de jornada explica o que falta e não apresenta um relatório inventado.
- **SC-008**: Em uma revisão das telas de pacientes, sessões, documentos e relatórios, toda recusa de permissão usa a comunicação já conhecida do aplicativo e não exibe conteúdo clínico de outra pessoa.
- **SC-009**: O pedido de recuperação de senha apresenta o mesmo resultado para e-mail cadastrado e não cadastrado. O login inválido não revela qual dos dois dados está errado.
- **SC-010**: Basic abre a comparação de planos e Plus ou Pro abrem a assinatura atual, com os mesmos limites e o mesmo caminho de upgrade do aplicativo.
- **SC-011**: Depois de recarregar, a terapeuta autenticada continua no produto. Depois de sair, este navegador pede o acesso de novo.
- **SC-012**: Uma terapeuta no computador ou no tablet consegue, na mesma conta, tratar documentos, clínica compartilhada, convites e plano, além de sair, sem encontrar uma capacidade que o aplicativo não tenha hoje.

## Assumptions

- A referência de comportamento é o aplicativo Teranova já usado pela terapeuta. Onde esta especificação não detalha um gesto, vale o que esse aplicativo faz hoje. Não se cria regra clínica nova.
- A plataforma reutiliza os dados e as capacidades atuais de conta, paciente, sessão, clínica, relatório e plano. Não há um segundo cadastro clínico nem uma segunda fonte de dados. O modelo clínico não muda.
- A única alteração prevista no serviço já existente é permitir que o endereço desta plataforma use as capacidades da terapeuta. Criar sessão sem arquivo de áudio já é aceito: o obrigatório é a nota, e o áudio é opcional.
- A construção já está fechada e o planejamento não a reabre: página única no navegador, na mesma família do portal administrativo, com código separado. O acesso da terapeuta neste navegador é o mesmo modelo do aplicativo, permanece ao recarregar e é diferente do acesso do portal administrativo. Os nomes das ferramentas dessa decisão ficam para o planejamento, não para o comportamento descrito aqui.
- A sessão deste navegador é independente da sessão de outro navegador e da sessão do aplicativo. Sair encerra só este navegador.
- O onboarding obrigatório usa a lista atual de especialidades: Psicologia, Psicopedagogia, Fonoaudiologia, Nutrição, Fisioterapia, Musicoterapia, Terapia Ocupacional, Psicomotricidade, Educação Física, Acompanhamento Terapêutico, Supervisão Clínica e Outro.
- Os três primeiros passos acompanham a conclusão já calculada hoje: conta, primeiro paciente e primeira sessão. O texto do passo da sessão muda apenas para convidar a escrever, não a gravar.
- A criação de sessão não tem limite de quantidade por plano. Os limites atuais continuam sendo o de pacientes no consultório pessoal, o de relatórios de jornada por mês e o de clínicas adicionais. Se uma ação for recusada por limite de plano, a comunicação é a mesma do aplicativo e, no salvamento da sessão, a terapeuta permanece no resumo com a nota visível.
- O horário inicial sugerido no resumo segue a regra atual do aplicativo, descrita nos cenários desta especificação.
- Abrir um documento faz parte da capacidade que o aplicativo já tem e entra nesta versão junto com listar, enviar e remover.
- A foto da terapeuta, nos detalhes da conta, também é escolhida por arquivo no computador. Não se pede câmera.
- Excluir a conta continua disponível nos detalhes da conta, com a confirmação de que a perda de acesso aos dados é permanente e irreversível.
- Preços, ciclos e textos comerciais dos planos são os que o aplicativo exibe hoje, sem uma tabela nova.
- Fora desta versão: gravar ou reproduzir áudio, biometria, página institucional, portal administrativo, métricas de fundador e qualquer capacidade que o aplicativo não tenha hoje.
- A constituição do projeto ainda está no modelo em branco e não acrescentou princípio adicional a esta especificação.
