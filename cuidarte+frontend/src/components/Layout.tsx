import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { type ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;