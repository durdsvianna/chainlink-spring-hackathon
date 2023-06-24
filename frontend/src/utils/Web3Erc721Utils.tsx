import { useState, useEffect, SetStateAction } from 'react';
import { useContract, useContractRead, useFeeData, useSigner, useAccount, useContractWrite, usePrepareContractWrite, useNetwork } from 'wagmi';
import type { Address } from 'wagmi'
import NftERC721Artifact from "src/contracts/NftERC721.json";
import contractAddress from "src/contracts/contract-nfterc721-address.json";
import { NftOrder } from 'src/models/nft_order';
import { useIpfsUploader } from "src/utils/IpfsUtils"
import { useWalletAddress } from 'src/utils/Web3Utils';
import { number } from 'prop-types';
import { ethers, Signer } from 'ethers';
import { configureChains } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { arDZ } from 'date-fns/locale';
import useSWR from "swr";
import { getNftAsset } from  "src/utils/nfts/index";

// const { chains } = configureChains(
//   [hardhat],
//   [publicProvider()],
// )

const ipfsGateway = process.env.REACT_APP_IPFS_GATEWAY;

const provider = new ethers.providers.Web3Provider(window.ethereum);  
const contract = new ethers.Contract(
  contractAddress.NftERC721,
  NftERC721Artifact.abi,
  provider.getSigner()
);

export function useMintToken(uploadJsonResult) {
  const [loading, setLoading] = useState(false);
  const [ isMinted, setIsMinted ] = useState(false);
  const [addressContract, setAddressContract] = useState<Address>(`0x${contractAddress.NftERC721.substring(2, contractAddress.NftERC721.length)}`)

  async function safeMint(to: string, tokenUri: string, amount: string): Promise<void> {
    if (contract != null) {
      try {          
        await contract.safeMint(addressContract, tokenUri, {value:ethers.utils.parseEther(amount)});
        setIsMinted(true);
        console.log("FINALIZOU O SAFEMINT")
      } catch (error) {
        console.log("errors", error);
        return;
      }       
    }
  }

  return { loading, setLoading, isMinted, safeMint }     
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

export function useContractApprovementActivity() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null)
 
  let getNextNonce = async (contract) => (await contract.nonce()).add(1);
        
  let getDigest = async (tokenId, nonce, amount, to) => {
    let txn = {tokenId, amount, to};
    let encoded = ethers.utils.defaultAbiCoder.encode(["tuple(uint256,address)"],  [[txn.tokenId, txn.amount, txn.to]]);
    let encodedWithNonce = ethers.utils.solidityPack(["bytes", "uint256"], [encoded, nonce]);
      
    let digest= ethers.utils.keccak256(encodedWithNonce);
    return digest;
  }

  let subjectMethod = async (signer, nonce, amount, tokenId, to, signatures) => {
    let txn = {tokenId, amount, to};
    await contract.connect(signer).approveActivity(contract.address, txn, nonce, signatures, {gasPrice: 8});
  }
  
  async function approveActivityMultisig(to: string, tokenId: number) {
    console.log("ENTROU NO HOOK")
    setLoading(true);
    if (contract != null) {
      try {          
        const amount = 2;
        let nonce = await getNextNonce(contract);
        let digest = await getDigest(tokenId, nonce, amount, to);
        let signers = [ provider.getSigner(0)];
        signers.sort((x, y) => x.getAddress() > y.getAddress()? 1: -1);
        let signatures = [];
        for (let signer of signers) {
          let sign = await signer.signMessage (ethers.utils.arrayify(digest)) ;
          signatures.push(sign);
        }

        await subjectMethod(provider.getSigner(0), nonce, amount, tokenId, to, signatures);
            
        //console.log('Check Leader  = ', leader);  
        //setLoading(false);
        
      } catch (error) {
        console.log("errors", error);
        setErrors(error);
        setLoading(false);        
      } 
    }
  }

  return {loading, setLoading, errors, approveActivityMultisig }
}

