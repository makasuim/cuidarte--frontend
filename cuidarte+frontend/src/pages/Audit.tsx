import { useState, useEffect } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Chip, MenuItem } from '@mui/material';
import { Search } from '@mui/icons-material';
import api from '../api/axios';

export const Audit = () => {
  const [registros, setRegistros] = useState<any[]>([]);

  useEffect(() => {
    const fetchAuditoria = async () => {
      try {
        const res = await api.get('/auditoria');
        setRegistros(res.data);
      } catch (error) {
        console.error("Error cargando auditoría", error);
      }
    };
    fetchAuditoria();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>Auditoría</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Trazabilidad de las acciones críticas realizadas en Cuidarte+.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField placeholder="Buscar por usuario o acción" variant="outlined" size="small" sx={{ width: 300, bgcolor: 'background.paper' }}
          slotProps={{ input: { startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) } }}
        />
        <TextField select label="Criticidad" defaultValue="Todas" size="small" sx={{ width: 150, bgcolor: 'background.paper' }}>
          <MenuItem value="Todas">Todas</MenuItem>
          <MenuItem value="Alta">Alta</MenuItem>
          <MenuItem value="Media">Media</MenuItem>
          <MenuItem value="Baja">Baja</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Acción</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Detalle</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Criticidad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registros.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.fecha}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{row.usuario}</TableCell>
                <TableCell>{row.accion}</TableCell>
                <TableCell>{row.detalle}</TableCell>
                <TableCell>
                  <Chip label={row.criticidad} color={row.criticidad === 'Alta' ? 'error' : row.criticidad === 'Media' ? 'warning' : 'success'} size="small" sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};