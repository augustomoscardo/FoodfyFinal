# Desafio Foodfy

Desafio do último módulo do Bootcamp Launchbase.

```
Última atualização do projeto foi depois do prazo de entrega. 
A atualização foi para finalizar o seed.js! Não afeta o código do desafio, 
e não foi feito nenhuma alteração do código. Foi apenas para facilitar e 
agilizar a correção do desafio.
```

O Foodfy é uma aplicação de receitas culinárias. Nele você pode consultar as receitas cadastradas com a autoria de seus respectivos chefs, contendo os ingredientes necessários, modos de preparo e informações adicionais para você poder reproduzir essas receitas sem erro algum!


Para desenvolvimento da aplicação foram usados:
* Nunjucks
* Express
* Sessão de usuário
* Banco de dados (Postgres)
* Sistema de Login
* Multer para envio de imagens
* Hash para senhas
* Mailtrap para simulação de envio de email

De primeiro momento para usar a aplicação basta rodar o seed.js
```
node seed.js
```
Além popular as receitas no site, a seed irá criar usuários admin e usuários comum. Para facilitar o acesso, basta pegar um email de um usuário admin que a seed criou e no momento de realizar login selecionar a opção "Perdeu a senha?"


Para iniciar a aplicação:
```
npm start
```
A aplicação irá iniciar na rota inicial para todos. Para conseguir acessar a rota de admin, basta colocar após a rota de seu localhost: /admin/users/login
```
Ex:
http://localhost:3000/admin/users/login
```