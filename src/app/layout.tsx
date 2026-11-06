import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ORDORA — Orders made effortless | Restaurant Ordering, POS & Management Platform',
  description:
    'The complete operating system for modern food businesses. QR Dine-in, Takeaway, Cloud POS, Kitchen Display System (KDS), Inventory, Multi-Outlet and CRM.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col bg-ordora-ivory text-ordora-charcoal selection:bg-ordora-coral selection:text-white">
        {children}
      </body>
    </html>
  );
}
