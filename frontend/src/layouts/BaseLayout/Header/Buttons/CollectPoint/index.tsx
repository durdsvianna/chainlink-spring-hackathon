import { Box, Button } from '@mui/material'

const CollectPoint = () => {
  return (
    <Box
          sx={{ p: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
            <Button variant="contained" href="/#">Pontos de Coleta</Button>
        </Box>
  )
}

export default CollectPoint