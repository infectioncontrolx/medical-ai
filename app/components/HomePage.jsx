'use client';

import { experimental_useAssistant as useAssistant } from 'ai/react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { ReactTyped } from 'react-typed';
import remarkGfm from 'remark-gfm';
import FeedBackModal from './FeedBackModal';
const OpenAIAssistant = dynamic(() => import('./openai-assistant'), {
  ssr: false, // This ensures the component is only rendered on the client side
});
export default function HomePage() {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [modelOpened, setModelOpened] = useState(false);
  const placeHolderInput = {
    bn: '',
  };
  const { status, messages, submitMessage, input, handleInputChange, error } =
    useAssistant({
      api: '/api/assistant',
    });
  const [showAccordion, setShowAccordion] = useState(false);

  const [userInput, setUserInput] = useState('');
  const [suggestionLinks, setSuggestionLinks] = useState(true);

  const [answerBox, setAnswerBox] = useState(false);

  const [activeAnswer, setActiveAnswer] = useState({});

  //   useEffect(() => {
  //     // setLoading(false)
  //     const hasRendered = localStorage.getItem('feedBackForInit');
  //     if (!hasRendered) {
  //       setTimeout(() => {
  //         setModelOpened(true);
  //         localStorage.setItem('feedBackForInit', true); //Set flag
  //       }, 50000);
  //     }
  //   }, []);

  useEffect(() => {
    const type = searchParams.get('type');
    const department = searchParams.get('department');
    if (type) setSelectedType(type);
    if (department) setSelectedDepartment(department);
  }, [searchParams]);

  const readyQuestions = {
    en: [
      'What are the initial signs of heat exhaustion or stroke, and how to prevent them?',
      'What are effective ways to treat symptoms of a cough, flu, or fever?',
      'I am pregnant and have noticed some bleeding. What steps should I take immediately?',
      'How can I best manage my diabetes during Hajj?',
    ],

    ar: [
      'ما هي العلامات الأولية للإجهاد الحراري أو ضربة الشمس، وكيف يمكن الوقاية منها؟ ',

      ,
      'ما هي الطرق الفعالة لعلاج أعراض السعال والإنفلونزا والحمى؟',
      'أنا حامل ولاحظت نزيفا. ماذا يجب أن أفعل على الفور؟',
      'كيف يمكنني إدارة مرض السكري بأفضل شكل ممكن خلال الحج؟',
    ],

    fr: [
      'What are the initial signs of heat exhaustion or stroke, and how to prevent them?',
      'What are effective ways to treat symptoms of a cough, flu, or fever?',
      'I am pregnant and have noticed some bleeding. What steps should I take immediately?',
      'How can I best manage my diabetes during Hajj?',
    ],
    bn: [
      'তাপ ক্লান্তি বা স্ট্রোকের প্রাথমিক লক্ষণগুলি কী এবং কীভাবে সেগুলি প্রতিরোধ করা যায়?',
      'কাশি, ফ্লু বা জ্বরের লক্ষণগুলি কার্যকরভাবে নিরাময় করার উপায় কী কী?',
      'আমি গর্ভবতী এবং কিছু রক্তপাত লক্ষ্য করেছি। আমি তাৎক্ষণিকভাবে কী পদক্ষেপ নিতে পারি?',
      'হজের সময় আমি কীভাবে আমার ডায়াবেটিস সবচেয়ে ভালভাবে পরিচালনা করতে পারি?',
    ],
    bm: [
      'Apakah tanda-tanda awal keletihan haba atau strok, dan bagaimana untuk mencegahnya?',
      'Apakah cara yang berkesan untuk merawat gejala batuk, selesema, atau demam?',
      'Saya hamil dan telah melihat beberapa pendarahan. Apakah langkah yang perlu saya ambil segera?',
      'Bagaimana saya boleh menguruskan diabetes saya dengan baik semasa Haji?',
    ],
    ud: [
      'گرمی کے تھکن یا ہیٹ اسٹروک کی ابتدائی علامات کیا ہیں، اور ان سے بچاؤ کیسے کیا جا سکتا ہے؟',
      'کھانسی، فلو یا بخار کی علامات کے علاج کے مؤثر طریقے کیا ہیں؟',
      'میں حاملہ ہوں اور کچھ خون بہہ رہا ہے۔ مجھے فوری طور پر کیا اقدامات کرنے چاہئیں؟',
      'حج کے دوران اپنے ذیابیطس کو بہترین طریقے سے کیسے سنبھال سکتی ہوں؟',
    ],
  };

  const homePageElement = {
    en: {
      nearby: 'Medical Facilities',
      health: 'Health & Enviro Tips',
      plceholder: 'Type Your Question',
      FAQ: 'Few Examples To Ask',
      less: 'Less',
      more: 'More',
      examples: 'Examples',
      about: 'About',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      rights: 'All Rights Reserved',
    },
    ar: {
      nearby: 'المرافق الطبية',
      health: 'نصائح صحية وبيئية',
      plceholder: 'اكتب سؤالك',
      FAQ: 'بعض الأمثلة لتسأل',
      less: 'أقل',
      more: 'أكثر',
      examples: 'أمثلة',
      about: 'حول',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
      rights: 'جميع الحقوق محفوظة',
    },
    bn: {
      nearby: 'চিকিৎসা সুবিধা',
      health: 'স্বাস্থ্য ও পরিবেশ টিপস',
      plceholder: 'আপনার প্রশ্ন টাইপ করুন',
      FAQ: 'কিছু উদাহরণ জিজ্ঞাসা করতে',
      less: 'কম',
      more: 'আরও',
      examples: 'উদাহরণ',
      about: 'সম্পর্কিত',
      privacy: 'গোপনীয়তা নীতি',
      terms: 'ব্যবহারের শর্তাবলী',
      rights: 'সর্বস্বত্ব সংরক্ষিত',
    },
    bm: {
      nearby: 'Kemudahan Perubatan',
      health: 'Tips Kesihatan & Alam Sekitar',
      plceholder: 'Taip soalan anda',
      FAQ: 'Beberapa Contoh untuk Ditanya',
      less: 'Kurang',
      more: 'Lebih',
      examples: 'Contoh',
      about: 'Tentang',
      privacy: 'Dasar Privasi',
      terms: 'Syarat Penggunaan',
      rights: 'Hak Cipta Terpelihara',
    },
    ud: {
      nearby: 'طبی سہولیات',
      health: 'صحت اور ماحولیات کی تجاویز',
      plceholder: 'اپنا سوال ٹائپ کریں',
      FAQ: 'پوچھنے کے لیے چند مثالیں',
      less: 'کم',
      more: 'زیادہ',
      examples: 'مثالیں',
      about: 'کے بارے میں',
      privacy: 'رازداری کی پالیسی',
      terms: 'استعمال کی شرائط',
      rights: 'جملہ حقوق محفوظ ہیں',
    },
    fr: {
      nearby: 'Installations Médicales',
      health: 'Conseils Santé & Environnement',
      plceholder: 'Tapez votre question',
      FAQ: 'Quelques Exemples à Demander',
      less: 'Moins',
      more: 'Plus',
      examples: 'Exemples',
      about: 'À propos',
      privacy: 'Politique de Confidentialité',
      terms: "Conditions d'Utilisation",
      rights: 'Tous droits réservés',
    },
    in: {
      nearby: 'Fasilitas Medis',
      health: 'Tips Kesehatan & Lingkungan',
      plceholder: 'Ketik pertanyaan Anda',
      FAQ: 'Beberapa Contoh untuk Ditanyakan',
      less: 'Kurang',
      more: 'Lebih',
      examples: 'Contoh',
      about: 'Tentang',
      privacy: 'Kebijakan Privasi',
      terms: 'Syarat Penggunaan',
      rights: 'Hak Cipta Dilindungi',
    },
    tr: {
      nearby: 'Tıbbi Tesisler',
      health: 'Sağlık ve Çevre İpuçları',
      plceholder: 'Sorunuzu yazın',
      FAQ: 'Sorulacak Birkaç Örnek',
      less: 'Daha Az',
      more: 'Daha Fazla',
      examples: 'Örnekler',
      about: 'Hakkında',
      privacy: 'Gizlilik Politikası',
      terms: 'Kullanım Koşulları',
      rights: 'Tüm Hakları Saklıdır',
    },
    hn: {
      nearby: 'चिकित्सा सुविधाएं',
      health: 'स्वास्थ्य और पर्यावरण सुझाव',
      plceholder: 'अपना सवाल टाइप करें',
      FAQ: 'पूछने के लिए कुछ उदाहरण',
      less: 'कम',
      more: 'अधिक',
      examples: 'उदाहरण',
      about: 'के बारे में',
      privacy: 'गोपनीयता नीति',
      terms: 'उपयोग की शर्तें',
      rights: 'सर्वाधिकार सुरक्षित',
    },
    ks: {
      nearby: 'Vituo vya Matibabu',
      health: 'Vidokezo vya Afya na Mazingira',
      plceholder: 'Andika swali lako',
      FAQ: 'Mifano Michache ya Kuuliza',
      less: 'Chache',
      more: 'Zaidi',
      examples: 'Mifano',
      about: 'Kuhusu',
      privacy: 'Sera ya Faragha',
      terms: 'Masharti ya Matumizi',
      rights: 'Haki Zote Zimehifadhiwa',
    },
    fa: {
      nearby: 'تسهیلات پزشکی',
      health: 'نکات بهداشتی و محیط زیست',
      plceholder: 'سوال خود را تایپ کنید',
      FAQ: 'چند مثال برای پرسیدن',
      less: 'کمتر',
      more: 'بیشتر',
      examples: 'مثال‌ها',
      about: 'درباره',
      privacy: 'سیاست حفظ حریم خصوصی',
      terms: 'شرایط استفاده',
      rights: 'کلیه حقوق محفوظ است',
    },
  };

  const medical = {
    en: 'For Medical Consultations and Emergencies Call ',

    ar: 'للإستشارة الطبية أتصل على ',

    ud: 'طبی ایمرجنسی کی صورت میں 937 پر کال کریں',

    bn: ' জরুরী অবস্থার চিকিৎসা জন্য ৯৩৭ নম্বরে কল করুন',

    hn: 'चिकित्सा आपातकाल के लिए 937 पर कॉल करें',

    ks: 'Kwa Dharura za Matibabu Piga simu 937',

    tr: "Acil Tıbbi Durumlar İçin 937'yi arayın",

    fr: ' Pour les urgences médicales Appelez le 937',

    bm: 'Untuk Kecemasan Perubatan Hubungi 937',

    in: 'Untuk Keadaan Darurat Medis Hubungi 937',

    fa: 'برای اورژانس‌های پزشکی با 937 تماس بگیرید',
  };
  const logoText = {
    ar: 'الراعي الصحي',
    en: 'Healthcare Sponsor',
    ud: 'Healthcare Sponsor',
    bn: 'Healthcare Sponsor',
    hn: 'Healthcare Sponsor',
    tr: 'Healthcare Sponsor',
    fr: 'Healthcare Sponsor',
    bm: 'Healthcare Sponsor',
    in: 'Healthcare Sponsor',
    fa: 'Healthcare Sponsor',
  };
  const sponsorText = {
    ar: 'شركاء النجاح',
    en: 'Success partners',
    ud: 'Success partners',
    bn: 'Success partners',
    hn: 'Success partners',
    ks: 'Success partners',
    tr: 'Success partners',
    fr: 'Success partners',
    bm: 'Success partners',
    in: 'Success partners',
    fa: 'Success partners',
  };

  const hanleCloseClick = () => {
    setAnswerBox(false);
    setUserInput('');
    setSuggestionLinks(true);
  };

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  const inputRef = useRef(null);
  useEffect(() => {
    if (status === 'awaiting_message') {
      inputRef.current?.focus();
    }
  }, [status]);

  const handleSerchClick = () => {
    setEnabled(!enabled);
  };
  const activeAnswerRef = useRef(null);
  const executeScroll = () => activeAnswerRef.current.scrollIntoView();

  const handleSelectQuestion = (prompt) => {
    console.log({ prompt });
  };
  {
    console.log('i am from 🤦‍♂️ => ', activeAnswer?.answer);
  }
  return (
    <div className=" flex flex-col w-full h-auto items-center mt-2 overflow-hidden ">
      {/* <div className="navigate flex items-center flex-wrap justify-center gap-4 my-10  w-full sm:text-sm  ">
        <Link href="/medical" className="">
          <button className=" bg-[#085f61] flex gap-2 justify-between  px-2 rounded-lg  text-[14px] text-white font-semibold py-2">
            {homePageElement[currentLanguage]?.nearby}
            <span>
              <span>
                <Image
                  src="/loc.svg"
                  width={15}
                  height={10}
                  alt="medical image"
                  className="h-5"
                />
              </span>
            </span>
          </button>
        </Link>
        <Link href="/healthcare" className="">
          <button
            className="bg-[#085f61] flex gap-2 justify-between px-2 rounded-lg  text-[14px] text-white
          py-2 font-semibold items-center "
          >
            {homePageElement[currentLanguage]?.health}
            <span>
              <Image
                src="./flashcardicon.png"
                width={22}
                height={23}
                alt="health-image"
                className=" "
              />
            </span>
          </button>
        </Link>
      </div> */}
      {/* <HealthcareSelector handleSelectQuestion={handleSelectQuestion} /> */}
      <div className="w-[97%] flex items-center justify-center rounded-lg">
        <OpenAIAssistant
          assistantId="asst_rp7mKcsIJsmKzQETXUIaO3yU"
          userInput={userInput}
          setUserInput={setUserInput}
        />
      </div>
      <div
        ref={activeAnswerRef}
        className="w-4/5 px-4 mt-1 bg-[#F0F4F9] rounded-lg"
      >
        {activeAnswer?.question && (
          <div className="w-4/5 py-4 bg-[#F0F4F9] rounded-lg ">
            <div
              className={`mx-3 ${
                'user'
                  ? 'bg-[#1d3b70] w-fit  px-4 py-3 md:font-semibold right-2 text-white  mb-8 rounded-lg'
                  : 'font-bold text-[#1d3b70] leading-7 '
              } ${
                currentLanguage === 'ar' ? 'text-right' : 'text-left'
              }   overflow-auto openai-text relative`}
            >
              {activeAnswer?.question[currentLanguage]}
            </div>
          </div>
        )}

        {activeAnswer?.answer && (
          <div className="bg-white rounded-lg sm:text-sm py-2 flex items-center -mt-6 mb-4">
            <div
              className={`mx-4 ${
                false
                  ? 'bg-white  rounded-lg sm:text-sm w-fit px-0 py-3 flex items-center'
                  : 'bg-white  rounded-lg sm:text-sm w-fit px-0 py-3 flex items-center'
              } ${
                currentLanguage === 'ar' ? 'text-right' : 'text-left'
              }   overflow-auto openai-text relative`}
            >
              <Markdown remarkPlugins={[remarkGfm]}>
                <ReactTyped
                  strings={[activeAnswer?.answer[currentLanguage]]}
                  typeSpeed={10}
                />
              </Markdown>
            </div>
          </div>
        )}
      </div>

      {/* <div className="w-[96%] lg:w-[97%] relative border-2 border-[#1d3b70] rounded-lg px-6 mx-4 text-center shadow my-4">
        <div className="absolute -top-4 inset-x-0 flex justify-center">
          <span className="bg-white text-[#0CAFB8] px-4 text-2xl font-bold">
            {sponsorText[currentLanguage]}
          </span>
        </div>

        <div className="w-full">
          <TransitionSliderLogo />
        </div>
      </div> */}

      <FeedBackModal setIsOpen={setModelOpened} isOpen={modelOpened} />
    </div>
  );
}
