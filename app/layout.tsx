import './globals.css'
import { Inter,  } from 'next/font/google'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter =Inter ({ subsets: ["latin"]})

export const metadata = {
  title: 'InStock',
  description: 'A stock taking application for shopping malls and stores.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {children}
            <ToastContainer />
      </body>
  
    </html>
  )
}
