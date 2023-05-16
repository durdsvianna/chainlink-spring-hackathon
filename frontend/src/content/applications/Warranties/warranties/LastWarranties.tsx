import CreateMintNft from 'src/components/Nfts/CreateMintNft';
import LastActivitiesNft from 'src/components/Nfts/LastActivitiesNft';
import {Card, CardActions, CardActionArea, CardContent, CardMedia, Button,Tooltip, Typography, Box, Grid, Avatar, styled, alpha} from '@mui/material';
import { AddTwoTone } from '@mui/icons-material';
import { useEffect, useState, useCallback } from 'react';
function LastWarranties({ data }) {  
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);
  const handleButtonCreateActivity = () => {
    window.location.href = "/dapp/activity-settings";
  };

  useEffect(() => {
    forceUpdate();
    console.log("LastActvities...")
  },[data])

  return (
    <> 
    <Box
      display="flex"
      alignItems="center"
      sx={{
        pb: 3
      }}
      >
      <Typography variant="h3">Recent Activities</Typography>
      <Button sx={{ ml: 2 }}
        size="small"
        variant="outlined"
        onClick={handleButtonCreateActivity}
        startIcon={<AddTwoTone fontSize="small" />}
      >
        Create Activity
      </Button>
    </Box>
    <Grid container spacing={3}>
      <CreateMintNft/>
      <LastActivitiesNft data={data}/>
    </Grid>
    
    </>
  );
}

export default LastWarranties;
