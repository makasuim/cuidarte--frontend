import { useState, useEffect } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Switch } from '@mui/material';
import api from '../api/axios';

export const Users = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get('/usuarios');
        setUsuarios(res.data);
      } catch (error) {
        console.error("Error cargando usuarios", error);
      }
    };
    fetchUsuarios();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>Gestión de usuarios</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Cambia el rol de una cuenta o desactívala temporalmente.
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Correo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Activo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{user.usuario}</TableCell>
                <TableCell>{user.correo}</TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ border: '1px solid', borderColor: 'primary.main', color: 'primary.main', px: 1, py: 0.5, borderRadius: 1, textTransform: 'capitalize' }}>
                    {user.rol}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Switch checked={user.activo} color="primary" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small" sx={{ borderRadius: 5 }}>Editar cuenta</Button>
                    <Button variant="outlined" color="error" size="small" sx={{ borderRadius: 5 }}>Eliminar</Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};