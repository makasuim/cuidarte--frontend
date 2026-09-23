import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Chip, Divider, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { ArrowBack, ExpandMore, ExpandLess, PictureAsPdf, Delete, Edit, UploadFile } from '@mui/icons-material';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [paciente, setPaciente] = useState<any>(null);
  const [examenes, setExamenes] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Estados para Registrar Examen
  const [openModal, setOpenModal] = useState(false);
  const [examData, setExamData] = useState({ tipo_examen: '', fecha: '', medico_responsable: '', estado: 'Pendiente', resultado: '', observaciones: '' });
  const [archivoPDF, setArchivoPDF] = useState<File | null>(null);

  // Estados para Editar Paciente
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nombre_completo: '',
    rut: '',
    edad: '',
    prevision: '',
    telefono: '',
    correo: ''
  });

  const fetchData = async () => {
    try {
      const resPac = await api.get(`/pacientes/${id}`);
      setPaciente(resPac.data);
      
      // Cargar los datos actuales en el formulario de edición
      setEditFormData({
        nombre_completo: resPac.data.nombre_completo || '',
        rut: resPac.data.rut || '',
        edad: resPac.data.edad || '',
        prevision: resPac.data.prevision || 'Ninguna',
        telefono: resPac.data.telefono || '',
        correo: resPac.data.correo || ''
      });

      const resExa = await api.get(`/examenes/paciente/${id}`);
      setExamenes(resExa.data);
      
      const resMed = await api.get('/usuarios/medicos');
      setMedicos(resMed.data);
    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  // Función para guardar la edición del paciente
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/pacientes/${id}`, {
        ...editFormData,
        edad: Number(editFormData.edad)
      });
      setOpenEditModal(false);
      fetchData(); // Recargar los datos para que se reflejen de inmediato
    } catch (error) {
      alert("Error al actualizar los datos del paciente.");
    }
  };

  const handleSaveExam = async () => {
    try {
      const formData = new FormData();
      formData.append('paciente_id', id as string);
      formData.append('tipo_examen', examData.tipo_examen);
      formData.append('fecha', examData.fecha);
      formData.append('estado', examData.estado);
      formData.append('medico_responsable', examData.medico_responsable);
      formData.append('resultado', examData.resultado);
      formData.append('observaciones', examData.observaciones);
      if (archivoPDF) {
        formData.append('archivo', archivoPDF);
      }

      await api.post('/examenes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setOpenModal(false);
      setExamData({ tipo_examen: '', fecha: '', medico_responsable: '', estado: 'Pendiente', resultado: '', observaciones: '' });
      setArchivoPDF(null);
      fetchData();
    } catch (error) {
      alert("Error al guardar el examen. Verifica que todos los campos obligatorios estén llenos.");
    }
  };

  const handleDeleteExam = async (examenId: string) => {
    if(window.confirm("¿Estás seguro de eliminar este examen de forma permanente?")) {
      await api.delete(`/examenes/${examenId}`);
      fetchData();
    }
  };

  const descargarPDF = async (examenId: string, tipo: string, nombreArchivoSubido: string) => {
    try {
      const res = await api.get(`/examenes/${examenId}/descargar`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nombreArchivoSubido || `informe_generado_${tipo.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Error al descargar el documento del servidor.");
    }
  };

  if (!paciente) return <Typography sx={{ p: 3 }}>Cargando ficha clínica...</Typography>;

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/patients')} sx={{ mb: 2, color: 'primary.main' }}>
        Volver al listado
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{paciente.nombre_completo}</Typography>
          <Typography variant="body1" color="text.secondary">
            {paciente.rut} - {paciente.edad} años - {paciente.prevision}
          </Typography>
        </Box>
        
        {/* Contenedor con los dos botones: Editar y Registrar */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {(user?.rol === 'administrador' || user?.rol === 'medico') && (
            <Button variant="outlined" startIcon={<Edit />} onClick={() => setOpenEditModal(true)}>
              Editar ficha
            </Button>
          )}
          
          {(user?.rol === 'administrador' || user?.rol === 'medico') && (
            <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
              + Registrar examen
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Datos de contacto</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Teléfono</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{paciente.telefono || 'No registrado'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Correo</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{paciente.correo || 'No registrado'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Previsión</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{paciente.prevision}</Typography>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Exámenes médicos <Chip label={examenes.length} size="small" sx={{ ml: 1, bgcolor: '#e3f2fd', color: 'primary.main', fontWeight: 'bold' }} />
      </Typography>

      {examenes.map((examen) => (
        <Paper key={examen.id} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none', overflow: 'hidden' }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{examen.tipo_examen}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(examen.fecha).toLocaleDateString('es-CL', { timeZone: 'UTC' })} - {examen.medico_responsable}
              </Typography>
            </Box>
            <Chip label={examen.estado} color={examen.estado === 'Completado' ? 'success' : examen.estado === 'En proceso' ? 'info' : 'default'} sx={{ fontWeight: 'bold' }} />
          </Box>
          
          <Box sx={{ px: 3, pb: expandedId === examen.id ? 0 : 2 }}>
            <Button size="small" color="inherit" onClick={() => setExpandedId(expandedId === examen.id ? null : examen.id)} endIcon={expandedId === examen.id ? <ExpandLess /> : <ExpandMore />}>
              {expandedId === examen.id ? 'Ocultar detalle' : 'Ver detalle y documentos'}
            </Button>
          </Box>

          <Collapse in={expandedId === examen.id}>
            <Divider />
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Resultado</Typography>
                  <Typography variant="body2">{examen.resultado || 'Sin resultados aún'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Observaciones</Typography>
                  <Typography variant="body2">{examen.observaciones || 'Ninguna'}</Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Documentos adjuntos</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e0e0e0', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PictureAsPdf color={examen.archivo_nombre ? "primary" : "error"} />
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {examen.archivo_nombre ? examen.archivo_nombre : 'informe_generado_cuidarte.pdf'}
                  </Typography>
                </Box>
                <Button variant="outlined" size="small" color="success" onClick={() => descargarPDF(examen.id, examen.tipo_examen, examen.archivo_nombre)}>
                  Descargar Informe
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" color="primary" startIcon={<Edit />}>Editar examen</Button>
                <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => handleDeleteExam(examen.id)}>Eliminar examen</Button>
              </Box>
            </Box>
          </Collapse>
        </Paper>
      ))}

      {/* MODAL PARA EDITAR FICHA MÉDICA */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Editar información del paciente</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField 
                label="Nombre Completo" 
                value={editFormData.nombre_completo}
                onChange={(e) => setEditFormData({...editFormData, nombre_completo: e.target.value})}
                required
                fullWidth
                size="small"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                  label="RUT (Ej: 11222333-4)" 
                  value={editFormData.rut}
                  onChange={(e) => setEditFormData({...editFormData, rut: e.target.value})}
                  required
                  fullWidth
                  size="small"
                />
                <TextField 
                  label="Edad" 
                  type="number"
                  value={editFormData.edad}
                  onChange={(e) => setEditFormData({...editFormData, edad: e.target.value})}
                  required
                  fullWidth
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                  select 
                  label="Previsión" 
                  fullWidth 
                  size="small" 
                  value={editFormData.prevision} 
                  onChange={e => setEditFormData({...editFormData, prevision: e.target.value})}
                >
                  <MenuItem value="Ninguna">Ninguna</MenuItem>
                  <MenuItem value="Fonasa A">Fonasa A</MenuItem>
                  <MenuItem value="Fonasa B">Fonasa B</MenuItem>
                  <MenuItem value="Fonasa C">Fonasa C</MenuItem>
                  <MenuItem value="Fonasa D">Fonasa D</MenuItem>
                  <MenuItem value="Isapre">Isapre</MenuItem>
                </TextField>
                <TextField 
                  label="Teléfono" 
                  value={editFormData.telefono}
                  onChange={(e) => setEditFormData({...editFormData, telefono: e.target.value})}
                  fullWidth
                  size="small"
                />
              </Box>
              <TextField 
                label="Correo (Opcional)" 
                type="email"
                value={editFormData.correo}
                onChange={(e) => setEditFormData({...editFormData, correo: e.target.value})}
                fullWidth
                size="small"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenEditModal(false)} color="inherit">Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">Guardar cambios</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* MODAL REGISTRAR EXAMEN */}
      <Dialog open={openModal} onClose={() => { setOpenModal(false); setArchivoPDF(null); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Registrar nuevo examen</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, pt: 1 }}>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              <TextField label="Tipo de examen *" fullWidth size="small" value={examData.tipo_examen} onChange={e => setExamData({...examData, tipo_examen: e.target.value})} />
            </Box>
            <Box>
              <TextField type="date" label="Fecha *" fullWidth size="small" value={examData.fecha} onChange={e => setExamData({...examData, fecha: e.target.value})} slotProps={{ inputLabel: { shrink: true } }} />
            </Box>
            <Box>
              <TextField select label="Estado *" fullWidth size="small" value={examData.estado} onChange={e => setExamData({...examData, estado: e.target.value})}>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="En proceso">En proceso</MenuItem>
                <MenuItem value="Completado">Completado</MenuItem>
              </TextField>
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              <TextField select label="Médico responsable *" fullWidth size="small" value={examData.medico_responsable} onChange={e => setExamData({...examData, medico_responsable: e.target.value})}>
                {medicos.length > 0 ? (
                  medicos.map((med: any) => (
                    <MenuItem key={med.id} value={med.nombre}>
                      {med.nombre}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>No hay médicos registrados</MenuItem>
                )}
              </TextField>
            </Box>

            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              <TextField label="Resultado clínico" multiline rows={3} fullWidth size="small" value={examData.resultado} onChange={e => setExamData({...examData, resultado: e.target.value})} />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              <TextField label="Observaciones" multiline rows={2} fullWidth size="small" value={examData.observaciones} onChange={e => setExamData({...examData, observaciones: e.target.value})} />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' }, bgcolor: '#f8fafc', p: 2, borderRadius: 1, border: '1px dashed #cbd5e1' }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                <UploadFile fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }}/> 
                Adjuntar PDF del laboratorio (Opcional)
              </Typography>
              <input 
                type="file" 
                accept=".pdf, .doc, .docx, .ppt, .pptx, .jpg, .jpeg, .png" 
                onChange={(e) => setArchivoPDF(e.target.files ? e.target.files[0] : null)} 
                style={{ fontSize: '0.85rem' }} 
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Si no adjuntas ningún archivo, el sistema generará un PDF automático con los resultados ingresados.
              </Typography>
            </Box>

          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setOpenModal(false); setArchivoPDF(null); }} color="inherit">Cancelar</Button>
          <Button onClick={handleSaveExam} variant="contained" color="primary">Guardar examen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};