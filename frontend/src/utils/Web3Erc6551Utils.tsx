import { useState, useEffect, SetStateAction } from 'react';

import type { Address } from 'wagmi'
import NftERC721Artifact from "src/contracts/NftERC721.json";
import implementationArtifact from "src/contracts/implementation.json";
import tokenboundArtifact from "src/contracts/tokenbound.json";
import { useNetwork } from 'wagmi';
import contractAddress from "src/contracts/contract-nfterc721-address.json";
import { ethers, Signer } from 'ethers';


// const { chains } = configureChains(
//   [hardhat],
//   [publicProvider()],
// )

const ipfsGateway = process.env.REACT_APP_IPFS_GATEWAY;
const tokenboundAddress = process.env.REACT_APP_TOKENBOUND_ADDRESS || "";
const implementationAddress = process.env.REACT_APP_IMPLEMENTATION_ADDRESS || "";
const salt = Number(process.env.REACT_APP_SALT) || 0;

const provider = new ethers.providers.Web3Provider(window.ethereum);  

const contract = new ethers.Contract(
  tokenboundAddress as `0x${string}`,
  tokenboundArtifact,
  provider.getSigner()
);

interface GetAccount {
  data?: string;
  error?: string;
}

export function useAccount(uploadJsonResult) {
  const [loading, setLoading] = useState(false);
  const { chain } = useNetwork();

  async function getAccount(tokenId: number, contractAddress: string): Promise<GetAccount> {
    try {
      const response = (contract.account(implementationAddress, chain.id, contractAddress, tokenId, salt)) as string;
  
      return { data: response };
    } catch (err) {
      console.error(err);
      // Sentry.captureMessage(`getAccount error`, {
      //   tags: {
      //     reason: "account",
      //   },
      //   extra: {
      //     prepareError: err,
      //     tokenId,
      //   },
      // });
  
      return { error: `failed getting account for token $id: {tokenId}` };
    }
  }
  

  return { loading, setLoading, getAccount }     
}

export function useBurnActivity() {
  const [loading, setLoading] = useState(false);
  const [ burn, setBurn ] = useState('');

  async function Burning(tokenId: string): Promise<void> {
    if (contract != null) {
      try {          
        const activityBurn = await contract.BurnNft(tokenId); 
        setBurn(activityBurn);
        console.log('Burning  = ', activityBurn);          
      } catch (error) {
        console.log("errors", error);
        return;
      } 
    }
  }

  return { loading, setLoading, burn, Burning  }     
}

