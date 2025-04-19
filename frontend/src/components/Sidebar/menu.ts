import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListIcon from '@mui/icons-material/FormatListBulleted';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TuneIcon from '@mui/icons-material/Tune';
import { ElementType } from 'react';

export interface MenuItem {
  id: string;
  title: string;
  icon: ElementType;
  path?: string;
  children?: MenuItem[];
  external?: boolean;
  disabled?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard',
  },
  {
    id: 'faculty',
    title: 'Faculty',
    icon: PeopleIcon,
    path: '/dashboard/faculty'
  },
  {
    id: 'users',
    title: 'Users',
    icon: PeopleIcon,
    children: [
      {
        id: 'users-list',
        title: 'List Users',
        icon: ListIcon,
        path: '/users/list',
      },
      {
        id: 'users-add',
        title: 'Add User',
        icon: PersonAddIcon,
        path: '/users/add',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: SettingsIcon,
    children: [
      {
        id: 'settings-profile',
        title: 'Profile',
        icon: AccountCircleIcon,
        path: '/settings/profile',
      },
      {
        id: 'settings-preferences',
        title: 'Preferences',
        icon: TuneIcon,
        path: '/settings/preferences',
      },
    ],
  },
];
