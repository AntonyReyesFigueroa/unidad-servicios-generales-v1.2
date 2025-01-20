import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Footer from '@/structures/footer/footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Unidad de servicios generales",
  description: "Unidad de servicios generales de la Universidad Nacional de Cajamarca",
  icons: {
    icon: "/logo.png"
  }
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <UserProvider>
        <body className={inter.className}>

          {children}
          <Footer />
        </body>
      </UserProvider>
    </html>
  );
}
