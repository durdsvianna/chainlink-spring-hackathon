import * as Sentry from "@sentry/react";
// import { rpcClient } from "src/models/viem";
import { erc6551AccountAbi, erc6551RegistryAbi } from "@tokenbound/sdk-ethers" ;
import { ethers } from "ethers";

// import implementationArtifact from "src/contracts/implementation.json";
import tokenboundArtifact from "src/contracts/tokenbound.json";
import { useNetwork } from 'wagmi';

const ipfsGateway = process.env.REACT_APP_IPFS_GATEWAY;
const tokenboundAddress = process.env.REACT_APP_TOKENBOUND_ADDRESS;
const implementationAddress = process.env.REACT_APP_IMPLEMENTATION_ADDRESS;
const salt = Number(process.env.REACT_APP_SALT) || 0;

const provider = new ethers.providers.Web3Provider(window.ethereum);

const contract = new ethers.Contract(
  tokenboundAddress as string,
  tokenboundArtifact,
  provider.getSigner()
); 
const { chain } = useNetwork();

interface GetAccountStatus {
  data?: boolean;
  error?: string;
}

export async function getAccountStatus(account: string): Promise<GetAccountStatus> {
  try {
    const response = (contract.isLocked(account)) as boolean;
  

    return { data: response };
  } catch (error) {
    console.error(error);
    Sentry.captureMessage(`getAccountStatus error`, {
      tags: {
        reason: "isLocked",
      },
      extra: {
        prepareError: error,
        account,
      },
    });

    return {
      error: `failed getting account status for account: ${account}. It may not exist yet.`,
    };
  }
}

interface GetAccount {
  data?: string;
  error?: string;
}

export async function getAccount(tokenId: number, contractAddress: string): Promise<GetAccount> {
  try {
    const response = (contract.account(implementationAddress, chain.id, contractAddress, tokenId, salt)) as string;

    return { data: response };
  } catch (err) {
    console.error(err);
    Sentry.captureMessage(`getAccount error`, {
      tags: {
        reason: "account",
      },
      extra: {
        prepareError: err,
        tokenId,
      },
    });

    return { error: `failed getting account for token $id: {tokenId}` };
  }
}
