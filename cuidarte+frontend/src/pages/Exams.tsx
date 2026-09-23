import { Typography, Box, Alert } from '@mui/material';

export const Exams = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0f172a', mb: 1 }}>Mis exámenes</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Vista de solo lectura. Puedes revisar tus resultados y descargar tus documentos.
      </Typography>

      <Alert 
        severity="info" 
        sx={{ 
          mb: 3, 
          borderRadius: 2, 
          bgcolor: '#e0f2fe', 
          color: '#0369a1',   
          '& .MuiAlert-icon': { color: '#0369a1' } 
        }}
      >
        Si necesitas modificar algún dato, contacta a tu médico tratante.
      </Alert>

      <Alert 
        severity="warning" 
        sx={{ 
          borderRadius: 2, 
          bgcolor: '#ffedd5', 
          color: '#9a3412',   
          '& .MuiAlert-icon': { color: '#9a3412' } 
        }}
      >
        Tu cuenta todavía no está vinculada a una ficha clínica. Pídele al administrador que la vincule para ver tus exámenes.
      </Alert>
    </Box>
  );
};