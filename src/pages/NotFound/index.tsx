import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex',
        background: '#f7f7f7',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h1" component="h2" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h3" gutterBottom>
        Página Não Encontrada
      </Typography>
      <Typography variant="body1" gutterBottom>
        Oops! Não conseguimos encontrar a página que você estava procurando.
      </Typography>
      <Button variant="outlined" sx={{ mt: 3 }} onClick={() => navigate('/')}>
        Voltar para o Início
      </Button>
    </Box>
  )
}
