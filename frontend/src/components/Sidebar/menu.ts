import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import { ElementType } from 'react';
import { AddBox, School } from '@mui/icons-material';

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
    id: 'student',
    title: 'Student',
    icon: School,
    path: '/dashboard/student'
  },
  {
    id: 'class',
    title: 'Class',
    icon: AddBox,
    path: '/dashboard/class'
  },
];
