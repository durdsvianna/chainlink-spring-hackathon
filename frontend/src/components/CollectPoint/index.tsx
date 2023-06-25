import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material'

const CollectPoint = (data) => {
    return (

        <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Pontos de Coleta
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Benefícios
          </Typography>
          <Typography variant="body2">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
        <CardActions>
        <Button variant="contained" href="/#">Pontos de Coleta</Button>
        </CardActions>
      </Card>
    )
}

export default CollectPoint