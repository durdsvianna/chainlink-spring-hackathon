import { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Box, Grid } from '@mui/material';
import SuspenseLoader from 'src/components/SuspenseLoader';
import DetailsDescriptionNft from 'src/content/applications/Activities/activity-details/DetailsDescriptionNft';
import { styled } from '@mui/material/styles';
import { createAccount } from "@tokenbound/sdk-ethers";
import { AlchemyConfig } from "src/utils/Alchemy";
import { Erc6551VisualizationNft } from 'src/components/Nfts/Erc6551VisualizationNft/ERC6551VisualizationNft/index'
import { getLensNfts, getNfts } from "src/components/Nfts/Erc6551VisualizationNft/Nfts/index";
import { getAccount, getAccountStatus } from 'src/components/Nfts/Erc6551VisualizationNft/Account/index';
import { isNil } from "lodash";
import useSWR from 'swr';
import { TbaOwnedNft } from 'src/models/TbaOwnedNft';
import { ethers, providers } from 'ethers';
//import { useGetApprovals } from "src/utils/nfts/useGetApprovals";
import tokenboundArtifact from "src/contracts/tokenbound.json";
import { Exclamation } from 'src/components/Icons/Exclamation';
import { Tooltip } from 'src/components/Tooltip';

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

const CardActionsWrapper = styled(CardActions)(
  ({ theme }) => `
     background: ${theme.colors.alpha.black[5]};
     padding: ${theme.spacing(3)};
`
);

