const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const produtos = [
  // Produtos do magnus
   {
    nome: "Magnus Premium Cães Adultos Sabor Carne",
    descricao: "Ração seca para cães adultos sabor carne",
    preco: 120.50,
    alt: "Magnus Premium Cães Adultos"
  },
  {
    nome: "Magnus Original Cães Filhotes Sabor Frango",
    descricao: "Ração seca para cães filhotes sabor frango",
    preco: 98.90,
    alt: "Magnus Original Cães Filhotes"
  },
  {
    nome: "Origens Premium Especial Light Cães Adultos Portes Mini e Pequeno Sabor Frango e Cereais",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Energy Cães Adultos Sabor Frango e Cereais",
    descricao: "Suplemento Pet",
    preco: 227.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Light Cães Adultos Portes Médio e Grande Sabor Frango e Cereais",
    descricao: "Suplemento Pet",
    preco: 242.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Raças Específicas Cães Adultos Pit Bull e Rottweiler",
    descricao: "Ração Premium",
    preco: 257.20,
    alt: "Brinquedo para Cães"
  },
  {
    nome: "Origens Premium Especial Cães Adultos Sabor Carne e Cereais",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },

  // Proodutos do Premier (dog.html)
  {
    nome: "Ração Premier Pet Formula Frango Cães Adultos Raças Médias 15kg",
    descricao: "Ração Premium",
    preco: 220.40,
    alt: "Ração Premium"
  },
  {
    nome: "Ração Premier Fórmula Light para Cães Adultos Raças Grandes Sabor Frango 15kg",
    descricao: "Brinquedo para Cães",
    preco: 257.20,
    alt: "Brinquedo para Cães"
  },
  {
    nome: "Ração Premier Shih Tzu Raças Específicas Cães Adultos 1,0kg",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Ração Premier Seleção Natural Raças Pequenas Adultos Frango 10,1kg",
    descricao: "Suplemento Pet",
    preco: 227.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Ração Premier Seleção Natural Raças Pequenas Adultos Frango 10,1kg",
    descricao: "Suplemento Pet",
    preco: 242.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Ração Premier Para Cães Filhotes de Sabor Frango e Salmão 2,5kg",
    descricao: "Ração Premium",
    preco: 84.90,
    alt: "Ração Premium"
  },
  {
    nome: "Ração Premier Raças Específicas Yorkshire Filhotes 2,5kg",
    descricao: "Brinquedos para Cães",
    preco: 84.59,
    alt: "Brinquedo para Cães"
  },
  {
    nome: "Ração Premier Formula Cães Filhotes Raças Pequenas 20 kg",
    descricao: "Suplemento Pet",
    preco: 322.49,
    alt: "Suplemento Pet"
  },
  {
    nome: "Ração Premier Raças Específicas Cães Filhotes Shih Tzu – 1kg",
    descricao: "Suplemento Pet",
    preco: 39.49,
    alt: "Suplemento Pet"
  },
  {
    nome: "Ração Premier Filhote Raças Grandes",
    descricao: "Suplemento Pet",
    preco: 243.89,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Light Cães Adultos Portes Médio e Grande Sabor Frango e Cereais",
    descricao: "Suplemento Pet",
    preco: 242.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Raças Específicas Cães Adultos Pit Bull e Rottweiler",
    descricao: "Ração Premium",
    preco: 257.20,
    alt: "Ração Premium"
  },
  {
    nome: "Origens Premium Especial Cães Adultos Sabor Carne e Cereais",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },

  // Produtos do Origens (origens.html)
  {
    nome: 'Origens Premium Especial Cães Adultos Portes Mini e Pequeno Sabor Carne e Cereais',
    descricao: 'Ração Premium',
    preco: 220.40,
    alt: 'Ração Premium'
  },
  {
    nome: 'Origens Premium Especial Cães Adultos Sabor Frango e Cereais',
    descricao: 'Ração Premium',
    preco: 257.20,
    alt: 'Ração Premium'
  },
  {
    nome: 'Origens Premium Especial Cães Adultos Sabor Carne e Cereais',
    descricao: 'Suplemento Pet',
    preco: 37.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Origens Premium Especial Cães Adultos Porte Grande Carne e Cereais',
    descricao: 'Suplemento Pet',
    preco: 227.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Origens Premium Especial Cães Sênior Portes Médio e Grande Sabor Frango e Cereais',
    descricao: 'Suplemento Pet',
    preco: 242.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Origens Premium Especial Raças Específicas Cães Adultos Labrador e Golden Retriever',
    descricao: 'Ração Premium',
    preco: 220.40,
    alt: 'Ração Premium'
  },
  {
    nome: 'Origens Premium Especial Raças Específicas Cães Adultos Pit Bull e Rottweiler',
    descricao: 'Ração Premium',
    preco: 257.20,
    alt: 'Ração Premium'
  },
  {
    nome: 'Origens Premium Especial Light Cães Adultos Portes Mini e Pequeno Sabor Frango e Cereais',
    descricao: 'Suplemento Pet',
    preco: 37.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Origens Premium Especial Energy Cães Adultos Sabor Frango e Cereais',
    descricao: 'Suplemento Pet',
    preco: 227.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Origens Premium Especial Light Cães Adultos Portes Médio e Grande Sabor Frango e Cereais',
    descricao: 'Suplemento Pet',
    preco: 242.20,
    alt: 'Suplemento Pet'
  },

  // Produtos Fórmula Natural (form.html)
  {
    nome: 'Fórmula Natural Super Premium Fresh Meat Cães Filhotes Porte Médio Frango, Mandioca e Cúrcuma',
    descricao: 'Suplemento Pet',
    preco: 220.40,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Fórmula Natural Super Premium Fresh Meat Cães Adultos Portes Grande e Gigante Frango, Mandioca e Alecrim',
    descricao: 'Suplemento Pet',
    preco: 257.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Fórmula Natural Super Premium Fresh Meat Cão Sênior Portes Mini e Pequeno Frango, Tomate e Chá Verde',
    descricao: 'Suplemento Pet',
    preco: 37.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Fórmula Natural Fresh Meat Cães Adultos Light Portes Médio e Grande',
    descricao: 'Suplemento Pet',
    preco: 227.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Fórmula Natural Super Premium Fresh Meat Sensitive Cães Adultos',
    descricao: 'Suplemento Pet',
    preco: 242.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Fórmula Natural Super Premium Fresh Meat Controle De Peso Cães Adultos Portes Médio e Grande Frango, Abóbora e Cúrcuma',
    descricao: 'Suplemento Pet',
    preco: 220.40,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Fórmula Natural Super Premium Life Cães Filhotes Portes Médio e Grande Sabor Frango e Maçã',
    descricao: 'Suplemento Pet',
    preco: 257.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Fórmula Natural Super Premium Fresh Meat Controle De Peso Cães Adultos Portes Mini e Pequeno Frango, Abóbora e Cúrcumas',
    descricao: 'Suplemento Pet',
    preco: 37.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Fórmula Natural Super Premium Life Cães Adultos Portes Mini e Pequeno Frango e Linhaça',
    descricao: 'Suplemento Pet',
    preco: 227.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Fórmula Natural Super Premium Life Cães Adultos Portes Médio e Grande Frango e Linhaça',
    descricao: 'Suplemento Pet',
    preco: 242.20,
    alt: 'Suplemento Pet'
  },

  // Produtos Gondel (cat.html)
  {
    nome: 'Ração Premier Pet Formula Frango Cães Adultos Raças Médias 15kg',
    descricao: 'Ração Premium',
    preco: 220.40,
    alt: 'Ração Premium'
  },
  {
    nome: 'Ração Premier Fórmula Light para Cães Adultos Raças Grandes Sabor Frango 15kg',
    descricao: 'Brinquedo para Cães',
    preco: 257.20,
    alt: 'Brinquedo para Cães'
  },
  {
    nome: 'Ração Premier Shih Tzu Raças Específicas Cães Adultos 1,0kg',
    descricao: 'Suplemento Pet',
    preco: 37.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Ração Premier Seleção Natural Raças Pequenas Adultos Frango 10,1kg',
    descricao: 'Suplemento Pet',
    preco: 227.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Ração Premier Seleção Natural Raças Pequenas Adultos Frango 10,1kg',
    descricao: 'Suplemento Pet',
    preco: 242.20,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Ração Premier Para Cães Filhotes de Sabor Frango e Salmão 2,5kg',
    descricao: 'Ração Premium',
    preco: 84.90,
    alt: 'Ração Premium'
  },
  {
    nome: 'Ração Premier Raças Específicas Yorkshire Filhotes 2,5kg',
    descricao: 'Brinquedos para Cães',
    preco: 84.59,
    alt: 'Brinquedo para Cães'
  },
  {
    nome: 'Ração Premier Formula Cães Filhotes Raças Pequenas 20 kg',
    descricao: 'Suplemento Pet',
    preco: 322.49,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Ração Premier Raças Específicas Cães Filhotes Shih Tzu – 1kg',
    descricao: 'Suplemento Pet',
    preco: 39.49,
    alt: 'Suplemento Pet'
  },
  {
    nome: 'Ração Premier Filhote Raças Grandes',
    descricao: 'Suplemento Pet',
    preco: 243.89,
    alt: 'Suplemento Pet'
  },

  // Produtos Gran Plus (cat2.html)
  {
    nome: "Menu Gato Adulto Salmão & Arroz",
    descricao: "Ração Premium",
    preco: 220.40,
    alt: "Ração Premium"
  },
  {
    nome: "Menu Gato Castrado Carne & Arroz",
    descricao: "Brinquedo para Cães",
    preco: 257.20,
    alt: "Brinquedo para Cães"
  },
  {
    nome: "Menu Gato Sênior Castrado Frango & Arroz",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Menu Gato Filhote Frango & Arroz",
    descricao: "Suplemento Pet",
    preco: 227.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Choice Gato Adulto Frango & Carne",
    descricao: "Suplemento Pet",
    preco: 242.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Gourmet Gato Castrado Ovelha & Arroz",
    descricao: "Ração Premium",
    preco: 84.90,
    alt: "Ração Premium"
  },
  {
    nome: "Gourmet Gato Castrado Peru & Arroz",
    descricao: "Brinquedos para Cães",
    preco: 84.59,
    alt: "Brinquedo para Cães"
  },
  {
    nome: "Gourmet Gato Filhote Sabor Salmão & Frango",
    descricao: "Suplemento Pet",
    preco: 322.49,
    alt: "Suplemento Pet"
  },
  {
    nome: "Menu Gato Castrado Atum & Arroz",
    descricao: "Suplemento Pet",
    preco: 39.49,
    alt: "Suplemento Pet"
  },
  {
    nome: "Menu Gato Adulto Frango & Arroz",
    descricao: "Suplemento Pet",
    preco: 243.89,
    alt: "Suplemento Pet"
  },

  // Brinquedos (brinquedos.html)
   {
    nome: "Brinquedo Macaco de Pelúcia Marrom Buddy Flicks para Cães",
    descricao: "Brinquedo para Cães",
    preco: 35.91,
    alt: "Ração Premium"
  },
  {
    nome: "Brinquedo Macaco de Pelúcia Preto Buddy Flicks para Cães",
    descricao: "Brinquedo para Cães",
    preco: 35.91,
    alt: "Brinquedo para Cães"
  },
  {
    nome: "Mordedor Pelúcia Big Duck Jambo",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Brinquedo Mordedor Sustentável Wood Amicus",
    descricao: "Suplemento Pet",
    preco: 38.16,
    alt: "Suplemento Pet"
  },
  {
    nome: "Brinquedo Comedouro Amicus Crazy Ball Azul e Branca",
    descricao: "Suplemento Pet",
    preco: 29.99,
    alt: "Suplemento Pet"
  },
  {
    nome: "Brinquedo Bolinha Cordão Flicks",
    descricao: "Ração Premium",
    preco: 14.90,
    alt: "Ração Premium"
  },
  {
    nome: "Pelúcia Monkey Fleece Jambo Bege",
    descricao: "Brinquedo para Cães",
    preco: 59.95,
    alt: "Brinquedo para Cães"
  },
  {
    nome: "Bolinha Mini Travinha 2 Unidades Animania Verde e Azul",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Brinquedo Interativo Labirinto Verde Pet Games",
    descricao: "Suplemento Pet",
    preco: 62.81,
    alt: "Suplemento Pet"
  },
  {
    nome: "Bolinha de Pontas Grande Azul Jambo",
    descricao: "Suplemento Pet",
    preco: 27.51,
    alt: "Suplemento Pet"
  },

  // Produtos do tartaruga.json
   {
    nome: "Origens Premium Especial Light Cães Adultos Portes Mini e Pequeno Sabor Frango e Cereais",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Energy Cães Adultos Sabor Frango e Cereais",
    descricao: "Suplemento Pet",
    preco: 227.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Light Cães Adultos Portes Médio e Grande Sabor Frango e Cereais",
    descricao: "Suplemento Pet",
    preco: 242.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Raças Específicas Cães Adultos Pit Bull e Rottweiler",
    descricao: "Ração Premium",
    preco: 257.20,
    alt: "Brinquedo para Cães"
  },
  {
    nome: "Origens Premium Especial Cães Adultos Sabor Carne e Cereais",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Cães Adultos Sabor Carne e Cereais",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Cães Adultos Sabor Carne e Cereais",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Cães Adultos Sabor Carne e Cereais",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Cães Adultos Sabor Carne e Cereais",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },
  {
    nome: "Origens Premium Especial Cães Adultos Sabor Carne e Cereais",
    descricao: "Suplemento Pet",
    preco: 37.20,
    alt: "Suplemento Pet"
  },

  // Produtos do roedores.json
  {
        "id": 111,
        "nome": "Ração Funny Bunny Delícias da Horta Supra ",
        "descricao": "",
        "preco": 52.56,
        "precoAntigo": 59.90,
        "imagem": "https://cobasi.vteximg.com.br/arquivos/ids/1062387-368-368/Racao-Funny-Bunny-18kg.png?v=638833439633530000",
        "alt": "Funny Bunny",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 112,
        "nome": "Ração Funny Bunny Roedores Blend Supra ",
        "descricao": "",
        "preco": 24.18,
        "precoAntigo": 22.90,
        "imagem": "https://cobasi.vteximg.com.br/arquivos/ids/1062389-368-368/Funny-Bunny-Blend-500g.png?v=638827591771830000",
        "alt": "Funny Bunny",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 113,
        "nome": "Ração Funny Bunny Chinchila Supra",
        "descricao": "",
        "preco": 22.36,
        "precoAntigo": 24.90,
        "imagem": "https://cobasi.vteximg.com.br/arquivos/ids/1062388-368-368/Funny-Bunny-Chinchila.png?v=638640753837000000",
        "alt": "Funny Bunny",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 114,
        "nome": "Ração Funny Bunny Blend Para Coelho Hamsters ",
        "descricao": "",
        "preco": 22.50,
        "precoAntigo": 25.00,
        "imagem": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTV-Qnz8vMGH6n5sT5Hetrv0YxbSKSjdtd5Zu-4_yTQ53bk8nQlNgnHuTIPpztrmR2zDkMdaXebJIhBakA-Nk55kQm8cxo_KerKHyiHezG-29bQ1PApGI1AqQ",
        "alt": "Funny Bunny",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 115,
        "nome": "Kit 3 Ração Funny Bunny Delicias Da Horta - 500g em Promoção",
        "descricao": "",
        "preco": 75.50,
        "precoAntigo": 80.00,
        "imagem": "https://i.zst.com.br/thumbs/12/13/2f/2004373973.jpg",
        "alt": "Funny Bunny",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 116,
        "nome": "Kit 4 Rações coelho, hamsters e roedores Funny Bunny 500gr",
        "descricao": "",
        "preco": 199.90,
        "precoAntigo": 202.00,
        "imagem": "https://a-static.mlcdn.com.br/1500x1500/kit-4-racoes-coelho-hamsters-e-roedores-funny-bunny-500gr-supra-pets/pirapopets/funnybunny-dlchorta500gr-4pct/d9dfe6f1cd63740dd41efb8b9eccd4ce.jpeg",
        "alt": "Funny Bunny",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 117,
        "nome": "Ração Nutrópica para Coelho Adulto Super Premium",
        "descricao": "",
        "preco": 86.31,
        "precoAntigo": 95.90,
        "imagem": "https://cobasi.vteximg.com.br/arquivos/ids/1048320-368-368/Racao-Nutropica-para-Coelho-Adulto-Super-Premium.png?v=638738612391800000",
        "alt": "Nutrópica",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 118,
        "nome": "Ração Nutrópica para Coelhos Filhotes",
        "descricao": "",
        "preco": 89.91,
        "precoAntigo": 99.90,
        "imagem": "https://cobasi.vteximg.com.br/arquivos/ids/1049868-368-368/Novo-Projeto-Coelho-Filhote.png?v=638289227484130000",
        "alt": "Nutrópica",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 119,
        "nome": "Ração Nutrópica Extrusada Natural para Coelhos Adultos",
        "descricao": "",
        "preco": 77.31,
        "precoAntigo": 85.90,
        "imagem": "https://cobasi.vteximg.com.br/arquivos/ids/1050380-368-368/Nutropica-Extrusada-Coelho.png?v=638304047139770000",
        "alt": "Nutrópica",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 120,
        "nome": "Ração Nutrópica para Hamster Muesli",
        "descricao": "",
        "preco": 44.90,
        "precoAntigo": 39.90,
        "imagem": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRmd-COBfvmrc4HnfG681GKgoeryqwq5GHq8kD-Shmxs1WAj1vFOI-0q1lB-2a31jAZsFIfmxn7lY3o2njSmrTOFsNcBJcUPrpbKS4V39w07jRTb7m5VpLb",
        "alt": "Nutrópica",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 121,
        "nome": "Ração Nutrópica para Twister",
        "descricao": "",
        "preco": 315.90,
        "precoAntigo": 340.00,
        "imagem": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ4irYMXXv_RDi00Sbm6GlYMoyONMC978o1I3BOYM9h18ZnvJKAO8XMdPTvLvBC845ygvse_0uu32FgClufZUiv-bxdurSk18NSSrLgnNaPKWQAyF1qybVQ",
        "alt": "Nutrópica",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 122,
        "nome": "Ração Nutrópica Twister Gourmet",
        "descricao": "",
        "preco": 47.99,
        "precoAntigo": 54.00,
        "imagem": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSFscvXwc7k4CRqNWxy233Dzc0WpsK8CgLGaX1IdnItIEjRiR2B4mm5MsQdjBX2Fe4ZQxJuoAe_2uR0cyQ1FuSEKQOitZ9ApRZTavZXM5VPY8H4AdyfzDhKBN0",
        "alt": "Nutrópica",
        "button": "Adicionar ao Carrinho"
    },

    // Produtos do fishing.json
    
    {
        "id": 81,
        "nome": "Alimento completo para peixes ornamentais.",
        "descricao": "Alimento completo para peixes ornamentais.",
        "preco": 25.90,
        "precoAntigo": 32.00,
        "imagem": "assets/img/alcon.webp",
        "alt": "Alcon Allium",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 82,
        "nome": "Alcon Club Carpas",
        "descricao": "Ração especial para carpas e peixes de lago.",
        "preco": 39.50,
        "precoAntigo": 45.00,
        "imagem": "assets/img/alcon1.webp",
        "alt": "Alcon Thymus",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 83,
        "nome": "Alcon Flocos Ornamentais",
        "descricao": "Alcon Herbal",
        "preco": 18.90,
        "precoAntigo": 22.00,
        "imagem": "assets/img/alcon2.webp",
        "alt": "Alcon Herbal",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 84,
        "nome": "Alcon Betta",
        "descricao": "Alimento completo em flocos para peixes filhotes.",
        "preco": 12.50,
        "precoAntigo": 15.00,
        "imagem": "assets/img/alcon3.webp",
        "alt": "Alcon Alevinos",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 85,
        "nome": "Alcon Granulado Kinguios",
        "descricao": "Ração granulada para Kinguios.",
        "preco": 21.00,
        "precoAntigo": 26.00,
        "imagem": "assets/img/alcon4.webp",
        "alt": "Alcon Basic Tabs",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 86,
        "nome": "Alcon Fundo",
        "descricao": "Ração para peixes de fundo.",
        "preco": 19.90,
        "precoAntigo": 24.00,
        "imagem": "assets/img/alcon5.webp",
        "alt": "Alcon Shaimp",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 87,
        "nome": "Alcon Mix Aquário",
        "descricao": "Ração mix para peixes de aquário.",
        "preco": 29.90,
        "precoAntigo": 35.00,
        "imagem": "assets/img/alcon6.webp",
        "alt": "Alcon Colours",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 88,
        "nome": "Alcon Natural",
        "descricao": "Ração natural para peixes.",
        "preco": 34.90,
        "precoAntigo": 40.00,
        "imagem": "assets/img/alcon7.webp",
        "alt": "Alcon Spirulina",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 89,
        "nome": "Alcon Neon",
        "descricao": "Ração colorida para peixes ornamentais.",
        "preco": 22.90,
        "precoAntigo": 28.00,
        "imagem": "assets/img/alcon10.png",
        "alt": "Alcon Neon",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 90,
        "nome": "Alcon Premium",
        "descricao": "Ração premium para peixes de aquário.",
        "preco": 44.90,
        "precoAntigo": 52.00,
        "imagem": "assets/img/Alcon9.webp",
        "alt": "Alcon Basic",
        "button": "Adicionar ao Carrinho"
    },
      {
        "id": 90,
        "nome": "Alcon Premium",
        "descricao": "Ração premium para peixes de aquário.",
        "preco": 44.90,
        "precoAntigo": 52.00,
        "imagem": "assets/img/Alcon9.webp",
        "alt": "Alcon Basic",
        "button": "Adicionar ao Carrinho"
    },
      {
        "id": 90,
        "nome": "Alcon Premium",
        "descricao": "Ração premium para peixes de aquário.",
        "preco": 44.90,
        "precoAntigo": 52.00,
        "imagem": "assets/img/Alcon9.webp",
        "alt": "Alcon Basic",
        "button": "Adicionar ao Carrinho"
    },

    // Produtos dos peixes (produtos.json)

    {
        "id": 101,
        "nome": "Alimento completo para peixes ornamentais.",
        "descricao": "Alimento completo para peixes ornamentais.",
        "preco": 25.90,
        "precoAntigo": 32.00,
        "imagem": "assets/img/prod.jpeg",
        "alt": "Alcon Allium",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 102,
        "nome": "Alcon Club Carpas",
        "descricao": "Ração especial para carpas e peixes de lago.",
        "preco": 39.50,
        "precoAntigo": 45.00,
        "imagem": "assets/img/prod1.jpg",
        "alt": "Alcon Thymus",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 103,
        "nome": "Alcon Flocos Ornamentais",
        "descricao": "Alcon Herbal",
        "preco": 18.90,
        "precoAntigo": 22.00,
        "imagem": "assets/img/prod2.jpg",
        "alt": "Alcon Herbal",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 104,
        "nome": "Alcon Betta",
        "descricao": "Alimento completo em flocos para peixes filhotes.",
        "preco": 12.50,
        "precoAntigo": 15.00,
        "imagem": "assets/img/prod3.jpg",
        "alt": "Alcon Alevinos",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 105,
        "nome": "Alcon Granulado Kinguios",
        "descricao": "Ração granulada para Kinguios.",
        "preco": 21.00,
        "precoAntigo": 26.00,
        "imagem": "assets/img/prod4.jpg",
        "alt": "Alcon Basic Tabs",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 106,
        "nome": "Alcon Fundo",
        "descricao": "Ração para peixes de fundo.",
        "preco": 19.90,
        "precoAntigo": 24.00,
        "imagem": "assets/img/prod5.jpg",
        "alt": "Alcon Shaimp",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 107,
        "nome": "Alcon Mix Aquário",
        "descricao": "Ração mix para peixes de aquário.",
        "preco": 29.90,
        "precoAntigo": 35.00,
        "imagem": "assets/img/prod6.jpg",
        "alt": "Aquário Boyu Led EA-80E 95L",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 108,
        "nome": "Alcon Natural",
        "descricao": "Ração natural para peixes.",
        "preco": 34.90,
        "precoAntigo": 40.00,
        "imagem": "assets/img/prod7.jpg",
        "alt": "Aquário Boyu 60 99 Litros",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 109,
        "nome": "Alcon Neon",
        "descricao": "Ração colorida para peixes ornamentais.",
        "preco": 22.90,
        "precoAntigo": 28.00,
        "imagem": "assets/img/prod8.jpg",
        "alt": "Aquário Curvo Led EA-60E 68L",
        "button": "Adicionar ao Carrinho"
    },
    {
        "id": 110,
        "nome": "Alcon Premium",
        "descricao": "Ração premium para peixes de aquário.",
        "preco": 44.90,
        "precoAntigo": 52.00,
        "imagem": "assets/img/prod9.jpg",
        "alt": "Aquário de Vidro Retangular",
        "button": "Adicionar ao Carrinho"
    },
     {
        "id": 110,
        "nome": "Alcon Premium",
        "descricao": "Ração premium para peixes de aquário.",
        "preco": 44.90,
        "precoAntigo": 52.00,
        "imagem": "assets/img/prod9.jpg",
        "alt": "Aquário de Vidro Retangular",
        "button": "Adicionar ao Carrinho"
    },
     {
        "id": 110,
        "nome": "Alcon Premium",
        "descricao": "Ração premium para peixes de aquário.",
        "preco": 44.90,
        "precoAntigo": 52.00,
        "imagem": "assets/img/prod9.jpg",
        "alt": "Aquário de Vidro Retangular",
        "button": "Adicionar ao Carrinho"
    },

    // Negocios.json
    {
    "id": 1,
    "nome": "Banho Completo",
    "descricao": "Banho com produtos especiais para saúde da pele e pelos.",
    "preco": 50.00,
    "precoAntigo": 65.00,
    "imagem": "assets/img/banho.jpg",
    "alt": "Banho em cachorro",
    "button": "Agendar"
  },
  {
    "id": 2,
    "nome": "Banho & Tosa",
    "descricao": "Tosa higiênica para maior conforto e bem-estar.",
    "preco": 100.00,
    "precoAntigo": 110.00,
    "imagem": "assets/img/tosa.jpg",
    "alt": "Tosa em cachorro",
    "button": "Agendar"
  },
  {
    "id": 3,
    "nome": "Tosa na Tesoura",
    "descricao": "Atendimento completo com médico veterinário especializado.",
    "preco": 130.00,
    "precoAntigo": 140.00,
    "imagem": "assets/img/tosa_na_tesoura.webp",
    "alt": "Consulta veterinária",
    "button": "Agendar"
  },
    {
    "id": 4,
    "nome": "Consulta Veterinária",
    "descricao": "Atendimento completo com médico veterinário especializado.",
    "preco": 120.00,
    "precoAntigo": 150.00,
    "imagem": "assets/img/vete.jpg",
    "alt": "Consulta veterinária",
    "button": "Agendar"
  },

  // Rações para passáros (bird.json)
  {
    "id": 121,
    "nome": "Ração para Calopsita Mix Megazoo 300 g",
    "descricao": "Ração Nutrópica Calopsita Gourmet 300 g",
    "preco": 40.41,
    "precoAntigo": 43.90,
    "imagem": "assets/img/pas6.webp",
    "alt": "Nutrópica",
    "button": "Adicionar ao Carrinho"
  },
  {
    "id": 122,
    "nome": "Ração Nutrópica para Calopsita Extrusado Natural Mini Bits 5 Kg",
    "preco": 269.99,
    "precoAntigo": 289.99,
    "imagem": "assets/img/pas3.png",
    "alt": "Nutrópica",
    "button": "Adicionar ao Carrinho"
  },
  {
    "id": 123,
    "nome": "Ração Nutrópica Extrusado Natural para Calopsitas 300 g",
    "descricao": "A ração perfeita para sua tartaruga",
    "preco": 34.19,
    "precoAntigo": 37.90,
    "imagem": "assets/img/pas2.webp",
    "alt": "Nutrópica",
    "button": "Adicionar ao Carrinho"
  },
  {
    "id": 124,
    "nome": "Ração Nutrópica Sementes e Extrusados Natural para Calopsitas 2,5 kg",
    "descricao": "A ração perfeita para sua tartaruga",
    "preco": 86.00,
    "precoAntigo": 94.90,
    "imagem": "assets/img/pas4.webp",
    "alt": "Nutrópica",
    "button": "Adicionar ao Carrinho"
  },
  {
    "id": 125,
    "nome": "Ração Nutrópica Sementes e Extrusados Natural para Calopsitas 300 g",
    "preco": 38.90,
    "precoAntigo": 44.90,
    "imagem": "assets/img/pas5.webp",
    "alt": "Nutrópica",
    "button": "Adicionar ao Carrinho"
  },
  {
    "id": 126,
    "nome": "Natural Papagaio Nutrópica 600 g",
    "descricao": "A ração perfeita para sua tartaruga",
    "preco": 24.90,
    "precoAntigo": 29.90,
    "imagem": "assets/img/pas11.webp",
    "alt": "Nutrópica",
    "button": "Adicionar ao Carrinho"
  },
  {
    "id": 127,
    "nome": "Ração Extrusada Megazoo para Calopsitas Soft 350 g",
    "preco": 49.90,
    "precoAntigo": 55.00,
    "imagem": "assets/img/pas7.jpg",
    "alt": "Megazoo",
    "button": "Adicionar ao Carrinho"
  },
  {
    "id": 128,
    "nome": "Ração Megazoo para Calopsitas e Periquitos",
    "descricao": "A ração perfeita para sua tartaruga",
    "preco": 31.99,
    "precoAntigo": 35.90,
    "imagem": "assets/img/pas8.jpg",
    "alt": "Megazoo",
    "button": "Adicionar ao Carrinho"
  },
  {
    "id": 129,
    "nome": "Ração Megazoo Mix Calopsitas Tropical",
    "descricao": "A ração perfeita para sua tartaruga",
    "preco": 56.79,
    "precoAntigo": 61.90,
    "imagem": "assets/img/pas9.jpg",
    "alt": "Megazoo",
    "button": "Adicionar ao Carrinho"
  },
  {
    "id": 130,
    "nome": "Ração Extrusada Megazoo Regular Bits para Calopsitas e Ring Necks",
    "descricao": "A ração perfeita para sua tartaruga",
    "preco": 36.90,
    "precoAntigo": 40.90,
    "imagem": "assets/img/pas10.jpg",
    "alt": "Megazoo",
    "button": "Adicionar ao Carrinho"
  },
  {
    "id": 131,
    "nome": "Ração Extrusada Megazoo Regular Bits para Calopsitas e Ring Necks",
    "descricao": "A ração perfeita para sua tartaruga",
    "preco": 24.90,
    "precoAntigo": 24.90,
    "imagem": "assets/img/pas1.png",
    "alt": "Megazoo",
    "button": "Adicionar ao Carrinho"
  },
  {
    "id": 132,
    "nome": "Ração Extrusada Megazoo para Papagaio Regular 600g",
    "descricao": "A ração perfeita para sua tartaruga",
    "preco": 38.60,
    "precoAntigo": 44.90,
    "imagem": "assets/img/pas12.jpg",
    "alt": "Megazoo",
    "button": "Adicionar ao Carrinho"
  }
];

async function main() {
  await prisma.produto.createMany({
    data: produtos
  });
  console.log('Produtos inseridos com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });