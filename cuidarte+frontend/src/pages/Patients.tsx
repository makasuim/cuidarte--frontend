import { useState, useEffect } from 'react';
import { Typography, Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import { Search } from '@mui/icons-material';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Patients = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ nombre_completo: '', rut: '', telefono: '', edad: '', prevision: '', correo: '' });
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const res = await api.get('/pacientes');
      setPatients(res.data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleSave = async () => {
    try {
      await api.post('/pacientes', formData);
      setOpenModal(false);
      setFormData({ nombre_completo: '', rut: '', telefono: '', edad: '', prevision: '', correo: '' });
      fetchPatients(); 
    } catch (error) {
      alert("Error al guardar el paciente. Revisa los datos o si el RUT ya existe.");
    }
  };

  const filteredPatients = patients.filter((p: any) => 
    p.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) || p.rut.includes(searchTerm)
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Pacientes</Typography>
          <Typography variant="body2" color="text.secondary">Haz clic en un paciente para ver su ficha y sus exámenes médicos.</Typography>
        </Box>
        <Button variant="outlined" color="primary" onClick={() => setOpenModal(true)}>
          + Nuevo paciente
        </Button>
      </Box>

      <TextField placeholder="Buscar por nombre o RUT" variant="outlined" size="small" sx={{ mb: 3, width: 320, bgcolor: 'background.paper' }}
        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        slotProps={{ input: { startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) } }}
      />

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Paciente</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>RUT</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Edad</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Previsión</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient: any) => (
              <TableRow key={patient.id} hover>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{patient.nombre_completo}</TableCell>
                <TableCell>{patient.rut}</TableCell>
                <TableCell>{patient.edad}</TableCell>
                <TableCell>{patient.prevision}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => navigate(`/patients/${patient.id}`)} sx={{ borderRadius: 5 }}>Ver ficha</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Nuevo paciente</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, pt: 1 }}>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              <TextField label="Nombre completo *" fullWidth size="small" value={formData.nombre_completo} onChange={e => setFormData({...formData, nombre_completo: e.target.value})} />
            </Box>
            <Box>
              <TextField label="RUT *" fullWidth size="small" value={formData.rut} onChange={e => setFormData({...formData, rut: e.target.value})} />
            </Box>
            <Box>
              <TextField label="Teléfono" fullWidth size="small" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
            </Box>
            <Box>
              <TextField label="Edad" type="number" fullWidth size="small" value={formData.edad} onChange={e => setFormData({...formData, edad: e.target.value})} />
            </Box>
            <Box>
              <TextField select label="Previsión" fullWidth size="small" value={formData.prevision} onChange={e => setFormData({...formData, prevision: e.target.value})}>
                <MenuItem value="Fonasa A">Fonasa A</MenuItem>
                <MenuItem value="Fonasa B">Fonasa B</MenuItem>
                <MenuItem value="Isapre">Isapre</MenuItem>
                <MenuItem value="Ninguna">Ninguna</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              <TextField label="Correo electrónico" fullWidth size="small" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Guardar paciente</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Patients;