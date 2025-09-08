import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';

export default function Footer() {
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  const footerItems = {
    en: {
      about: 'About Us',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
    },
    ar: {
      about: 'من نحن',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
    },
    fr: {
      about: 'A propos de nous',
      privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation",
    },
    it: {
      about: 'A proposito di noi',
      privacy: 'Informativa sulla privacy',
      terms: 'Termini di utilizzo',
    },
    bn: {
      about: 'আমাদের সম্পর্কে',
      privacy: 'গোপনীয়তা নীতি',
      terms: 'ব্যবহারের শর্তাবলী',
    },
    bm: {
      about: 'Tentang Kami',
      privacy: 'Dasar Privasi',
      terms: 'Syarat Penggunaan',
    },
    ud: {
      about: 'ہمارے بارے میں',
      privacy: 'پرائیویسی پالیسی',
      terms: 'استعمال کی شرائط',
    },
  };

  const copyRights = {
    en: 'All Rights Reserved. ',
    ar: 'كل الحقوق محفوظة.️ ',
    fr: 'Toutes les droits sont réservés.️ ',
    it: 'Tutti i diritti riservati.️ ',
    bn: '  কপিরাইট সর্বস্বত্ব সংরক্ষিত। ',
    bm: 'Hak Cipta Terpelihara.️',
    ud: 'جملہ حقوق محفوظ ہیں۔️',
  };
  return (
    <div className="w-full pb-2 pt-2   border-t-2  border-[#0a5c64] h-fit ">
      <div className="flex justify-between px-4 gap-2 items-center w-full  ">
        <div className=" ">
          <Image src={'/footer.png'} alt="diaf" width={60} height={60} />
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex self-end items-center gap-4 text-[11px] font-semibold tracking-normal text-[#a2a0a5]">
            <Link href="/about">{footerItems[currentLanguage]?.about}</Link>
            <Link href="/privacy">{footerItems[currentLanguage]?.privacy}</Link>
            <Link href="/terms">{footerItems[currentLanguage]?.terms}</Link>
          </div>
          <p className="text-[#a2a0a5] text-[11px] text-center py-1">
            {copyRights[currentLanguage]}
            {new Date().getFullYear()} ©
          </p>
        </div>
      </div> 
               <div class="mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center px-5 py-3 rounded shadow-lg font-medium text-base">
  🚀 This application is currently in <span class="font-semibold">Beta</span>. Some features may change or improve!
</div>
    </div>
  );
}
