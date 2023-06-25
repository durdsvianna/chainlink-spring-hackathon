import {Card, CardActions, CardActionArea, CardContent, CardMedia, Button,Tooltip, Typography, Box, Grid, Avatar, styled, alpha} from '@mui/material';

export default function LastDisplayNft({lastToken}) {

    const handleButtonDetails = () => {
      window.location.href = "/dapp/product-details/"+lastToken.tokenId;
    };

    const handleButtonEdit = () => {
      window.location.href = "/dapp/product-settings/edit/"+lastToken.tokenId;
    };
    
    return(
      <>
        <Grid
          sx={{
            position: 'relative'
          }}
          display="flex"
          alignItems="center"
          item
          xs={12}
          md={6}
        >
          <Box p={4} sx={{
                  width: '94%'
                }}>
            <Typography
              sx={{
                pb: 3
              }}
              variant="h4"
            >
              Último produto criado
            </Typography>
            <Card >
              <CardMedia
                sx={{ height: 180 }}
                image={lastToken && lastToken.image}
                title="Web3Dev Blockchain"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {lastToken && lastToken.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lastToken && lastToken.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={handleButtonDetails}>Edit</Button>
                <Button size="small" onClick={handleButtonDetails}>Details</Button>
              </CardActions>
            </Card>
          </Box>          
        </Grid>    
      </>
  
    );
  }