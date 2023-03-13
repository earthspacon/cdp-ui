import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { styled } from '@stitches/react';
import { Store } from 'effector';
import { useUnit } from 'effector-react';

import { ChildrenProp } from '@/shared/types/utility';
import { NoStyleLink } from '@/shared/ui/no-style-link';

import { mainDrawerItems } from './lib';

export function MainDrawer({ children }: ChildrenProp) {
  return (
    <Wrapper>
      <Drawer sx={drawerStyles} variant="permanent" anchor="left">
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

      <Body>{children}</Body>
    </Wrapper>
  );
}

interface ListItemBtnProps extends ChildrenProp {
  isRouteOpened: Store<boolean>;
}

function ListItemBtn({ isRouteOpened, children }: ListItemBtnProps) {
  const selected = useUnit(isRouteOpened);
  return <ListItemButton selected={selected}>{children}</ListItemButton>;
}

const Wrapper = styled('div', {
  display: 'flex',
});

const drawerWidth = 250;
const drawerStyles = {
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
};

const Body = styled('div', {
  width: '100%',
  height: '100%',
  padding: '30px',
});
