import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import { Erc6551VisualizationNft } from 'src/components/Nfts/Erc6551VisualizationNft/ERC6551VisualizationNft/index'
import { getLensNfts, getNfts } from "src/components/Nfts/Erc6551VisualizationNft/Nfts/index";
import { getAccount, getAccountStatus } from 'src/components/Nfts/Erc6551VisualizationNft/Account/index';

import AccountBalance from './AccountBalance';
import Warranties from './Warranties';
import LastWarranties from './LastWarranties';

import { useContractLoadLastNft, useContractLoadNfts, useErc721Contract } from "src/utils/Web3Erc721Utils"
import SuspenseLoader from 'src/components/SuspenseLoader';
import { useEffect, useState } from 'react';
import { NftOrder } from 'src/models/nft_order';

import useSWR from 'swr';
import { TbaOwnedNft } from 'src/models/TbaOwnedNft';
import { ethers, providers } from 'ethers';
// import { rpcClient } from 'src/models/viem';
import tokenboundArtifact from "src/contracts/tokenbound.json";
import { useNetwork } from 'wagmi';

const tokenId = "2";
const tokenContract = "0x66F322B886464252A0D7a44F6e519032894BF094";
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

function ApplicationsWarranties() {
  const { loading, setLoading, loadNfts } = useContractLoadNfts();
  const [ data, setData ] = useState<NftOrder[]>(null);
  const { loadingLastToken, setLoadingLastToken, lastToken, loadLastNft } = useContractLoadLastNft();
  const { balance } = useErc721Contract();

  
  const [tokenInfoTooltip, setTokenInfoTooltip] = useState(false);
  const [tokens, setTokens] = useState<TbaOwnedNft[]>([]);

  // Get Methods from componetns NFT visualization ERC6551

    // Fetch nft's TBA
    const { data: account } = useSWR(tokenId ? `/account/${tokenId}` : null, async () => {
      const result = await getAccount(Number(tokenId), tokenContract);
      console.log('data DATA = ', result)
      return result.data;
    });

  // Get nft's TBA account bytecode to check if account is deployed or not
  const { data: accountBytecode } = useSWR(
    account ? `/account/${account}/bytecode` : null,
    async () => provider.getCode(account)
  );

  const accountIsDeployed = accountBytecode && accountBytecode?.length > 2;

  const { data: isLocked } = useSWR(account ? `/account/${account}/locked` : null, async () => {
    if (!accountIsDeployed) {
      return false;
    }

    const { data, error } = await getAccountStatus(account!);

    return data ?? false;
  });


  // async function loadData() {
        
  // }

  useEffect(() => {
      setLoadingLastToken(true)      
      loadLastNft().then(result => {                  
        setLoadingLastToken(false)      
      });
      
      //loadData();                 
      setLoading(true);  
      loadNfts().then(result => {
        console.log("result", result)
        setTimeout(()=>{
          setData(result);
          setLoading(false);  
          console.log("data", data)
        },2000)        
        
      })    
       
        
    },[])

    // TokenInfo / Tokens / setToken - ERC6551Visualization -> Ajeitar ainda
  return (
    <>
      <Helmet>
        <title>Web3Dev - Activities</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Erc6551VisualizationNft
            account={account}
            isLocked={isLocked}
            tokenInfoTooltip={tokenInfoTooltip}
            tokens={tokens}
            setTokenInfoTooltip={setTokenInfoTooltip}
          />
      {(!loading && !loadingLastToken) 
      ? 
        <Container maxWidth="lg">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12}>
              <AccountBalance lastToken={lastToken} balance={balance}/>
            </Grid>
            <Grid item xs={12}>
              { data && <LastWarranties data={data}/> }
            </Grid>
            <Grid item xs={12}>            
              { data && <Warranties data={data}/> }
            </Grid>
          </Grid>
        </Container>

      : 
        <SuspenseLoader />        
      }     
      <Footer />
    </>
  );
}

export default ApplicationsWarranties;
