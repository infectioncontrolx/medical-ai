'use client';

// import feedbackImg from '@/public/OIP.jpeg';

import Image from 'next/image';
import Link from 'next/link';

import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Header() {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Stop animation after 5 seconds
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);
  const [lang, setLang] = useState('English');
  const [modelOpened, setModelOpened] = useState(false);
  const path = usePathname();
  const router = useParams();
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const currentLanguageFullName = useSelector(
    (state) => state.language.currentLanguageFullName
  );

  const appTitle = {
    en: 'AI Infection Prevention & Control Assistant for Healthcare Professionals',
    ar: 'المثقف الصحي لضيوف الرحمن',
    bn: 'আল্লাহর অতিথিদের জন্য এআই স্বাস্থ্য সহকারী',
    bm: 'Pembantu Kesihatan Kecerdasan Buatan untuk Tetamu Allah',
    ud: 'اللہ کے مہمانوں کے لیے اے آئی ہیلتھ اسسٹنٹ',
    fr: "Assistant Santé AI pour les Invités d'Allah",
    in: 'Asisten Kesehatan AI untuk Tamu Allah',
    tr: "Allah'ın Misafirleri için AI Sağlık Asistanı",
    hn: 'अल्लाह के मेहमानों के लिए एआई स्वास्थ्य सहायक',
    ks: 'Msaidizi wa Afya wa AI kwa Wageni wa Allah',
    fa: 'دستیار سلامت هوش مصنوعی برای مهمانان الله',
  };

  if (router?.id && path.startsWith('/healthcare')) {
    return null;
  }

  return (
    <div className=" shadow-sm flex gap-2 relative flex-col  pb-4  items-center bg-white ">
      <div className="flex justify-between items-center w-full px-4">
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/logo-new.png"
              height={100}
              width={100}
              alt="IPC Expert logo"
              className="mt-4 mb-2 w-32"
              priority
            />
          </Link>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/mhc-logo.png"
            alt="Makkah Health Cluster logo"
            width={200}
            height={200}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </div>
      <h1 className=" leading-7 sm:leading-8 my-1 text-[#2ca9e0] px-2 font-bold break-words text-lg text-center max-w-[99%] mx-auto">
        {/* {appTitle[currentLanguage]} */}
        AI Assistant for Infection Prevention & Control for Healthcare
        Professionals
      </h1>
      <div className="px-4 w-full flex justify-center items-center">
        {/* <div className="p-3 w-full flex justify-evenly flex-row items-center">
          <Image
            src={logoImg}

            height={120}
            width={120}
            alt="logo"
            // className=" mt-4 mb-2 w-full "
            className=" mt-4 mb-2 w-36"
            priority
          />
          <h1 className=" leading-7 my-1 text-red-500 px-2 font-bold text-lg text-center">

            WAAW 2024 Special Edition
          </h1>

        </div> */}
        {/* <div className="cursor-pointer " onClick={() => setModelOpened(true)}>
          <Image
            src={feedbackImg}
            height={35}
            width={35}
            alt="logo"
            className={`min-w-[40px] w-[45px] sm:w-[60px]  hover:scale-110 transition-transform
            ${isAnimating ? 'animate-[bounce_1s_ease-in-out_15]' : ''}`}
            priority
          />
        </div> */}
      </div>
      {/* <FeedBackModal setIsOpen={setModelOpened} isOpen={modelOpened} /> */}
    </div>
  );
}
