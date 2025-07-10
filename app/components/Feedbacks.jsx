'use client';

import feedbackImg from '@/public/rate-us.png';

import Image from 'next/image';

import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import FeedBackModal from './FeedBackModal';

export default function Feedbacks() {
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

  if (router?.id && path.startsWith('/healthcare')) {
    return null;
  }

  return (
    <div className=" flex gap-2 relative flex-col mt-6 pb-4  items-center">
      
      <div className="px-4 w-full flex justify-center items-center">
        <div className="cursor-pointer " onClick={() => setModelOpened(true)}>
          <Image
            src={feedbackImg}
            height={35}
            width={35}
            alt="logo"
            className={`w-[140px] `}
            priority
          />
        </div>
      </div>
      <FeedBackModal setIsOpen={setModelOpened} isOpen={modelOpened} />
    </div>
  );
}
