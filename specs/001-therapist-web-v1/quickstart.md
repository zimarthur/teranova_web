# Quickstart: Plataforma web da terapeuta (v1)

Prova manual da especificação contra o serviço que o aplicativo já usa. Os detalhes de campos estão em [data-model.md](data-model.md). As chamadas estão em [contracts/therapist-api.md](contracts/therapist-api.md).

## Pré-requisitos

- Node compatível com Vite 7.
- `teranova_backend` no ar, com `THERAPIST_WEB_ORIGIN=http://localhost:5174`.
- Uma conta de terapeuta que já exista no aplicativo, para a sessão gravada e para o plano.
- Navegador com largura ajustável.

## Subir

Na raiz de `teranova_web`:

```bash
npm install
npm run dev
```

O endereço local é `http://localhost:5174`. A variável da API aponta para o serviço da terapeuta, sem cookie de admin.

`npm run build` precisa passar a checagem de tipos. `npm test` cobre o portão de largura, as mensagens de autenticação, a nota vazia e a ficha sem editar nem iniciar sessão para quem não está na equipe.

## Cenários

1. **Celular.** Abaixo de 768 pixels, qualquer endereço mostra só o aviso do aplicativo Teranova. A rede não pede paciente, sessão ou relatório. Em 768 pixels ou mais, o produto volta.
2. **Conta.** Cadastrar, confirmar o código, completar nome, sobrenome e especialidade. Recarregar continua dentro. Sair pede o acesso de novo. Login errado diz "Credenciais inválidas". Recuperação segue o mesmo passo com e-mail existente ou não.
3. **Início.** Saudação, clínica, ações e sessões de hoje. Com passos incompletos, o passo da sessão convida a escrever e não fala em gravar.
4. **Paciente.** Cadastrar com os campos da especificação e uma foto JPEG, PNG ou WebP de até 5 MB. Abrir a ficha. Em clínica compartilhada, quem não está na equipe vê a ficha sem editar, sem nova sessão e sem a aba Documentos.
5. **Sessão escrita.** Escolher paciente, tentar avançar com nota vazia, escrever, ajustar data e horários, salvar. A sessão aparece no início, na lista e na ficha. Não há microfone nem duração. Recarregar antes de salvar não cria sessão. Falha de rede permanece no resumo com a nota visível.
6. **Sessão do aplicativo.** Abrir uma sessão gravada no app. Há transcrição e, se já existir, resumo estruturado. Não há arquivo de áudio. "Copiar notas" confirma "Notas copiadas". Sem permissão, a frase é "Você não tem acesso a esta sessão." e o texto clínico não aparece.
7. **Documentos.** Na equipe, enviar um PDF de até 20 MB, abrir e remover. Arquivo fora da regra explica o limite. Paciente inativo não aceita enviar nem remover.
8. **Relatório.** Sem sessão elegível, a configuração explica o que falta e não cria relatório. Com sessão elegível, gerar e abrir o detalhe. No limite do plano, a mensagem é a mesma do aplicativo.
9. **Clínica e plano.** Consultório pessoal não mostra gestão de clínica compartilhada. Basic abre a comparação. Plus ou Pro abrem a assinatura. Convite recebido mostra a contagem. Sair encerra este navegador.
10. **Ausências.** Percorrer entrada, início, paciente, sessão, relatório e configurações. Nenhuma tela oferece microfone, áudio ou biometria.
