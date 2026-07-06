# Controle de Gastos Residenciais

API REST desenvolvida em ASP.NET Core como parte de um desafio técnico para uma vaga de estágio em Desenvolvimento C# .NET Full Stack.

O sistema permite cadastrar pessoas, registrar transações financeiras (receitas e despesas) e consultar relatórios com totais e saldos por pessoa.

> **Status:** Backend concluído e testado. Frontend em React + TypeScript será desenvolvido na próxima fase.

---

# Funcionalidades

* Cadastro de pessoas.
* Cadastro de transações financeiras.
* Listagem de pessoas.
* Listagem de transações.
* Exclusão de pessoas.
* Relatório de totais por pessoa.
* Relatório com totais gerais do sistema.

### Regras de negócio

* Pessoas menores de 18 anos podem registrar apenas **despesas**.
* Toda transação deve estar vinculada a uma pessoa existente.
* Ao excluir uma pessoa, suas transações são removidas automaticamente (Cascade Delete).
* O relatório apresenta:

  * Total de receitas por pessoa.
  * Total de despesas por pessoa.
  * Saldo individual.
  * Totais gerais do sistema.

---

# Tecnologias utilizadas

## Backend

* .NET 10
* ASP.NET Core Web API
* C#
* Entity Framework Core
* SQLite

## Frontend

* React
* TypeScript
* Vite *(em desenvolvimento)*

---

# Estrutura do projeto

```text
controle-gastos-residenciais/
│
├── backend/
│   ├── Controllers/
│   ├── DTOs/
│   ├── Data/
│   ├── Models/
│   ├── Migrations/
│   ├── Program.cs
│   └── appsettings.json
│
├── frontend/          (em desenvolvimento)
│
└── README.md
```

### Organização

* **Controllers** → Endpoints da API.
* **Models** → Entidades do domínio.
* **DTOs** → Objetos utilizados na comunicação da API.
* **Data** → Contexto do Entity Framework Core.
* **Migrations** → Histórico das alterações do banco de dados.

---

# Como executar o projeto

## Pré-requisitos

* .NET SDK 10
* EF Core CLI

Caso ainda não possua a ferramenta instalada:

```bash
dotnet tool install --global dotnet-ef
```

## Executando

Entre na pasta do backend:

```bash
cd backend
```

Restaure os pacotes:

```bash
dotnet restore
```

Crie o banco de dados utilizando as migrations:

```bash
dotnet ef database update
```

Execute a aplicação:

```bash
dotnet run
```

A API ficará disponível em:

```text
http://localhost:5044
```

Também é possível acessar a documentação da API pelo Swagger durante a execução.

---

# Endpoints

## Pessoas

| Método | Endpoint        | Descrição              |
| ------ | --------------- | ---------------------- |
| GET    | `/Pessoas`      | Lista todas as pessoas |
| POST   | `/Pessoas`      | Cadastra uma pessoa    |
| DELETE | `/Pessoas/{id}` | Remove uma pessoa      |

---

## Transações

| Método | Endpoint      | Descrição                 |
| ------ | ------------- | ------------------------- |
| GET    | `/Transacoes` | Lista todas as transações |
| POST   | `/Transacoes` | Cadastra uma transação    |

Validações:

* Retorna **404 Not Found** caso a pessoa informada não exista.
* Retorna **400 Bad Request** quando uma pessoa menor de idade tenta cadastrar uma receita.

---

## Relatórios

| Método | Endpoint             | Descrição                                                |
| ------ | -------------------- | -------------------------------------------------------- |
| GET    | `/Relatorios/totais` | Retorna os totais por pessoa e o resumo geral do sistema |

---

# Decisões técnicas

Durante o desenvolvimento foram adotadas algumas decisões de arquitetura visando manter o projeto simples, organizado e alinhado às boas práticas do ASP.NET Core.

### Utilização de `decimal`

Os valores financeiros são armazenados utilizando `decimal`, evitando problemas de precisão inerentes aos tipos de ponto flutuante (`float` e `double`).

### Utilização de Controllers

A API foi desenvolvida utilizando Controllers do ASP.NET Core, por serem adequados para APIs REST tradicionais e oferecerem boa organização dos endpoints.

### Uso de DTOs

As operações da API utilizam DTOs para separar o contrato HTTP das entidades do domínio, evitando expor diretamente as entidades do Entity Framework Core.

### Enum como texto no JSON

Foi configurado o `JsonStringEnumConverter`, permitindo que o cliente envie e receba valores como `"Receita"` e `"Despesa"` em vez de valores numéricos, tornando o contrato da API mais legível.

### Cascade Delete

O relacionamento entre Pessoa e Transação utiliza chave estrangeira com exclusão em cascata, garantindo a integridade referencial ao remover uma pessoa.

### Agregações realizadas no banco

Os cálculos de receitas e despesas são executados diretamente pelo banco de dados através das consultas geradas pelo Entity Framework Core, reduzindo a quantidade de dados carregados em memória. Apenas o cálculo final do saldo é realizado na aplicação, sobre uma coleção pequena de pessoas.

---

# Próximas etapas

* Desenvolvimento do frontend em React + TypeScript.
* Integração entre frontend e backend.
* Configuração de CORS.
* Refinamento da interface e experiência do usuário.

---

# Autor

Projeto desenvolvido por **Gabriel R.** como desafio técnico de estudo e avaliação para vaga de estágio em Desenvolvimento C# .NET Full Stack.
