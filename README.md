# pamii-leticia-carpes
Aula de Programação de Aplicativos Mobile II com o Professor João Siles

<br>

# 📱 Calculadora em React Native

Este projeto consiste no desenvolvimento de uma calculadora simples utilizando **React Native** e **TypeScript**, com foco em organização de código, componentização e uso de métodos da linguagem.

<br>

# Objetivo

O objetivo da aplicação é permitir que o usuário realize operações matemáticas básicas por meio de uma interface interativa, simulando uma calculadora.

Além disso, o projeto demonstra conceitos importantes como:
- Separação de componentes
- Gerenciamento de estado
- Manipulação de strings
- Uso de métodos do JavaScript/TypeScript

<br>

## Estrutura do Projeto

app/ <br>
├── components/ <br>
│ └── Botao.tsx <br>
└── index.tsx <br>

<br>

## Funcionalidades

- Inserção de números e operadores
- Cálculo de expressões matemáticas
- Limpar toda a expressão (`C`)
- Apagar último caractere (`⌫`)
- Validação de operadores
- Exibição de erros em expressões inválidas

<br>

## Métodos do JavaScript/TypeScript

O projeto utiliza alguns métodos importantes da linguagem:

- `map()` → Percorrer arrays e renderizar elementos na tela
- `slice()` → Manipular partes de strings
- `replace()` → Substituir caracteres em uma string
- `includes()` → Verificar se um valor existe em um array
- `eval()` → Executar uma expressão matemática

Esses métodos são fundamentais para manipulação de dados e lógica da aplicação.

<br>

## OBS:

- O uso de `eval()` foi aplicado para simplificar o cálculo das expressões.
- Em aplicações reais, seu uso deve ser feito com cautela por questões de segurança.

<br><br>

# Build Android com Expo + EAS

Este documento descreve o processo de geração de builds Android utilizando **Expo Application Services (EAS)**.

O projeto utiliza dois tipos principais de build:

* **Development Build:** utilizado durante o desenvolvimento e testes da aplicação.
* **Production Build:** utilizado para gerar o arquivo final (`.aab`) para publicação na Google Play Store.



## Pré-requisitos

Antes de iniciar, é necessário possuir:

* Node.js instalado
* Projeto Expo configurado
* Conta Expo
* Conta Google Play Console (para publicação)

<br>

## 1. Instalação do EAS CLI

Instale o EAS CLI globalmente:

```bash
npm install -g eas-cli
```

Verifique a instalação:

```bash
eas --version
```

<br>

## 2. Login na Expo

Faça login na conta Expo:

```bash
eas login
```

Verifique a conta conectada:

```bash
eas whoami
```

<br>

## 3. Configuração do EAS no projeto

Dentro da pasta do projeto execute:

```bash
eas build:configure
```

Esse comando cria o arquivo:

```
eas.json
```

responsável pelas configurações dos builds.

<br>

# Development Build

O Development Build cria uma versão da aplicação destinada ao desenvolvimento.

Ele permite testar funcionalidades nativas que não estão disponíveis no Expo Go, utilizando o pacote:

```
expo-dev-client
```

<br>

## 1. Instalar o Expo Dev Client

Execute:

```bash
npx expo install expo-dev-client
```

<br>

## 2. Configurar o eas.json

Adicione um perfil de desenvolvimento:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

Onde:

* `developmentClient` habilita o Expo Development Client.
* `distribution: internal` gera uma versão para testes internos.

<br>

## 3. Gerar Development Build

Execute:

```bash
eas build --platform android --profile development
```

Após finalizar, será gerado um aplicativo Android para testes.

Esse build pode ser instalado diretamente em dispositivos cadastrados.

<br>

## 4. Executar o projeto usando Development Build

Após instalar o aplicativo:

Execute:

```bash
npx expo start --dev-client
```

O projeto será iniciado utilizando o Development Client.

<br>

# Production Build (Google Play Store)

O Production Build gera o arquivo final que será enviado para a Play Store.

O resultado será um arquivo:

```
.aab
```

(Android App Bundle)

<br>

## 1. Configurar produção no eas.json

Exemplo:

```json
{
  "build": {
    "production": {}
  }
}
```

<br>

## 2. Gerar build de produção

Execute:

```bash
eas build --platform android --profile production
```

Durante o processo, o EAS:

* compila o aplicativo Android
* gera a assinatura do aplicativo
* cria o arquivo `.aab`

<br>

# Publicação na Google Play Console

Após o build finalizar:

1. Acesse a Google Play Console
2. Selecione o aplicativo
3. Vá em:

```
Produção → Criar nova versão
```

4. Faça upload do arquivo:

```
app-release.aab
```

5. Preencha as informações necessárias:

   * Nome do aplicativo
   * Descrição
   * Ícone
   * Imagens
   * Política de privacidade

6. Envie para análise.

<br>

## Fluxo resumido

### Desenvolvimento

```
Instalar dependências
        ↓
Configurar EAS
        ↓
Instalar expo-dev-client
        ↓
Gerar Development Build
        ↓
Testar aplicação
```

### Publicação

```
Código finalizado
        ↓
Production Build
        ↓
Arquivo .aab
        ↓
Google Play Console
        ↓
Aplicativo publicado
```

<br>

# Comandos principais

```bash
npm install -g eas-cli

eas login

eas build:configure

npx expo install expo-dev-client

# Desenvolvimento
eas build --platform android --profile development

# Produção
eas build --platform android --profile production
```





