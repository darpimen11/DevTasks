export interface TaskTemplate {
  id: string
  name: string
  content: string
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'bug-report',
    name: 'Bug Report',
    content: `## Comportamento Esperado
O que deveria acontecer?

## Comportamento Atual
O que está acontecendo (o erro)?

## Passos para Reproduzir
1. Acessar a página X
2. Clicar no botão Y
3. Ver o erro Z

## Informações Adicionais
* **Browser:** Chrome / Firefox / Safari
* **Versão:** v1.0.0
`
  },
  {
    id: 'feature-request',
    name: 'Feature Request',
    content: `## Qual é o problema?
Descreva o problema que esta feature visa resolver.

## Solução Proposta
Como a feature deve funcionar?

## Alternativas Consideradas
Quais outras soluções foram pensadas?

## Critérios de Aceite
- [ ] O usuário consegue fazer X
- [ ] O sistema retorna Y
`
  },
  {
    id: 'simple-task',
    name: 'Tarefa Simples',
    content: `## Objetivo
Breve descrição do objetivo desta tarefa.

## Checklist
- [ ] Passo 1
- [ ] Passo 2
`
  }
]
