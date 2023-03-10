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
import { Store } from 'effector';
import { useUnit } from 'effector-react';

import { ChildrenProp } from '@/shared/types/utility';
import { NoStyleLink } from '@/shared/ui/no-style-link';

import { mainDrawerItems } from './lib';

const drawerWidth = 250;

export function MainDrawer({ children }: ChildrenProp) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />

        <List>
          {mainDrawerItems.map((drawerItem) => (
            <ListItem key={drawerItem.title}>
              <NoStyleLink to={drawerItem.route}>
                <ListItemBtn isRouteOpened={drawerItem.route.$isOpened}>
                  <ListItemText primary={drawerItem.title} />
                </ListItemBtn>
              </NoStyleLink>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box sx={{ width: '100%', height: '100%', p: '30px' }}>{children}</Box>
    </Box>
  );
}

interface ListItemBtnProps extends ChildrenProp {
  isRouteOpened: Store<boolean>;
}

function ListItemBtn({ isRouteOpened, children }: ListItemBtnProps) {
  const selected = useUnit(isRouteOpened);
  return <ListItemButton selected={selected}>{children}</ListItemButton>;
}
