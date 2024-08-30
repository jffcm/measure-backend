# Consumo de Água e Gás - Backend

Este projeto é um serviço de backend desenvolvido em Node.js com TypeScript para gerenciar leituras individualizadas de consumo de água e gás. A aplicação utiliza SQLite como banco de dados e oferece endpoints para upload de imagens, confirmação de leituras e listagem de medições. Além disso, o serviço integra com a API Gemini para processar imagens e obter as medições.


## Requisitos

- **Node.js**
- **Docker e Docker Compose instalados na sua máquina** 


## Instalação

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/measure-backend.git
    cd measure-backend
    ```


2. **Instale as dependências:**

    ```bash
    npm install
    ```


3. **Configuração do ambiente:**

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

    ```env
    GEMINI_API_KEY=sua_chave_api_gemini
    ```

   - `GEMINI_API_KEY`: Chave da API Gemini usada para processar imagens e obter medições.


4. **Suba a aplicação usando Docker Compose:**

    ```bash
    docker-compose up
    ```


## Endpoints Disponíveis

Abaixo estão os principais endpoints disponíveis na API:

### 1. `POST /upload`

**Descrição:** Recebe uma imagem em base64, consulta a API Gemini, e retorna a leitura.

#### Request

```http
POST /upload HTTP/1.1
Content-Type: application/json

{
  "image": "base64_encoded_image",
  "customer_code": "123456",
  "measure_datetime": "2024-08-01T15:00:00Z",
  "measure_type": "WATER"
}
```

#### Response

- **Status 200 - Sucesso**

  ```json
  {
    "image_url": "https://example.com/temp_image.jpg",
    "measure_value": 123,
    "measure_uuid": "abcd-1234-efgh-5678"
  }
  ```

- **Status 400 - Dados Inválidos**

  ```json
  {
    "error_code": "INVALID_DATA",
    "error_description": "Descrição do erro."
  }
  ```

- **Status 409 - Leitura Duplicada**

  ```json
  {
    "error_code": "DOUBLE_REPORT",
    "error_description": "Leitura do mês já realizada."
  }
  ```

### 2. `PATCH /confirm`

**Descrição:** Responsável por confirmar ou corrigir o valor lido pelo LLM.

#### Request

```http
PATCH /confirm HTTP/1.1
Content-Type: application/json

{
  "measure_uuid": "abcd-1234-efgh-5678",
  "confirmed_value": 130
}
```

#### Response

- **Status 200 - Sucesso**

  ```json
  {
    "success": true
  }
  ```

- **Status 400 - Dados Inválidos**

  ```json
  {
    "error_code": "INVALID_DATA",
    "error_description": "Descrição do erro."
  }
  ```

- **Status 404 - Leitura Não Encontrada**

  ```json
  {
    "error_code": "MEASURE_NOT_FOUND",
    "error_description": "Leitura não encontrada."
  }
  ```

- **Status 409 - Confirmação Duplicada**

  ```json
  {
    "error_code": "CONFIRMATION_DUPLICATE",
    "error_description": "Leitura do mês já realizada."
  }
  ```

### 3. `GET /<customer_code>/list`

**Descrição:** Lista as medições realizadas por um cliente, com opção de filtrar por tipo de medição.

#### Request

```http
GET /123456/list?measure_type=WATER HTTP/1.1
```

#### Response

- **Status 200 - Sucesso**

  ```json
  {
    "customer_code": "123456",
    "measures": [
      {
        "measure_uuid": "abcd-1234-efgh-5678",
        "measure_datetime": "2024-08-01T15:00:00Z",
        "measure_type": "WATER",
        "has_confirmed": true,
        "image_url": "https://example.com/image.jpg"
      },
      {
        "measure_uuid": "ijkl-9101-mnop-1213",
        "measure_datetime": "2024-08-02T16:00:00Z",
        "measure_type": "GAS",
        "has_confirmed": false,
        "image_url": "https://example.com/image2.jpg"
      }
    ]
  }
  ```

- **Status 400 - Tipo de Medição Inválido**

  ```json
  {
    "error_code": "INVALID_TYPE",
    "error_description": "Tipo de medição não permitida."
  }
  ```

- **Status 404 - Nenhum Registro Encontrado**

  ```json
  {
    "error_code": "MEASURES_NOT_FOUND",
    "error_description": "Nenhuma leitura encontrada."
  }
  ```
