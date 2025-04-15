import { Drawer, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import MenuItems from './MenuItems';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppDispatch, useAppSelector } from '../../store/store';
import { closeMobile } from '../../store/reducers/sidebarReducer';

const drawerWidth = 240;
const collapsedWidth = 72;

const Sidebar = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const { collapsed, mobileOpen } = useAppSelector((state: RootState) => state.sidebar);
  const actualCollapsed = collapsed || isMediumScreen;

  const drawerContent = (
    <>
      <Toolbar />
      <MenuItems
        collapsed={actualCollapsed}
        onItemClick={() => {
          if (isSmallScreen) dispatch(closeMobile());
        }}
      />
    </>
  );

  return isSmallScreen ? (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={() => dispatch(closeMobile())}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      sx={{
        width: actualCollapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: actualCollapsed ? collapsedWidth : drawerWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: 'border-box',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
