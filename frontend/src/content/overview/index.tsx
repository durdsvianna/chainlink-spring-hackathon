import { Box, Container, styled} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import MediaNft from 'src/components/Nfts/MediaNft';

import Footer from 'src/components/Footer';
import { useEffect } from 'react';
import SuspenseLoader from 'src/components/SuspenseLoader';

function Overview() {
 
  const OverviewWrapper = styled(Box)(
    () => `
      overflow: auto;
      flex: 1;
      overflow-x: hidden;
      align-items: center;
          `
  );


  return (
    <OverviewWrapper>
      <Helmet>
        <title>Web3Dev Marketplace</title>
      </Helmet>
      <Container maxWidth="lg">
        <MediaNft/>        
      </Container>
      <Footer />
    </OverviewWrapper>
  );
}

export default Overview;
