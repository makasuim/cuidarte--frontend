import { useState, useEffect } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Switch, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import api from '../api/axios';

export const Users = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  
  // Estados para el Modal de Editar
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('');

  const fetchUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Función para el Switch (Activar/Desactivar)
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/usuarios/${id}/estado`, { activo: !currentStatus });
      fetchUsuarios(); // Recargar tabla
    } catch (error) {
      alert("Error al cambiar el estado del usuario.");
    }
  };

  // Función para el botón Eliminar
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario de forma permanente?")) {
      try {
        await api.delete(`/usuarios/${id}`);
        fetchUsuarios(); // Recargar tabla
      } catch (error) {
        alert("No se puede eliminar. Es probable que este usuario tenga exámenes o registros asociados.");
      }
    }
  };

  // Funciones para Editar Rol
  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.rol);
    setOpenModal(true);
  };

  const handleSaveRole = async () => {
    try {
      await api.put(`/usuarios/${selectedUser.id}/rol`, { rol: newRole });
      setOpenModal(false);
      fetchUsuarios(); // Recargar tabla
    } catch (error) {
      alert("Error al cambiar el rol del usuario.");
    }
  };

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
                  <Switch 
                    checked={user.activo} 
                    color="primary" 
                    onChange={() => handleToggleStatus(user.id, user.activo)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small" onClick={() => handleOpenEdit(user)} sx={{ borderRadius: 5 }}>Editar cuenta</Button>
                    <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(user.id)} sx={{ borderRadius: 5 }}>Eliminar</Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL PARA CAMBIAR EL ROL */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Editar cuenta</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Modificando el rol de: <b>{selectedUser?.usuario}</b>
          </Typography>
          <TextField 
            select 
            label="Rol del sistema" 
            fullWidth 
            size="small" 
            value={newRole} 
            onChange={(e) => setNewRole(e.target.value)}
          >
            <MenuItem value="paciente">Paciente</MenuItem>
            <MenuItem value="medico">Médico</MenuItem>
            <MenuItem value="administrador">Administrador</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSaveRole} variant="contained" color="primary">Guardar cambios</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};