import { useContext } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, Button, Divider, ListItemButton } from '@mui/material';
import { Home, People, Assignment, Gavel, ExitToApp, AddBox, ManageAccounts } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const drawerWidth = 260;

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Inicio', icon: <Home />, path: '/dashboard', roles: ['administrador', 'medico', 'paciente'] },
    { text: 'Pacientes', icon: <People />, path: '/patients', roles: ['administrador', 'medico'] },
    { text: 'Mis exámenes', icon: <Assignment />, path: '/exams', roles: ['paciente'] },
    { text: 'Gestión de usuarios', icon: <ManageAccounts />, path: '/users', roles: ['administrador'] },
    { text: 'Auditoría', icon: <Gavel />, path: '/audit', roles: ['administrador'] },
  ];

  // Colores institucionales
  const COLOR_PRIMARIO = '#064e64'; // Azul petróleo oscuro
  const COLOR_VERDE = '#008763'; // Verde esmeralda

  const getRoleColor = (role: string | undefined) => {
    if (role === 'medico') return '#0369a1'; 
    return COLOR_VERDE; // Administrador y Paciente en verde
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Ícono del logo corregido al color azul petróleo */}
        <AddBox sx={{ color: COLOR_PRIMARIO, fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, color: COLOR_PRIMARIO }}>Cuidarte+</Typography>
          <Typography variant="caption" color="text.secondary">Centro de salud</Typography>
        </Box>
      </Box>
      
      {/* px: 2 despega la lista de los bordes para que el botón flote y se vea entero */}
      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.filter(item => item.roles.includes(user?.rol || '')).map((item) => {
          const isActive = location.pathname === item.path || (location.pathname.startsWith('/patients') && item.path === '/patients');
          return (
            <ListItem disablePadding key={item.text} sx={{ mb: 0.5 }}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{ 
                  borderRadius: '12px', // Curvas en los 4 bordes (Botón entero)
                  bgcolor: isActive ? COLOR_PRIMARIO : 'transparent',
                  color: isActive ? '#fff' : '#475569',
                  '&:hover': {
                    bgcolor: isActive ? COLOR_PRIMARIO : '#f1f5f9',
                    color: isActive ? '#fff' : '#0f172a',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontWeight: isActive ? 700 : 400 }}>{item.text}</Typography>} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: COLOR_PRIMARIO }}>
          {user?.nombre}
        </Typography>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontSize: '0.75rem' }}>
          {user?.email}
        </Typography>
        
        <Box sx={{ mt: 0.5, mb: 2 }}>
          <Typography component="span" variant="caption" sx={{ 
            bgcolor: getRoleColor(user?.rol), 
            color: '#fff', 
            px: 1.5, py: 0.5, 
            borderRadius: 5, 
            textTransform: 'capitalize',
            fontWeight: 'bold'
          }}>
            {user?.rol}
          </Typography>
        </Box>
        
        <Button 
          variant="outlined" 
          fullWidth 
          startIcon={<ExitToApp />} 
          onClick={handleLogout} 
          sx={{ 
            borderRadius: 2, 
            color: COLOR_PRIMARIO, 
            borderColor: '#cbd5e1', 
            textTransform: 'none', 
            fontWeight: 'bold' 
          }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;