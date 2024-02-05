import { Roboto } from 'next/font/google';

export const fontSans = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-sans',
});
