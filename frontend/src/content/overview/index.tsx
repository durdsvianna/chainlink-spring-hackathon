import { Box, Container, Typography, styled } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import MediaNft from 'src/components/Nfts/MediaNft';
import Footer from 'src/components/Footer';
import { useEffect, useState } from 'react';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { useContractLoadNfts } from 'src/utils/Web3Erc721Utils';
import { NftOrder } from 'src/models/nft_order';
import HorizontalLinearStepper from 'src/components/Stepper';

function Overview() {

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
    //if (data) console.log("data.length", data.length)
    console.log("loading", loading)
    console.log("quantity", quantity)
  }, [data, loading])

  return (
    <>
    <OverviewWrapper>
      <Helmet>
        <title>W3 RECICLE - HOME</title>
      </Helmet>
      <Container maxWidth="lg">

        <Box>
        <HorizontalLinearStepper />
        </Box>
        
        <Box sx={{
        width: 632,
        height: 71,
        marginTop: 10,
      }}>
        <Typography variant="h1" component="h2" color="#B56926" >  Unimos tecnologia à conscientização sustentável da população</Typography>
        </Box>
        
      </Container>
      <Footer />
    </OverviewWrapper>
    </>
  );
}

export default Overview;