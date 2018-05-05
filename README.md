## Yigioh catalog

Este projeto visa catalogar de forma simples e elegante coleções de cartas de [Yiugioh](https://pt.wikipedia.org/wiki/Yu-Gi-Oh!).

#### Passo a passo

- Instalar [nodejs](https://nodejs.org/en/download/);
- Instalar [mysql](https://www.mysql.com/);
- Criar uma sessão no banco de dados com as credenciais
> Host: localhost\
  User: root\
  Password: 1234

- Criar um banco de dados chamado **ygo-catalog**;
- Entrar na pasta backend via linha de comando;
- Executar o seguinte comando:
```sh
$ node install
```

#### Passos para editar o código
- Mudar o que quiser nos arquivos *src/.ts**
- Entrar a pasta backend pelo shell e:

Para transpilar para js:
```sh
$ tsc
```

Para executar:
```sh
$ node index
```
