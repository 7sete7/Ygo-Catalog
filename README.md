##Yigioh catalog

Este projeto visa catalogar de forma simples e intuitiva coleções da cartas de [Yiugioh](https://pt.wikipedia.org/wiki/Yu-Gi-Oh!).

####Passo a passo

- Instalar [nodejs](https://nodejs.org/en/download/);
- Instalar [mysql](https://www.mysql.com/);
- Criar uma sessão no banco de dados com as credenciais
> Host: localhost
  User: root
  Password: 1234
  
- Criar um banco de dados chamado **ygo-catalog**;
- Entrar na pasta backend via linha de comando;
- Executar os seguintes comandos:
  1.`$ node install`
  2.`$ node index`

[==========]

#####Passos para editar o código
- Mudar o que quiser nos arquivos **src/*.ts**
- Na pasta backend pelo shell digitar
  1.`$ tsc` para transpilar
  2.`$ node index` para executar
