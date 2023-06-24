import { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Box, Grid } from '@mui/material';
import SuspenseLoader from 'src/components/SuspenseLoader';
import DetailsDescriptionNft from 'src/content/applications/Activities/activity-details/DetailsDescriptionNft';
import { styled } from '@mui/material/styles';
import { createAccount } from "@tokenbound/sdk-ethers";
 

const CardActionsWrapper = styled(CardActions)(
  ({ theme }) => `
     background: ${theme.colors.alpha.black[5]};
     padding: ${theme.spacing(3)};
`
);

export default function ActivityDetailsNft({ data, loading, tokenId, tokenContract, signer}) {
  const [hashAccount, setHashAccount] = useState<{}>({});  
  
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
                      <><CardMedia
                        sx={{ height: 420, width: 500 }}
                        image={data.image}
                        title="Web3Dev Blockchain" /><CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {data.name}
                          </Typography>
                        </CardContent></>
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