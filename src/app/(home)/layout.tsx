import '@/app/globals.css';
import logo from '@/assets/logo.png';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ouvidoria UniEvangelica',
  description: 'Ouvidoria Faculdade UniEvangelica',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex-1">
        <Image src={logo} alt="logo" className="m-auto mt-4 h-12" />
      </div>
      <main className={inter.className}>{children}</main>
    </div>
  );
}
