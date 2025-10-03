'use client';
import { Inter } from 'next/font/google';
import './globals.css';
// import "./globalicon.css";
import Loader from '@/components/Shared/Loader';
import { GoogleTagManager } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Provider } from 'react-redux'; // For Redux
import 'sweetalert2/src/sweetalert2.scss';
import { GA_TRACKING_ID, pageview } from '../lib/gtag';
import store from './../lib/store';
import Footer from './components/Footer';
import Header from './components/Header';
import WhatsAppButton from './components/WhatsAppButton';
import { SelectedBusinessContext } from './context/SelectedBusinessContext';
import { UserLocationContext } from './context/UserLocationContext';
const inter = Inter({ subsets: ['latin'], preload: true, display: 'swap' });

import bgImage from '@/public/pattern.png';

export default function RootLayout({ children }) {
  const pathName = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window?.gtag) {
        pageview(pathName);
      }
    }
  }, [pathName]);

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(function (pos) {
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };

  //   useEffect(() => {
  //     getUserLocation();
  //   }, []);
  const [userLocation, setUserLocation] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const isAdminChats = pathName === '/admin/chats';

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/Favicon.ico" type="icon" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
          }}
        />
      </head>
      <GoogleTagManager gtmId="GTM-K6TWCJ6G" />
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Provider store={store}>
          <SelectedBusinessContext.Provider
            value={{ selectedBusiness, setSelectedBusiness }}
          >
            <UserLocationContext.Provider
              value={{ userLocation, setUserLocation }}
            >
              <div
                className={`flex flex-col min-h-screen ${
                  isAdminChats ? 'max-w-7xl' : 'max-w-2xl'
                } mx-auto`}
              >
                {pathName !== '/medical' && <Header />}

                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-screen relative">
                      <div className="flex items-center justify-center absolute top-[30%]">
                        <Loader />
                      </div>
                    </div>
                  }
                >
                  <div
                    className="flex-grow"
                    style={{
                      background: isAdminChats ? '' : `url(${bgImage.src})`,
                      backgroundPosition: 'bottom',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'contain',
                    }}
                  >
                    {children}
                  </div>
                </Suspense>
                {/* {pathName !== '/medical' && <Feedbacks />} */}
                {/* Conditionally render the footer */}
                {pathName !== '/medical' && (
                  <Footer className="mt-auto w-full fixed bottom-0" />
                )}

                {/* WhatsApp floating button */}
                <a
                  href="https://wa.me/message/I34R4JJHX7COA1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-500 shadow-lg hover:bg-green-600 transition-colors duration-200"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    fill="currentColor"
                    className="w-8 h-8 md:w-10 md:h-10 text-white"
                  >
                    <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.393L4 29l7.828-2.05C13.41 27.633 14.686 28 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.18 0-2.337-.207-3.433-.614l-.245-.09-4.65 1.217 1.24-4.527-.16-.234C7.23 18.13 6.5 16.6 6.5 15c0-5.238 4.262-9.5 9.5-9.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5zm5.29-7.29c-.29-.145-1.71-.844-1.974-.94-.264-.097-.456-.145-.648.145-.193.29-.744.94-.912 1.133-.168.193-.336.217-.626.072-.29-.145-1.225-.452-2.334-1.44-.863-.77-1.445-1.72-1.615-2.01-.168-.29-.018-.447.127-.592.13-.13.29-.336.435-.504.145-.168.193-.29.29-.483.097-.193.048-.362-.024-.507-.072-.145-.648-1.566-.888-2.146-.234-.563-.472-.486-.648-.495-.168-.007-.362-.009-.555-.009-.193 0-.507.072-.773.362-.264.29-1.01.99-1.01 2.415 0 1.425 1.034 2.803 1.178 2.997.145.193 2.04 3.12 4.95 4.253.692.298 1.23.475 1.65.606.693.22 1.324.19 1.82.115.555-.082 1.71-.698 1.953-1.372.24-.674.24-1.252.168-1.372-.072-.12-.264-.193-.555-.338z" />
                  </svg>
                </a>
              </div>
              <WhatsAppButton />
            </UserLocationContext.Provider>
          </SelectedBusinessContext.Provider>
        </Provider>
      </body>
    </html>
  );
}
