// import React from 'react'
// import { useState } from 'react'

// export default function Dashboard() {
//     return (<h1>supervisor Dashboard</h1>)
// }
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  AppBar, 
  Toolbar, 
  IconButton, 
  InputBase, 
  Avatar 
} from '@mui/material';
import { 
  HomeRounded, 
  AccountCircleRounded, 
  ChatRounded, 
  NotificationsRounded, 
  AddCircleRounded,
  ChevronRight
} from '@mui/icons-material';

const ProgramPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  
  const programDurations = [
    { id: 1, title: "9- Months", selected: true },
    { id: 2, title: "4 - Months", selected: false },
    { id: 3, title: "Summer Training", selected: true }
  ];
  
  const tracks = [
    { id: 1, title: "Full stack Web development Using Python" },
    { id: 2, title: "Open-source Application development" },
    { id: 3, title: "Full stack Web development Using PHP" },
    { id: 4, title: "Full stack Web development Using PHP" },
    { id: 5, title: "Full stack Web development Using PHP" },
  ];
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      bgcolor: '#1E1E1E', 
      color: 'white' 
    }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" color="inherit">
              <Avatar sx={{ bgcolor: 'white', width: 32, height: 32 }}>
                <Box component="img" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJibGFjayIgZD0iTTQgMjFWOWwxMC02TDI0IDl2MTJIMnYtMkgydjJINFptMiAwaDJ2LTVoOHY1aDJWMTBsLTYtMy42TDYgMTB2MTFabTQtN2MxLjEgMCAyLS45IDItMnMtLjktMi0yLTJzLTIgLjktMiAycy45IDIgMiAyWiIvPjwvc3ZnPg==" alt="Logo" sx={{ width: 24, height: 24 }} />
              </Avatar>
            </IconButton>
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                ml: 1,
                width: 200,
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, color: 'white' }}
                placeholder="#Explore"
                inputProps={{ 'aria-label': 'explore' }}
              />
            </Paper>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit">
              <HomeRounded />
            </IconButton>
            <IconButton color="inherit">
              <AccountCircleRounded />
            </IconButton>
            <IconButton color="inherit">
              <ChatRounded />
            </IconButton>
            <IconButton color="inherit" sx={{ bgcolor: 'rgba(255, 255, 0, 0.3)' }}>
              <NotificationsRounded sx={{ color: 'yellow' }} />
            </IconButton>
            <IconButton color="inherit">
              <AddCircleRounded />
            </IconButton>
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 32, height: 32 }} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Open-Source Department
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <Box sx={{ width: 210, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Program
          </Typography>
          
          <List>
            {programDurations.map((program) => (
              <ListItem 
                key={program.id} 
                sx={{ 
                  mb: 1, 
                  bgcolor: program.selected ? '#FFEB3B' : 'transparent',
                  color: program.selected ? 'black' : 'white',
                  borderRadius: 1,
                  p: 1
                }}
              >
                <ListItemText primary={program.title} />
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* Right Content */}
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Select Track
          </Typography>
          
          <List>
            {tracks.map((track) => (
              <ListItem 
                key={track.id}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  mb: 2, 
                  borderRadius: 1,
                  cursor: 'pointer'
                }}
              >
                <ListItemText primary={track.title} />
                <ListItemIcon sx={{ color: 'white' }}>
                  <ChevronRight />
                </ListItemIcon>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgramPage;