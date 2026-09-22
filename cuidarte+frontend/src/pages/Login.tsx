import { useState, useContext, type ReactNode } from 'react';
import { TextField, Button, Typography, Container, Box, Alert, IconButton, InputAdornment, Tabs, Tab, Link, Divider } from '@mui/material';
import { Visibility, VisibilityOff, AddBox } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other} style={{ width: '100%' }}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Login = () => {
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regUsuario, setRegUsuario] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRepetirPassword, setRegRepetirPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.usuario);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (regPassword !== regRepetirPassword) {
      return setError('Las contraseñas no coinciden');
    }
    try {
      await api.post('/auth/registro', { nombre: regUsuario, email: regEmail, password: regPassword });
      setTabValue(0);
      setEmail(regEmail);
      setPassword('');
      setError('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar la cuenta');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6f8' }}>
      <Container component="main" maxWidth="xs">
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <AddBox sx={{ fontSize: 45, color: 'primary.main', mb: 0.5 }} />
          <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
            Cuidarte+
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Gestión de pacientes y exámenes médicos
          </Typography>

          <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0px 4px 20px rgba(0,0,0,0.03)', p: { xs: 3, sm: 4 } }}>
            
            <Tabs 
              value={tabValue} 
              onChange={(_, val) => { setTabValue(val); setError(''); }} 
              variant="fullWidth" 
              sx={{ 
                borderBottom: 1, borderColor: 'divider', 
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 'bold', fontSize: '1rem', color: 'text.secondary' }, 
                '& .Mui-selected': { color: 'primary.main' }, 
                '& .MuiTabs-indicator': { bgcolor: 'primary.main' } 
              }}
            >
              <Tab label="Iniciar sesión" />
              <Tab label="Registrarse" />
            </Tabs>

            {error && <Alert severity={error.includes('exitosa') ? 'success' : 'error'} sx={{ width: '100%', mt: 2 }}>{error}</Alert>}

            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                <TextField margin="normal" required fullWidth id="email" label="Correo electrónico" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} size="small" />
                
                <TextField margin="normal" required fullWidth name="password" label="Contraseña" type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
                
                <Button type="submit" fullWidth color="primary" variant="contained" sx={{ mt: 2, mb: 2 }}>
                  Entrar
                </Button>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Link href="#" variant="body2" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 'bold' }}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
                <TextField margin="dense" required fullWidth id="regUsuario" label="Usuario" name="usuario" value={regUsuario} onChange={(e) => setRegUsuario(e.target.value)} size="small" />
                <TextField margin="dense" required fullWidth id="regEmail" label="Correo electrónico" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} size="small" />
                
                <TextField margin="dense" required fullWidth name="regPassword" label="Contraseña" type={showPassword ? 'text' : 'password'} id="regPassword" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} size="small" 
                  helperText="Mínimo 12 caracteres, con mayúsculas, minúsculas, números y símbolos" 
                  slotProps={{
                    formHelperText: { sx: { fontSize: '0.7rem', lineHeight: 1.2 } },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
                
                <TextField margin="dense" required fullWidth name="regRepetirPassword" label="Repetir contraseña" type={showPassword ? 'text' : 'password'} id="regRepetirPassword" value={regRepetirPassword} onChange={(e) => setRegRepetirPassword(e.target.value)} size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
                
                <Button type="submit" fullWidth color="primary" variant="contained" sx={{ mt: 3, mb: 1 }}>
                  Crear cuenta
                </Button>
              </Box>
            </TabPanel>

            <Divider sx={{ mb: 2, mt: tabValue === 1 ? 2 : 0, color: 'text.secondary', fontSize: '0.875rem' }}>o</Divider>
            
            <Button fullWidth variant="outlined" color="inherit" sx={{ py: 1.2, borderColor: '#d3d3d3' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: 20, height: 20, marginRight: 10 }} />
              Continuar con Google
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;