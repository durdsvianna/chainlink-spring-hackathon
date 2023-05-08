#### Edital do Hackathon: https://docs.web3dev.com.br/pods/hackathon-pod-labs/edital-geral
#### Edital dos Temas e Premiações: https://docs.web3dev.com.br/pods/hackathon-pod-labs/edital-dos-temas

```
Nome da equipe: 
Nome dos integrantes:
Grants aplicados:
```

```
Nome do projeto:
Pitch:

## Marketplace de Atividades Web3Dev

## Arquitetura do sistema

# Adicionar Arquitetura MIRO

## Tecnologias

Esse projeto foi desenvolvido usando as seguintes tecnologias:

- React
- Mui
- Css
- TypeScript
- Node Js
- Hardhat
- Pinata
- Solidity

---

Descrição do produto:

Como testar/compilar o produto:

## Rodar Aplicação

Para testar/compilar é necessário ter o Node Js instalado na máquina.

Pré-requisito Instalação:

- Node Js

### Variáveis de ambiente

É necessário setar as seguintes variávei de ambiente no sistema:

## Frontend
- Crie um arquivo .env em frontend

```
REACT_APP_PINATA_AUTH="Bearer <senha>"
REACT_APP_PINATA_API_KEY="<senha>"
REACT_APP_PINATA_API_SECRET"<senha>"

```

## Testes Locais no Hardhat

- Pré-requisitos
    - Metamask configurada com nó Local Hardhat
    ```
    Network Name: Hardhat
    New RPC URL: http://127.0.0.1:8545/ — O ponto de acesso retornado ao rodar o nó local do hardhat
    Chain ID: 31337 —  ID Padrão do Hardhat, veja mais (aqui)[https://hardhat.org/hardhat-network/docs/reference]
    Currency Symbol: HardhatETH — Defina um simbolo que irá aparecer no seu LocalHost do Hardhat
    ```
1. Entre na pasta frontend

```
    cd frontend
```

2. Inicialize a aplicação

```
    npm run start
```

3. Entre na pasta de contracts/

```
    cd contracts
```

4. Inicialize o Nó Local do Hardhat

```
    npx hardhat node
```

5. Depois, execute o comando:

```
    npm run deploy
```

6. Envie faucet para seu endereço:
```
  npx hardhat --network localhost faucet <address>  
```

7. Interaja com o contrato criando uma atividade

---

Dificuldades:
Visão de futuro:
```


## Licença

Distributed under the MIT License. See `LICENSE` for more information.

## Colaboradores

<table>
  <tr>
    <td align="center">
      <a href="https://www.linkedin.com/in/">
        <img src="https://avatars.githubusercontent.com/u/19876786?v=4" width="100px;" alt="Daniel Vianna"/><br>
        <sub>
          <b>Daniel Vianna</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://www.linkedin.com/in/heron-lancellot">
        <img src="https://avatars.githubusercontent.com/u/57544272?v=4" width="100px;" alt="Heron Lancellot"/><br>
        <sub>
          <b>Heron Lancellot</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
