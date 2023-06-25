import { Box, Container, Typography, styled } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import { useContractLoadNfts, useContractLoadTokenId } from 'src/utils/Web3Erc721Utils';
import HorizontalLinearStepper from 'src/components/Stepper';
import CollectPoint from 'src/components/CollectPoint';

function Overview() {

  const { data, loading, setLoading, loadNft } = useContractLoadTokenId();

  const OverviewWrapper = styled(Box)(
    () => `
      overflow: auto;
      flex: 1;
      overflow-x: hidden;
      align-items: center;
          `
  );

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
        
        <Box>
        <CollectPoint data={data}/>
        </Box>
        
      </Container>
      <Footer />
    </OverviewWrapper>
    </>
  );
}

export default Overview;