export function useContractAccessControl() {
  const { address, connector, isConnected } = useAccount();  
  
  const [loading, setLoading] = useState(false);
  const [ isMember, setIsMember ] = useState<boolean>(false);
  const [ isLeader, setIsLeader ] = useState<boolean>(false);

  async function checkLeader(): Promise<void> {        
    try {          
      const leader:boolean = await contract.checkAddressLeader(address); 
      setIsLeader(leader);
      console.log('Check Leader  = ', leader);          
    } catch (error) {
      console.log("errors", error);
      return;
    } 
      
  }

  return { loading, setLoading, isLeader, checkLeader }
}

export function useContractLoadTokenId(){  
  const { downloadJsonFromPinata, downloadListFromPinata } = useIpfsUploader();
  const [loading, setLoading] = useState(false);
  const [ data, setData ] = useState<NftOrder>(null);

  async function loadNft (tokenIdstr: string): Promise<void> {
    let tokenId = -1;
    if (tokenIdstr && tokenIdstr.length > 0){
      tokenId = +tokenIdstr;
    }
    console.log("tokenId", tokenId)
    if (contract != null && tokenId >= 0) {
      try {
        const uri = await contract.tokenURI(tokenId);
        const nftOwner = await contract.ownerOf(tokenId); 
        console.log("uri", uri)
        const activityJson = JSON.parse(await downloadJsonFromPinata(ipfsGateway+uri).then(result => result));
        let rewards:number 
        activityJson.attributes.forEach((attr: { trait_type: string; value: number; }) => {
          if (attr.trait_type == 'Rewards')
            rewards = attr.value;
        })            

        const nftOrder: NftOrder = 
          {
            owner: nftOwner,
            tokenId: tokenId,
            name: activityJson.name,
            description: activityJson.description,
            image: ipfsGateway + activityJson.image,
            status: 'Concluido',
            attributes: 'Comunidade',
            creatorActivity: 'Douglas',
            tag: 'tag#3',
            dateLimit: 'Dezembro',
            bounty: rewards,
            difficulty: 'Avancado',
          };         
        console.log("nftOrder", nftOrder);    
        setData(nftOrder);        
      } catch (error) {
        console.log("error", error);
        return;
      }
    }
  }

  return { data, loading, setLoading, loadNft}
}

export function useContractLoadLastNft() {
  const [loadingLastToken, setLoadingLastToken] = useState(false);
  const { downloadJsonFromPinata, downloadListFromPinata } = useIpfsUploader();    
  
  const [lastToken, setLastToken] = useState<NftOrder>(null);

  async function loadLastNft() : Promise<void>{
    if (contract != null) {
      try {
        const nftQuantity = await contract.idCounter();  
        const uri = await contract.tokenURI(nftQuantity.toNumber()-1);
        const nftOwner = await contract.ownerOf(nftQuantity.toNumber()-1); 
        const metadblata = downloadJsonFromPinata(ipfsGateway+uri).then(result => {
          const activityJson = JSON.parse(result);
          let rewards:string 
          let creator:string
          activityJson.attributes.forEach((attr: { trait_type: string; value: string; }) => {
            if (attr.trait_type == 'Rewards')
              rewards = attr.value;
            if (attr.trait_type == 'Creator')
              creator = attr.value;
          })            
          const nftOrder: NftOrder = 
            {
              owner: nftOwner,
              tokenId: nftQuantity.toNumber()-1,
              name: activityJson.name,
              description: activityJson.description,
              image: ipfsGateway + activityJson.image,
              status: 'Concluido',
              attributes: 'Comunidade',
              creatorActivity: creator,
              tag: 'tag#3',
              dateLimit: 'Dezembro',
              bounty: Number(rewards),
              difficulty: 'Avancado',
            };         
          setLastToken(nftOrder);  
        });        
      } catch (error) {
        console.log("error", error);
        return;
      }
    }
  }

  
  return { loadingLastToken, 
    setLoadingLastToken, 
    lastToken, 
    loadLastNft }
}

