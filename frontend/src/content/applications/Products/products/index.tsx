import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import AccountBalance from './AccountBalance';
import Products from './Products';
import LastProducts from './LastProducts';

import { useContractLoadLastNft, useContractLoadNfts, useErc721Contract } from "src/utils/Web3Erc721Utils"
import SuspenseLoader from 'src/components/SuspenseLoader';
import { useEffect, useState } from 'react';
import { NftOrder } from 'src/models/nft_order';

function ApplicationsProducts() {
  const { loading, setLoading, loadNfts } = useContractLoadNfts();
  const [ data, setData ] = useState<NftOrder[]>(null);
  const { loadingLastToken, setLoadingLastToken, lastToken, loadLastNft } = useContractLoadLastNft();
  const { balance } = useErc721Contract();

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

  return (
    <>
      <Helmet>
        <title>Web3Dev - Products</title>
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
              <LastProducts data={data}/>
            </Grid>
            <Grid item xs={12}>            
              <Products data={data}/>
            </Grid>
          </Grid>
        </Container>
      }     
      <Footer />
    </>
  );
}

export default ApplicationsProducts;
