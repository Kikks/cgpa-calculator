import { FoldersIcon, HomeIcon, PhoneIcon, UserIcon } from 'lucide-react';

export const navLinks = [
  {
    url: '/dashboard',
    title: 'Dashboard',
    Icon: HomeIcon,
  },
  {
    url: '/dashboard/summary',
    title: 'Summary',
    Icon: FoldersIcon,
  },
  // {
  //   url: '/dashboard/profile',
  //   title: 'Profile',
  //   Icon: UserIcon,
  // },
  // {
  //   url: '/dashboard/contact',
  //   title: 'Contact Us',
  //   Icon: PhoneIcon,
  // },
];

export const fivePointGrades = [
  { grade: 'A', point: 5 },
  { grade: 'B', point: 4 },
  { grade: 'C', point: 3 },
  { grade: 'D', point: 2 },
  { grade: 'E', point: 1 },
  { grade: 'F', point: 0 },
];

export const sevenPointGrades = [
  { grade: 'A', point: 7 },
  { grade: 'B', point: 6 },
  { grade: 'C', point: 5 },
  { grade: 'D', point: 4 },
  { grade: 'D-', point: 3 },
  { grade: 'E', point: 2 },
  { grade: 'E-', point: 1 },
  { grade: 'F', point: 0 },
];

export const semesters = ['Harmattan', 'Rain'];
