'use client';

import Image from 'next/image';
import { useSelector } from 'react-redux';

export default function SponsorLogo() {
  const logoText = {
    ar: 'الراعي الصحي',
    en: 'Healthcare Sponsor',
    ud: 'Healthcare Sponsor',
    bn: 'Healthcare Sponsor',
    hn: 'Healthcare Sponsor',
    ks: 'Healthcare Sponsor',
    tr: 'Healthcare Sponsor',
    fr: 'Healthcare Sponsor',
    bm: 'Healthcare Sponsor',
    in: 'Healthcare Sponsor',
    fa: 'Healthcare Sponsor',
  };

  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  return (
    <div className="relative border-2 border-green-600 rounded-lg px-6 pb-6 mx-4 my-12 text-center shadow">
      <div className="absolute -top-4 inset-x-0 flex justify-center">
        <span className="bg-white px-4 text-2xl font-bold">
          {logoText[currentLanguage]}
        </span>
      </div>
      <div className="flex justify-center mt-6">
        {' '}
        <Image
          src="/mhc-logo.png"
          alt="Sponsor Logos"
          width={200}
          height={100}
          className="max-w-full h-auto"
          priority
        />
      </div>
    </div>
  );
}
