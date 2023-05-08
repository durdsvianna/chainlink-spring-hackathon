import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import AccountBalance from './AccountBalance';
import Activities from './Activities';
import LastActivities from './LastActivities';

import { useContractLoadLastNft, useContractLoadNfts, useErc721Contract } from "src/utils/Web3Erc721Utils"
import SuspenseLoader from 'src/components/SuspenseLoader';
import { useEffect } from 'react';

function ApplicationsActivities() {
  const { loading, setLoading, data, loadNfts } = useContractLoadNfts();
  const { loadingLastToken, setLoadingLastToken, lastToken, loadLastNft } = useContractLoadLastNft();
  const { balance } = useErc721Contract();

  async function loadData() {
    setLoading(true);
    setLoadingLastToken(true)
    loadNfts().then(result => {
      loadLastNft().then(result => {        
      });     
    });    
    setLoading(false);    
    setLoadingLastToken(false)
  }

  useEffect(() => {
    if (!loading || !loadingLastToken){
      if (data.length <= 0 )
        if(lastToken == null) 
          loadData();  
    }
    })

  return (
    <>
      <Helmet>
        <title>Web3Dev - Activities</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      {loading 
      ? <SuspenseLoader />
      : 
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
              <LastActivities data={data}/>
            </Grid>
            <Grid item xs={12}>            
              <Activities data={data}/>
            </Grid>
          </Grid>
        </Container>
      }     
      <Footer />
    </>
  );
}

export default ApplicationsActivities;
