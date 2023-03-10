import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material';

import { ChildrenProp } from '@/shared/types/utility';

export function MainDrawer({ children }: ChildrenProp) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {children}
      <h1>Integration</h1>
      {/* <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
      </Box> */}
    </Box>
  );
}