export default function ActivityDetailsNft({ data, loading, tokenId, contractAddress, signer}) {
  const [hashAccount, setHashAccount] = useState<string>("");
  const [isLocked, setIsLocked] = useState(false);
  const [tokenInfoTooltip, setTokenInfoTooltip] = useState(false);
  const [tokens, setTokens] = useState<TbaOwnedNft[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [nfts, setNfts] = useState<TbaOwnedNft[]>([]);
  const [lensNfts, setLensNfts] = useState<TbaOwnedNft[]>([]);
  // Get Methods from componetns NFT visualization ERC6551

  const { data: nftMetadata } = useSWR(`nft/metadata/${contractAddress}/${tokenId}`, () => {
    return AlchemyConfig.nft.getNftMetadataBatch([{ contractAddress, tokenId }]);
  });

  useEffect(() => {
    if (!isNil(nftMetadata) && nftMetadata.length) {
      const imagePromises = [nftMetadata[0]?.media[0].gateway].map((src: string) => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = reject;
          image.src = src;
        });
      });

      Promise.all(imagePromises)
        .then(() => {
          setImagesLoaded(true);
        })
        .catch((error) => {
          console.error("Error loading images:", error);
        });
    }
  }, [nftMetadata]);

  const accountResponse  =  getAccount(Number(tokenId), contractAddress).then(result => { return result.data }).then(res => {return res });

  useEffect(() => {
    // Fetch nft's TBA
    console.log("ENTROU NO USEEFFECT")    
    accountResponse.then(result => setHashAccount(result));

  },[accountResponse]);

  // Get nft's TBA account bytecode to check if account is deployed or not
  const { data: accountBytecode } = useSWR(
    hashAccount ? `/account/${hashAccount}/bytecode` : null,
    async () => provider.getCode(hashAccount)
  );

  const accountIsDeployed = accountBytecode && accountBytecode?.length > 2;
  
  const isLockedResponse  = getAccountStatus(hashAccount).then(result => { return result.data }).then(res => {return res });

  useEffect(() => {
    // Fetch nft's TBA
    console.log("ENTROU NO USEEFFECT")    
    isLockedResponse.then(result => setIsLocked(result));

  },[isLockedResponse]);

   // fetch nfts inside TBA
   useEffect(() => {
    
    async function fetchNfts(account: string) {
      const [data, lensData] = await Promise.all([getNfts(account), getLensNfts(account)]);

      if (data) {
        setNfts(data);
      }
      if (lensData) {
        setLensNfts(lensData);
      }
    }

    if (hashAccount) {
      fetchNfts(hashAccount);
    }
  }, [hashAccount, accountBytecode]);
  
  const allNfts = [...nfts, ...lensNfts];

  // const { data: approvalData } = useGetApprovals(
  //   allNfts.map((nft) => nft.contract.address),
  //   account
  // );

  useEffect(() => {
    if (nfts !== undefined && nfts.length) {
      nfts.map((token) => {
        //   const foundApproval = approvalData?.find((item: any) => {
        //   const contract = item?.value?.contract;
        //   const tokenIds = item?.approvedTokenIds;
        //   const approvalForAll = item.nftApprovalForAll;

        //   if (ethers.utils.getAddress(contract) === ethers.utils.getAddress(token.contract.address) && approvalForAll) {
        //     return true;
        //   }

        //   if (
        //     ethers.utils.getAddress(contract) === ethers.utils.getAddress(token.contract.address) &&
        //     tokenIds &&
        //     tokenIds.includes(String(token.tokenId))
        //   ) {
        //     return true;
        //   }
        // });

        token.hasApprovals = false;
      });
      setTokens(nfts);
      if (lensNfts) {
        setTokens([...nfts, ...lensNfts]);
      }
    }
  }, [nfts, lensNfts]);

  const onDployAccount = async (event: { preventDefault: () => void; }) => {
    
    setHashAccount(await createAccount(
      tokenContract, // ERC-712 contract address
      tokenId, // ERC-721 token ID
      signer // ethers signer 
    ));
    
  };
  
  return (
    <>
      {console.log('STATUS LOADING MEDIA NFT INITIAL = ', loading)}
      {console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = ', data)}
      {console.log('hashAccount= ', hashAccount)}
      {console.log('contractAddress= ', contractAddress)}
      {console.log('tokenId= ', tokenId)}
      {console.log('nftMetadata= ', nftMetadata)}
      {console.log('tokens= ', tokens)}
      {console.log('isLocked= ', isLocked)}
      {console.log('nfts= ', nfts)}
      {console.log('lensNfts= ', lensNfts)}
     
        <Box
          sx={{
            marginTop: 4,
            width: 1,
          }}>
          <Grid container spacing={10}>
              <Grid item xs={12} >
                <Card sx={{ maxWidth: 1, height: 1}}>
                  <Grid spacing={0} container>

                    <Card sx={{ maxWidth: 1035 }}>
                    {data && data.image && (
                      <>
                        <div className="w-screen h-screen bg-white">
                              <div className="relative max-h-screen mx-auto bg-black max-w-screen aspect-square overflow-hidden">
                                {/* <div className="relative max-h-screen mx-auto bg-gradient-to-b from-[#ab96d3] via-[#fbaaac] to-[#ffe8c4] max-w-screen aspect-square overflow-hidden"> */}
                                <div className="relative w-full h-full">
                                  {/* if accountDeployed is true and isLocked is false */}
                                  {console.log('nftMetadata= ', nftMetadata)}
                                  {/*(!isLocked || approvalData.length) && accountIsDeployed && ( */
                                    (!isLocked) && accountIsDeployed && (
                                    <div className="absolute top-0 right-0 z-10 w-16 h-16">
                                      <Tooltip
                                        lineOne="This token account is Unlocked or has Approvals."
                                        lineTwo="Its contents may be removed while listed."
                                        position="left"
                                      >
                                        <Exclamation />
                                      </Tooltip>
                                    </div>
                                  )}
                                  <Erc6551VisualizationNft
                                    account={hashAccount}
                                    isLocked={isLocked}
                                    tokenInfoTooltip={tokenInfoTooltip}
                                    tokens={tokens}
                                    setTokenInfoTooltip={setTokenInfoTooltip}
                                  />
                                  <div className="relative w-full">
                                    <div
                                      className={`grid w-full grid-cols-1 grid-rows-1 transition ${
                                        imagesLoaded ? "" : "blur-xl"
                                      }`}
                                    >
                                      {!isNil(nftMetadata) ? (
                                        <img
                                          src={`${nftMetadata[0]?.media[0].gateway}`}
                                          alt="Nft image"
                                          className="col-span-1 col-start-1 row-span-1 row-start-1 translate-x-0"
                                        />
                                      ) : (
                                        <></>
                                      )}
                                      {}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {data.name}
                          </Typography>
                        </CardContent>
                      </>
                    )}

                    </Card>
                    <DetailsDescriptionNft data={data} loading={loading} tokenId={tokenId} />

                  </Grid>
                  <CardActionsWrapper
                    sx={{
                      display: { xs: 'block', md: 'flex' },
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >        
                    <Box>              
                    </Box>
                    <Box sx={{ mt: { xs: 2, md: 0 } }}>
                      <Button onClick={onDployAccount} variant="contained">
                        Deploy Account
                      </Button>
                    </Box>
                  </CardActionsWrapper>
                </Card>
              </Grid>
          </Grid>
        </Box>
     
    </>
  );
}