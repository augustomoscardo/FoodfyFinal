# 🍽️ FoodFy - Bootcamp Launchbase

*Desafio do último módulo do Bootcamp Launchbase da [**Rocketseat**](https://rocketseat.com.br).*

# 📝 Descrição
O Foodfy é uma aplicação de receitas culinárias. Nele você pode consultar as receitas cadastradas com a autoria de seus respectivos chefs, contendo os ingredientes necessários, modos de preparo e informações adicionais para você poder reproduzir essas receitas sem erro algum!


## 💻 Tecnologias Utilizadas

* Nunjucks
* Express
* Express Session
* PostgresSQL
* Sistema de Login
* Multer para envio de imagens
* Bcryptjs para Hash de senhas
* Nodemailer para simulação de envio de email

# 🛠️ Instalação e Instruções
Segue algumas instruções e depedências necessárias para utilização da aplicação Foodyfy.

1. Instalar **Node.js** e **PostgreSQL**.
2. Clone este repositório e abra-o na IDE de sua preferência.
3. Instalar as dependências do projeto rodando o código abaixo no terminal:
```
npm i
```
4. Crie a estrutura do banco de dados que se encontra no arquivo "**foodfy.sql**".
5. É necessário configurar o usuário em senha do Postgres, veja como foi feito no arquivo "**src/config/db.js**".
6. Popule o banco de dados rodando o código abaixo no terminal:
```
node seed.js
```
7. Inicie a aplicação com:
```
npm start
```


# 🕹️ Usando Foodfy
A aplicação irá iniciar na rota inicial para todos os usuários. Para conseguir acessar a rota de admin, basta colocar após a rota de seu localhost: "/admin/users/login"
```
Ex:
http://localhost:3000/admin/users/login
```

Além de popular as receitas no site, a seed irá criar usuários admin e usuários comum. Para facilitar o acesso, basta pegar um email de um usuário admin que a seed criou e no momento de realizar login selecionar a opção "Perdeu a senha?"

# ⚠️ Atenção
Por favor, ao utilizar a aplicação, efetue o login como usuário administrativo e também como usuário comum. Existem funcionalidades específicas e botões que ficam ocultos quando um usuário comum estiver logado.

# 👷 Desenvolvimento
Projeto desenvolvido por [**Augusto Moscardo**](https://github.com/augustomoscardo).