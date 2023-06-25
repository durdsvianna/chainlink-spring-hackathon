import CreateMintNft from 'src/components/Nfts/CreateMintNft';
import LastsNfts from 'src/components/Nfts/LastsNfts';
import {Card, CardActions, CardActionArea, CardContent, CardMedia, Button,Tooltip, Typography, Box, Grid, Avatar, styled, alpha} from '@mui/material';
import { AddTwoTone } from '@mui/icons-material';

function LastProducts({ data }) {  

  const handleButtonCreate = () => {
    window.location.href = "/dapp/product-settings";
  };

  return (
    <> 
    <Box
      display="flex"
      alignItems="center"
      sx={{
        pb: 3
      }}
      >
      <Typography variant="h3">Cadastro de Produto</Typography>
      <Button sx={{ ml: 2 }}
        size="small"
        variant="outlined"
        onClick={handleButtonCreate}
        startIcon={<AddTwoTone fontSize="small" />}
      >
        Criar Produto
      </Button>
    </Box>
    <Grid container spacing={3}>
      <CreateMintNft/>
      <LastsNfts data={data}/>
    </Grid>
    
    </>
  );
}

export default LastProducts;