export function useContractLoadNfts() {
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const { downloadJsonFromPinata, downloadListFromPinata } = useIpfsUploader();    
  
  async function loadNfts () : Promise<NftOrder[]> {  
    if (contract != null) {
      try {          
        const nftQuantity = await contract.idCounter();  
        let lastsUriMints: [{tokenId: number; tokenUri: string, owner: string }] = [{tokenId: -1, tokenUri: '', owner: ''}];
        let max = nftQuantity.toNumber();

        setQuantity(max);
        console.log("quantity", quantity)
        for(let i = max ; i > 0; i--) {             
          const uri = await contract.tokenURI(nftQuantity.toNumber()-i);
          const nftOwner = await contract.ownerOf(nftQuantity.toNumber()-1); 
          lastsUriMints.push({
            tokenId: nftQuantity.toNumber()-i, 
            tokenUri: uri,
            owner:nftOwner
          })            
        }        
        console.log("lastsUriMints", lastsUriMints)
        let nfts: NftOrder[] = [];
        lastsUriMints.slice().reverse().forEach(async token => {          
          if (token.tokenId >= 0) {
            const activityJson = JSON.parse(await downloadJsonFromPinata(ipfsGateway+token.tokenUri).then(result => result));            
            let rewards:string 
            let creator:string
            activityJson.attributes.forEach((attr: { trait_type: string; value: string; }) => {
              if (attr.trait_type == 'Rewards')
                rewards = attr.value;
              if (attr.trait_type == 'Creator')
                creator = attr.value;
            })
            const nftOrder: NftOrder = 
              {
                owner: token.owner,
                tokenId: token.tokenId,
                name: activityJson.name,
                description: activityJson.description,
                image: ipfsGateway+activityJson.image,
                status: 'Concluido',
                attributes: 'Comunidade',
                creatorActivity: creator,
                tag: 'tag#3',
                dateLimit: 'Dezembro',
                bounty: parseInt(rewards),
                difficulty: 'Avancado',
              };
            nfts.push(nftOrder)               
          }            
        }); 
        return nfts;
      } catch (error) {
        console.log("error", error)
        return;
      }                       
    }
  }

  return { loading, 
           setLoading, 
           loadNfts,
           quantity
         }
}

export function useErc721Contract() {
    const [data, setData] = useState<NftOrder[]>([]);
    const [lastToken, setLastToken] = useState<NftOrder>(null);
    const [counter, setCounter] = useState<number>(-1);
    const [balance, setBalance] = useState<string>('');      
    const [loading, setLoading] = useState(false);
    const [checkMember, setCheckMember] = useState(true);
    const [checkLeader, setCheckLeader] = useState(false);
    const [burn, setBurn] = useState(false)

    function balanceOf(to: string): void {
      if (contract != null) {
        try {
          let balancePromise = contract.balanceOf(to);
          console.log("balancePromise", balancePromise);
          balancePromise.then((result: { toNumber: () => SetStateAction<string>; }) => {
              console.log("setBalance", result.toNumber());
              setBalance(result.toNumber());      
            });
        } catch (error) {
          console.log('error', error);
        }
      }            
    }

    
    
    useEffect(() => {      
        balanceOf(process.env.REACT_APP_DAPP_CONTRACT);
        // getActivityOwnerAddress()
    }, []);

    return { data, loading, setLoading, counter, lastToken, balance, checkMember, checkLeader };
  }



export const useNft = ({
  tokenId,
  apiEndpoint,
  refreshInterval = 30000,
  cacheKey,
}: {
  tokenId: number;
  apiEndpoint?: string;
  refreshInterval?: number;
  cacheKey?: string;
}) => {
  const { data } = useSWR(
    cacheKey ?? `getNftAsset-${tokenId}`,
    () => getNftAsset(tokenId, apiEndpoint),
    {
      refreshInterval: refreshInterval,
      shouldRetryOnError: true,
      retry: 3,
    }
  );
  return {
    data: data ?? null,
  };
};
