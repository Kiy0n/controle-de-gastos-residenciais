# Controle de Gastos Residenciais

Aplicação full stack desenvolvida como parte de um desafio técnico para uma vaga de estágio em Desenvolvimento C# .NET Full Stack.

O sistema permite cadastrar pessoas, registrar transações financeiras (receitas e despesas) e consultar relatórios com totais e saldos por pessoa. O backend é uma API REST em ASP.NET Core e o frontend uma aplicação em React + TypeScript que consome essa API.

> **Status:** Projeto concluído. Backend em ASP.NET Core e frontend em React + TypeScript implementados e integrados.

---

# Funcionalidades

* Cadastro de pessoas (com identificador único gerado automaticamente).
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
* Vite
* React Router

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
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── App.tsx
│   └── package.json
│
└── README.md
```

### Organização do backend

* **Controllers** → Endpoints da API.
* **Models** → Entidades do domínio.
* **DTOs** → Objetos utilizados na comunicação da API (contrato HTTP).
* **Data** → Contexto do Entity Framework Core.
* **Migrations** → Histórico das alterações do banco de dados.

### Organização do frontend

* **pages** → Telas da aplicação (Pessoas, Transações, Relatórios).
* **services** → Camada de comunicação com a API.
* **types.ts** → Tipos TypeScript que espelham os contratos da API.

---

# Como executar o backend

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

Durante a execução, o documento OpenAPI da API fica disponível em `http://localhost:5044/openapi/v1.json`.

---

# Como executar o frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do frontend com a URL da API (use o `.env.example` como referência):

```text
VITE_API_BASE_URL=http://localhost:5044
```

Execute a aplicação:

```bash
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`. Certifique-se de que o backend esteja em execução para que a integração funcione.

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

Os valores financeiros são armazenados utilizando `decimal`, evitando os erros de arredondamento inerentes aos tipos de ponto flutuante (`float` e `double`), que representam números em base binária e não conseguem representar certos valores decimais com exatidão.

### Utilização de Controllers

A API foi desenvolvida utilizando Controllers do ASP.NET Core, por organizarem os endpoints por domínio (Pessoas, Transações, Relatórios) e serem adequados a APIs com múltiplas áreas distintas. Para uma API de endpoint único, Minimal API seria uma alternativa mais enxuta.

### Uso de DTOs

As operações da API utilizam DTOs para separar o contrato HTTP das entidades do domínio. Isso evita expor as entidades do Entity Framework Core diretamente e previne problemas como ciclos de serialização causados pelas propriedades de navegação.

### Enum como texto no JSON

Foi configurado o `JsonStringEnumConverter`, permitindo que o cliente envie e receba valores como `"Receita"` e `"Despesa"` em vez de valores numéricos, tornando o contrato da API mais legível.

### Escolha do SQLite

Foi utilizado o SQLite pela simplicidade: é um banco em arquivo único, sem necessidade de servidor dedicado, adequado ao escopo do desafio. A abstração do Entity Framework Core permite trocar o provedor de banco (por exemplo, para PostgreSQL ou SQL Server) com alterações mínimas no código.

### Cascade Delete

O relacionamento entre Pessoa e Transação utiliza chave estrangeira com exclusão em cascata, configurada automaticamente pela convenção do EF Core (chave estrangeira obrigatória), garantindo a integridade referencial ao remover uma pessoa.

### Agregações realizadas no banco

Os cálculos de receitas e despesas são executados diretamente pelo banco de dados através das consultas geradas pelo Entity Framework Core (LINQ traduzido para SQL), reduzindo a quantidade de dados carregados em memória. Apenas o cálculo final do saldo é realizado na aplicação, sobre uma coleção pequena de pessoas.

### Supressão de aviso de vulnerabilidade (NU1903)

O provedor SQLite do EF Core depende, de forma transitiva, do pacote nativo `SQLitePCLRaw.lib.e_sqlite3`, que possui uma vulnerabilidade conhecida (CVE-2025-6965) sem correção publicada na cadeia de pacotes no momento do desenvolvimento. Após análise, o aviso foi suprimido de forma cirúrgica, pois a falha (relacionada ao parsing de consultas de agregação específicas) não é explorável neste contexto, em que todas as consultas são geradas internamente pelo EF Core. A supressão está documentada no arquivo de projeto e deve ser removida quando uma versão corrigida for disponibilizada.

### CORS

O backend está configurado para permitir requisições apenas da origem do frontend (`http://localhost:5173`), em vez de liberar qualquer origem, mantendo a restrição de segurança que o CORS existe para garantir.

---

# Melhorias futuras

* Autenticação e autorização de usuários.
* Edição de transações.

---

# Autor

Projeto desenvolvido por **Gabriel R.** como desafio técnico para vaga de estágio em Desenvolvimento C# .NET Full Stack.