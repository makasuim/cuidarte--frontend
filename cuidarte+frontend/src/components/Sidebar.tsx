import { useContext } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, Button, Divider, ListItemButton } from '@mui/material';
import { Home, People, Assignment, Gavel, ExitToApp, AddBox } from '@mui/icons-material';
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
    { text: 'Exámenes', icon: <Assignment />, path: '/exams', roles: ['paciente'] },
    { text: 'Gestión de usuarios', icon: <People />, path: '/users', roles: ['administrador'] },
    { text: 'Auditoría', icon: <Gavel />, path: '/audit', roles: ['administrador'] },
  ];

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
        <AddBox sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>Cuidarte+</Typography>
          <Typography variant="caption" color="text.secondary">Centro de salud</Typography>
        </Box>
      </Box>
      
      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.filter(item => item.roles.includes(user?.rol || '')).map((item) => {
          const isActive = location.pathname === item.path || (location.pathname.startsWith('/patients') && item.path === '/patients');
          return (
            <ListItem disablePadding key={item.text} sx={{ mb: 0.5 }}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{ 
                  borderRadius: '0.5rem',
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontWeight: isActive ? 700 : 500 }}>{item.text}</Typography>} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{user?.nombre}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{user?.email}</Typography>
        <Box sx={{ mt: 1, mb: 2 }}>
          <Typography variant="caption" sx={{ bgcolor: 'secondary.main', color: '#fff', px: 1.5, py: 0.5, borderRadius: 1, textTransform: 'capitalize' }}>
            {user?.rol}
          </Typography>
        </Box>
        <Button variant="outlined" color="secondary" fullWidth startIcon={<ExitToApp />} onClick={handleLogout} sx={{ borderRadius: 2 }}>
          Cerrar sesión
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;