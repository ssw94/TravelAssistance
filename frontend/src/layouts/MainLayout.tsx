import React from 'react';
import { Box, Container, Fab, Tooltip } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SmartToyIcon from '@mui/icons-material/SmartToy';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../features/assistant/components/ChatWidget';
import { useAppDispatch } from '../store/store';
import { toggleChatDrawer } from '../store/slices/uiSlice';

export const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 4 } }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      {/* Floating AI Assistant Trigger */}
      <Tooltip title="AI Travel Assistant" placement="left">
        <Fab
          color="primary"
          aria-label="chat with AI travel assistant"
          onClick={() => dispatch(toggleChatDrawer())}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            boxShadow: '0 8px 24px rgba(2, 132, 199, 0.45)',
          }}
        >
          <SmartToyIcon />
        </Fab>
      </Tooltip>

      <ChatWidget />
      <Footer />
    </Box>
  );
};
export default MainLayout;
