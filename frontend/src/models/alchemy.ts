import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: process.env.REACT_APP_PUBLIC_ALCHEMY_KEY,
  network:
    process.env.REACT_APP_PUBLIC_CHAIN_ID === "1"
      ? Network.ETH_MAINNET
      : Network.ETH_GOERLI,
};

export const alchemy = new Alchemy(config);

const configLens = {
  apiKey: process.env.REACT_APP_PUBLIC_ALCHEMY_KEY,
  network: Network.MATIC_MAINNET,
};

export const alchemyLens = new Alchemy(configLens);
