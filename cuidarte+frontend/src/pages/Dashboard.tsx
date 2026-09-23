import { useContext, useEffect, useState } from 'react';
import { Typography, Box, Paper, Button, Divider } from '@mui/material';
import { People, Assignment, ManageAccounts } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Importante para hacer la petición a la BD

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Estado para almacenar los números reales de la BD
  const [stats, setStats] = useState({ pacientes: 0, examenesTotal: 0, examenesPendientes: 0 });

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    const loadStats = async () => {
      // Solo pedimos las estadísticas si el usuario tiene permisos
      if (user?.rol === 'administrador' || user?.rol === 'medico') {
        try {
          const res = await api.get('/examenes/stats/dashboard');
          setStats(res.data);
        } catch (error) {
          console.error("Error al cargar estadísticas del dashboard", error);
        }
      }
    };
    loadStats();
  }, [user]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Hola, {user?.nombre}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Estás usando Cuidarte+ con el rol {user?.rol}.
      </Typography>
      
      {(user?.rol === 'administrador' || user?.rol === 'medico') && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            {/* Ahora usamos las variables de estado en lugar del número fijo */}
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{stats.pacientes}</Typography>
            <Typography variant="body2" color="text.secondary">Pacientes registrados</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', borderLeft: { md: '1px solid #e0e0e0' }, borderRight: { md: '1px solid #e0e0e0' } }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{stats.examenesTotal}</Typography>
            <Typography variant="body2" color="text.secondary">Exámenes en el sistema</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{stats.examenesPendientes}</Typography>
            <Typography variant="body2" color="text.secondary">Exámenes pendientes</Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ mb: 4 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        
        {(user?.rol === 'administrador' || user?.rol === 'medico') && (
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <People sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Gestión de pacientes</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
              Busca un paciente y entra a su ficha para ver sus exámenes.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/patients')}>
              Ir a gestión de pacientes
            </Button>
          </Paper>
        )}

        {user?.rol === 'administrador' && (
          <>
            <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ManageAccounts sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Gestión de usuarios</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                Cambia roles y activa o desactiva cuentas del centro.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => navigate('/users')}>
                Ir a gestión de usuarios
              </Button>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Assignment sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Auditoría</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                Revisa el registro de acciones críticas del sistema.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => navigate('/audit')}>
                Ir a auditoría
              </Button>
            </Paper>
          </>
        )}

      </Box>
    </Box>
  );
};