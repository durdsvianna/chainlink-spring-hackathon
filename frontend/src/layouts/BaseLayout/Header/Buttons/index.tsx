import { Box } from '@mui/material';
import CollectPoint from './CollectPoint/index'

function HeaderButtons() {
  return (
    <Box sx={{ mr: 1 }}>
      <Box sx={{ mx: 0.5 }} component="span">
        <CollectPoint/>
      </Box>
    </Box>
  );
}

export default HeaderButtons;
