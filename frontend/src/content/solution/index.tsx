import { Box, Container, Typography, styled } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import MediaNft from 'src/components/Nfts/MediaNft';
import Footer from 'src/components/Footer';
import { useEffect, useState } from 'react';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { useContractLoadNfts } from 'src/utils/Web3Erc721Utils';
import { NftOrder } from 'src/models/nft_order';
import Carousel from 'src/components/Carousel'
import SimplePaper from 'src/components/Paper';

function Solution() {

  const { loading, setLoading, loadNfts, quantity } = useContractLoadNfts();
  const [data, setData] = useState<NftOrder[]>(null);

  const OverviewWrapper = styled(Box)(
    () => `
      overflow: auto;
      flex: 1;
      overflow-x: hidden;
      align-items: center;
          `
  );

  useEffect(() => {
    setLoading(true);
    loadNfts().then(result => {
      console.log("result", result)
      setTimeout(() => {
        setData(result);
        setLoading(false);
        console.log("data", data)
      }, 2000)

    })
  }, [])


  useEffect(() => {
    console.log("loading", loading)
    console.log("quantity", quantity)
  }, [data, loading])

  return (
    <>
      <OverviewWrapper>
        <Helmet>
          <title>W3 RECICLE - SOLUTION</title>
        </Helmet>
        <Container maxWidth="lg">

          <Box sx={{
            width: 632,
            height: 'maxContent',
            marginTop: 10,
          }}>
            <Typography variant="h1" component="h2" color="#B56926" >  Unimos tecnologia à conscientização sustentável da população</Typography>
          </Box>
          
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            padding='3%'>
            <Carousel />
          </Box>

        </Container>
        <Footer />
      </OverviewWrapper>
    </>
  );
}

export default Solution;