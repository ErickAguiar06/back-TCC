# Instalação do Prisma 

```bash
cd api
npm i prisma -g (caso não tenha o prisma global baixado)
npm init -y
npx prisma init --datasource-provider mysql
```

# Baixe todas as dependencias de uma vez
```bash
npm install express cors dotenv prisma jsonwebtoken nodemailer bcrypt
```

# Necessário para teste local
- Altere o endereço do arquivo **.env** para:   
```js
ASAAS_API_KEY=(chave secreta da conta Asaas)
ASAAS_BASE_URL="https://sandbox.asaas.com/api/v3" (para ambiente sandbox, caso seja real altere isso)
SENDGRID_API_KEY=(chave da api)  (essa api é para chegar mensagem no email)
DATABASE_URL="mysql://root@localhost:3306/petshop?schema=public&timezone=UTC"

```

# Migrations
- Faremos a migração do banco de dados para o MySQL através do comando a seguir no terminal
```bash
npx prisma migrate dev --name init
```

# Se necessário use:
```bash
npx prisma generate
```

# Para adicionar os produtos no banco
```bash
npx prisma db seed
```

# Rodar o servidor 
```bash
npx nodemon
```
