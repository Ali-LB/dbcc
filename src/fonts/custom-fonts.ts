import localFont from 'next/font/local';

// Custom font for headings and titles - Mini Wakuwaku
export const headingFont = localFont({
  src: [
    {
      path: './mini-wakuwaku.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-heading',
  display: 'swap',
});

// Maru variant of Mini Wakuwaku for display text
export const displayFont = localFont({
  src: [
    {
      path: './mini-wakuwaku-maru.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-display',
  display: 'swap',
}); 