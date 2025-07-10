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
import { SelectedBusinessContext } from './context/SelectedBusinessContext';
import { UserLocationContext } from './context/UserLocationContext';
import Feedbacks from './components/Feedbacks';
const inter = Inter({ subsets: ['latin'], preload: true, display: 'swap' });

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
            console.log(pos);
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
                            <div className="flex flex-col min-h-screen max-w-2xl mx-auto">
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
                                    <div className="flex-grow">{children}</div>
                                </Suspense>
                                {/* {pathName !== '/medical' && <Feedbacks />} */}
                                {/* Conditionally render the footer */}
                                {pathName !== '/medical' && (
                                    <Footer className="mt-auto w-full fixed bottom-0" />
                                )}
                            </div>
                        </UserLocationContext.Provider>
                    </SelectedBusinessContext.Provider>
                </Provider>
            </body>
        </html>
    );
}
