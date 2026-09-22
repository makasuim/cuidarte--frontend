import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0f172a', contrastText: '#ffffff' }, // Slate 900 (Color oscuro principal)
    secondary: { main: '#64748b', contrastText: '#ffffff' }, // Slate 500 (Gris secundario)
    info: { main: '#0ea5e9', contrastText: '#ffffff' }, // Sky 500 (Azul claro)
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' },
  },
  typography: {
    fontFamily: '"Atkinson Hyperlegible", "Segoe UI", system-ui, sans-serif',
    h1: { fontSize: "2.25rem", fontWeight: 800 },
    h2: { fontSize: "1.875rem", fontWeight: 800 },
    h3: { fontSize: "1.5rem", fontWeight: 700 },
    h4: { fontSize: "1.25rem", fontWeight: 700 },
    h5: { fontSize: "1.125rem", fontWeight: 700 },
    h6: { fontSize: "1rem", fontWeight: 700 },
    body1: { fontSize: "1.0625rem" },
    body2: { fontSize: "0.9375rem" },
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { paddingInline: 22, fontWeight: 700, borderRadius: '0.5rem' },
        contained: { minHeight: 48 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", fullWidth: true, size: "medium" },
      styleOverrides: {
        root: { "& .MuiOutlinedInput-root": { borderRadius: "0.5rem" } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        elevation1: { boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: "1px solid #e2e8f0", backgroundColor: "#ffffff" },
      },
    },
  },
});