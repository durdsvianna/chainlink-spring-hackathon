import { useState, ChangeEvent, useEffect } from 'react';
import {useParams} from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import { styled } from '@mui/material/styles';
import { useContractLoadTokenId } from "src/utils/Web3Erc721Utils"
import WarrantyTab from './WarrantyTab';
import MintInfoTab from './MintInfoTab';
import SuspenseLoader from 'src/components/SuspenseLoader';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function WarrantySettings() {
  const [currentTab, setCurrentTab] = useState<string>('warranties');
  const { tokenId } = useParams();
  const { data, loading, setLoading, loadNft } = useContractLoadTokenId();
  

  const tabs = [
    { value: 'warranties', label: 'Warranties' },
    { value: 'products', label: 'Products' },
    { value: 'product-batches', label: 'Product Batches' },
  ];

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  async function loadData() {
    setLoading(true);
    loadNft(tokenId);
    setLoading(false);
  }

  useEffect(() =>{
    
    if (!loading){
      if (data == null)
        loadData();
    }
      
    
  })

  useEffect(() =>{
    console.log("data", data)
    console.log("loading", loading)
  }, [loading, data])

  return (
    <>
      <Helmet>
        <title>Warranty Settings - Configuration Panel</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      {loading 
      ? <SuspenseLoader />
      :
        data == null && (tokenId!=null && +tokenId >=0) ? <SuspenseLoader />
        :
        (
          <Container maxWidth="lg">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={3}
            >
              <Grid item xs={12}>
                <TabsWrapper
                  onChange={handleTabsChange}
                  value={currentTab}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value}/>
                  ))}
                </TabsWrapper>
              </Grid>
              <Grid item xs={12}>
                {currentTab === 'warranties' && <WarrantyTab data={data} />}
                {currentTab === 'products' && <MintInfoTab data={data} />}
                {currentTab === 'product-batches' && <MintInfoTab data={data}/>}
              </Grid>
            </Grid>
          </Container>
        )
      }      
      <Footer />
    </>
  );
}

export default WarrantySettings;
