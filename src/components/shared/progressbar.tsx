'use client';
import { AppProgressBar } from 'next-nprogress-bar';

export default function Progressbar() {
  return (
    <AppProgressBar
      height="4px"
      color="#110AD4"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
