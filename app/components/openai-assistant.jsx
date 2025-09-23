/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { ReactTyped } from 'react-typed';

import API from '@/lib/instance/instance';
import bgImage from '@/public/pattern.png';
import Image from 'next/image';
import { AssistantStream } from 'openai/lib/AssistantStream';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineRobot, AiOutlineUser } from 'react-icons/ai';
import { TfiHandPointLeft, TfiHandPointRight } from 'react-icons/tfi';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import HealthcareSelector from './HealthcareSelector';

export default function OpenAIAssistant({
  //   assistantId = 'asst_rp7mKcsIJsmKzQETXUIaO3yU',
  userInput,
  setUserInput,
}) {
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [assistantId, setAssistantId] = useState('');
  const [streamingMessage, setStreamingMessage] = useState({
    id: 'Thinking...',
    role: 'assistant',
    content: '_Thinking..._',
    createdAt: new Date(),
  });
  const messageId = useRef(0);

  // set default greeting Message
  // const greetingMessage = {
  //     id: "greeting",
  //     role: "assistant",

  //     createdAt: new Date(),
  // };

  const placeholder = {
    en: 'Type your question...',
    bn: 'আপনার প্রশ্ন টাইপ করুন',
    ar: 'اكتب سؤالك',
    bm: 'Taip soalan anda',
    ud: 'اپنا سوال ٹائپ کریں',
    fr: 'Tapez votre question...',
    in: 'Ketik pertanyaan Anda...',
    tr: 'Sorunuzu yazın...',
    hn: 'अपना सवाल टाइप करें...',
    ks: 'Andika swali lako...',
    fa: 'سوال خود را تایپ کنید',
  };
  const disabledPlaceholder = {
    en: 'Please select your organization',
    bn: 'চালাতে একটি অপশন বেছে নিন',
    ar: 'تابع باختيار خيار',
    bm: 'Pilih satu untuk teruskan',
    ud: 'آگے بڑھنے کے لیے انتخاب کریں',
    fr: 'Choisissez pour continuer',
    in: 'Pilih untuk lanjut',
    tr: 'Devam için seçin',
    hn: 'जारी रखने के लिए चुनें',
    ks: 'Chagua ili kuendelea',
    fa: 'برای ادامه انتخاب کنید',
  };

  const instructions = {
    selectButton: {
      en: 'Please select your organization',
      bn: 'চালাতে একটি অপশন বেছে নিন',
      ar: 'تابع باختيار خيار',
      bm: 'Pilih satu untuk teruskan',
      ud: 'آگے بڑھنے کے لیے انتخاب کریں',
      fr: 'Choisissez pour continuer',
      in: 'Pilih untuk lanjut',
      tr: 'Devam için seçin',
      hn: 'जारी रखने के लिए चुनें',
      ks: 'Chagua ili kuendelea',
      fa: 'برای ادامه انتخاب کنید',
    },
    inputPlaceHolder: {
      en: 'Type your question',
      bn: 'আপনার প্রশ্ন লিখুন',
      ar: 'اكتب استفسارك',
      bm: 'Taip soalan anda',
      ud: 'اپنا سوال لکھیں',
      fr: 'Saisissez votre question',
      in: 'Ketik pertanyaan Anda',
      tr: 'Sorunuzu yazın',
      hn: 'अपना प्रश्न लिखें',
      ks: 'پنُن سوال لِکھیو',
      fa: 'سوال خود را تایپ کنید',
    },
    infectionText: {
      en: 'Infection Control Resources',
      bn: 'সংক্রমণ নিয়ন্ত্রণের সম্পদ',
      ar: 'الأدلة والمراجع العلمية في مجال مكافحة العدوى',
      bm: 'Sumber Kawalan Jangkitan',
      ud: 'انفیکشن کنٹرول وسائل',
      fr: 'Ressources pour le contrôle des infections',
      in: 'Sumber daya pengendalian infeksi',
      tr: 'Enfeksiyon Kontrol Kaynakları',
      hn: 'संक्रमण नियंत्रण संसाधन',
      ks: 'انفیکشن کنٹرول وسائل',
      fa: 'منابع کنترل عفونت',
    },
  };

  const [suggesstions, setSuggestions] = useState([]);

  const [suggestionLinks, setSuggestionLinks] = useState(true);
  const [answer, setAnswer] = useState({});
  const [answerBox, setAnswerBox] = useState(false);
  const [predefinedQuestions, setPredefinedQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState('');

  

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === 'phc') {
      setAssistantId('asst_tQzyG4yOKaC9RWlchzmzH0JD');
    } else {
      setAssistantId('asst_a4CVqRL4lQvtCW8JCRWaCpV1');
    }
    setInputValue('');
  };

  //   asst_a4CVqRL4lQvtCW8JCRWaCpV1 hospital
  // asst_tQzyG4yOKaC9RWlchzmzH0JD ipc

  const getQuestions = async () => {
    // await fetch("api/questions")
    //     .then((res) => res.json())
    //     .then((data) => setPredefinedQuestions(data));

    const data = [
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What vaccinations are required before traveling for Hajj?',
          fr: 'Quelles vaccinations sont nécessaires avant de voyager pour le Hajj ?',
          ud: 'حج کے لیے سفر سے پہلے کون سے ٹیکے ضروری ہیں؟',
          de: 'Welche Impfungen sind vor der Reise zum Haddsch erforderlich?',
          ar: 'ما هي التطعيمات المطلوبة قبل السفر لأداء الحج؟',
          bm: 'Apakah vaksinasi yang diperlukan sebelum mengerjakan Haji?',
          tr: 'Hacca gitmeden önce hangi aşılar gereklidir?',
          bn: 'হজ্জে যাওয়ার আগে কোন টিকাগুলি প্রয়োজন?',
        },
        answer: {
          en: 'Meningococcal meningitis (mandatory), Influenza, Hepatitis A and B, Polio, Tetanus, Typhoid, Covid-19.',
          fr: 'Méningite à méningocoques (obligatoire), Grippe, Hépatite A et B, Polio, Tétanos, Typhoïde, Covid-19.',
          ud: 'میننجوکوکل میننجائٹس (لازمی)، فلو، ہیپاٹائٹس اے اور بی، پولیو، تشنج، ٹائیفائیڈ، کووڈ - 19۔',
          de: 'Meningokokken-Meningitis (verpflichtend), Grippe, Hepatitis A und B, Polio, Tetanus, Typhus, Covid-19.',
          ar: 'التهاب السحايا بالمكورات السحائية (إلزامي)، الإنفلونزا، التهاب الكبد A و B، شلل الأطفال، الكزاز، التيفوئيد، كوفيد-19.',
          bm: 'Meningitis meningokokus (wajib), Influenza, Hepatitis A dan B, Polio, Tetanus, Typhoid, Covid-19.',
          tr: 'Meningokok menenjit (zorunlu), Grip, Hepatit A ve B, Polio, Tetanos, Tifo, Covid-19.',
          bn: 'মেনিনজোকোকাল মেনিনজাইটিস (আবশ্যিক), ইনফ্লুয়েঞ্জা, হেপাটাইটিস এ এবং বি, পোলিও, টিটেনাস, টাইফয়েড, কোভিড-১৯।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I protect myself from heatstroke during Hajj?',
          fr: 'Comment puis-je me protéger des coups de chaleur pendant le Hajj ?',
          ud: 'حج کے دوران ہیٹ اسٹروک سے خود کو کیسے بچا سکتا ہوں؟',
          de: 'Wie kann ich mich während des Haddsch vor einem Hitzschlag schützen?',
          ar: 'كيف يمكنني حماية نفسي من ضربة الشمس أثناء الحج؟',
          bm: 'Bagaimana saya boleh melindungi diri daripada strok haba semasa Haji?',
          tr: 'Hac sırasında güneş çarpmasından nasıl korunabilirim?',
          bn: 'হজ্জের সময় কীভাবে নিজেকে হিটস্ট্রোক থেকে রক্ষা করতে পারি?',
        },
        answer: {
          en: 'Stay hydrated by drinking plenty of water. Wear loose, light-colored clothing. Use an umbrella or hat to shade yourself. Take frequent breaks in shaded or air-conditioned areas. Avoid outdoor activities during peak sun hours.',
          fr: "Restez hydraté en buvant beaucoup d'eau. Portez des vêtements amples et de couleur claire. Utilisez un parapluie ou un chapeau pour vous protéger du soleil. Faites des pauses fréquentes dans des endroits ombragés ou climatisés. Évitez les activités extérieures pendant les heures de pointe du soleil.",
          ud: 'زیادہ پانی پی کر خود کو ہائیڈریٹ رکھیں۔ ڈھیلے، ہلکے رنگ کے کپڑے پہنیں۔ اپنے آپ کو سایہ دینے کے لیے چھتری یا ٹوپی استعمال کریں۔ سایہ دار یا ایئر کنڈیشنڈ جگہوں پر بار بار آرام کریں۔ دھوپ کے اوقات میں باہر کی سرگرمیوں سے پرہیز کریں۔',
          de: 'Bleiben Sie hydratisiert, indem Sie viel Wasser trinken. Tragen Sie lockere, helle Kleidung. Verwenden Sie einen Regenschirm oder Hut, um sich zu schützen. Machen Sie häufig Pausen in schattigen oder klimatisierten Bereichen. Vermeiden Sie Aktivitäten im Freien während der Hauptsonnenstunden.',
          ar: 'ابقَ مُرتويًا بشرب الكثير من الماء. ارتدِ ملابس فضفاضة وفاتحة اللون. استخدم مظلة أو قبعة لتظليل نفسك. خذ فترات راحة متكررة في مناطق مظللة أو مكيفة. تجنب الأنشطة الخارجية خلال ساعات الذروة الشمسية.',
          bm: 'Kekal hidrat dengan minum banyak air. Pakai pakaian yang longgar dan berwarna terang. Gunakan payung atau topi untuk melindungi diri anda. Ambil rehat yang kerap di kawasan teduh atau berhawa dingin. Elakkan aktiviti luar semasa waktu puncak matahari.',
          tr: 'Bol su içerek susuz kalmayın. Bol, açık renkli giysiler giyin. Kendinizi korumak için şemsiye veya şapka kullanın. Gölgeli veya klimalı alanlarda sık sık mola verin. Güneşin en yoğun olduğu saatlerde dışarıda aktivitelerden kaçının.',
          bn: 'প্রচুর পানি পান করে হাইড্রেটেড থাকুন। ঢিলা, হালকা রঙের পোশাক পরুন। নিজেকে ছায়া দিতে একটি ছাতা বা টুপি ব্যবহার করুন। ছায়াযুক্ত বা এয়ার-কন্ডিশন্ড এলাকায় ঘন ঘন বিরতি নিন। চূড়ান্ত সূর্য সময়ে আউটডোর কার্যকলাপ এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I face dehydration during the pilgrimage?',
          fr: 'Que dois-je faire si je suis déshydraté pendant le pèlerinage ?',
          ud: 'حج کے دوران خود کو خشکی کا سامنا ہوتا ہے تو میں کیا کروں؟',
          de: 'Was soll ich tun, wenn ich während der Pilgerfahrt dehydriere?',
          ar: 'ماذا يجب أن أفعل إذا واجهت الجفاف خلال الحج؟',
          bm: 'Apa yang harus saya lakukan jika saya menghadapi dehidrasi semasa melakukan ibadah haji?',
          tr: 'Hac sırasında susuzlukla karşılaşırsam ne yapmalıyım?',
          bn: 'হজে যাওয়ার সময় আমি কি করবো যদি আমি ডিহাইড্রেশনের সম্মুখীন হই?',
        },
        answer: {
          en: 'Drink oral rehydration solutions or sports drinks. Rest in a cool, shaded area. Seek medical assistance if symptoms persist or worsen.',
          fr: "Buvez des solutions de réhydratation orale ou des boissons pour sportifs. Reposez-vous dans un endroit frais et ombragé. Cherchez de l'aide médicale si les symptômes persistent ou s'aggravent.",
          ud: 'دہائی کے حل یا کھیلنے والے مشروبات پینے کا مشورہ دیں۔ ٹھنڈے، سایہ دار علاقے میں آرام کریں۔ علامات مستقل یا بہتر ہونے کی صورت میں طبی مدد حاصل کریں۔',
          de: 'Trinken Sie orale Rehydratationslösungen oder Sportgetränke. Ruhen Sie sich an einem kühlen, schattigen Ort aus. Suchen Sie ärztliche Hilfe, wenn die Symptome anhalten oder sich verschlimmern.',
          ar: 'اشرب محاليل إعادة التحلية عن طريق الفم أو المشروبات الرياضية. استرح في منطقة باردة ومظللة. اطلب المساعدة الطبية إذا استمرت الأعراض أو تفاقمت.',
          bm: 'Minum larutan rehidrasi oral atau minuman sukan. Berehat di kawasan yang sejuk dan berbayang. Cari bantuan perubatan jika gejala berterusan atau bertambah teruk.',
          tr: 'Oral rehidrasyon çözeltileri veya spor içecekleri içmek. Serin, gölgeli bir alanda dinlenmek. Belirtiler devam eder veya kötüleşirse tıbbi yardım aramak.',
          bn: 'শারীরিক প্রশ্ন স্থায়ী অথবা খারাপ হলে মেডিকেল সাহায্য চাইতেন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Are there any specific dietary recommendations during Hajj?',
          fr: 'Y a-t-il des recommandations alimentaires spécifiques pendant le Hajj ?',
          ud: 'حج کے دوران کوئی خاص غذائی تجویزات ہیں؟',
          de: 'Gibt es während der Haddsch spezifische Ernährungsempfehlungen?',
          ar: 'هل هناك أي توصيات غذائية محددة خلال الحج؟',
          bm: 'Adakah sebarang cadangan diet tertentu semasa Haji?',
          tr: 'Hac sırasında herhangi özel bir diyet önerisi var mı?',
          bn: 'হজের সময় কোন নিশ্চিত আহারিক পরামর্শ আছে?',
        },
        answer: {
          en: 'Eat light, balanced meals. Avoid very spicy or oily foods. Prioritize fruits, vegetables, and lean proteins. Stay away from street food or unhygienic places.',
          fr: 'Mangez des repas légers et équilibrés. Évitez les aliments très épicés ou gras. Donnez la priorité aux fruits, légumes et protéines maigres. Éloignez-vous des aliments de rue ou des endroits non hygiéniques.',
          ud: 'ہلکے، متوازن خوراک کھائیں۔ بہت تیز یا تیلیہ کھانے سے بچیں۔ پھل، سبزیاں اور پروٹین کی اہمیت کو ترجیح دیں۔ سڑک کے کھانے یا غیر صحت بخش جگہوں سے دور رہیں۔',
          de: 'Essen Sie leichte, ausgewogene Mahlzeiten. Vermeiden Sie sehr würzige oder fettige Speisen. Geben Sie Obst, Gemüse und magerem Eiweiß Vorrang. Halten Sie sich von Straßenessen oder unhygienischen Orten fern.',
          ar: 'تناول وجبات خفيفة ومتوازنة. تجنب تناول الأطعمة الحارة أو الدهنية جدًا. أعط الأولوية للفواكه والخضروات والبروتينات الخالية من الدهون. ابتعد عن الطعام الشارعي أو الأماكن غير الصحية.',
          bm: 'Makan makanan ringan dan seimbang. Elakkan makanan yang sangat pedas atau berminyak. Utamakan buah-buahan, sayur-sayuran, dan protein ringan. Jauhi makanan jalanan atau tempat yang tidak higienik.',
          tr: 'Hafif, dengeli yemekler yiyin. Çok baharatlı veya yağlı yiyeceklerden kaçının. Meyve, sebze ve az yağlı proteinlere öncelik verin. Sokak yiyeceklerinden veya hijyenik olmayan yerlerden uzak durun.',
          bn: 'হালকা, সামঞ্জস্যপূর্ণ খাবার খাওয়া উচিত। খুব তীব্র বা তেলো খাবার এড়িয়ে চলুন। ফল, সবজি এবং হাঁসল প্রোটিনে প্রাথমিকতা দিন। রাস্তার খাবার বা অস্বাস্থ্যকর জায়গাদি থেকে দূরে থাকুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What items should I include in my first aid kit?',
          fr: 'Quels articles dois-je inclure dans ma trousse de premiers secours ?',
          ud: 'پہلی ایڈ کٹ میں کون سی اشیاء شامل کرنی چاہیں؟',
          de: 'Welche Gegenstände sollte ich in mein Erste-Hilfe-Set aufnehmen?',
          ar: 'ما هي العناصر التي يجب أن أضعها في علبة الإسعافات الأولية؟',
          bm: 'Apakah barang yang patut saya masukkan dalam kit pertolongan cemas saya?',
          tr: 'İlk yardım çantanıza hangi eşyaları eklemeliyim?',
          bn: 'আমার প্রথম সাহায্য বাক্সে কি আইটেম যোগ করতে হবে?',
        },
        answer: {
          en: 'Antiseptic wipes, Band-aids and bandages, Pain relievers (e.g., paracetamol, ibuprofen), Anti-diarrhea medication, Oral rehydration salts, Personal medications, Sunscreen and lip balm',
          fr: ' Lingettes antiseptiques, pansements et bandages, Analgésiques (par exemple, paracétamol, ibuprofène), Médicaments contre la diarrhée, Sels de réhydratation orale, Médicaments personnels, Crème solaire et baume à lèvres',
          ud: 'ضد عفونت وائپ، بینڈ-ایڈ اور بینڈیجز، درد کم کن کی دوائیاں (مثال کے طور پر، پیراسیٹامول، ایبوپروفین)، آنٹی اسکاپےٹیک دوائی، آرال ری ہائیڈریشن نمک، ذاتی دوائیں، سانسکرین اور لپ بالم',
          de: 'Antiseptische Tücher, Pflaster und Verbände, Schmerzmittel (z.B. Paracetamol, Ibuprofen), Medikamente gegen Durchfall, Orale Rehydratisierungssalze, Persönliche Medikamente, Sonnencreme und Lippenbalsam',
          ar: 'مناديل مطهرة، البند-ايدز والضمادات، مسكنات الألم (على سبيل المثال، الباراسيتامول، الإيبوبروفين)، دواء مضاد للإسهال، أملاح إعادة التحلية عن طريق الفم، الأدوية الشخصية، واقي الشمس ومرطب الشفاه',
          bm: 'Tisu antiseptik, Penutup luka dan perban, Penahan sakit (contohnya, parasetamol, ibuprofen), Ubat anti-diare, Garam rehidrasi oral, Ubat peribadi, Sunscreen dan lip balm',
          tr: 'Antiseptik mendiller, Band-aid ve bandajlar, Ağrı kesiciler (örneğin, parasetamol, ibuprofen), İshal ilacı, Oral rehidrasyon tuzları, Kişisel ilaçlar, Güneş kremi ve dudak kremi',
          bn: 'এন্টিসেপটিক ওয়াইপ, ব্যান্ড-এইড এবং ব্যান্ডেজ, ব্যথা শান্তি প্রদানকারী (উদাহরণস্বরূপ, প্যারাসিটামল, ইবুপ্রোফেন), অ্যান্টি-ডায়ারিয়া ওষুধ, ওড়াল রিহাইড্রেশন সল্ট, ব্যক্তিগত ওষুধ, সানস্ক্রিন এবং লিপ বাম',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I ensure my medications remain effective in the hot weather?',
          fr: "Comment puis-je m'assurer que mes médicaments restent efficaces par temps chaud ?",
          ud: 'گرمی کی موسم میں اپنی دوائیوں کی کارکردگی کو کیسے یقینی بنایا جائے؟',
          de: 'Wie kann ich sicherstellen, dass meine Medikamente bei heißem Wetter wirksam bleiben?',
          ar: 'كيف يمكنني التأكد من أن أدويتي تظل فعالة في الطقس الحار؟',
          bm: 'Bagaimana saya boleh memastikan ubat-ubatan saya kekal berkesan dalam cuaca panas?',
          tr: 'İlaçlarımın sıcak havalarda etkili olmasını nasıl sağlayabilirim?',
          bn: 'গরম আবহাওয়ায় আমার ঔষধের কার্যক্ষমতা কিভাবে নিশ্চিত করতে পারি?',
        },
        answer: {
          en: 'Keep medications in a cool, dry place. Use a thermal insulated bag. Avoid direct sunlight exposure.',
          fr: "Gardez les médicaments dans un endroit frais et sec. Utilisez un sac isolé thermiquement. Évitez l'exposition directe au soleil.",
          ud: 'دوائیوں کو ٹھنڈی، خشک جگہ میں رکھیں۔ ایک تھرمل انسولیٹڈ بیگ استعمال کریں۔ سیدھی دھوپ کی تش exposure  سے بچیں۔',
          de: 'Bewahren Sie Medikamente an einem kühlen, trockenen Ort auf. Verwenden Sie eine thermisch isolierte Tasche. Vermeiden Sie direkte Sonneneinstrahlung.',
          ar: 'احتفظ بالأدوية في مكان بارد وجاف. استخدم حقيبة معزولة حراريًا. تجنب التعرض المباشر لأشعة الشمس.',
          bm: 'Simpan ubat dalam tempat yang sejuk dan kering. Gunakan beg terisolasi termal. Elakkan pendedahan terus kepada sinar matahari.',
          tr: 'İlaçları serin, kuru bir yerde saklayın. Bir termal yalıtımlı çanta kullanın. Doğrudan güneş ışığına maruz kalmaktan kaçının.',
          bn: 'ঔষধ ঠান্ডা, শুষ্ক জায়গায় রাখুন। একটি থার্মাল ইনসুলেটেড ব্যাগ ব্যবহার করুন। সরাসরি সূর্যের আলোর প্রকাশ থেকে বিরত থাকুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What steps can I take to avoid infections during the pilgrimage?',
          fr: 'Quelles mesures puis-je prendre pour éviter les infections pendant le pèlerinage ?',
          ud: 'پلیگریم کے دوران انفیکشن سے بچنے کے لئے میں کون سی اقدامات اٹھا سکتا ہوں؟',
          de: 'Welche Maßnahmen kann ich ergreifen, um Infektionen während der Pilgerreise zu vermeiden?',
          ar: 'ما الخطوات التي يمكنني اتخاذها لتجنب العدوى خلال الحج؟',
          bm: 'Langkah-langkah apa yang boleh saya ambil untuk mengelakkan jangkitan semasa ziarah?',
          tr: 'Hac sırasında enfeksiyonlardan kaçınmak için neler yapabilirim?',
          bn: 'হজ পালনের সময় সংক্রমণ থেকে কীভাবে বিরতি নিতে পারি?',
        },
        answer: {
          en: 'Regularly wash your hands with soap and water. Use hand sanitizers. Avoid touching your face. Keep your living area clean and disinfected. Wear face masks in crowded areas.',
          fr: "Lavez régulièrement vos mains avec du savon et de l'eau. Utilisez des désinfectants pour les mains. Évitez de toucher votre visage. Gardez votre espace de vie propre et désinfecté. Portez des masques faciaux dans les zones bondées.",
          ud: 'با ساپ اور پانی سے اپنے ہاتھوں کو باقاعدگی سے دھوئیں۔ ہینڈ سینیٹائزر استعمال کریں۔ اپنا چہرہ چھونے سے بچیں۔ اپنے رہنے کے علاقے کو صاف اور جراثیم سے پاک رکھیں۔ بھیڑوں والے علاقوں میں چہرہ ماسک پہنیں۔',
          de: 'Waschen Sie regelmäßig Ihre Hände mit Seife und Wasser. Verwenden Sie Handdesinfektionsmittel. Berühren Sie nicht Ihr Gesicht. Halten Sie Ihren Wohnbereich sauber und desinfiziert. Tragen Sie in überfüllten Bereichen Gesichtsmasken.',
          ar: 'اغسل يديك بانتظام بالصابون والماء. استخدم مطهرات اليدين. تجنب لمس وجهك. احتفظ بمنطقتك المعيشية نظيفة ومعقمة. ارتدي أقنعة الوجه في المناطق المزدحمة.',
          bm: 'Basuh tangan anda dengan kerap menggunakan sabun dan air. Gunakan pembersih tangan. Elakkan sentuhan wajah anda. Pastikan kawasan tinggal anda bersih dan disterilkan. Pakailah topeng muka di kawasan sesak.',
          tr: 'Ellerinizi düzenli olarak sabun ve su ile yıkayın. El dezenfektanları kullanın. Yüzünüze dokunmaktan kaçının. Yaşam alanınızı temiz ve dezenfekte edin. Kalabalık alanlarda yüz maskesi takın.',
          bn: 'নিয়মিতভাবে সাবান এবং পানিতে আপনার হাত ধুয়ে দিন। হ্যান্ড স্যানিটাইজার ব্যবহার করুন। আপনার মুখে স্পর্শ করা এড়িয়ে চলুন। আপনার বাসার এলাকাটি পরিষ্কার এবং ডিসিনফেক্টেড রাখুন। জনবহুল এলাকায় মুখ মাস্ক পরেন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What personal hygiene practices should I follow?',
          fr: "Quelles pratiques d'hygiène personnelle dois-je suivre ?",
          ud: 'میں کس طرح کے ذاتی صحت کے انداز کو اپنائے؟',
          de: 'Welche persönlichen Hygienepraktiken sollte ich befolgen?',
          ar: 'ما هي الممارسات الصحية الشخصية التي يجب أن أتبعها؟',
          bm: 'Amalan kebersihan diri apa yang patut saya ikuti?',
          tr: 'Hangi kişisel hijyen uygulamalarını takip etmeliyim?',
          bn: 'আমি কীভাবে ব্যক্তিগত স্বাস্থ্য অভ্যাস অনুসরণ করব?',
        },
        answer: {
          en: 'Frequent handwashing. Regular showers. Keep your clothing clean. Trim nails to prevent infections.',
          fr: 'Lavage fréquent des mains. Douches régulières. Gardez vos vêtements propres. Coupez les ongles pour éviter les infections.',
          ud: 'با قدر ممکن ہاتھ دھونا۔ باقاعدگی سے نہانا۔ اپنے کپڑے صاف رکھیں۔ انفیکشن سے بچاؤ کے لئے ناخن کاٹیں۔',
          de: 'Häufiges Händewaschen. Regelmäßige Duschen. Halten Sie Ihre Kleidung sauber. Schneiden Sie Ihre Nägel, um Infektionen vorzubeugen.',
          ar: 'غسل اليدين بانتظام. الاستحمام الدوري. احتفظ بملابسك نظيفة. قص الأظافر لتجنب العدوى.',
          bm: 'Pembersihan tangan yang kerap. Mandi secara berkala. Pastikan pakaian anda bersih. Memotong kuku untuk mengelakkan jangkitan.',
          tr: 'Sık sık el yıkama. Düzenli duş alın. Giysilerinizi temiz tutun. Enfeksiyonları önlemek için tırnaklarınızı düzenli olarak kesin.',
          bn: 'নিয়মিত হাত ধোয়া। নিয়মিত সানান। আপনার পোশাকগুলি সাফ রাখুন। ইনফেকশন প্রতিরোধের জন্য নখ করে নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How do I deal with blisters on my feet from walking long distances?',
          fr: 'Comment puis-je traiter les ampoules sur mes pieds après avoir marché sur de longues distances ?',
          ud: 'طویل فاصلہ طے کرنے سے پیر پر چھالے کا سامنا ہوتا ہے تو میں کیسے نپٹ سکتا ہوں؟',
          de: 'Wie gehe ich mit Blasen an meinen Füßen nach langem Gehen um?',
          ar: 'كيف يمكنني التعامل مع الفقاعات على قدمي من المشي لمسافات طويلة؟',
          bm: 'Bagaimana saya mengatasi lepuh di kaki saya dari berjalan jauh?',
          tr: 'Uzun mesafe yürüyüşlerinden kaynaklanan ayakta kabarcıklarla nasıl başa çıkabilirim?',
          bn: 'দীর্ঘ দূরত্ব চলার পরে আমার পায়ে ব্লিস্টার সঙ্গে কিভাবে বিবেচনা করব?',
        },
        answer: {
          en: 'Wear comfortable, well-fitted footwear. Use blister pads or moleskin. Wash and dry your feet thoroughly. Apply antibiotic ointment if needed.',
          fr: 'Portez des chaussures confortables et bien ajustées. Utilisez des pansements anti-ampoules ou de la peau de chamois. Lavez et séchez vos pieds soigneusement. Appliquez une pommade antibiotique si nécessaire.',
          ud: 'آرام دہ، اچھی بجا، پہنے۔ چھالوں کے پیڈ یا مولیسکن استعمال کریں۔ اپنے پیر کو خوبصورتی سے دھوئیں اور خشک کریں۔ ضرورت پڑنے پر مضاد حیاتیاتی مرہم لگائیں۔',
          de: 'Tragen Sie bequeme, gut sitzende Schuhe. Verwenden Sie Blasenpflaster oder Moltex. Waschen und trocknen Sie Ihre Füße gründlich. Tragen Sie bei Bedarf eine antibiotische Salbe auf.',
          ar: 'ارتدي أحذية مريحة ومناسبة تمامًا. استخدم لاصقات للفقاعات أو الجلد الاصطناعي. اغسلي قدميك وجففيهما جيدًا. ضعي مرهمًا مضادًا للبكتيريا إذا لزم الأمر.',
          bm: 'Pakailah kasut yang selesa dan sesuai. Gunakan pad lepuh atau kulit kambing liar. Cuci dan keringkan kaki anda dengan teliti. Sapukan salep antibiotik jika perlu.',
          tr: 'Rahat, uygun ayakkabılar giyin. Kabarcıklar için yama veya özel ped kullanın. Ayaklarınızı iyice yıkayın ve kurulayın. Gerektiğinde antibiyotik merhem uygulayın.',
          bn: 'সুগম, ভাল সাইজের ফুটউয়্যার পরেন। ব্লিস্টার প্যাড বা মোলস্কিন ব্যবহার করুন। আপনার পা ভালোভাবে ধুয়ে এবং শুষ্ক করুন। প্রয়োজনে জীবাণুনাশক মেনে ব্যবহার করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Can I continue my fast if I fall ill during Hajj?',
          fr: 'Puis-je continuer mon jeûne si je tombe malade pendant le Hajj ?',
          ud: 'اگر میں حج کے دوران بیمار ہو جاؤں تو کیا میں اپنا روزہ جاری رکھ سکتا ہوں؟',
          de: 'Kann ich mein Fasten fortsetzen, wenn ich während des Haddsch krank werde?',
          ar: 'هل يمكنني مواصلة صيامي إذا مرضت أثناء الحج؟',
          bm: 'Bolehkah saya meneruskan puasa saya jika saya jatuh sakit semasa Haji?',
          tr: 'Hac sırasında hastalanırsam orucumu devam ettirebilir miyim?',
          bn: 'হজ্জের সময় যদি আমি অসুস্থ হয়ে যাই তাহলে কি আমি আমার রোজা চালিয়ে যাতে পারি?',
        },
        answer: {
          en: "It's advisable to break your fast if you're seriously ill. Your health takes precedence, and you can make up missed fasts later.",
          fr: 'Il est conseillé de rompre le jeûne en cas de maladie grave. Votre santé passe en premier, et vous pouvez rattraper les jeûnes manqués plus tard.',
          ud: 'اگر آپ بہت زیادہ بیمار ہیں تو روزہ توڑنا بہتر ہے۔ آپ کی صحت سب سے اہم ہے، اور آپ بعد میں نقصان کے روزے قضا کر سکتے ہیں۔',
          de: 'Es ist ratsam, das Fasten zu brechen, wenn Sie schwer krank sind. Ihre Gesundheit hat Vorrang, und Sie können versäumte Fastentage später nachholen.',
          ar: 'من النصح تفطير صومك إذا كنت مريضًا بشكل خطير. تأتي صحتك في المقام الأول، ويمكنك تعويض الصيامات المفقودة لاحقًا.',
          bm: 'Adalah disarankan untuk membatalkan puasa jika anda sakit dengan serius. Kesihatan anda adalah keutamaan, dan anda boleh mengganti puasa yang terlepas kemudian.',
          tr: 'Ciddi bir hastaysanız orucunuzu bozmanız tavsiye edilir. Sağlığınız önceliklidir ve kaçırılan oruçları daha sonra telafi edebilirsiniz.',
          bn: 'যদি আপনি গভীরভাবে অসুস্থ হন তবে আপনার রোজা ভেঙ্গে দেওয়া উচিত। আপনার স্বাস্থ্য অগ্রাধিকার, এবং আপনি পরে অনুপ্রাণিত রোজা পূরণ করতে পারেন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I manage chronic illnesses such as diabetes or hypertension while performing Hajj?',
          fr: "Comment puis-je gérer les maladies chroniques telles que le diabète ou l'hypertension pendant le Hajj ?",
          ud: 'میں حج کرتے وقت ذیابیطس یا ہائی بلڈ پریشر جیسی دائمی بیماریوں کا کیسے خیال رکھوں؟',
          de: 'Wie kann ich chronische Krankheiten wie Diabetes oder Bluthochdruck während des Haddsch managen?',
          ar: 'كيف يمكنني التحكم في الأمراض المزمنة مثل السكري أو ارتفاع ضغط الدم أثناء أداء الحج؟',
          bm: 'Bagaimana saya boleh menguruskan penyakit kronik seperti diabetes atau hipertensi semasa menjalankan Haji?',
          tr: 'Hac sırasında diyabet veya hipertansiyon gibi kronik hastalıkları nasıl yönetebilirim?',
          bn: 'হজ্জ করার সময় আমি কিভাবে ডায়াবেটিস বা উচ্চ রক্তচাপ সহিত ক্রোনিক রোগ পরিচালনা করতে পারি?',
        },
        answer: {
          en: 'Carry enough medications. Monitor your health regularly. Maintain a healthy diet. Stay hydrated and avoid stress.',
          fr: 'Apportez suffisamment de médicaments. Surveillez régulièrement votre santé. Maintenez une alimentation saine. Restez hydraté et évitez le stress.',
          ud: 'کافی مقدار میں ادویات ساتھ رکھیں۔ اپنی صحت کا باقاعدگی سے معائنہ کریں۔ صحت مند غذا برقرار رکھیں۔ ہائیڈریٹ رہیں اور تناؤ سے بچیں۔',
          de: 'Nehmen Sie genügend Medikamente mit. Überwachen Sie regelmäßig Ihre Gesundheit. Ernähren Sie sich gesund. Bleiben Sie hydratisiert und vermeiden Sie Stress.',
          ar: 'احمل ما يكفي من الأدوية. راقب صحتك بانتظام. حافظ على نظام غذائي صحي. حافظ على رطوبتك وتجنب الإجهاد.',
          bm: 'Bawa ubat yang mencukupi. Pantau kesihatan anda secara berkala. Kekalkan diet yang sihat. Kekal terhidrasi dan elakkan tekanan.',
          tr: 'Yeterince ilaç taşıyın. Sağlığınızı düzenli olarak izleyin. Sağlıklı bir diyet sürdürün. Susuz kalmayın ve stresten kaçının.',
          bn: 'পর্যাপ্ত ওষুধ সাথে রাখুন। নিয়মিত আপনার স্বাস্থ্যের পর্যবেক্ষণ করুন। স্বাস্থ্যকর খাদ্য বজায় রাখুন। হাইড্রেটেড থাকুন এবং চাপ এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I get lost in the crowd?',
          fr: 'Que dois-je faire si je me perds dans la foule ?',
          ud: 'اگر میں بھیڑ میں کھو جاؤں تو مجھے کیا کرنا چاہیے؟',
          de: 'Was soll ich tun, wenn ich mich in der Menge verliere?',
          ar: 'ماذا أفعل إذا ضعت في الزحام؟',
          bm: 'Apa yang perlu saya lakukan jika saya tersesat dalam kerumunan?',
          tr: 'Kalabalıkta kaybolursam ne yapmalıyım?',
          bn: 'ভিড়ের মধ্যে হারিয়ে গেলে আমি কী করব?',
        },
        answer: {
          en: 'Stay calm and find a recognizable landmark. Seek help from officials or volunteers. Have a contact card with your group’s details.',
          fr: "Restez calme et trouvez un repère reconnaissable. Demandez de l'aide aux officiels ou aux bénévoles. Ayez une carte de contact avec les coordonnées de votre groupe.",
          ud: 'پرسکون رہیں اور کوئی پہچاننے والا نشان تلاش کریں۔ اہلکاروں یا رضاکاروں سے مدد طلب کریں۔ اپنے گروپ کی تفصیلات کے ساتھ ایک رابطہ کارڈ رکھیں۔',
          de: 'Bleiben Sie ruhig und finden Sie ein erkennbares Wahrzeichen. Bitten Sie Beamte oder Freiwillige um Hilfe. Haben Sie eine Kontaktkarte mit den Angaben Ihrer Gruppe.',
          ar: 'ابق هادئًا وابحث عن معلم معروف. اطلب المساعدة من المسؤولين أو المتطوعين. احمل بطاقة اتصال تحتوي على تفاصيل مجموعتك.',
          bm: 'Kekal tenang dan cari mercu tanda yang dikenali. Dapatkan bantuan daripada pegawai atau sukarelawan. Bawa kad hubungan dengan butiran kumpulan anda.',
          tr: 'Sakin olun ve tanınabilir bir yer bulun. Yetkililerden veya gönüllülerden yardım isteyin. Grubunuzun bilgilerini içeren bir iletişim kartı taşıyın.',
          bn: 'শান্ত থাকুন এবং একটি স্বীকৃত ল্যান্ডমার্ক খুঁজুন। কর্মকর্তাদের বা স্বেচ্ছাসেবকদের কাছ থেকে সাহায্য চান। আপনার দলের বিবরণ সহ একটি যোগাযোগ কার্ড রাখুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I protect my respiratory health in a crowded environment?',
          fr: 'Comment puis-je protéger ma santé respiratoire dans un environnement bondé ?',
          ud: 'بھیڑ والے ماحول میں اپنی سانس کی صحت کا تحفظ کیسے کر سکتا ہوں؟',
          de: 'Wie kann ich meine Atemwege in einer überfüllten Umgebung schützen?',
          ar: 'كيف يمكنني حماية صحة الجهاز التنفسي في بيئة مزدحمة؟',
          bm: 'Bagaimana saya boleh melindungi kesihatan pernafasan saya di persekitaran yang sesak?',
          tr: 'Kalabalık bir ortamda solunum sağlığımı nasıl koruyabilirim?',
          bn: 'ভিড়ের পরিবেশে কীভাবে আমি আমার শ্বাসযন্ত্রের স্বাস্থ্য রক্ষা করতে পারি?',
        },
        answer: {
          en: 'Wear a face mask. Avoid direct exposure to dust and smoke. Use a saline nasal spray to keep nasal passages moist.',
          fr: "Portez un masque facial. Évitez l'exposition directe à la poussière et à la fumée. Utilisez un spray nasal salin pour garder les voies nasales humides.",
          ud: 'چہرے کا ماسک پہنیں۔ دھول اور دھوئیں سے براہ راست نمائش سے بچیں۔ ناک کے راستوں کو نم رکھنے کے لئے ایک نمکین ناک سپرے استعمال کریں۔',
          de: 'Tragen Sie eine Gesichtsmaske. Vermeiden Sie direkten Kontakt mit Staub und Rauch. Verwenden Sie ein salzhaltiges Nasenspray, um die Nasengänge feucht zu halten.',
          ar: 'ارتدِ قناع الوجه. تجنب التعرض المباشر للغبار والدخان. استخدم رذاذ الأنف الملحي للحفاظ على رطوبة الممرات الأنفية.',
          bm: 'Pakai topeng muka. Elakkan pendedahan langsung kepada habuk dan asap. Gunakan semburan hidung garam untuk menjaga saluran hidung lembap.',
          tr: 'Yüz maskesi takın. Toz ve dumana doğrudan maruz kalmaktan kaçının. Burun pasajlarını nemli tutmak için tuzlu burun spreyi kullanın.',
          bn: 'মুখোশ পরুন। ধুলো এবং ধোঁয়ার সরাসরি এক্সপোজার এড়িয়ে চলুন। নাকের পথগুলি স্যাঁতসেঁতে রাখতে একটি স্যালাইন নাসাল স্প্রে ব্যবহার করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do in case of a stampede or overcrowding?',
          fr: 'Que dois-je faire en cas de bousculade ou de surpeuplement ?',
          ud: 'بھیڑ یا بھگدڑ کی صورت میں مجھے کیا کرنا چاہیے؟',
          de: 'Was soll ich bei einer Massenpanik oder Überfüllung tun?',
          ar: 'ماذا أفعل في حالة حدوث تدافع أو اكتظاظ؟',
          bm: 'Apa yang perlu saya lakukan sekiranya berlaku rempuhan atau kesesakan?',
          tr: 'Bir izdiham veya aşırı kalabalık durumunda ne yapmalıyım?',
          bn: 'একটি পদদলিত বা জনাকীর্ণ পরিস্থিতিতে আমি কী করব?',
        },
        answer: {
          en: 'Stay calm and move with the crowd. Avoid pushing and try to stay on your feet. Look for exits and move towards open spaces.',
          fr: 'Restez calme et déplacez-vous avec la foule. Évitez de pousser et essayez de rester debout. Cherchez des sorties et dirigez-vous vers des espaces ouverts.',
          ud: 'پرسکون رہیں اور ہجوم کے ساتھ چلیں۔ دھکا دینے سے بچیں اور اپنے پیروں پر کھڑے رہنے کی کوشش کریں۔ نکلنے کے راستے دیکھیں اور کھلی جگہوں کی طرف بڑھیں۔',
          de: 'Bleiben Sie ruhig und bewegen Sie sich mit der Menge. Vermeiden Sie Drücken und versuchen Sie, auf den Beinen zu bleiben. Suchen Sie nach Ausgängen und bewegen Sie sich in offene Bereiche.',
          ar: 'ابق هادئًا وتحرك مع الحشد. تجنب الدفع وحاول البقاء على قدميك. ابحث عن المخارج وانتقل إلى الأماكن المفتوحة.',
          bm: 'Kekal tenang dan bergerak bersama orang ramai. Elakkan menolak dan cuba kekal berdiri. Cari pintu keluar dan bergerak ke kawasan terbuka.',
          tr: 'Sakin kalın ve kalabalıkla birlikte hareket edin. İtmekten kaçının ve ayakta kalmaya çalışın. Çıkışları arayın ve açık alanlara yönelin.',
          bn: 'শান্ত থাকুন এবং ভিড়ের সাথে চলুন। ধাক্কা দেওয়া এড়িয়ে চলুন এবং আপনার পায়ে থাকার চেষ্টা করুন। প্রস্থানগুলি সন্ধান করুন এবং খোলা জায়গার দিকে যান।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How do I recognize the signs of a heat-related illness?',
          fr: "Comment reconnaître les signes d'une maladie liée à la chaleur ?",
          ud: 'میں گرمی سے متعلق بیماری کی علامات کو کیسے پہچان سکتا ہوں؟',
          de: 'Wie erkenne ich die Anzeichen einer hitzebedingten Erkrankung?',
          ar: 'كيف أتعرف على علامات الأمراض المتعلقة بالحرارة؟',
          bm: 'Bagaimana saya boleh mengenali tanda-tanda penyakit berkaitan haba?',
          tr: 'Sıcağa bağlı bir hastalığın belirtilerini nasıl tanırım?',
          bn: 'তাপ-সম্পর্কিত অসুস্থতার লক্ষণগুলি আমি কীভাবে চিনতে পারি?',
        },
        answer: {
          en: 'Symptoms include headache, dizziness, nausea, and profuse sweating. Severe cases can lead to confusion, lack of sweating, and fainting.',
          fr: 'Les symptômes incluent des maux de tête, des étourdissements, des nausées et une transpiration abondante. Les cas graves peuvent entraîner de la confusion, un manque de transpiration et des évanouissements.',
          ud: 'علامات میں سر درد، چکر آنا، متلی اور زیادہ پسینہ آنا شامل ہیں۔ شدید صورتوں میں الجھن، پسینے کی کمی اور بے ہوشی شامل ہو سکتی ہے۔',
          de: 'Zu den Symptomen gehören Kopfschmerzen, Schwindel, Übelkeit und starkes Schwitzen. Schwere Fälle können zu Verwirrung, fehlendem Schwitzen und Ohnmacht führen.',
          ar: 'تشمل الأعراض الصداع، والدوخة، والغثيان، والتعرق الشديد. قد تؤدي الحالات الشديدة إلى الارتباك، وعدم التعرق، والإغماء.',
          bm: 'Gejala termasuk sakit kepala, pening, loya, dan berpeluh banyak. Kes yang teruk boleh menyebabkan kekeliruan, kekurangan peluh, dan pengsan.',
          tr: 'Belirtiler arasında baş ağrısı, baş dönmesi, mide bulantısı ve aşırı terleme bulunur. Ciddi vakalarda kafa karışıklığı, terlemenin olmaması ve bayılma görülebilir.',
          bn: 'লক্ষণগুলির মধ্যে রয়েছে মাথাব্যথা, মাথা ঘোরা, বমি বমি ভাব এবং প্রচুর ঘাম। গুরুতর ক্ষেত্রে বিভ্রান্তি, ঘামের অভাব এবং অজ্ঞান হয়ে যাওয়া অন্তর্ভুক্ত থাকতে পারে।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Where can I find medical assistance in the Hajj areas?',
          fr: 'Où puis-je trouver une assistance médicale dans les zones du Hajj ?',
          ud: 'حج کے علاقوں میں طبی معاونت کہاں دستیاب ہوسکتی ہے؟',
          de: 'Wo finde ich medizinische Hilfe in den Hajj-Gebieten?',
          ar: 'أين يمكنني العثور على المساعدة الطبية في مناطق الحج؟',
          bm: 'Di mana saya boleh mencari bantuan perubatan di kawasan Haji?',
          tr: 'Hac alanlarında tıbbi yardımı nereden bulabilirim?',
          bn: 'হজ্জ এলাকায় আমি কোথায় চিকিৎসাযোগ্য সাহায্য পাব?',
        },
        answer: {
          en: 'Medical tents and centers are available at various points in Mina, Arafat, and Muzdalifah. Emergency services and ambulances patrol the area.',
          fr: "Des tentes médicales et des centres sont disponibles à différents endroits à Mina, Arafat et Muzdalifah. Des services d'urgence et des ambulances patrouillent la zone.",
          ud: 'مینا، عرفات اور مضافاتہ میں مختلف نقاط پر طبی شاملے اور سنٹر دستیاب ہیں۔ ایمرجنسی خدمات اور ایمبولینس پٹرول کرتی ہیں۔',
          de: 'Medizinische Zelte und Zentren sind an verschiedenen Stellen in Mina, Arafat und Muzdalifah verfügbar. Notfalldienste und Krankenwagen patrouillieren in der Gegend.',
          ar: 'تتوفر خيام طبية ومراكز في نقاط مختلفة في منى وعرفات ومزدلفة. تقوم خدمات الطوارئ والإسعافات بدوريات في المنطقة.',
          bm: 'Tenda dan pusat perubatan tersedia di pelbagai tempat di Mina, Arafat, dan Muzdalifah. Perkhidmatan kecemasan dan ambulans menjalankan rondaan di kawasan tersebut.',
          tr: "Mina, Arafat ve Muzdalifah'ta çeşitli noktalarda tıbbi çadırlar ve merkezler bulunmaktadır. Acil servisler ve ambulanslar bölgeyi devriye geziyor.",
          bn: 'মিনা, আরাফাত এবং মুয়াদ্ধালিফাহে বিভিন্ন স্থানে চিকিৎসা টেন্ট এবং কেন্দ্র পাওয়া যায়। জরুরী সেবা এবং এম্বুলেন্স এলাকায় প্যাট্রোল করে।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What are the emergency contact numbers I should keep handy?',
          fr: "Quels sont les numéros de contact d'urgence que je devrais avoir à portée de main ?",
          ud: 'مجھے کون سے ایمرجنسی رابطہ نمبرات یاد رکھنے چاہئے؟',
          de: 'Welche Notfallkontaktnummern sollte ich griffbereit halten?',
          ar: 'ما هي أرقام الاتصال الطارئ التي يجب أن أحتفظ بها بجواري؟',
          bm: 'Apakah nombor hubungan kecemasan yang perlu saya simpan dengan mudah?',
          tr: 'Yanımda bulundurmalı olduğum acil iletişim numaraları nelerdir?',
          bn: 'আমি কি ইমার্জেন্সি যোগাযোগ নম্বরগুলি সংরক্ষণ করে রাখা উচিত?',
        },
        answer: {
          en: 'Emergency: 911 or 999 within Saudi Arabia. Contact numbers of your country’s embassy or consulate.',
          fr: "Urgence : 911 ou 999 en Arabie saoudite. Numéros de contact de l'ambassade ou du consulat de votre pays.",
          ud: 'ایمرجنسی: 911 یا 999 عربستان میں۔ آپ کے ملک کے سفارت خانے یا قونصل خانے کے رابطہ نمبر۔',
          de: 'Notruf: 911 oder 999 innerhalb Saudi-Arabiens. Kontaktinformationen der Botschaft oder des Konsulats Ihres Landes.',
          ar: 'الطوارئ: 911 أو 999 داخل المملكة العربية السعودية. أرقام الاتصال بسفارة بلدك أو قنصليته.',
          bm: 'Kecemasan: 911 atau 999 di dalam Arab Saudi. Nombor hubungan kedutaan atau konsulat negara anda.',
          tr: "Acil durum: Suudi Arabistan'da 911 veya 999. Ülkenizin büyükelçiliği veya konsolosluğunun iletişim numaraları.",
          bn: 'জরুরি: সৌদি আরবের মধ্যে 911 বা 999। আপনার দেশের রাষ্ট্রীয় সফরবাস বা কনসুলেটের যোগাযোগ নম্বর।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I avoid food poisoning during the pilgrimage?',
          fr: "Comment puis-je éviter l'intoxication alimentaire pendant le pèlerinage ?",
          ud: 'حج کے دوران خوراک زہریلے ہونے سے کیسے بچا جا سکتا ہے؟',
          de: 'Wie kann ich während der Pilgerreise eine Lebensmittelvergiftung vermeiden?',
          ar: 'كيف يمكنني تجنب التسمم الغذائي خلال الحج؟',
          bm: 'Bagaimana saya boleh mengelakkan keracunan makanan semasa ibadah haji?',
          tr: 'Hac sırasında gıda zehirlenmesinden nasıl kaçınabilirim?',
          bn: 'হজ পালনের সময় আমি কীভাবে খাদ্য পাকনাসার হুমকি বাঁচতে পারি?',
        },
        answer: {
          en: 'Choose hygienic food vendors. Avoid raw or undercooked foods. Wash fruits and vegetables before eating.',
          fr: 'Choisissez des vendeurs de nourriture hygiéniques. Évitez les aliments crus ou insuffisamment cuits. Lavez les fruits et les légumes avant de les manger.',
          ud: 'صافی خوراک فروخت کاروں کو منتخب کریں۔ کچا یا ناتج پکا کھانا سے بچیں۔ پھل اور سبزیوں کو کھانے سے پہلے دھوئیں۔',
          de: 'Wählen Sie hygienische Lebensmittelverkäufer aus. Vermeiden Sie rohe oder unzureichend gekochte Lebensmittel. Waschen Sie Obst und Gemüse vor dem Verzehr.',
          ar: 'اختر بائعي الطعام النظيف. تجنب الأطعمة الخام أو غير المطهية بشكل كافي. اغسل الفواكه والخضروات قبل تناولها.',
          bm: 'Pilih penjual makanan yang bersih. Elakkan makanan mentah atau separa masak. Basuh buah-buahan dan sayur-sayuran sebelum dimakan.',
          tr: 'Hijyenik gıda satıcılarını tercih edin. Çiğ veya yeterince pişmemiş yiyeceklerden kaçının. Meyve ve sebzeleri yemeden önce yıkayın.',
          bn: 'পরিষ্কার খাবার বিক্রেতা নির্বাচন করুন। কাঁচা বা অপূর্নপক্ষে খাবার এড়িয়ে চলুন। ফল এবং সবজি খাবারে পূর্বে ধোয়া করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What clothing is best for staying cool and comfortable?',
          fr: 'Quel type de vêtements est le mieux pour rester frais et confortable ?',
          ud: 'ٹھنڈے اور آرام دہ محسوس کرنے کے لئے بہترین کپڑے کون سے ہیں؟',
          de: 'Welche Kleidung ist am besten, um kühl und komfortabel zu bleiben?',
          ar: 'ما هو أفضل نوع من الملابس للبقاء منتعشًا ومريحًا؟',
          bm: 'Pakaian apa yang terbaik untuk tetap sejuk dan selesa?',
          tr: 'Serin ve rahat kalmak için en iyi giyim nedir?',
          bn: 'শীতল এবং সুবিধাজনক থাকার জন্য সেরা কোন পোশাক?',
        },
        answer: {
          en: 'Light, loose-fitting, breathable fabrics like cotton. White or light-colored clothes.',
          fr: 'Des tissus légers, amples et respirants comme le coton. Des vêtements blancs ou de couleur claire.',
          ud: 'ہلکے، ڈھیلے، سانس لینے والے کپڑے جیسے کہ کپاس۔ سفید یا ہلکے رنگ کے کپڑے۔',
          de: 'Leichte, locker sitzende, atmungsaktive Stoffe wie Baumwolle. Weiße oder hellfarbene Kleidung.',
          ar: 'أقمشة خفيفة وفضفاضة وقابلة للتنفس مثل القطن. ملابس بيضاء أو بألوان فاتحة.',
          bm: 'Fabrik yang ringan, longgar, dan bernafas seperti kapas. Pakaian berwarna putih atau terang.',
          tr: 'Pamuk gibi hafif, bol ve nefes alabilir kumaşlar. Beyaz veya açık renkli giysiler.',
          bn: 'কাপড় যেমন কপাসের মতো হালকা, সবুজ এবং বায়ুপূর্ণ। সাদা বা হালকা রঙের পোশাক।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I prevent sunburn?',
          fr: 'Comment puis-je prévenir les coups de soleil ?',
          ud: 'سان برن سے بچاو کیسے کیا جا سکتا ہے؟',
          de: 'Wie kann ich Sonnenbrand vorbeugen?',
          ar: 'كيف يمكنني الوقاية من حروق الشمس؟',
          bm: 'Bagaimana saya boleh mengelakkan kulit terbakar matahari?',
          tr: 'Güneş yanığını nasıl önleyebilirim?',
          bn: 'আমি কিভাবে সানবার্ন প্রতিরোধ করতে পারি?',
        },
        answer: {
          en: 'Apply a broad-spectrum sunscreen with high SPF. Wear long-sleeved shirts and wide-brimmed hats. Seek shade whenever possible.',
          fr: "Appliquez un écran solaire à large spectre avec un FPS élevé. Portez des chemises à manches longues et des chapeaux à larges bords. Cherchez de l'ombre chaque fois que possible.",
          ud: 'اچھی ایس پی ایف کے ساتھ چوڑے روشنی کے ہتھکرے کا استعمال کریں۔ لمبی آستینوں والی قمیضیں اور چوڑے کناپ کی ٹوپی پہنیں۔ جہاں ممکن ہو وہاں سائیڈ تلاش کریں۔',
          de: 'Tragen Sie einen breitbandigen Sonnenschutz mit hohem Lichtschutzfaktor (LSF) auf. Tragen Sie langärmlige Hemden und breitkrempige Hüte. Suchen Sie immer Schatten, wenn möglich.',
          ar: 'ضع واقي شمس طيف واسع ذو معدل حماية من الشمس عالي. ارتدي قمصان طويلة الأكمام وقبعات ذات أطراف واسعة. ابحث عن الظل كلما كان ذلك ممكنًا.',
          bm: 'Sapukan pelindung matahari spektrum luas dengan SPF yang tinggi. Pakai baju berlengan panjang dan topi berpinggiran lebar. Cari tempat teduh setiap kali boleh.',
          tr: "Yüksek SPF'li geniş spektrumlu bir güneş kremi uygulayın. Uzun kollu gömlekler ve geniş kenarlı şapka giyin. Mümkün olduğunda gölge arayın.",
          bn: 'প্রস্থানযোগ্য এবং উচ্চ এসপিএফ সহ প্রসারণ স্পেক্ট্রাম সানস্ক্রিন প্রয়োগ করুন। দীর্ঘ স্লিভ শার্ট এবং প্রসারিত মাথার টুপি পরে যান। যখনই সম্ভব, ছায়া চাইন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What precautions should I take to avoid contracting the flu or other viral infections?',
          fr: "Quelles précautions dois-je prendre pour éviter de contracter la grippe ou d'autres infections virales ?",
          ud: 'انفلوؤنزا یا دیگر وائرسی انفیکشنز سے بچنے کے لئے آپ کو کیا احتیاطی تدابیر اختیار کرنے چاہئیں؟',
          de: 'Welche Vorsichtsmaßnahmen sollte ich treffen, um eine Grippe oder andere virale Infektionen zu vermeiden?',
          ar: 'ما هي الاحتياطات التي يجب أن أتخذها لتجنب الإصابة بالإنفلونزا أو العدوى الفيروسية الأخرى؟',
          bm: 'Apakah langkah-langkah berjaga-jaga yang perlu saya ambil untuk mengelakkan daripada berjangkit flu atau jangkitan virus lain?',
          tr: 'Grip veya diğer viral enfeksiyonlardan korunmak için hangi önlemleri almalıyım?',
          bn: 'আমি কি করণীয় নেওয়া উচিত যেন আমি ফ্লু বা অন্যান্য ভাইরাল সংক্রমণে পড়তে না পারি?',
        },
        answer: {
          en: 'Get vaccinated before travel. Maintain good hand and respiratory hygiene. Avoid close contact with sick individuals.',
          fr: 'Faites-vous vacciner avant de voyager. Maintenez une bonne hygiène des mains et des voies respiratoires. Évitez tout contact étroit avec des personnes malades.',
          ud: 'سفر سے پہلے ویکسین لگوائیں۔ اچھی ہاتھوں اور تنفسی احتیاط کی حفاظت کریں۔ بیمار افراد کے قریبی رابطہ سے بچیں۔',
          de: 'Lassen Sie sich vor der Reise impfen. Achten Sie auf gute Hand- und Atemwegshygiene. Vermeiden Sie engen Kontakt mit kranken Personen.',
          ar: 'احصل على التطعيم قبل السفر. حافظ على نظافة اليدين والجهاز التنفسي الجيدة. تجنب الاتصال الوثيق مع الأشخاص المرضى.',
          bm: 'Dapatkan vaksin sebelum perjalanan. Menjaga kebersihan tangan dan pernafasan yang baik. Elakkan daripada berdekatan dengan individu yang sakit.',
          tr: 'Seyahatten önce aşı olun. İyi el ve solunum hijyeni koruyun. Hastalıklı kişilerle yakın teması kaçının.',
          bn: 'ভ্রমণের আগে টিকা নিন। ভালো হাত ও শ্বাসকোষীয় পরিষ্কারতা বজায় রাখুন। অসুস্থ ব্যক্তিদের সম্পর্কে কাছাকাছি আসা থেকে বিরত থাকুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How should I handle an asthma attack?',
          fr: "Comment dois-je gérer une crise d'asthme ?",
          ud: 'آسما کی حملہ کیسے سنبھالا جائے؟',
          de: 'Wie sollte ich einen Asthmaanfall behandeln?',
          ar: 'كيف يجب أن أتعامل مع نوبة الربو؟',
          bm: 'Bagaimana saya harus mengendalikan serangan asma?',
          tr: 'Bir astım atağını nasıl yönetmeliyim?',
          bn: 'আমি অ্যাসমা আক্রান্ত করার উপায় কি?',
        },
        answer: {
          en: 'Carry your inhaler at all times. Avoid crowded and dusty areas. Use your inhaler as directed and seek medical help if needed.',
          fr: 'Portez toujours votre inhalateur avec vous. Évitez les endroits bondés et poussiéreux. Utilisez votre inhalateur comme prescrit et consultez un médecin si nécessaire.',
          ud: 'ہر وقت اپنا انہیلر ساتھ رکھیں۔ بھیڑ بھاڑ والے اور دھول بھرے علاقوں سے گریز کریں۔ اپنے انہیلر کا استعمال ہدایات کے مطابق کریں اور ضرورت پڑنے پر طبی امداد حاصل کریں۔',
          de: 'Tragen Sie Ihren Inhalator immer bei sich. Meiden Sie überfüllte und staubige Bereiche. Verwenden Sie Ihren Inhalator wie angewiesen und holen Sie sich bei Bedarf ärztliche Hilfe.',
          ar: 'احمل جهاز الاستنشاق معك في جميع الأوقات. تجنب الأماكن المزدحمة والمليئة بالغبار. استخدم جهاز الاستنشاق بالطريقة الموجهة واطلب المساعدة الطبية إذا لزم الأمر.',
          bm: 'Bawa inhaler Anda setiap saat. Hindari area yang ramai dan berdebu. Gunakan inhaler Anda seperti yang diarahkan dan cari bantuan medis jika diperlukan.',
          tr: 'Her zaman inhalerinizi yanınızda bulundurun. Kalabalık ve tozlu alanlardan kaçının. İnhalerinizi talimatlara göre kullanın ve ihtiyaç duyarsanız tıbbi yardım isteyin.',
          bn: 'সব সময় আপনার ইনহেলার সঙ্গে রাখুন। ভিড় এবং ধুলোবালু এলাকা এড়িয়ে চলুন। নির্দেশ অনুযায়ী আপনার ইনহেলার ব্যবহার করুন এবং প্রয়োজন হলে চিকিৎসা সহায়তা নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Can I perform Hajj if I am pregnant?',
          fr: 'Puis-je effectuer le Hajj si je suis enceinte ?',
          ud: 'کیا میں حاملہ ہونے کی صورت میں حج کرسکتی ہوں؟',
          de: 'Kann ich die Hadsch durchführen, wenn ich schwanger bin?',
          ar: 'هل يمكنني أداء فريضة الحج إذا كنت حاملاً؟',
          bm: 'Bolehkah saya menunaikan ibadah haji jika saya hamil?',
          tr: 'Hamile isem hacca gidebilir miyim?',
          bn: 'আমি গর্ভবতী হলে কি হজ্জ করতে পারব?',
        },
        answer: {
          en: 'Consult with your healthcare provider. Travel during the second trimester if possible. Avoid strenuous activities and stay hydrated.',
          fr: 'Consultez votre professionnel de santé. Voyagez pendant le deuxième trimestre si possible. Évitez les activités éprouvantes et restez hydraté.',
          ud: 'اپنے صحت کے ماہر سے مشورہ کریں۔ اگر ممکن ہو تو دوسرے سہ ماہی کے دوران سفر کریں۔ شدید سرگرمیوں سے گریز کریں اور پانی پیتے رہیں۔',
          de: 'Konsultieren Sie Ihren Arzt. Reisen Sie während des zweiten Trimesters, wenn möglich. Vermeiden Sie anstrengende Aktivitäten und bleiben Sie hydriert.',
          ar: 'استشر مقدم الرعاية الصحية الخاص بك. سافر خلال الثلث الثاني من الحمل إن أمكن. تجنب الأنشطة الشاقة وابق رطبًا.',
          bm: 'Konsultasikan dengan penyedia layanan kesehatan Anda. Bepergian selama trimester kedua jika memungkinkan. Hindari aktivitas berat dan tetap terhidrasi.',
          tr: 'Sağlık hizmeti sağlayıcınıza danışın. Mümkünse ikinci trimestrede seyahat edin. Zorlayıcı aktivitelerden kaçının ve hidrasyonu koruyun.',
          bn: 'আপনার স্বাস্থ্যসেবা প্রদানকারীর সাথে পরামর্শ করুন। সম্ভব হলে দ্বিতীয় ত্রৈমাসিকে ভ্রমণ করুন। কঠিন কর্মকাণ্ড এড়িয়ে চলুন এবং নিজেকে হাইড্রেটেড রাখুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I experience a severe allergic reaction?',
          fr: "Que dois-je faire si j'ai une réaction allergique sévère ?",
          ud: 'اگر میں شدید الرجی کا شکار ہوں تو مجھے کیا کرنا چاہیے؟',
          de: 'Was sollte ich tun, wenn ich eine schwere allergische Reaktion erlebe?',
          ar: 'ماذا يجب أن أفعل إذا عانيت من رد فعل تحسسي شديد؟',
          bm: 'Apa yang harus saya lakukan jika saya mengalami reaksi alergi parah?',
          tr: 'Şiddetli bir alerjik reaksiyon yaşarsam ne yapmalıyım?',
          bn: 'যদি আমি একটি গুরুতর অ্যালার্জিক প্রতিক্রিয়া অনুভব করি তবে আমার কি করা উচিত?',
        },
        answer: {
          en: 'Carry an epinephrine auto-injector (EpiPen). Seek immediate medical help. Avoid known allergens.',
          fr: "Portez un auto-injecteur d'épinéphrine (EpiPen). Obtenez immédiatement de l'aide médicale. Évitez les allergènes connus.",
          ud: 'ایپی نیپھرین آٹو-انجکٹر (ایپی پین) لے کر چلیں۔ فوری طبی امداد حاصل کریں۔ جانے پہچانے ایلرجنز سے پرہیز کریں۔',
          de: 'Tragen Sie einen Epinephrin-Autoinjektor (EpiPen) mit sich. Suchen Sie sofort medizinische Hilfe auf. Meiden Sie bekannte Allergene.',
          ar: 'احمل جهاز الحقن الآلي للإبينفرين (إبي بن). اطلب المساعدة الطبية الفورية. تجنب المسببات المعروفة للحساسية.',
          bm: 'Bawa suntikan otomatis epinefrin (EpiPen). Segera cari bantuan medis. Hindari alergen yang diketahui.',
          tr: 'Bir epinefrin oto-enjektörü (EpiPen) taşıyın. Acil tıbbi yardım arayın. Bilinen alerjenlerden kaçının.',
          bn: 'একটি ইপিনেফ্রিন অটো-ইনজেক্টর (ইপিপেন) বহন করুন। অবিলম্বে চিকিত্সা সহায়তা নিন। পরিচিত অ্যালার্জেন এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I manage my sleep effectively during Hajj?',
          fr: 'Comment gérer efficacement mon sommeil pendant le Hajj ?',
          ud: 'حج کے دوران میں اپنی نیند کو کیسے موثر طریقے سے منظم کر سکتا ہوں؟',
          de: 'Wie kann ich während der Hadsch effektiv schlafen?',
          ar: 'كيف يمكنني إدارة نومي بشكل فعال أثناء الحج؟',
          bm: 'Bagaimana saya dapat mengelola tidur saya secara efektif selama Haji?',
          tr: 'Hac sırasında uykumu nasıl etkili bir şekilde yönetebilirim?',
          bn: 'হজ্জের সময় আমি কিভাবে আমার ঘুম কার্যকরভাবে পরিচালনা করতে পারি?',
        },
        answer: {
          en: 'Take naps whenever possible. Create a comfortable sleeping environment. Avoid caffeine and heavy meals before bedtime.',
          fr: 'Faites des siestes chaque fois que possible. Créez un environnement de sommeil confortable. Évitez la caféine et les repas copieux avant le coucher.',
          ud: 'جب بھی ممکن ہو آرام کریں۔ ایک آرامدہ سونے کا ماحول بنائیں۔ کیفین اور سونے سے پہلے بھاری کھانا لینے سے گریز کریں۔',
          de: 'Machen Sie Nickerchen, wann immer möglich. Schaffen Sie eine gemütliche Schlafumgebung. Vermeiden Sie Koffein und schwere Mahlzeiten vor dem Schlafengehen.',
          ar: 'خذ قيلولة متى أمكن ذلك. اصنع بيئة نوم مريحة. تجنب تناول المنبهات والوجبات الثقيلة قبل النوم.',
          bm: 'Ambil tindur kapan saja mungkin. Ciptakan lingkungan tidur yang nyaman. Hindari kafein dan makanan berat sebelum tidur.',
          tr: 'Mümkün olduğunca kestirmeler yapın. Rahat bir uyku ortamı yaratın. Uyumadan önce kafein ve ağır yemeklerden kaçının.',
          bn: 'যখনই সম্ভব ঘুমিয়ে নিন। একটি আরামদায়ক ঘুমের পরিবেশ তৈরি করুন। রাতে ঘুমানোর আগে কফি এবং ভারী খাবার এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I get a cut or wound?',
          fr: 'Que dois-je faire si je me coupe ou si je me blesse ?',
          ud: 'اگر میں کٹ گیا یا زخمی ہوگیا تو مجھے کیا کرنا چاہیے؟',
          de: 'Was sollte ich tun, wenn ich mich schneide oder eine Wunde bekomme?',
          ar: 'ماذا يجب أن أفعل إذا أصبت بجرح أو جرح؟',
          bm: 'Apa yang harus saya lakukan jika saya terluka atau terluka?',
          tr: 'Kesik veya yara alırsam ne yapmalıyım?',
          bn: 'আমি যদি কোনো কাটা বা আঘাত পাই তাহলে আমার কি করা উচিত?',
        },
        answer: {
          en: 'Clean the wound with water and antiseptic. Apply a clean bandage. Seek medical attention if necessary.',
          fr: "Nettoyez la plaie avec de l'eau et un antiseptique. Appliquez un pansement propre. Consultez un médecin si nécessaire.",
          ud: 'زخم کو پانی اور جراثیم کش سے صاف کریں۔ ایک صاف پٹی لگائیں۔ اگر ضروری ہو تو طبی امداد حاصل کریں۔',
          de: 'Reinigen Sie die Wunde mit Wasser und Antiseptikum. Bringen Sie einen sauberen Verband an. Suchen Sie bei Bedarf ärztliche Hilfe auf.',
          ar: 'نظف الجرح بالماء والمطهر. ضع ضمادة نظيفة. اطلب الرعاية الطبية إذا لزم الأمر.',
          bm: 'Bersihkan luka dengan air dan antiseptik. Terapkan balutan bersih. Cari bantuan medis jika diperlukan.',
          tr: 'Yarayı su ve antiseptikle temizleyin. Temiz bir sargı uygulayın. Gerekirse tıbbi yardım alın.',
          bn: 'জল এবং অ্যান্টিসেপটিক দিয়ে আঘাতটি পরিষ্কার করুন। একটি পরিষ্কার বেঁধে দিন। প্রয়োজন হলে চিকিত্সা সহায়তা নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: "How important is it to stay hydrated, and what's the best way to do so?",
          fr: "Quelle est l'importance de rester hydraté et quelle est la meilleure façon de le faire ?",
          ud: 'پانی پینا کتنا اہم ہے، اور اسے کرنے کا بہترین طریقہ کیا ہے؟',
          de: 'Wie wichtig ist es, hydratisiert zu bleiben, und was ist der beste Weg dafür?',
          ar: 'ما أهمية البقاء رطبًا، وما هي أفضل طريقة للقيام بذلك؟',
          bm: 'Seberapa penting untuk tetap terhidrasi, dan apa cara terbaik untuk melakukannya?',
          tr: 'Vücudunuzu nemli tutmanın önemi nedir ve bunu yapmanın en iyi yolu nedir?',
          bn: 'জলপ্রাপ্ত থাকা কতটা গুরুত্বপূর্ণ এবং তা করার সর্বোত্তম উপায় কী?',
        },
        answer: {
          en: 'Extremely important. Drink water regularly and avoid caffeinated or sugary drinks.',
          fr: "Extrêmement important. Buvez de l'eau régulièrement et évitez les boissons caféinées ou sucrées.",
          ud: 'انتہائی اہم ہے۔ باقاعدگی سے پانی پیئں اور کیفین یا چینی والے مشروبات سے گریز کریں۔',
          de: 'Äußerst wichtig. Trinken Sie regelmäßig Wasser und meiden Sie koffeinhaltige oder zuckerhaltige Getränke.',
          ar: 'شيء في غاية الأهمية. اشرب الماء بانتظام وتجنب المشروبات المنبهة أو السكرية.',
          bm: 'Sangat penting. Minum air secara teratur dan hindari minuman berkafein atau bergula.',
          tr: 'Son derece önemli. Düzenli olarak su için ve kafeinsiz veya şekerli içeceklerden kaçının.',
          bn: 'অত্যন্ত গুরুত্বপূর্ণ। নিয়মিত পানি পান করুন এবং ক্যাফেইন বা চিনির পানীয় এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How do I use public restrooms safely?',
          fr: 'Comment utiliser les toilettes publiques en toute sécurité ?',
          ud: 'مَیں کس طرح عوامی باتھ روم کو محفوظ طریقے سے استعمال کر سکتا ہوں؟',
          de: 'Wie benutze ich öffentliche Toiletten sicher?',
          ar: 'كيف أستخدم دورات المياه العامة بأمان؟',
          bm: 'Bagaimana cara menggunakan toilet umum dengan aman?',
          tr: 'Halka açık tuvaletleri nasıl güvenli bir şekilde kullanabilirim?',
          bn: 'আমি কিভাবে নিরাপদে সার্বজনিক বাথরুম ব্যবহার করব?',
        },
        answer: {
          en: 'Use toilet seat covers or clean the seat with antiseptic wipes. Wash hands thoroughly after use.',
          fr: 'Utilisez des couvercles de siège de toilette ou nettoyez le siège avec des lingettes désinfectantes. Lavez-vous soigneusement les mains après usage.',
          ud: 'ٹوائلٹ سیٹ کور استعمال کریں یا صفائی کے لیے جراثیم کش واپس کو استعمال کریں۔ استعمال کے بعد اچھی طرح ہاتھ دھوئیں۔',
          de: 'Benutzen Sie Toilettensitzauflagen oder reinigen Sie den Sitz mit Desinfektionstüchern. Waschen Sie nach der Benutzung gründlich Ihre Hände.',
          ar: 'استخدم أغطية مقاعد المرحاض أو نظف المقعد بمناديل معقمة. اغسل يديك جيدًا بعد الاستخدام.',
          bm: 'Gunakan penutup toilet atau bersihkan tempat duduk dengan tisu antiseptik. Cuci tangan dengan saksama setelah digunakan.',
          tr: 'Tuvalet koltuk kaplamaları kullanın veya koltuğu antiseptik mendillerle temizleyin. Kullandıktan sonra ellerinizi iyice yıkayın.',
          bn: 'টয়লেট সিট কভার ব্যবহার করুন অথবা এন্টিসেপটিক ওয়াইপস দিয়ে আসনটি পরিষ্কার করুন। ব্যবহারের পরে ভালভাবে হাত ধোয়া করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What are the best practices for queueing efficiently and safely?',
          fr: "Quelles sont les meilleures pratiques pour la mise en file d'attente efficace et sûre?",
          ud: 'کیو میں کارآمد اور محفوظ طریقے سے لگنے کی بہترین روایات کیا ہیں؟',
          de: 'Was sind die besten Praktiken für eine effiziente und sichere Einreihung?',
          ar: 'ما هي أفضل الممارسات للانضمام إلى الصف بكفاءة وأمان؟',
          bm: 'Apakah praktik terbaik untuk mengantri secara efisien dan aman?',
          tr: 'Etkili ve güvenli bir şekilde kuyruk oluşturmak için en iyi uygulamalar nelerdir?',
          bn: 'দক্ষতা এবং নিরাপদভাবে লাইনে দাঁড়ানোর সেরা অনুশীলনগুলি কী?',
        },
        answer: {
          en: 'Follow the instructions and guidelines set by organizers. Be patient and respectful. Keep personal space and avoid pushing.',
          fr: "Suivez les instructions et les directives établies par les organisateurs. Soyez patient et respectueux. Respectez l'espace personnel et évitez de pousser.",
          ud: 'انتظامیوں کی طرف سے مقرر کردہ ہدایات اور رہنما خطوط پر عمل کریں۔ صبر اور احترام کا مظاہرہ کریں۔ ذاتی جگہ برقرار رکھیں اور دھکیلنے سے گریز کریں۔',
          de: 'Folgen Sie den Anweisungen und Richtlinien der Organisatoren. Seien Sie geduldig und respektvoll. Halten Sie Abstand und vermeiden Sie Schubsen.',
          ar: 'اتبع التعليمات والإرشادات التي حددها المنظمون. كن صبورًا ومحترمًا. حافظ على المساحة الشخصية وتجنب الدفع.',
          bm: 'Ikuti arahan dan pedoman yang ditetapkan oleh penyelenggara. Bersabarlah dan hormatilah. Jaga jarak pribadi dan hindari mendorong.',
          tr: 'Düzenleyiciler tarafından belirlenen talimat ve yönergeleri takip edin. Sabırlı ve saygılı olun. Kişisel alanı koruyun ve itmekten kaçının.',
          bn: 'আয়োজকদের নির্দেশ এবং নির্দেশিকা অনুসরণ করুন। ধৈর্যশীল এবং শ্রদ্ধাশীল হোন। ব্যক্তিগত স্থান বজায় রাখুন এবং ঠেলা এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Can I bring my own food and water into Hajj sites?',
          fr: "Puis-je apporter ma propre nourriture et de l'eau dans les sites du Hajj ?",
          ud: 'کیا میں حج کے مقامات پر اپنا کھانا اور پانی لے جا سکتا ہوں؟',
          de: 'Kann ich mein eigenes Essen und Wasser zu den Haddsch-Stätten mitbringen?',
          ar: 'هل يمكنني إحضار طعامي ومائي الخاص إلى مواقع الحج؟',
          bm: 'Bolehkah saya membawa makanan dan air minum sendiri ke tapak Haji?',
          tr: 'Hac alanlarına kendi yiyecek ve suyumu getirebilir miyim?',
          bn: 'আমি কি হজ্জ সাইটগুলিতে নিজের খাবার এবং পানি নিয়ে যেতে পারব?',
        },
        answer: {
          en: 'Yes, it is advisable to carry your own food and water for hygiene reasons.',
          fr: "Oui, il est conseillé d'apporter votre propre nourriture et eau pour des raisons d'hygiène.",
          ud: 'صفائی کی وجوہات کی بنا پر اپنا کھانا اور پانی ساتھ لے جانا مشورہ دیا جاتا ہے۔',
          de: 'Ja, aus Hygienegründen wird empfohlen, das eigene Essen und Wasser mitzunehmen.',
          ar: 'نعم، ينصح بحمل طعامك ومائك الخاص لأسباب صحية.',
          bm: 'Ya, adalah dinasihatkan untuk membawa makanan dan air minum anda sendiri atas sebab kebersihan.',
          tr: 'Evet, hijyen nedenleriyle kendi yiyeceğinizi ve suyunuzu getirmeniz tavsiye edilir.',
          bn: 'হ্যাঁ, স্বাস্থ্যগত কারণে নিজের খাবার এবং পানি নিয়ে আসার পরামর্শ দেওয়া হয়।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How do I care for elderly or disabled pilgrim companions?',
          fr: 'Comment dois-je prendre soin des compagnons de pèlerinage âgés ou handicapés ?',
          ud: 'میں بزرگ یا معذور ہمراہ حاجیوں کی کیا طرح دیکھ بھال کروں؟',
          de: 'Wie kümmere ich mich um ältere oder behinderte Pilgerbegleiter?',
          ar: 'كيف أعتني برفقاء الحج من كبار السن أو ذوي الإعاقة؟',
          bm: 'Bagaimanakah cara saya menjaga rakan jemaah tua atau kurang upaya?',
          tr: 'Yaşlı veya engelli hac yol arkadaşlarına nasıl bakabilirim?',
          bn: 'আমি কীভাবে বয়স্ক বা অক্ষম হাজি সঙ্গীদের যত্ন নেব?',
        },
        answer: {
          en: 'Ensure they have comfortable accommodations. Assist with mobility and specific needs. Keep their medications and emergency contact information handy.',
          fr: "Assurez-vous qu'ils aient un hébergement confortable. Aidez-les pour leur mobilité et leurs besoins spécifiques. Gardez leurs médicaments et leurs coordonnées d'urgence à portée de main.",
          ud: 'اُن کے لیے آرام دہ رہائش کی جگہ کو یقینی بنائیں۔ آمد و رفت اور خاص ضروریات میں ان کی مدد کریں۔ ان کی ادویات اور ہنگامی رابطے کی معلومات آسانی سے دستیاب رکھیں۔',
          de: 'Stellen Sie sicher, dass sie eine komfortable Unterkunft haben. Unterstützen Sie sie bei ihrer Mobilität und ihren speziellen Bedürfnissen. Halten Sie ihre Medikamente und Notfallkontaktinformationen griffbereit.',
          ar: 'تأكد من توفر إقامة مريحة لهم. ساعدهم في التنقل واحتياجاتهم الخاصة. احتفظ بأدويتهم ومعلومات الاتصال في حالات الطوارئ في متناول يديك.',
          bm: 'Pastikan mereka mendapat penginapan yang selesa. Bantu dengan kemudahan mobiliti dan keperluan khusus mereka. Simpan ubat-ubatan dan maklumat hubungan kecemasan mereka di tempat yang mudah diambil.',
          tr: 'Rahat bir konaklamaya sahip olduklarından emin olun. Hareketlilik ve özel ihtiyaçlarında yardımcı olun. İlaçlarını ve acil durum iletişim bilgilerini hazır tutun.',
          bn: 'তাদের আরামদায়ক আবাসন থাকার বিষয়টি নিশ্চিত করুন। গতিশীলতা এবং বিশেষ চাহিদাগুলিতে সাহায্য করুন। তাদের ওষুধপত্র এবং জরুরি যোগাযোগের তথ্য হাতের কাছে রাখুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I carry with me at all times for personal safety?',
          fr: 'Que devrais-je avoir sur moi en tout temps pour ma sécurité personnelle ?',
          ud: 'ذاتی حفاظت کے لیے مجھے ہر وقت کیا کچھ ساتھ رکھنا چاہیے؟',
          de: 'Was sollte ich für meine persönliche Sicherheit jederzeit bei mir tragen?',
          ar: 'ما الذي ينبغي علي حمله معي في جميع الأوقات لسلامتي الشخصية؟',
          bm: 'Apakah yang patut saya bawa bersama saya pada setiap masa untuk keselamatan peribadi?',
          tr: 'Kişisel güvenliğim için yanımda ne taşımalıyım?',
          bn: 'ব্যক্তিগত নিরাপত্তার জন্য আমাকে সবসময় কী নিয়ে যেতে হবে?',
        },
        answer: {
          en: 'Identification and contact information. Basic first aid supplies. Mobile phone and charger.',
          fr: "Pièces d'identité et coordonnées. Trousse de premiers soins de base. Téléphone portable et chargeur.",
          ud: 'شناختی دستاویزات اور رابطے کی معلومات۔ بنیادی طبی امدادی سامان۔ موبائل فون اور چارجر۔',
          de: 'Ausweispapiere und Kontaktinformationen. Eine Basick Erste-Hilfe-Ausstattung. Mobiltelefon und Ladegerät.',
          ar: 'بطاقات تعريفية ومعلومات الاتصال. إمدادات إسعافات أولية أساسية. هاتف محمول وشاحن.',
          bm: 'Pengenalan diri dan maklumat hubungan. Bekalan pertolongan cemas asas. Telefon bimbit dan pengecas.',
          tr: 'Kimlik ve iletişim bilgileri. Temel ilk yardım malzemeleri. Cep telefonu ve şarj cihazı.',
          bn: 'পরিচয়পত্র এবং যোগাযোগের তথ্য। মৌলিক প্রাথমিক চিকিত্সা সরঞ্জাম। মোবাইল ফোন এবং চার্জার।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I prepare my physical fitness for Hajj?',
          fr: 'Comment puis-je préparer ma forme physique pour le Hajj ?',
          ud: 'میں حج کے لیے اپنی جسمانی صلاحیت کو کس طرح تیار کر سکتا ہوں؟',
          de: 'Wie kann ich meine körperliche Fitness für die Hadsch vorbereiten?',
          ar: 'كيف يمكنني إعداد لياقتي البدنية للحج؟',
          bm: 'Bagaimanakah cara saya menyediakan kecergasan fizikal untuk Haji?',
          tr: 'Hac için fiziksel formumu nasıl hazırlayabilirim?',
          bn: 'হজ্জের জন্য আমি কীভাবে শারীরিক ফিটনেস প্রস্তুত করতে পারি?',
        },
        answer: {
          en: 'Start a walking regimen well before the trip. Engage in light cardio exercises. Consult with your physician.',
          fr: 'Commencez un régime de marche bien avant le voyage. Faites des exercices cardiovasculaires légers. Consultez votre médecin.',
          ud: 'سفر سے کافی پہلے سے چلنے کا نظام شروع کریں۔ ہلکی کارڈیو ورزشیں کریں۔ اپنے طبیب سے مشورہ کریں۔',
          de: 'Beginnen Sie weit vor der Reise mit einem Gehtraining. Machen Sie leichte Cardio-Übungen. Konsultieren Sie Ihren Arzt.',
          ar: 'ابدأ نظامًا للمشي قبل الرحلة بفترة كافية. امارس تمارين خفيفة للقلب والأوعية الدموية. استشر طبيبك.',
          bm: 'Mulakan rejim berjalan kaki jauh sebelum perjalanan. Lakukan senaman kardio ringan. Berbincang dengan doktor anda.',
          tr: 'Seyahattan çok önce yürüyüş programına başlayın. Hafif kardiyovasküler egzersizler yapın. Hekiminize danışın.',
          bn: 'ভ্রমণের অনেক আগে হাঁটার রুটিন শুরু করুন। হালকা কার্ডিও ব্যায়াম করুন। আপনার চিকিত্সকের পরামর্শ নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What are the symptoms of meningitis I should be aware of?',
          fr: 'Quels sont les symptômes de la méningite dont je dois être conscient ?',
          ud: 'مجھے کن لقوے کے عَلامات سے آگاہ ہونا چاہیے؟',
          de: 'Welches sind die Symptome von Meningitis, auf die ich achten sollte?',
          ar: 'ما أعراض التهاب السحايا التي ينبغي أن أكون مدركًا لها؟',
          bm: 'Apakah gejala penyakit meningitis yang harus saya ambil perhatian?',
          tr: 'Nelere dikkat etmeliyim?',
          bn: 'মেনিনজাইটিসের কোন লক্ষণগুলির প্রতি আমাকে সতর্ক থাকতে হবে?',
        },
        answer: {
          en: 'Severe headache. Stiff neck. High fever. Sensitivity to light. Nausea or vomiting.',
          fr: 'Maux de tête sévères. Raideur de la nuque. Forte fièvre. Sensibilité à la lumière. Nausées ou vomissements.',
          ud: 'شدید سردرد. گردن کی سختی. بہت زیادہ بخار. روشنی کے تناظر میں حساسیت. چکر یا قے آنا.',
          de: 'Starke Kopfschmerzen. Steifer Nacken. Hohes Fieber. Lichtempfindlichkeit. Übelkeit oder Erbrechen.',
          ar: 'صداع شديد. تصلب في الرقبة. حمى شديدة. حساسية تجاه الضوء. غثيان أو قيء.',
          bm: 'Sakit kepala teruk. Leher kaku. Demam tinggi. Sensitif kepada cahaya. Loya atau muntah.',
          tr: 'Şiddetli baş ağrısı. Boyun tutukluğu. Yüksek ateş. Işığa duyarlılık. Bulantı veya kusma.',
          bn: 'প্রচণ্ড মাথা ব্যথা। শক্ত ঘাড়। উচ্চ জ্বর। আলোর প্রতি সংবেদনশীলতা। বমি বমি ভাব বা বমি।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How often should I rest and hydrate during the pilgrimage?',
          fr: "À quelle fréquence devrais-je me reposer et m'hydrater pendant le pèlerinage ?",
          ud: 'حج کے دوران مجھے کتنی بار آرام اور پانی پینا چاہیے؟',
          de: 'Wie oft sollte ich während der Pilgerfahrt rasten und Flüssigkeit zu mir nehmen?',
          ar: 'كم مرة ينبغي علي أن أستريح وأبقى رطبًا خلال رحلة الحج؟',
          bm: 'Seberapa kerap saya harus berehat dan menghidrasi diri semasa mengerjakan ibadah haji?',
          tr: 'Hac yolculuğu sırasında ne sıklıkta dinlenmeli ve sıvı almalıyım?',
          bn: 'হজ্জ যাত্রার সময় আমাকে কত বার বিশ্রাম এবং পানি পান করা উচিত?',
        },
        answer: {
          en: 'Take short breaks every hour. Drink water every 20-30 minutes.',
          fr: "Faites de courtes pauses chaque heure. Buvez de l'eau toutes les 20 à 30 minutes.",
          ud: 'ہر گھنٹے میں چھوٹے بریک لیں۔ ہر 20-30 منٹ میں پانی پیئں۔',
          de: 'Machen Sie jede Stunde eine kurze Pause. Trinken Sie alle 20-30 Minuten Wasser.',
          ar: 'خذ استراحات قصيرة كل ساعة. اشرب الماء كل 20-30 دقيقة.',
          bm: 'Ambil rehat sebentar setiap jam. Minum air setiap 20-30 minit.',
          tr: 'Her saat kısa molalar verin. 20-30 dakikada bir su için.',
          bn: 'প্রতি ঘন্টায় খানিকটা বিরতি নিন। প্রতি 20-30 মিনিটে পানি পান করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I protect myself from theft or loss of belongings?',
          fr: "Comment puis-je me protéger contre le vol ou la perte d'effets personnels ?",
          ud: 'میں چوری یا اپنی اشیاء کے گُم ہونے سے کس طرح اپنی حفاظت کر سکتا ہوں؟',
          de: 'Wie kann ich mich vor Diebstahl oder Verlust meiner Sachen schützen?',
          ar: 'كيف يمكنني حماية نفسي من السرقة أو فقدان متعلقاتي؟',
          bm: 'Bagaimana saya dapat melindungi diri daripada kecurian atau kehilangan barang kepunyaan?',
          tr: 'Hırsızlığa veya eşyalarımın kaybolmasına karşı nasıl kendimi koruyabilirim?',
          bn: 'আমি কীভাবে আমার সম্পদগুলির চুরি বা হারানোর বিরুদ্ধে নিজেকে রক্ষা করব?',
        },
        answer: {
          en: 'Use a money belt or neck pouch. Keep an eye on your belongings. Avoid carrying large sums of money.',
          fr: "Utilisez une ceinture ou un pochette tour de cou pour l'argent. Gardez un œil sur vos effets personnels. Évitez de transporter de grosses sommes d'argent.",
          ud: 'رقم کی بیلٹ یا گلے کا پاؤچ استعمال کریں۔ اپنی چیزوں پر نظر رکھیں۔ بڑی رقم لے جانے سے گریز کریں۔',
          de: 'Benutzen Sie einen Geldgürtel oder eine Halstasche. Behalten Sie Ihr Gepäck im Auge. Vermeiden Sie es, große Bargeldbeträge zu tragen.',
          ar: 'استخدم حزامًا للأموال أو كيسًا معلقًا حول الرقبة. راقب متعلقاتك. تجنب حمل مبالغ كبيرة من المال.',
          bm: 'Gunakan tali pinggang duit atau pouch leher. Awasi barang kepunyaan anda. Elakkan membawa jumlah wang yang besar.',
          tr: 'Para kemeri veya boyun çantası kullanın. Eşyalarınızı gözünüzden ayırmayın. Büyük miktarlarda para taşımaktan kaçının.',
          bn: 'মানি বেল্ট বা নেক পাউচ ব্যবহার করুন। আপনার সম্পদগুলির প্রতি নজর রাখুন। বড় পরিমাণ অর্থ বহন করা এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Are there special medical facilities for women?',
          fr: 'Existe-t-il des installations médicales spéciales pour les femmes?',
          ud: 'کیا خواتین کے لیے کوئی خصوصی طبی سہولیات ہیں؟',
          de: 'Gibt es spezielle medizinische Einrichtungen für Frauen?',
          ar: 'هل هناك مرافق طبية خاصة للنساء؟',
          bm: 'Adakah terdapat kemudahan perubatan khas untuk wanita?',
          tr: 'Kadınlar için özel tıbbi tesisler var mı?',
          bn: 'নারীদের জন্য কোন বিশেষ চিকিত্সা সুবিধা আছে কি?',
        },
        answer: {
          en: 'Yes, there are designated female-only medical facilities.',
          fr: 'Oui, il existe des installations médicales réservées aux femmes.',
          ud: 'جی ہاں، صرف خواتین کے لیے مختص طبی سہولیات موجود ہیں۔',
          de: 'Ja, es gibt eigens für Frauen vorgesehene medizinische Einrichtungen.',
          ar: 'نعم، هناك مرافق طبية مخصصة للنساء فقط.',
          bm: 'Ya, terdapat kemudahan perubatan khas untuk wanita sahaja.',
          tr: 'Evet, sadece kadınlara yönelik ayrılmış tıbbi tesisler vardır.',
          bn: 'হ্যাঁ, শুধুমাত্র নারীদের জন্য নির্দিষ্ট চিকিত্সা সুবিধা রয়েছে।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How should I handle a panic attack or extreme anxiety during Hajj?',
          fr: 'Comment devrais-je gérer une crise de panique ou une anxiété extrême pendant le Hajj ?',
          ud: 'حج کے دوران شدید گھبراہٹ یا اضطراب کا سامنا کیسے کریں؟',
          de: 'Wie sollte ich eine Panikattacke oder extreme Angst während des Hadsch bewältigen?',
          ar: 'كيف يجب أن أتعامل مع نوبة هلع أو قلق شديد أثناء الحج؟',
          bm: 'Bagaimana saya harus menangani serangan panik atau kebimbangan melampau semasa Haji?',
          tr: 'Hac sırasında bir panik atak veya aşırı kaygı ile nasıl başa çıkmalıyım?',
          bn: 'হজ চলাকালীন আমি কীভাবে একটি আতঙ্কিত আক্রমণ বা চরম উদ্বেগ পরিচালনা করব?',
        },
        answer: {
          en: 'Sit down and practice deep breathing. Use calming techniques such as visualization. Seek help if needed from nearby medical services or companions.',
          fr: "Asseyez-vous et pratiquez la respiration profonde. Utilisez des techniques de relaxation telles que la visualisation. Demandez de l'aide si nécessaire auprès des services médicaux à proximité ou de vos compagnons.",
          ud: 'بیٹھ جائیں اور گہری سانس لینے کی مشق کریں۔ تصور جیسے آرام دہ تکنیکوں کا استعمال کریں۔ قریبی طبی خدمات یا ساتھیوں سے مدد طلب کریں اگر ضرورت ہو۔',
          de: 'Setzen Sie sich hin und üben Sie tiefes Atmen. Verwenden Sie beruhigende Techniken wie Visualisierung. Suchen Sie bei Bedarf Hilfe von nahegelegenen medizinischen Diensten oder Begleitpersonen.',
          ar: 'اجلس ومارس التنفس العميق. استخدم تقنيات التهدئة مثل التصور. اطلب المساعدة إذا لزم الأمر من الخدمات الطبية القريبة أو من رفقائك.',
          bm: 'Duduk dan amalkan pernafasan dalam. Gunakan teknik menenangkan seperti visualisasi. Dapatkan bantuan jika perlu dari perkhidmatan perubatan berdekatan atau rakan-rakan.',
          tr: 'Oturun ve derin nefes almayı pratiğe dökün. Görselleştirme gibi sakinleştirici teknikler kullanın. Gerektiğinde yakındaki sağlık hizmetlerinden veya arkadaşlarınızdan yardım isteyin.',
          bn: 'বসে পড়ুন এবং গভীর শ্বাস-প্রশ্বাসের অনুশীলন করুন। চিত্রায়নের মতো শান্ত করার কৌশলগুলি ব্যবহার করুন। প্রয়োজনে নিকটস্থ চিকিৎসা পরিষেবা বা সঙ্গীদের কাছ থেকে সাহায্য চান।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What’s the best way to avoid getting sick from the crowded conditions?',
          fr: "Quelle est la meilleure façon d'éviter de tomber malade à cause des conditions de foule?",
          ud: 'ہجوم کی حالت سے بیمار ہونے سے بچنے کا بہترین طریقہ کیا ہے؟',
          de: 'Wie vermeidet man am besten, in den Menschenmengen krank zu werden?',
          ar: 'ما هي أفضل طريقة لتجنب الإصابة بالمرض من الظروف المزدحمة؟',
          bm: 'Apakah cara terbaik untuk mengelakkan daripada jatuh sakit akibat keadaan sesak?',
          tr: 'Kalabalık koşullardan hasta olmaktan kaçınmanın en iyi yolu nedir?',
          bn: 'ভিড়ের অবস্থার কারণে অসুস্থ হওয়া থেকে বাঁচার সর্বোত্তম উপায় কী?',
        },
        answer: {
          en: 'Maintain good personal hygiene. Wear a face mask. Avoid close contact with sick individuals.',
          fr: 'Maintenez une bonne hygiène personnelle. Portez un masque facial. Évitez les contacts rapprochés avec les personnes malades.',
          ud: 'اچھی ذاتی صفائی برقرار رکھیں۔ چہرے کا ماسک پہنیں۔ بیمار افراد کے ساتھ قریبی رابطے سے گریز کریں۔',
          de: 'Achten Sie auf gute persönliche Hygiene. Tragen Sie eine Gesichtsmaske. Vermeiden Sie engen Kontakt mit kranken Personen.',
          ar: 'حافظ على نظافة شخصية جيدة. ارتدِ قناع وجه. تجنب الاتصال الوثيق مع الأفراد المرضى.',
          bm: 'Kekalkan kebersihan peribadi yang baik. Pakai topeng muka. Elakkan daripada berhubung rapat dengan individu yang sakit.',
          tr: 'Kişisel hijyeninize dikkat edin. Yüz maskesi takın. Hasta bireylerle yakın temastan kaçının.',
          bn: 'ভালো ব্যক্তিগত স্বাস্থ্যবিধি বজায় রাখুন। একটি মুখোশ পরুন। অসুস্থ ব্যক্তিদের সাথে ঘনিষ্ঠ যোগাযোগ এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How effective are face masks, and should I wear one?',
          fr: "Quelle est l'efficacité des masques faciaux et devrais-je en porter un?",
          ud: 'چہرے کے ماسک کتنے مؤثر ہیں، اور کیا مجھے ایک پہننا چاہیے؟',
          de: 'Wie effektiv sind Gesichtsmasken und sollte ich eine tragen?',
          ar: 'ما مدى فعالية الأقنعة الوجهية، وهل يجب أن أرتدي واحداً؟',
          bm: 'Sejauh manakah keberkesanan topeng muka, dan patutkah saya memakainya?',
          tr: 'Yüz maskeleri ne kadar etkilidir ve bir tane takmalı mıyım?',
          bn: 'মুখোশগুলি কতটা কার্যকর এবং আমার কি একটি পরা উচিত?',
        },
        answer: {
          en: 'Face masks can be effective in reducing the spread of respiratory infections. Yes, wear one in crowded areas.',
          fr: 'Les masques faciaux peuvent être efficaces pour réduire la propagation des infections respiratoires. Oui, portez-en un dans les endroits bondés.',
          ud: 'چہرے کے ماسک سانس کی بیماریوں کے پھیلاؤ کو کم کرنے میں مؤثر ہو سکتے ہیں۔ جی ہاں، ہجوم والے مقامات پر ایک پہنیں۔',
          de: 'Gesichtsmasken können wirksam sein, um die Ausbreitung von Atemwegsinfektionen zu verringern. Ja, tragen Sie eine in überfüllten Bereichen.',
          ar: 'يمكن أن تكون الأقنعة الوجهية فعالة في الحد من انتشار العدوى التنفسية. نعم، ارتدِ واحدًا في الأماكن المزدحمة.',
          bm: 'Topeng muka boleh berkesan dalam mengurangkan penyebaran jangkitan pernafasan. Ya, pakailah satu di kawasan yang sesak.',
          tr: 'Yüz maskeleri solunum yolu enfeksiyonlarının yayılmasını azaltmada etkili olabilir. Evet, kalabalık alanlarda bir tane takın.',
          bn: 'মুখোশগুলি শ্বাসযন্ত্রের সংক্রমণের বিস্তার রোধে কার্যকর হতে পারে। হ্যাঁ, ভিড়ের এলাকায় একটি পরুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if my health deteriorates during Hajj?',
          fr: 'Que dois-je faire si ma santé se détériore pendant le Hajj?',
          ud: 'اگر حج کے دوران میری صحت بگڑ جائے تو مجھے کیا کرنا چاہیے؟',
          de: 'Was soll ich tun, wenn sich mein Gesundheitszustand während des Hadsch verschlechtert?',
          ar: 'ماذا يجب أن أفعل إذا تدهورت صحتي أثناء الحج؟',
          bm: 'Apa yang perlu saya lakukan jika kesihatan saya merosot semasa Haji?',
          tr: 'Hac sırasında sağlığım bozulursa ne yapmalıyım?',
          bn: 'হজ চলাকালীন আমার স্বাস্থ্যের অবনতি হলে আমার কী করা উচিত?',
        },
        answer: {
          en: 'Seek medical assistance immediately. Inform your group leader. Rest and avoid further physical strain.',
          fr: 'Cherchez une assistance médicale immédiatement. Informez votre chef de groupe. Reposez-vous et évitez les efforts physiques supplémentaires.',
          ud: 'فوری طور پر طبی مدد حاصل کریں۔ اپنے گروپ لیڈر کو مطلع کریں۔ آرام کریں اور مزید جسمانی مشقت سے بچیں۔',
          de: 'Suchen Sie sofort medizinische Hilfe. Informieren Sie Ihren Gruppenleiter. Ruhen Sie sich aus und vermeiden Sie weitere körperliche Anstrengung.',
          ar: 'اطلب المساعدة الطبية فوراً. أبلغ قائد مجموعتك. استرح وتجنب المزيد من الإجهاد البدني.',
          bm: 'Dapatkan bantuan perubatan segera. Maklumkan kepada ketua kumpulan anda. Berehat dan elakkan tekanan fizikal selanjutnya.',
          tr: 'Hemen tıbbi yardım alın. Grup liderinizi bilgilendirin. Dinlenin ve daha fazla fiziksel zorlamadan kaçının.',
          bn: 'তৎক্ষণাৎ চিকিৎসা সহায়তা নিন। আপনার দলনেতাকে জানান। বিশ্রাম নিন এবং অতিরিক্ত শারীরিক চাপ এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How do I manage hygiene and cleanliness in shared accommodations?',
          fr: "Comment puis-je gérer l'hygiène et la propreté dans les hébergements partagés?",
          ud: 'مشترکہ رہائش میں حفظان صحت اور صفائی کا انتظام کیسے کریں؟',
          de: 'Wie verwalte ich Hygiene und Sauberkeit in Gemeinschaftsunterkünften?',
          ar: 'كيف أدير النظافة والنظافة في أماكن الإقامة المشتركة؟',
          bm: 'Bagaimana saya menguruskan kebersihan dan kesihatan di penginapan berkongsi?',
          tr: 'Ortak konaklama yerlerinde hijyen ve temizlik nasıl sağlanır?',
          bn: 'যৌথ আবাসনে স্বাস্থ্যবিধি এবং পরিচ্ছন্নতা কীভাবে পরিচালনা করব?',
        },
        answer: {
          en: 'Keep your sleeping area tidy. Use disinfectant wipes. Use personal items like towels and toiletries.',
          fr: 'Gardez votre espace de sommeil propre. Utilisez des lingettes désinfectantes. Utilisez des articles personnels comme des serviettes et des articles de toilette.',
          ud: 'اپنی سونے کی جگہ کو صاف ستھرا رکھیں۔ ضد عفونت وائپز کا استعمال کریں۔ تولیہ اور بیترین استعمال کریں۔',
          de: 'Halten Sie Ihren Schlafbereich ordentlich. Verwenden Sie Desinfektionstücher. Verwenden Sie persönliche Gegenstände wie Handtücher und Toilettenartikel.',
          ar: 'حافظ على نظافة منطقة نومك. استخدم المناديل المطهرة. استخدم الأشياء الشخصية مثل المناشف ومستلزمات الحمام.',
          bm: 'Pastikan kawasan tidur anda kemas. Gunakan kain lap peluntur. Gunakan barang-barang peribadi seperti tuala dan barangan mandian.',
          tr: 'Uyku alanınızı düzenli tutun. Dezenfektan mendiller kullanın. Havlu ve kişisel hijyen ürünleri gibi kişisel eşyaları kullanın.',
          bn: 'আপনার ঘুমানোর এলাকা সাজান। ডিসিনফেক্টেন্ট ওয়াইপ ব্যবহার করুন। টাওয়েল এবং প্রায়োজনীয় সামগ্রী সহ ব্যক্তিগত জিনিসগুলি ব্যবহার করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What preparations should I make for the journey back home in terms of health?',
          fr: 'Quelles préparations dois-je faire pour le voyage de retour à la maison en termes de santé?',
          ud: 'صحت کے لحاظ سے گھر واپسی کے سفر کے لئے میں کن تیاریوں کو کرنا چاہئے؟',
          de: 'Welche Vorbereitungen sollte ich für die Rückreise nach Hause in Bezug auf die Gesundheit treffen?',
          ar: 'ما هي التحضيرات التي يجب أن أقوم بها لرحلة العودة إلى المنزل من الناحية الصحية؟',
          bm: 'Persediaan apa yang perlu saya lakukan untuk perjalanan pulang ke rumah dari segi kesihatan?',
          tr: 'Sağlık açısından eve dönüş yolculuğu için hangi hazırlıkları yapmalıyım?',
          bn: 'স্বাস্থ্যের দৃষ্টিকোণ থেকে বাড়িতে ফিরে যাওয়ার জন্য আমি কি প্রস্তুতি নিতে হবে?',
        },
        answer: {
          en: 'Rest well before traveling. Continue taking your medications. Stay hydrated and avoid stress.',
          fr: 'Reposez-vous bien avant de voyager. Continuez à prendre vos médicaments. Restez hydraté et évitez le stress.',
          ud: 'سفر سے پہلے اچھی طرح آرام کریں۔ اپنی دوائیں جاری رکھیں۔ آبیت برقرار رکھیں اور تناؤ سے بچیں۔',
          de: 'Erholen Sie sich gut vor der Reise. Setzen Sie Ihre Medikamente fort. Bleiben Sie hydratisiert und vermeiden Sie Stress.',
          ar: 'استرح جيدًا قبل السفر. استمر في تناول أدويتك. ابق مرطبًا وتجنب الإجهاد.',
          bm: 'Beristirahat dengan cukup sebelum berjalan. Teruskan pengambilan ubat anda. Pastikan anda sentiasa terhidrasi dan elakkan tekanan.',
          tr: 'Yolculuktan önce iyi dinlenin. İlaçlarınızı almaya devam edin. Hidrate olun ve stresten kaçının.',
          bn: 'ভ্রমণের আগে ভালো ভাবে বিশ্রাম নিন। আপনার ওষুধ চালিয়ে যান। অবাহমান করুন এবং তনাব থেকে বিরত থাকুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I avoid getting lost in unfamiliar areas of the pilgrimage?',
          fr: 'Comment puis-je éviter de me perdre dans des zones inconnues du pèlerinage?',
          ud: 'حج کے اناجانے علاقوں میں گم ہونے سے بچنے کا طریقہ کیا ہے؟',
          de: 'Wie kann ich vermeiden, mich in unbekannten Gebieten der Pilgerreise zu verirren?',
          ar: 'كيف يمكنني تجنب الضياع في المناطق غير المألوفة من الحج؟',
          bm: 'Bagaimana saya boleh mengelakkan diri daripada sesat di kawasan yang tidak dikenali semasa ziarah?',
          tr: 'Hac ibadetinde tanımadığınız alanlarda kaybolmaktan nasıl kaçınabilirim?',
          bn: 'যাত্রাগামী হিসেবে অপরিচিত এলাকায় হারিয়ে পড়ার কীভাবে পরিহার করা যায়?',
        },
        answer: {
          en: 'Study maps and familiarize yourself with key landmarks. Keep the contact information of your group leaders and accommodation. Use a mobile app for navigation and directions.',
          fr: 'Étudiez les cartes et familiarisez-vous avec les principaux repères. Conservez les coordonnées de vos chefs de groupe et de votre logement. Utilisez une application mobile pour la navigation et les directions.',
          ud: 'نقشے کی مطالعہ کریں اور اہم علامات سے واقف ہوں۔ اپنے گروپ لیڈرز اور رہائش کے رابطہ کی معلومات محفوظ رکھیں۔ نیویگیشن اور ہدایت کے لئے ایک موبائل ایپ استعمال کریں۔',
          de: 'Studieren Sie Karten und machen Sie sich mit wichtigen Orientierungspunkten vertraut. Behalten Sie die Kontaktdaten Ihrer Gruppenleiter und Unterkünfte bei. Verwenden Sie eine mobile App für Navigation und Richtungsanweisungen.',
          ar: 'دراسة الخرائط وتعرف على العلامات الرئيسية. احتفظ بمعلومات اتصال قادة مجموعتك ومكان إقامتك. استخدم تطبيقًا محمولًا للتنقل والتوجيهات.',
          bm: 'Kaji peta dan kenali ciri-ciri utama. Simpan maklumat hubungan pemimpin kumpulan dan penginapan anda. Gunakan aplikasi mudah alih untuk navigasi dan arahan.',
          tr: 'Haritaları inceleyin ve önemli belirleyici noktaları tanıyın. Grup liderlerinizin ve konaklamanızın iletişim bilgilerini saklayın. Yol bulma ve yönlendirme için bir mobil uygulama kullanın.',
          bn: 'মানচিত্র অধ্যয়ন করুন এবং প্রধান চিহ্নিত স্থানান্তর সম্পর্কে পরিচিত হন। আপনার দলনেতার এবং আবাসনের যোগাযোগ তথ্য সংরক্ষণ করুন। নেভিগেশন এবং নির্দেশানের জন্য একটি মোবাইল অ্যাপ্লিকেশন ব্যবহার করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What resources are available for pilgrims with special needs?',
          fr: 'Quelles ressources sont disponibles pour les pèlerins ayant des besoins spéciaux?',
          ud: 'خصوصی ضروریات رکھنے والے حجاج کے لیے کون سی وسائل دستیاب ہیں؟',
          de: 'Welche Ressourcen stehen Pilgern mit besonderen Bedürfnissen zur Verfügung?',
          ar: 'ما هي الموارد المتاحة للحجاج ذوي الاحتياجات الخاصة؟',
          bm: 'Apakah sumber yang tersedia untuk peziarah yang mempunyai keperluan khas?',
          tr: 'Özel ihtiyaçları olan hacılar için hangi kaynaklar mevcut?',
          bn: 'বিশেষ প্রয়োজনীয়তা সম্পর্কে পথপ্রদর্শন সেবা দেওয়া হয়?',
        },
        answer: {
          en: 'Special assistance services at airports. Wheelchair and mobility aid services. Dedicated medical facilities and staff.',
          fr: "Services d'assistance spéciale dans les aéroports. Services de fauteuils roulants et d'aide à la mobilité. Installations médicales dédiées et personnel qualifié.",
          ud: 'ہوائی اڈے پر خصوصی مدد کی خدمات۔ وہیل چیئر اور حرکت پذیری کی مدد کی خدمات۔ مخصوص طبی امکانات اور عملے۔',
          de: 'Spezielle Assistenzdienste an Flughäfen. Rollstuhl- und Mobilitätshilfsdienste. Dedizierte medizinische Einrichtungen und Personal.',
          ar: 'خدمات المساعدة الخاصة في المطارات. خدمات كراسي المتحرك والمساعدة في التنقل. مرافق طبية مخصصة وطاقم مؤهل.',
          bm: 'Perkhidmatan bantuan khas di lapangan terbang. Perkhidmatan kerusi roda dan bantuan mobiliti. Kemudahan perubatan yang khusus dan kakitangan yang berkelayakan.',
          tr: 'Havalimanlarında özel yardım hizmetleri. Tekerlekli sandalye ve hareketlilik yardım hizmetleri. Ayrılmış tıbbi tesisler ve personel.',
          bn: 'বিশেষ সাহায্য সেবা বান্দরের এয়ারপোর্টে। চক্রসম্পন্ন এবং গতিশীলতা সহায়তা সেবা। সমর্পিত চিকিৎসা সেবা ও কর্মী।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I avoid insect bites and potential diseases they carry?',
          fr: "Comment puis-je éviter les piqûres d'insectes et les maladies potentielles qu'ils transportent?",
          ud: 'کیسے میں کیڑوں کے کاٹنے اور ان کی لے جانے والی ممکنہ بیماریوں سے بچا جاسکتا ہوں؟',
          de: 'Wie kann ich Insektenstiche und potenzielle Krankheiten, die sie übertragen, vermeiden?',
          ar: 'كيف يمكنني تجنب لدغات الحشرات والأمراض المحتملة التي تحملها؟',
          bm: 'Bagaimana saya boleh mengelakkan gigitan serangga dan penyakit berpotensi yang mereka bawa?',
          tr: 'Nasıl böcek ısırıklarından ve taşıdıkları potansiyel hastalıklardan kaçınabilirim?',
          bn: 'আমি কিভাবে কীটপতঙ্গের কামড়ার এবং তারা আনোযোগিক রোগের মুখোমুখি থাকা যোগ্য সংক্রান্ত রোগগুলি থেকে বিরতি করবো?',
        },
        answer: {
          en: 'Use insect repellent. Wear protective clothing. Avoid stagnant water where insects breed.',
          fr: 'Utilisez un répulsif contre les insectes. Portez des vêtements de protection. Évitez les eaux stagnantes où les insectes se reproduisent.',
          ud: 'کیڑوں کو دور رکھنے والا دوا استعمال کریں۔ محافظتی لباس پہنیں۔ ایسی پانی سے بچیں جہاں کیڑے پیدا ہوتے ہیں۔',
          de: 'Verwenden Sie Insektenschutzmittel. Tragen Sie Schutzkleidung. Vermeiden Sie stehendes Wasser, in dem Insekten brüten.',
          ar: 'استخدم مبيدات الحشرات. ارتدي ملابس واقية. تجنب المياه الراكدة حيث يتكاثر الحشرات.',
          bm: 'Gunakan penolak serangga. Pakai pakaian perlindungan. Elakkan air yang tidak mengalir di mana serangga berkembang biak.',
          tr: 'Böcek kovucu kullanın. Koruyucu giysiler giyin. Böceklerin ürediği durgun suları kaçının.',
          bn: 'কীটনাশক ব্যবহার করুন। সুরক্ষামূলক পোশাক পরিধান করুন। কীটপতঙ্গ জন্মগ্রহণ করে থাকা জলের থেকে দূরে থাকুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How should I handle financial transactions safely?',
          fr: 'Comment dois-je gérer les transactions financières en toute sécurité?',
          ud: 'میں مالی لین دین کی تراکیب کو کیسے محفوظ طریقے سے سنبھالوں؟',
          de: 'Wie soll ich finanzielle Transaktionen sicher abwickeln?',
          ar: 'كيف يجب أن أتعامل مع المعاملات المالية بأمان؟',
          bm: 'Bagaimana saya boleh mengendalikan urus niaga kewangan dengan selamat?',
          tr: 'Nasıl güvenli bir şekilde finansal işlemler yapmalıyım?',
          bn: 'আমি কীভাবে আর্থিক লেনদেন নিরাপদে হ্যান্ডেল করব?',
        },
        answer: {
          en: 'Use credit/debit cards where possible. Avoid flashing large amounts of cash. Keep receipts and records of your transactions.',
          fr: "Utilisez des cartes de crédit/débit lorsque cela est possible. Évitez d'exposer de grosses sommes d'argent liquide. Conservez les reçus et les enregistrements de vos transactions.",
          ud: 'جہاں ممکن ہو وہاں کریڈٹ/ڈیبٹ کارڈ استعمال کریں۔ بڑی رقمی ہسپتال بچیں۔ اپنے لین دین کے رسید اور ریکارڈ رکھیں۔',
          de: 'Verwenden Sie Kredit-/Debitkarten, wo immer möglich. Vermeiden Sie es, große Bargeldbeträge zu zeigen. Behalten Sie die Quittungen und Aufzeichnungen Ihrer Transaktionen bei.',
          ar: 'استخدم بطاقات الائتمان/الخصم في الأماكن التي يكون فيها ذلك ممكنًا. تجنب عرض مبالغ كبيرة من النقد. احتفظ بالفواتير وسجلات معاملاتك.',
          bm: 'Gunakan kad kredit/debit di mana mungkin. Elakkan menunjukkan jumlah wang tunai yang besar. Simpan resit dan rekod transaksi anda.',
          tr: 'Mümkün olduğunca kredi/kartınızı kullanın. Büyük miktarda nakit para göstermekten kaçının. İşlemlerinizi makbuzlarını ve kayıtlarını tutun.',
          bn: 'যেখানে সম্ভব তার জন্য ক্রেডিট/ডেবিট কার্ড ব্যবহার করুন। বড় পরিমাণের নগদ অর্থ প্রদর্শন এড়িয়ে চলুন না। আপনার লেনদেনের রসিদ এবং রেকর্ড রাখুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Are there specific health and safety apps for pilgrims?',
          fr: 'Y a-t-il des applications spécifiques de santé et de sécurité pour les pèlerins?',
          ud: 'حجاج کے لئے خصوصی صحت اور حفاظتی ایپس موجود ہیں؟',
          de: 'Gibt es spezielle Gesundheits- und Sicherheits-Apps für Pilger?',
          ar: 'هل هناك تطبيقات محددة للصحة والسلامة للحجاج؟',
          bm: 'Adakah aplikasi kesihatan dan keselamatan khusus untuk peziarah?',
          tr: 'Hacılar için belirli sağlık ve güvenlik uygulamaları var mı?',
          bn: 'পথপ্রদর্শনের জন্য কোন বিশেষ স্বাস্থ্য এবং নিরাপত্তা অ্যাপ আছে?',
        },
        answer: {
          en: "Yes, there are several apps providing guidance, maps, health tips, and emergency contacts. Example: 'Hajj Navigator' or Saudi Hajj Ministry apps.",
          fr: "Oui, il existe plusieurs applications fournissant des conseils, des cartes, des conseils de santé et des contacts d'urgence. Exemple: 'Hajj Navigator' ou les applications du ministère saoudien du Hajj.",
          ud: "ہاں، رہنمائی، نقشے، صحت کے مشورے اور ہنگامی رابطے فراہم کرنے والے کئی ایپس ہیں۔ مثال: 'حج نیویگیٹر' یا سعودی حج وزارت کے ایپس۔",
          de: "Ja, es gibt mehrere Apps, die Anleitung, Karten, Gesundheitstipps und Notfallkontakte bieten. Beispiel: 'Hajj Navigator' oder Apps des saudischen Hadsch-Ministeriums.",
          ar: "نعم، هناك العديد من التطبيقات التي تقدم إرشادات وخرائط ونصائح صحية وجهات اتصال للطوارئ. مثال: 'Hajj Navigator' أو تطبيقات وزارة الحج السعودية.",
          bm: "Ya, terdapat beberapa aplikasi yang memberikan panduan, peta, tip kesihatan, dan kontak kecemasan. Contoh: 'Hajj Navigator' atau aplikasi Kementerian Haji Arab Saudi.",
          tr: "Evet, rehberlik, haritalar, sağlık ipuçları ve acil durum kontakları sağlayan birkaç uygulama var. Örnek: 'Hajj Navigator' veya Suudi Hacı Bakanlığı uygulamaları.",
          bn: "হ্যাঁ, সেখানে কয়েকটি অ্যাপস আছে যা নির্দেশনা, ম্যাপ, স্বাস্থ্য পরামর্শ এবং জরুরি যোগাযোগ সরবরাহ করে। উদাহরণ: 'হজ্জ ন্যাভিগেটর' অথবা সৌদি হজ্জ মন্ত্রণালয়ের অ্যাপ।",
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How should I dispose of waste properly to maintain cleanliness?',
          fr: 'Comment dois-je éliminer correctement les déchets pour maintenir la propreté ?',
          ud: 'میں صفائی برقرار رکھنے کے لیے کچرے کا صحیح طریقے سے کیسے نظام کروں؟',
          de: 'Wie soll ich Abfall richtig entsorgen, um die Sauberkeit zu erhalten?',
          ar: 'كيف ينبغي لي التخلص من النفايات بشكل صحيح للحفاظ على النظافة؟',
          bm: 'Bagaimanakah saya harus melupuskan sampah dengan betul untuk mengekalkan kebersihan?',
          tr: 'Temizliği sürdürmek için atıkları nasıl uygun şekilde bertaraf etmeliyim?',
          bn: 'পরিষ্কার পরিচ্ছন্নতা বজায় রাখতে আমাকে কীভাবে যথাযথভাবে বর্জ্য নিষ্পত্তি করতে হবে?',
        },
        answer: {
          en: 'Use the designated waste bins. Avoid littering and encourage others to do the same.',
          fr: 'Utilisez les bacs à déchets désignés. Évitez de jeter des déchets et encouragez les autres à faire de même.',
          ud: 'مقرر کردہ کچرے کے ڈبوں کا استعمال کریں۔ آلودگی سے گریز کریں اور دوسروں کو بھی ایسا ہی کرنے کی ترغیب دیں۔',
          de: 'Benutzen Sie die dafür vorgesehenen Abfallbehälter. Vermeiden Sie Littering und ermutigen Sie andere, es ebenso zu tun.',
          ar: 'استخدم صناديق القمامة المخصصة. تجنب رمي النفايات وشجع الآخرين على فعل الشيء نفسه.',
          bm: 'Gunakan tong sampah yang dikhususkan. Elakkan membuang sampah merata-rata dan galakkan orang lain berbuat sama.',
          tr: 'Belirtilen atık kutularını kullanın. Çöp atmaktan kaçının ve başkalarını da aynısını yapmaya teşvik edin.',
          bn: 'নির্ধারিত বর্জ্য বিনগুলি ব্যবহার করুন। অপরিষ্কার করা এড়িয়ে চলুন এবং অন্যদেরকেও একইভাবে করতে উত্সাহ দিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I lose my travel documents or money?',
          fr: 'Que dois-je faire si je perds mes documents de voyage ou mon argent ?',
          ud: 'اگر میری سفری دستاویزات یا پیسے گم ہو جائیں تو مجھے کیا کرنا چاہیے؟',
          de: 'Was soll ich tun, wenn ich meine Reisedokumente oder Geld verliere?',
          ar: 'ماذا ينبغي علي أن أفعل إذا فقدت وثائق سفري أو نقودي؟',
          bm: 'Apa yang harus saya lakukan jika saya hilang dokumen perjalanan atau wang?',
          tr: 'Seyahat belgelerimi veya paramı kaybedersem ne yapmalıyım?',
          bn: 'আমার যদি ট্রাভেল ডকুমেন্ট বা অর্থ হারিয়ে যায় তাহলে আমাকে কী করতে হবে?',
        },
        answer: {
          en: "Report immediately to your group leader. Contact your country's embassy or consulate. File a report with local authorities if necessary.",
          fr: "Signalez-le immédiatement à votre chef de groupe. Contactez l'ambassade ou le consulat de votre pays. Déposez un rapport auprès des autorités locales si nécessaire.",
          ud: 'فوری طور پر اپنے گروپ لیڈر کو اطلاع کریں۔ اپنے ملک کے سفارتخانے یا قونصلخانے سے رابطہ کریں۔ ضرورت پڑنے پر مقامی حکام کے ساتھ رپورٹ درج کروائیں۔',
          de: 'Melden Sie es sofort Ihrem Gruppenleiter. Kontaktieren Sie die Botschaft oder das Konsulat Ihres Landes. Erstatten Sie bei Bedarf Anzeige bei den örtlichen Behörden.',
          ar: 'أبلغ قائد مجموعتك على الفور. اتصل بسفارة بلدك أو قنصليتها. قدم تقريرًا للسلطات المحلية إذا لزم الأمر.',
          bm: 'Laporkan segera kepada ketua kumpulan anda. Hubungi kedutaan atau konsulat negara anda. Failkan laporan dengan pihak berkuasa tempatan jika perlu.',
          tr: 'Hemen grup liderinize bildirin. Ülkenizin büyükelçiliği veya konsolosluğu ile iletişime geçin. Gerekirse yerel makamlarla bir rapor düzenleyin.',
          bn: 'অবিলম্বে আপনার গ্রুপ লিডারকে রিপোর্ট করুন। আপনার দেশের দূতাবাস বা কনস্যুলেটের সাথে যোগাযোগ করুন। প্রয়োজনে স্থানীয় কর্তৃপক্ষের কাছে একটি রিপোর্ট দাখিল করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I minimize my environmental footprint during Hajj?',
          fr: 'Comment puis-je minimiser mon empreinte environnementale pendant le Hajj ?',
          ud: 'حج کے دوران میں اپنے ماحولیاتی نقش قدم کو کم سے کم کیسے کر سکتا ہوں؟',
          de: 'Wie kann ich während der Hadsch meinen ökologischen Fußabdruck minimieren?',
          ar: 'كيف يمكنني التقليل من بصمتي البيئية خلال الحج؟',
          bm: 'Bagaimanakah saya boleh mengurangkan jejak alam sekitar saya semasa Haji?',
          tr: 'Hac sırasında çevresel ayak izimi nasıl en aza indirebilirim?',
          bn: 'হজ্জের সময় কীভাবে আমি আমার পরিবেশগত ছাপ কমাতে পারি?',
        },
        answer: {
          en: 'Use reusable water bottles and bags. Minimize plastic use. Dispose of waste properly. Use public transportation or carpool.',
          fr: "Utilisez des bouteilles d'eau et des sacs réutilisables. Réduisez l'utilisation du plastique. Éliminez les déchets de manière appropriée. Utilisez les transports publics ou le covoiturage.",
          ud: 'قابل استعمال بوتلوں اور تھیلوں کا استعمال کریں۔ پلاسٹک کے استعمال کو کم سے کم کریں۔ کچرے کا مناسب طریقے سے نظام کریں۔ عوامی نقل و حمل یا کارپول کا استعمال کریں۔',
          de: 'Verwenden Sie wiederverwendbare Wasserflaschen und Taschen. Minimieren Sie die Verwendung von Plastik. Entsorgen Sie Abfälle ordnungsgemäß. Nutzen Sie öffentliche Verkehrsmittel oder Fahrgemeinschaften.',
          ar: 'استخدم زجاجات المياه والحقائب القابلة لإعادة الاستخدام. قلل استخدام البلاستيك. تخلص من النفايات بشكل صحيح. استخدم المواصلات العامة أو نظام المشاركة بالسيارة.',
          bm: 'Gunakan botol air dan beg yang boleh diguna semula. Minimumkan penggunaan plastik. Lupuskan sampah dengan betul. Gunakan pengangkutan awam atau karpool.',
          tr: "Yeniden kullanılabilir su şişeleri ve çantalar kullanın. Plastik kullanımını en aza indirin. Atıkları uygun şekilde bertaraf edin. Toplu taşıma araçlarını veya karpool'u kullanın.",
          bn: 'পুনর্ব্যবহারযোগ্য জলের বোতল এবং ব্যাগ ব্যবহার করুন। প্লাস্টিকের ব্যবহার কমান। যথাযথভাবে বর্জ্য নিষ্পত্তি করুন। গণপরিবহন বা কারপুল ব্যবহার করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What are the guidelines for waste disposal in Hajj sites?',
          fr: "Quelles sont les directives pour l'élimination des déchets dans les lieux du Hajj ?",
          ud: 'حج کی جگہوں پر کچرے کے نظام کے لیے کیا ہدایات ہیں؟',
          de: 'Was sind die Richtlinien für die Abfallentsorgung an Hadsch-Stätten?',
          ar: 'ما هي إرشادات التخلص من النفايات في مواقع الحج؟',
          bm: 'Apakah garis panduan untuk pelupusan sampah di tempat-tempat Haji?',
          tr: 'Hac alanlarında atık bertarafı için yönergeler nelerdir?',
          bn: 'হজ্জের স্থানে বর্জ্য নিষ্পত্তির জন্য নির্দেশিকাগুলি কী?',
        },
        answer: {
          en: 'Follow local waste disposal guidelines. Use designated bins for different types of waste. Avoid littering.',
          fr: "Suivez les directives locales d'élimination des déchets. Utilisez les bacs désignés pour différents types de déchets. Évitez de jeter des ordures.",
          ud: 'مقامی کچرے کے نظام کی ہدایات پر عمل کریں۔ مختلف اقسام کے کچرے کے لیے مقرر کردہ ڈبوں کا استعمال کریں۔ آلودگی سے گریز کریں۔',
          de: 'Befolgen Sie die örtlichen Richtlinien für die Abfallentsorgung. Benutzen Sie die dafür vorgesehenen Behälter für verschiedene Arten von Abfall. Vermeiden Sie Littering.',
          ar: 'اتبع إرشادات التخلص من النفايات المحلية. استخدم الحاويات المخصصة لأنواع مختلفة من النفايات. تجنب رمي النفايات.',
          bm: 'Ikut garis panduan pelupusan sampah tempatan. Gunakan tong sampah yang dikhususkan untuk jenis sampah yang berbeza. Elakkan membuang sampah merata-rata.',
          tr: 'Yerel atık bertaraf yönergelerini izleyin. Farklı atık türleri için ayrılmış kutuları kullanın. Çöp atmaktan kaçının.',
          bn: 'স্থানীয় বর্জ্য নিষ্পত্তির নির্দেশিকা অনুসরণ করুন। বিভিন্ন ধরনের বর্জ্যের জন্য নির্দিষ্ট বিনগুলি ব্যবহার করুন। অপরিষ্কার করা এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Are there designated areas for recycling during Hajj?',
          fr: 'Existe-t-il des zones désignées pour le recyclage pendant le Hajj ?',
          ud: 'کیا حج کے دوران ری سائیکلنگ کے لیے مخصوص علاقے ہیں؟',
          de: 'Gibt es während der Hadsch ausgewiesene Bereiche für das Recycling?',
          ar: 'هل هناك مناطق مخصصة لإعادة التدوير خلال الحج؟',
          bm: 'Adakah kawasan yang ditetapkan untuk pengitaran semula semasa Haji?',
          tr: 'Hac sırasında geri dönüşüm için belirlenmiş alanlar var mı?',
          bn: 'হজ্জের সময় পুনর্নবীকরণের জন্য নির্দিষ্ট এলাকা আছে কি?',
        },
        answer: {
          en: 'Yes, there are designated recycling areas. Look for recycling bins and participate in recycling programs.',
          fr: 'Oui, il existe des zones désignées pour le recyclage. Cherchez les bacs de recyclage et participez aux programmes de recyclage.',
          ud: 'ہاں، ری سائیکلنگ کے لیے مخصوص علاقے ہیں۔ ری سائیکلنگ کے ڈبوں کی تلاش کریں اور ری سائیکلنگ پروگراموں میں شرکت کریں۔',
          de: 'Ja, es gibt ausgewiesene Recyclingbereiche. Halten Sie nach Recyclingbehältern Ausschau und beteiligen Sie sich an Recyclingprogrammen.',
          ar: 'نعم، هناك مناطق مخصصة لإعادة التدوير. ابحث عن صناديق إعادة التدوير وشارك في برامج إعادة التدوير.',
          bm: 'Ya, terdapat kawasan kitar semula yang ditetapkan. Cari tong kitar semula dan sertai program kitar semula.',
          tr: 'Evet, geri dönüşüm için belirlenmiş alanlar var. Geri dönüşüm kutularını arayın ve geri dönüşüm programlarına katılın.',
          bn: 'হ্যাঁ, পুনর্নবীকরণের জন্য নির্দিষ্ট এলাকা রয়েছে। পুনর্নবীকরণ বিন খুঁজুন এবং পুনর্নবীকরণ কর্মসূচিতে অংশগ্রহণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I avoid contributing to air pollution during my pilgrimage?',
          fr: "Comment puis-je éviter de contribuer à la pollution de l'air pendant mon pèlerinage ?",
          ud: 'میں اپنے زیارت کے دوران ہوا کی آلودگی میں حصہ ڈالنے سے کیسے بچ سکتا ہوں؟',
          de: 'Wie kann ich während meiner Pilgerreise vermeiden, zur Luftverschmutzung beizutragen?',
          ar: 'كيف يمكنني تجنب المساهمة في تلوث الهواء خلال رحلة حجي؟',
          bm: 'Bagaimanakah saya boleh mengelakkan menyumbang kepada pencemaran udara semasa pengembaran saya?',
          tr: 'Hac ziyaretim sırasında hava kirliliğine katkıda bulunmaktan nasıl kaçınabilirim?',
          bn: 'আমার তীর্থযাত্রার সময় কীভাবে আমি বায়ু দূষণে অবদান রাখা এড়িয়ে চলতে পারি?',
        },
        answer: {
          en: 'Use public transportation. Avoid using vehicles with high emissions. Minimize the use of generators or portable stoves.',
          fr: "Utilisez les transports publics. Évitez d'utiliser des véhicules à fortes émissions. Minimisez l'utilisation de générateurs ou de réchauds portables.",
          ud: 'عوامی نقل و حمل کا استعمال کریں۔ زیادہ اخراج والی گاڑیوں کے استعمال سے گریز کریں۔ جنریٹرز یا پورٹیبل چولہوں کے استعمال کو کم سے کم کریں۔',
          de: 'Benutzen Sie öffentliche Verkehrsmittel. Vermeiden Sie den Einsatz von Fahrzeugen mit hohen Emissionen. Minimieren Sie die Nutzung von Generatoren oder Kochern.',
          ar: 'استخدم المواصلات العامة. تجنب استخدام المركبات ذات الانبعاثات العالية. قلل من استخدام المولدات أو المواقد المحمولة.',
          bm: 'Gunakan pengangkutan awam. Elakkan menggunakan kenderaan dengan pelepasan tinggi. Minimumkan penggunaan penjana atau dapur mudah alih.',
          tr: 'Toplu taşımayı kullanın. Yüksek emisyonlu araçları kullanmaktan kaçının. Jeneratör veya taşınabilir sobaların kullanımını en aza indirin.',
          bn: 'গণপরিবহন ব্যবহার করুন। উচ্চ নির্গমনযুক্ত যানবাহন ব্যবহার এড়িয়ে চলুন। জেনারেটর বা বহনযোগ্য চুলাগুলির ব্যবহার কমিয়ে দিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What steps can I take to conserve water while performing Hajj rituals?',
          fr: "Quelles mesures puis-je prendre pour économiser l'eau lors de l'accomplissement des rituels du Hajj ?",
          ud: 'حج کے رسومات ادا کرتے ہوئے میں پانی کی بچت کے لیے کیا اقدامات کر سکتا ہوں؟',
          de: 'Welche Schritte kann ich unternehmen, um beim Ausführen der Hadsch-Rituale Wasser zu sparen?',
          ar: 'ما هي الخطوات التي يمكنني اتخاذها لتوفير المياه أثناء أداء شعائر الحج؟',
          bm: 'Apakah langkah-langkah yang boleh saya ambil untuk menjimatkan air semasa melaksanakan ritual Haji?',
          tr: 'Hac ritüellerini yerine getirirken su tasarrufu yapmak için neler yapabilirim?',
          bn: 'হজ্জের নানা রীতি পালন করার সময় আমি কীভাবে জল সংরক্ষণ করতে পারি?',
        },
        answer: {
          en: 'Take shorter showers. Use water-saving devices. Avoid unnecessary water use.',
          fr: "Prenez des douches plus courtes. Utilisez des dispositifs économiseurs d'eau. Évitez les gaspillages d'eau inutiles.",
          ud: 'مختصر شاور لیں۔ پانی بچانے والے آلات کا استعمال کریں۔ غیر ضروری پانی کے استعمال سے گریز کریں۔',
          de: 'Duschen Sie kürzer. Verwenden Sie wassersparende Geräte. Vermeiden Sie unnötige Wassernutzung.',
          ar: 'خذ دشات أقصر. استخدم أجهزة توفير المياه. تجنب استخدام المياه بشكل غير ضروري.',
          bm: 'Ambil pancuran yang lebih singkat. Gunakan peralatan penjimatan air. Elakkan penggunaan air yang tidak perlu.',
          tr: 'Daha kısa süre duş alın. Su tasarrufu sağlayan cihazlar kullanın. Gereksiz su kullanımından kaçının.',
          bn: 'আরও কম সময়ের জন্য শাওয়ার নিন। জল সংরক্ষণকারী ডিভাইস ব্যবহার করুন। অপ্রয়োজনীয় জল ব্যবহার এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How does the local government handle environmental cleanliness during Hajj?',
          fr: 'Comment le gouvernement local gère-t-il la propreté environnementale pendant le Hajj ?',
          ud: 'حج کے دوران مقامی حکومت ماحولیاتی صفائی کا معاملہ کیسے نبھاتی ہے؟',
          de: 'Wie geht die lokale Regierung mit der Sauberkeit der Umwelt während der Hadsch um?',
          ar: 'كيف تتعامل الحكومة المحلية مع نظافة البيئة خلال موسم الحج؟',
          bm: 'Bagaimanakah kerajaan tempatan mengendalikan kebersihan persekitaran semasa Haji?',
          tr: 'Yerel yönetim, Hac sırasında çevresel temizliği nasıl ele alıyor?',
          bn: 'হজ্জের সময় স্থানীয় সরকার পরিবেশগত পরিচ্ছন্নতা কীভাবে পরিচালনা করে?',
        },
        answer: {
          en: 'The local government sets up additional waste management services. Comprehensive cleaning schedules are maintained.',
          fr: 'Le gouvernement local met en place des services supplémentaires de gestion des déchets. Des programmes complets de nettoyage sont maintenus.',
          ud: 'مقامی حکومت اضافی کچرے کے نظام کی خدمات قائم کرتی ہے۔ مکمل صفائی کے شیڈول برقرار رکھے جاتے ہیں۔',
          de: 'Die lokale Regierung richtet zusätzliche Abfallwirtschaftsdienste ein. Umfassende Reinigungspläne werden eingehalten.',
          ar: 'تنشئ الحكومة المحلية خدمات إضافية لإدارة النفايات. ويتم الحفاظ على جداول التنظيف الشاملة.',
          bm: 'Kerajaan tempatan menubuhkan perkhidmatan pengurusan sisa tambahan. Jadual pembersihan yang komprehensif dikekalkan.',
          tr: 'Yerel yönetim, ek atık yönetimi hizmetleri kuruyor. Kapsamlı temizlik programları sürdürülüyor.',
          bn: 'স্থানীয় সরকার অতিরিক্ত বর্জ্য ব্যবস্থাপনা পরিষেবাগুলি প্রতিষ্ঠা করে। বিস্তারিত পরিষ্কার পরিকল্পনাগুলি বজায় রাখা হয়।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What can I do to help keep the pilgrimage sites clean?',
          fr: 'Que puis-je faire pour aider à garder les lieux de pèlerinage propres ?',
          ud: 'میں زیارتگاہوں کو صاف ستھرا رکھنے میں کیا مدد کر سکتا ہوں؟',
          de: 'Was kann ich tun, um dabei zu helfen, die Pilgersstätten sauber zu halten?',
          ar: 'ماذا يمكنني أن أفعل للمساعدة في الحفاظ على نظافة أماكن الحج؟',
          bm: 'Apakah yang boleh saya lakukan untuk membantu mengekalkan kebersihan tempat-tempat pengembaran?',
          tr: 'Hac yerlerini temiz tutmaya yardımcı olmak için ne yapabilirim?',
          bn: 'তীর্থস্থানগুলি পরিষ্কার রাখতে আমি কী করতে পারি?',
        },
        answer: {
          en: 'Dispose of waste properly. Encourage others to keep the area clean. Participate in clean-up activities.',
          fr: 'Jetez les déchets de manière appropriée. Encouragez les autres à garder la zone propre. Participez aux activités de nettoyage.',
          ud: 'کچرے کا مناسب طریقے سے نظام کریں۔ دوسروں کو علاقہ صاف ستھرا رکھنے کی ترغیب دیں۔ صفائی کی سرگرمیوں میں شریک ہوں۔',
          de: 'Entsorgen Sie Abfälle ordnungsgemäß. Ermutigen Sie andere, den Bereich sauber zu halten. Beteiligen Sie sich an Aufräumaktionen.',
          ar: 'تخلص من النفايات بشكل صحيح. شجع الآخرين على الحفاظ على نظافة المنطقة. شارك في أنشطة التنظيف.',
          bm: 'Lupuskan sampah dengan betul. Galakkan orang lain untuk mengekalkan kebersihan kawasan. Sertai aktiviti pembersihan.',
          tr: 'Atıkları uygun şekilde bertaraf edin. Başkalarını alanı temiz tutmaya teşvik edin. Temizlik faaliyetlerine katılın.',
          bn: 'যথাযথভাবে বর্জ্য নিষ্পত্তি করুন। অন্যদের এলাকা পরিষ্কার রাখতে উৎসাহিত করুন। পরিচ্ছন্নতা কার্যক্রমে অংশগ্রহণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How are the waste collection services managed during Hajj?',
          fr: 'Comment les services de collecte des déchets sont-ils gérés pendant le Hajj ?',
          ud: 'حج کے دوران کچرا اکٹھا کرنے کی خدمات کا انتظام کیسے کیا جاتا ہے؟',
          de: 'Wie werden die Abfallsammeldienste während der Hadsch verwaltet?',
          ar: 'كيف يتم إدارة خدمات جمع النفايات خلال موسم الحج؟',
          bm: 'Bagaimanakah perkhidmatan pengumpulan sampah diuruskan semasa Haji?',
          tr: 'Hac sırasında atık toplama hizmetleri nasıl yönetiliyor?',
          bn: 'হজ্জের সময় বর্জ্য সংগ্রহ পরিষেবাগুলি কীভাবে পরিচালিত হয়?',
        },
        answer: {
          en: 'Waste collection services are intensified during Hajj. Additional garbage bins and collection points are provided.',
          fr: 'Les services de collecte des déchets sont intensifiés pendant le Hajj. Des bacs à ordures et des points de collecte supplémentaires sont fournis.',
          ud: 'حج کے دوران کچرا اکھٹا کرنے کی سروسز کو بڑھا دیا جاتا ہے۔ اضافی کچرے کے ڈبے اور اکھٹا کرنے کے مقامات فراہم کیے جاتے ہیں۔',
          de: 'Die Müllsammeldienste werden während der Hadsch intensiviert. Zusätzliche Mülltonnen und Sammelstellen werden bereitgestellt.',
          ar: 'تُكثَّف خدمات جمع النفايات أثناء موسم الحج. ويتم توفير صناديق قمامة إضافية ونقاط تجميع.',
          bm: 'Perkhidmatan pengumpulan sisa dipertingkatkan semasa Musim Haji. Tong sampah dan kawasan pengumpulan tambahan disediakan.',
          tr: 'Hac sırasında atık toplama hizmetleri yoğunlaştırılır. Ek çöp kutuları ve toplama noktaları sağlanır.',
          bn: 'হজ্জের সময় অপরিষ্কার পরিচ্ছন্নতা সংগ্রহ পরিষেবাগুলি বৃদ্ধি করা হয়। অতিরিক্ত আবর্জনা বিন এবং সংগ্রহ বিন্দুগুলি প্রদান করা হয়।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Are there any local or global environmental initiatives I can support while at Hajj?',
          fr: 'Existe-t-il des initiatives environnementales locales ou mondiales que je peux soutenir pendant le Hajj ?',
          ud: 'کیا حج کے دوران کوئی مقامی یا عالمی ماحولیاتی امدامات ہیں جنہیں میں سپورٹ کر سکتا ہوں؟',
          de: 'Gibt es lokale oder globale Umweltinitiativen, die ich während der Hadsch unterstützen kann?',
          ar: 'هل هناك أي مبادرات بيئية محلية أو عالمية يمكنني دعمها أثناء الحج؟',
          bm: 'Adakah ada inisiatif alam sekitar tempatan atau global yang boleh saya sokong semasa di Haji?',
          tr: 'Hac sırasında destekleyebileceğim yerel veya küresel çevre girişimleri var mı?',
          bn: 'আমি কি হজ্জের সময় কোন স্থানীয় বা গ্লোবাল পরিবেশগত উদ্যোগকে সমর্থন করতে পারি?',
        },
        answer: {
          en: 'Yes, support local and international environmental initiatives and campaigns. Participate in clean-up drives.',
          fr: 'Oui, soutenez les initiatives et campagnes environnementales locales et internationales. Participez aux opérations de nettoyage.',
          ud: 'ہاں، مقامی اور عالمی ماحولیاتی امدامات اور مہمات کی حمایت کریں۔ صفائی مہمات میں حصہ لیں۔',
          de: 'Ja, unterstützen Sie lokale und internationale Umweltinitiativen und -kampagnen. Beteiligen Sie sich an Aufräumaktionen.',
          ar: 'نعم، ادعم المبادرات والحملات البيئية المحلية والدولية. شارك في حملات التنظيف.',
          bm: 'Ya, sokong inisiatif dan kempen alam sekitar tempatan dan antarabangsa. Sertai kempen pembersihan.',
          tr: 'Evet, yerel ve uluslararası çevre girişimlerini ve kampanyalarını destekleyin. Temizlik seferberliklerine katılın.',
          bn: 'হ্যাঁ, স্থানীয় এবং আন্তর্জাতিক পরিবেশগত উদ্যোগ এবং প্রচারাভিযানগুলিকে সমর্থন করুন। পরিচ্ছন্নতা অভিযানে অংশগ্রহণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How do I properly dispose of plastic and other non-biodegradable materials during Hajj?',
          fr: 'Comment dois-je me débarrasser correctement des plastiques et autres matériaux non biodégradables pendant le Hajj ?',
          ud: 'حج کے دوران پلاسٹک اور دیگر غیر قابل تحلیل مواد کو کس طرح درست طریقے سے نکالا جائے؟',
          de: 'Wie entsorge ich Kunststoff und andere nicht bioabbaubare Materialien während der Hadsch ordnungsgemäß?',
          ar: 'كيف يمكنني التخلص بشكل صحيح من البلاستيك والمواد غير القابلة للتحلل البيولوجي أثناء الحج؟',
          bm: 'Bagaimanakah cara yang betul untuk membuang plastik dan bahan lain yang tidak dapat diurai semasa Haji?',
          tr: 'Hac sırasında plastik ve diğer biyolojik olarak parçalanamayan malzemeleri nasıl uygun bir şekilde atarım?',
          bn: 'হজ্জের সময় আমি কিভাবে যথাযথভাবে প্লাস্টিক এবং অন্যান্য অবৈজ পদার্থ নিষ্পত্তি করব?',
        },
        answer: {
          en: 'Use recycling bins. Avoid using non-biodegradable items where possible. Follow local disposal guidelines.',
          fr: "Utilisez les bacs de recyclage. Évitez d'utiliser des articles non biodégradables si possible. Suivez les directives locales en matière d'élimination.",
          ud: 'ری سائیکلنگ کے ڈبوں کا استعمال کریں۔ جہاں ممکن ہو غیر قابل تحلیل اشیاء کا استعمال سے گریز کریں۔ مقامی نکالنے کے ہدایات پر عمل کریں۔',
          de: 'Benutzen Sie Recyclingtonnen. Vermeiden Sie nach Möglichkeit den Einsatz von nicht bioabbaubaren Gegenständen. Befolgen Sie die örtlichen Entsorgungsrichtlinien.',
          ar: 'استخدم صناديق إعادة التدوير. تجنب استخدام المواد غير القابلة للتحلل البيولوجي إن أمكن. اتبع إرشادات التخلص المحلية.',
          bm: 'Gunakan tong kitar semula. Elakkan menggunakan barang bukan biobioterurai sekiranya boleh. Ikuti garis panduan pelupusan tempatan.',
          tr: 'Geri dönüşüm kutularını kullanın. Mümkün olan yerlerde biyolojik olarak parçalanamayan ürünleri kullanmaktan kaçının. Yerel bertaraf kılavuzlarını izleyin.',
          bn: 'পুনর্বাসযোগ্য বিনগুলি ব্যবহার করুন। যেখানে সম্ভব অবৈজ পদার্থগুলির ব্যবহার এড়িয়ে চলুন। স্থানীয় নিষ্পত্তি নির্দেশিকা অনুসরণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What are the most common types of injuries during Hajj?',
          fr: 'Quels sont les types de blessures les plus courants pendant le Hajj ?',
          ud: 'حج کے دوران سب سے عام قسم کی چوٹیں کونسی ہیں؟',
          de: 'Was sind die häufigsten Arten von Verletzungen während der Hadsch?',
          ar: 'ما هي أنواع الإصابات الأكثر شيوعًا أثناء الحج؟',
          bm: 'Apakah jenis kecederaan paling biasa semasa Haji?',
          tr: 'Hac sırasında en yaygın yaralanma türleri nelerdir?',
          bn: 'হজ্জের সময় সবচেয়ে সাধারণ আঘাতের ধরণগুলি কী কী?',
        },
        answer: {
          en: 'Common injuries include heatstroke, dehydration, blisters, sprains, and cuts.',
          fr: 'Les blessures courantes comprennent les coups de chaleur, la déshydratation, les ampoules, les entorses et les coupures.',
          ud: 'عام زخموں میں گرمی کا احساس، پانی کی کمی، پھنسیاں، موچ آنا اور زخم شامل ہیں۔',
          de: 'Häufige Verletzungen sind Hitzschlag, Dehydrierung, Blasen, Verstauchungen und Schnitte.',
          ar: 'تشمل الإصابات الشائعة ضربة الشمس، الجفاف، قرح القدم، اللواي والجروح.',
          bm: 'Kecederaan biasa termasuk strok haba, dehidrasi, kedal, terguling, dan luka.',
          tr: 'Yaygın yaralanmalar arasında güneş çarpması, dehidratasyon, nasırlar, incinmeler ve kesikler yer alır.',
          bn: 'সাধারণ আঘাতগুলির মধ্যে রয়েছে গরমাঘাত, জলাভাব, ফোলা, মোচড় এবং আঘাত।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I prevent falls and slips on the ground?',
          fr: 'Comment puis-je éviter les chutes et les glissades au sol ?',
          ud: 'میں زمین پر گرنے اور پھسلنے سے کیسے بچ سکتا ہوں؟',
          de: 'Wie kann ich Stürze und Rutschpartien auf dem Boden verhindern?',
          ar: 'كيف يمكنني منع السقوط والانزلاق على الأرض؟',
          bm: 'Bagaimanakah cara mengelakkan jatuh dan tergelincir di atas tanah?',
          tr: 'Yere düşme ve kaymaları nasıl önleyebilirim?',
          bn: 'আমি কীভাবে মাটিতে পড়ে যাওয়া এবং ঘষা এড়িয়ে চলতে পারি?',
        },
        answer: {
          en: 'Wear non-slip shoes, avoid wet surfaces, and be mindful of your surroundings.',
          fr: 'Portez des chaussures antidérapantes, évitez les surfaces mouillées et soyez attentif à votre environnement.',
          ud: 'غیر پھسلنے والے جوتے پہنیں، گیلی سطحوں سے بچیں، اور اپنے آس پاس کا خیال رکھیں۔',
          de: 'Tragen Sie rutschfeste Schuhe, meiden Sie nasse Oberflächen und achten Sie auf Ihre Umgebung.',
          ar: 'ارتدِ أحذية مانعة للانزلاق، تجنب الأسطح المبللة، وكن متيقظًا لما حولك.',
          bm: 'Pakai kasut tidak tergelincir, elakkan permukaan yang basah, dan berwaspada dengan persekitaran anda.',
          tr: 'Kaymayan ayakkabılar giyin, ıslak yüzeylerden kaçının ve çevrenizdeki şeylerin farkında olun.',
          bn: 'নন-স্লিপ জুতো পরুন, ভিজে তল এড়িয়ে চলুন এবং আপনার পরিবেশের প্রতি সতর্ক থাকুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I sprain my ankle or wrist during the pilgrimage?',
          fr: 'Que dois-je faire si je me fais une entorse à la cheville ou au poignet pendant le pèlerinage ?',
          ud: 'اگر زیارت کے دوران میرے ٹخنے یا کلائی میں موچ آ جائے تو مجھے کیا کرنا چاہیے؟',
          de: 'Was soll ich tun, wenn ich mir während der Pilgerfahrt den Knöchel oder das Handgelenk verstauche?',
          ar: 'ماذا ينبغي علي فعله إذا التواء كاحلي أو رسغي أثناء الحج؟',
          bm: 'Apa yang harus saya lakukan jika terguling buku lali atau mata kaki semasa mengembara?',
          tr: 'Hac sırasında bileklerimi veya bilek kemiklerimi incittiğimde ne yapmalıyım?',
          bn: 'যদি তীর্থযাত্রার সময় আমার নাড়ু বা নাড়ির মোচড় হয়ে যায়, তাহলে আমাকে কী করা উচিত?',
        },
        answer: {
          en: 'Rest the affected area, apply ice, and seek medical attention if necessary.',
          fr: 'Reposez la zone touchée, appliquez de la glace et consultez un médecin si nécessaire.',
          ud: 'متاثرہ علاقے کو آرام دیں، برف رکھیں، اور ضرورت پڑنے پر طبی توجہ حاصل کریں۔',
          de: 'Geben Sie der betroffenen Stelle Ruhe, kühlen Sie sie und suchen Sie bei Bedarf einen Arzt auf.',
          ar: 'استرح المنطقة المصابة، ضع الثلج عليها، والتمس الرعاية الطبية إذا لزم الأمر.',
          bm: 'Rehatkan kawasan yang terjejas, letakkan ais, dan dapatkan rawatan perubatan jika perlu.',
          tr: 'Etkilenen bölgeye istirahat verin, buz uygulayın ve gerekirse tıbbi yardım alın.',
          bn: 'আক্রান্ত এলাকাটিকে বিশ্রাম দিন, বরফ প্রয়োগ করুন এবং প্রয়োজন হলে চিকিত্সা সহায়তা নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I avoid getting blisters from walking long distances?',
          fr: 'Comment puis-je éviter les ampoules en marchant sur de longues distances ?',
          ud: 'میں کیسے لمبی دوریوں پر چلنے سے پھنسیوں سے بچ سکتا ہوں؟',
          de: 'Wie kann ich Blasen vom Gehen langer Strecken vermeiden?',
          ar: 'كيف يمكنني تجنب ظهور قرح القدم من المشي لمسافات طويلة؟',
          bm: 'Bagaimanakah cara mengelakkan daripada mendapat kedal akibat berjalan jarak yang jauh?',
          tr: 'Uzun mesafeler yürürken nasırlardan nasıl kaçınabilirim?',
          bn: 'দীর্ঘ দূরত্ব হাঁটার কারণে আমি কীভাবে ফোলা এড়াতে পারি?',
        },
        answer: {
          en: 'Wear comfortable, well-fitted shoes and use blister pads as needed.',
          fr: 'Portez des chaussures confortables et bien ajustées et utilisez des coussinets anti-ampoules au besoin.',
          ud: 'آرام دہ اور اچھی طرح سے فٹ جوتے پہنیں اور ضرورت پڑنے پر پھنسی کی پٹیاں استعمال کریں۔',
          de: 'Tragen Sie bequeme und gut sitzende Schuhe und benutzen Sie bei Bedarf Blasenpflaster.',
          ar: 'ارتد أحذية مريحة ومناسبة واستخدم لصقات قرح القدم عند الحاجة.',
          bm: 'Pakai kasut yang selesa dan muat dan gunakan pelapik kedal jika perlu.',
          tr: 'Rahat ve tam oturan ayakkabılar giyin ve gerektiğinde nasır pedleri kullanın.',
          bn: 'আরামদায়ক এবং সুপরিধেয় জুতো পরুন এবং প্রয়োজনে ফোলা প্যাড ব্যবহার করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I experience a muscle cramp or strain?',
          fr: 'Que dois-je faire si je ressens une crampe ou une élongation musculaire ?',
          ud: 'اگر مجھے پٹھوں میں اکڑن یا کھینچاؤ محسوس ہوتا ہے تو مجھے کیا کرنا چاہیے؟',
          de: 'Was soll ich tun, wenn ich einen Muskelkrampf oder eine Zerrung bekomme?',
          ar: 'ماذا ينبغي علي فعله إذا عانيت من تشنج أو التواء عضلي؟',
          bm: 'Apa yang harus saya lakukan jika mengalami kemutan atau regangan otot?',
          tr: 'Kas krampı veya kas gerilmesi yaşarsam ne yapmalıyım?',
          bn: 'যদি আমার মাংসপেশী ক্র্যাম্প বা ভ্রামক অনুভব করি তাহলে আমাকে কী করা উচিত?',
        },
        answer: {
          en: 'Gently stretch the affected muscle and hydrate well. Rest as needed.',
          fr: 'Étirez doucement le muscle affecté et hydratez-vous bien. Reposez-vous au besoin.',
          ud: 'متاثرہ پٹھے کو آہستگی سے کھینچیں اور اچھی طرح سے پانی پیئں۔ ضرورت پڑنے پر آرام کریں۔',
          de: 'Dehnen Sie den betroffenen Muskel vorsichtig und trinken Sie genug. Ruhen Sie sich bei Bedarf aus.',
          ar: 'قم بتمديد العضلة المصابة برفق والتزم بشرب السوائل جيدًا. واسترح عند الحاجة.',
          bm: 'Regangkan otot yang terjejas dengan lembut dan biak cukup minum. Rehat jika perlu.',
          tr: 'Etkilenen kası yavaşça germek ve iyi bir şekilde hidrate olmak. Gerektiğinde dinlenin.',
          bn: 'আক্রান্ত মাংসপেশীটিকে সন্তর্পণে প্রসারিত করুন এবং ভালভাবে জলপান করুন। প্রয়োজন অনুযায়ী বিশ্রাম নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I protect myself from being in a stampede?',
          fr: "Comment puis-je me protéger d'une bousculade ?",
          ud: 'میں کیسے ہنگامی بھگدڑ سے اپنے آپ کو محفوظ رکھ سکتا ہوں؟',
          de: 'Wie kann ich mich vor einer Massenpanik schützen?',
          ar: 'كيف يمكنني حماية نفسي من الوقوع في موجة زحام؟',
          bm: 'Bagaimanakah cara melindungi diri daripada terperangkap dalam perarakan?',
          tr: 'Bir izdihamdan nasıl korunabilirim?',
          bn: 'কীভাবে আমি আমাকে ভিড়জড়িয়ে পড়া থেকে রক্ষা করতে পারি?',
        },
        answer: {
          en: 'Stay vigilant, avoid congested areas, and follow crowd control guidelines.',
          fr: 'Restez vigilant, évitez les zones congestionnées et suivez les directives de contrôle de la foule.',
          ud: 'ہوشیار رہیں، بھیڑ بھاڑ والے علاقوں سے گریز کریں، اور ہنگامی بھیڑ کے قوانین پر عمل کریں۔',
          de: 'Bleiben Sie wachsam, meiden Sie überfüllte Bereiche und befolgen Sie die Richtlinien zur Crowd-Kontrolle.',
          ar: 'كن يقظًا، تجنب المناطق المزدحمة، واتبع إرشادات التحكم في الحشود.',
          bm: 'Sentiasa berwaspada, elakkan kawasan sesak, dan ikuti garis panduan kawalan keramaian.',
          tr: 'Tetikte kalın, kalabalık alanlardan kaçının ve kalabalık kontrol kurallarına uyun.',
          bn: 'সতর্ক থাকুন, চাপা এলাকা এড়িয়ে চলুন এবং ভিড় নিয়ন্ত্রণ নির্দেশিকা অনুসরণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What steps can I take to avoid dehydration-related injuries?',
          fr: 'Quelles mesures puis-je prendre pour éviter les blessures liées à la déshydratation ?',
          ur: 'میں پانی کی کمی سے متعلق چوٹوں سے بچنے کے لیے کیا اقدامات کر سکتا ہوں؟',
          de: 'Welche Schritte kann ich unternehmen, um Verletzungen durch Dehydration zu vermeiden?',
          ar: 'ما هي الخطوات التي يمكنني اتخاذها لتجنب الإصابات الناتجة عن الجفاف؟',
          bm: 'Apakah langkah-langkah yang boleh saya ambil untuk mengelakkan kecederaan berkaitan dehidrasi?',
          tr: 'Susuzlukla ilgili yaralanmalardan kaçınmak için hangi adımları atabilirim?',
          bn: 'জলশূন্যতার সাথে সম্পর্কিত আঘাত থেকে রক্ষা পাওয়ার জন্য আমি কী পদক্ষেপ নিতে পারি?',
        },
        answer: {
          en: 'Drink plenty of fluids, avoid excessive sun exposure, and rest frequently.',
          fr: 'Buvez beaucoup de liquides, évitez une exposition excessive au soleil et reposez-vous fréquemment.',
          ur: 'کافی مقدار میں پانی پیئیں، ضرورت سے زیادہ دھوپ سے بچیں، اور اکثر آرام کریں۔',
          de: 'Trinken Sie viel Flüssigkeit, vermeiden Sie übermäßige Sonneneinstrahlung und ruhen Sie sich häufig aus.',
          ar: 'اشرب الكثير من السوائل، وتجنب التعرض المفرط لأشعة الشمس، واسترح بشكل متكرر.',
          bm: 'Minum banyak cecair, elakkan pendedahan matahari yang berlebihan, dan berehat dengan kerap.',
          tr: 'Bol sıvı tüketin, aşırı güneşe maruz kalmaktan kaçının ve sık sık dinlenin.',
          bn: 'প্রচুর পরিমাণে তরল পান করুন, অতিরিক্ত রোদ থেকে দূরে থাকুন, এবং ঘন ঘন বিশ্রাম নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I minimize the risk of sunburn and heatstroke?',
          fr: 'Comment puis-je minimiser le risque de coup de soleil et de coup de chaleur ?',
          ur: 'میں سن برن اور ہیٹ اسٹروک کے خطرے کو کیسے کم کر سکتا ہوں؟',
          de: 'Wie kann ich das Risiko von Sonnenbrand und Hitzschlag minimieren?',
          ar: 'كيف يمكنني تقليل خطر الإصابة بحروق الشمس وضربة الشمس؟',
          bm: 'Bagaimanakah cara saya mengurangkan risiko terbakar matahari dan strok haba?',
          tr: 'Güneş yanığı ve sıcak çarpması riskini nasıl en aza indirebilirim?',
          bn: 'কীভাবে আমি রোদে পোড়া এবং হিটস্ট্রোকের ঝুঁকি কমাতে পারি?',
        },
        answer: {
          en: 'Apply sunscreen, wear protective clothing, and stay in shaded areas.',
          fr: 'Appliquez de la crème solaire, portez des vêtements de protection et restez dans des zones ombragées.',
          ur: 'سن اسکرین لگائیں، حفاظتی لباس پہنیں، اور چھاؤں میں رہیں۔',
          de: 'Tragen Sie Sonnencreme auf, tragen Sie Schutzkleidung und bleiben Sie im Schatten.',
          ar: 'ضع واقي الشمس، وارتدِ ملابس واقية، وابْقَ في المناطق المظللة.',
          bm: 'Sapukan pelindung matahari, pakai pakaian pelindung, dan tinggal di kawasan yang teduh.',
          tr: 'Güneş kremi uygulayın, koruyucu giysiler giyin ve gölgeli alanlarda kalın.',
          bn: 'সানস্ক্রিন ব্যবহার করুন, প্রতিরক্ষামূলক পোশাক পরুন, এবং ছায়াযুক্ত এলাকায় থাকুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What precautions should I take to prevent injuries while participating in the stoning ritual at Jamarat?',
          fr: 'Quelles précautions dois-je prendre pour éviter les blessures lors de la lapidation à Jamarat ?',
          ur: 'جمرات میں رمی کے دوران چوٹوں سے بچنے کے لیے مجھے کیا احتیاطی تدابیر اختیار کرنی چاہئیں؟',
          de: 'Welche Vorsichtsmaßnahmen sollte ich treffen, um Verletzungen beim Steinigungsritual in Jamarat zu vermeiden?',
          ar: 'ما الاحتياطات التي يجب أن أتخذها لتجنب الإصابات أثناء رمي الجمرات في الحج؟',
          bm: 'Apakah langkah berjaga-jaga yang perlu saya ambil untuk mengelakkan kecederaan semasa mengambil bahagian dalam ritual melontar di Jamarat?',
          tr: "Jamarat'ta taşlama ritüeline katılırken yaralanmaları önlemek için hangi önlemleri almalıyım?",
          bn: 'জামারাতে পাথর নিক্ষেপের সময় আঘাত এড়াতে আমি কী কী সতর্কতা অবলম্বন করতে পারি?',
        },
        answer: {
          en: 'Follow safety guidelines, stay alert, and avoid overly crowded spots.',
          fr: 'Suivez les consignes de sécurité, restez vigilant et évitez les endroits trop bondés.',
          ur: 'حفاظتی ہدایات پر عمل کریں، چوکس رہیں، اور زیادہ بھیڑ بھاڑ والی جگہوں سے بچیں۔',
          de: 'Befolgen Sie die Sicherheitsrichtlinien, bleiben Sie aufmerksam und vermeiden Sie überfüllte Stellen.',
          ar: 'اتبع إرشادات السلامة، كن يقظًا، وتجنب الأماكن المزدحمة للغاية.',
          bm: 'Ikuti garis panduan keselamatan, sentiasa berjaga-jaga, dan elakkan kawasan yang terlalu sesak.',
          tr: 'Güvenlik kurallarına uyun, dikkatli olun ve aşırı kalabalık yerlerden kaçının.',
          bn: 'নিরাপত্তা নির্দেশিকা মেনে চলুন, সতর্ক থাকুন, এবং অত্যন্ত ভিড়ের জায়গাগুলি এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I keep my feet and legs healthy during long periods of standing and walking?',
          fr: 'Comment puis-je garder mes pieds et mes jambes en bonne santé pendant de longues périodes de station debout et de marche ?',
          ur: 'لمبے عرصے تک کھڑے رہنے اور چلنے کے دوران میں اپنے پاؤں اور ٹانگوں کو کیسے صحت مند رکھ سکتا ہوں؟',
          de: 'Wie kann ich meine Füße und Beine gesund halten, wenn ich lange stehen und gehen muss?',
          ar: 'كيف يمكنني الحفاظ على صحة قدميّ وساقيّ خلال فترات طويلة من الوقوف والمشي؟',
          bm: 'Bagaimanakah saya dapat menjaga kesihatan kaki dan kaki saya semasa tempoh yang lama berdiri dan berjalan?',
          tr: 'Uzun süre ayakta durma ve yürüme sırasında ayaklarımı ve bacaklarımı nasıl sağlıklı tutabilirim?',
          bn: 'দীর্ঘ সময় দাঁড়িয়ে থাকা এবং হাঁটার সময় কীভাবে আমি আমার পা এবং পা সুস্থ রাখতে পারি?',
        },
        answer: {
          en: 'Wear supportive shoes, rest frequently, and do stretching exercises.',
          fr: "Portez des chaussures de soutien, reposez-vous fréquemment et faites des exercices d'étirement.",
          ur: 'سپورٹ دینے والے جوتے پہنیں، اکثر آرام کریں، اور اسٹریچنگ کی مشقیں کریں۔',
          de: 'Tragen Sie stützende Schuhe, ruhen Sie sich häufig aus und machen Sie Dehnübungen.',
          ar: 'ارتدِ أحذية داعمة، واسترح بشكل متكرر، وقم بتمارين التمدد.',
          bm: 'Pakai kasut sokongan, kerap berehat, dan lakukan senaman regangan.',
          tr: 'Destekleyici ayakkabılar giyin, sık sık dinlenin ve esneme egzersizleri yapın.',
          bn: 'সহায়ক জুতা পরুন, ঘন ঘন বিশ্রাম করুন, এবং প্রসারণ ব্যায়াম করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I manage diabetes during Hajj?',
          fr: 'Comment puis-je gérer le diabète pendant le Hajj ?',
          ur: 'حج کے دوران میں ذیابیطس کا انتظام کیسے کر سکتا ہوں؟',
          de: 'Wie kann ich Diabetes während der Hajj managen?',
          ar: 'كيف يمكنني إدارة مرض السكري أثناء الحج؟',
          bm: 'Bagaimanakah saya dapat menguruskan diabetes semasa Haji?',
          tr: 'Hac sırasında diyabetimi nasıl yönetebilirim?',
          bn: 'হজের সময় আমি কীভাবে ডায়াবেটিস পরিচালনা করতে পারি?',
        },
        answer: {
          en: 'Monitor blood sugar levels regularly, carry medications and insulin, stay hydrated, and avoid excessive sweets.',
          fr: "Contrôlez régulièrement votre taux de sucre dans le sang, emportez vos médicaments et de l'insuline, restez hydraté et évitez les sucreries excessives.",
          ur: 'بلڈ شوگر کی سطح کا باقاعدہ نگرانی کریں، دوائیاں اور انسولین ساتھ رکھیں، پانی کی کافی مقدار پیئیں، اور زیادہ میٹھے سے بچیں۔',
          de: 'Überwachen Sie regelmäßig den Blutzuckerspiegel, tragen Sie Medikamente und Insulin bei sich, bleiben Sie hydratisiert und vermeiden Sie übermäßige Süßigkeiten.',
          ar: 'راقب مستويات السكر في الدم بانتظام، واحمل الأدوية والإنسولين، وابقَ مترطبًا، وتجنب تناول الحلويات بشكل مفرط.',
          bm: 'Pantau aras gula dalam darah secara berkala, bawa ubat dan insulin, pastikan diri sentiasa terhidrasi, dan elakkan gula berlebihan.',
          tr: 'Düzenli olarak kan şekerini izleyin, ilaçları ve insülini yanınızda bulundurun, yeterli miktarda su için ve aşırı tatlılardan kaçının.',
          bn: 'নিয়মিতভাবে রক্তের শর্করা পরীক্ষা করুন, ঔষধ এবং ইনসুলিন নিয়ে চলে আসুন, পর্যাপ্ত পানি পান করুন, এবং অতিরিক্ত মিষ্টি এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I have a heart condition and plan to perform Hajj?',
          fr: "Que dois-je faire si j'ai une maladie cardiaque et que je prévois de faire le Hajj ?",
          ur: 'اگر میرے پاس دل کا مسئلہ ہو اور میں حج ادا کرنے کا ارادہ رکھتا ہوں تو میں کیا کروں؟',
          de: 'Was soll ich tun, wenn ich eine Herzerkrankung habe und vorhabe, die Hajj durchzuführen?',
          ar: 'ماذا يجب أن أفعل إذا كان لدي حالة قلبية وأخطط لأداء الحج؟',
          bm: 'Apa yang harus saya lakukan jika saya mempunyai masalah jantung dan merancang untuk menunaikan Haji?',
          tr: 'Kalp rahatsızlığım var ve hac yapmayı planlıyorsam ne yapmalıyım?',
          bn: 'আমার যদি হার্ট সমস্যা থাকে এবং হজ্জ করার পরিকল্পনা করি, তবে আমি কী করব?',
        },
        answer: {
          en: 'Consult your cardiologist, carry prescribed medications, avoid strenuous activities, and stay hydrated.',
          fr: 'Consultez votre cardiologue, emportez vos médicaments prescrits, évitez les activités vigoureuses et restez hydraté.',
          ur: 'اپنے کارڈیولوجسٹ سے مشاورت کریں، مقررہ دوائیاں لے جائیں، زور دار مشقتوں سے بچیں، اور پانی کافی مقدار میں پیئیں۔',
          de: 'Konsultieren Sie Ihren Kardiologen, tragen Sie verschriebene Medikamente bei sich, vermeiden Sie anstrengende Aktivitäten und bleiben Sie hydratisiert.',
          ar: 'استشر طبيب القلب، واحمل الأدوية الموصوفة، وتجنب الأنشطة الشاقة، وابقَ مترطبًا.',
          bm: 'Berkonsultasi dengan pakar jantung anda, membawa ubat yang ditetapkan, elakkan aktiviti yang mencabar, dan pastikan diri sentiasa terhidrasi.',
          tr: 'Kardiyologunuza danışın, reçeteli ilaçları yanınızda bulundurun, zorlu aktivitelerden kaçının ve yeterli miktarda su için.',
          bn: 'আপনার কার্ডিওলজিস্টের সাথে পরামর্শ করুন, নির্ধারিত ওষুধ নিন, কঠোর ক্রিয়াকলাপ এড়িয়ে চলুন, এবং পর্যাপ্ত পানি পান করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Are there any precautions for asthma sufferers during Hajj?',
          fr: "Y a-t-il des précautions à prendre pour les personnes souffrant d'asthme pendant le Hajj ?",
          ur: 'حج کے دوران دمہ کے متاثرین کے لیے کوئی احتیاطی تدابیر ہیں؟',
          de: 'Gibt es Vorsichtsmaßnahmen für Asthmatiker während der Hajj?',
          ar: 'هل هناك أي احتياطات لمرضى الربو خلال الحج؟',
          bm: 'Adakah apa-apa langkah berjaga-jaga bagi penderita asma semasa Haji?',
          tr: 'Hac sırasında astım hastaları için herhangi bir önlem var mı?',
          bn: 'হজে অ্যাসমা ভোগীদের জন্য কোনো সতর্কতা আছে?',
        },
        answer: {
          en: 'Carry your inhaler, avoid crowded and dusty areas, and monitor air quality.',
          fr: "Emportez votre inhalateur, évitez les zones surpeuplées et poussiéreuses, et surveillez la qualité de l'air.",
          ur: 'اپنا انہیلر ساتھ لیں، بھیڑ بھاڑ اور گردے بھرے علاقوں سے بچیں، اور ہوا کی معیار کا نگرانی کریں۔',
          de: 'Tragen Sie Ihren Inhalator bei sich, vermeiden Sie überfüllte und staubige Bereiche und überwachen Sie die Luftqualität.',
          ar: 'احمل معك جهاز الاستنشاق، وتجنب المناطق المزدحمة والمغبرة، وراقب جودة الهواء.',
          bm: 'Bawa inhaler anda, elakkan kawasan sesak dan berdebu, dan pantau kualiti udara.',
          tr: 'İnhalerinizi yanınızda taşıyın, kalabalık ve tozlu alanlardan kaçının, ve hava kalitesini izleyin.',
          bn: 'আপনার ইনহেলার নিয়ে যান, সমুদ্রের সমীপে থাকুন এবং হয়ে যাওয়া জায়গাগুলি এড়িয়ে চলুন, এবং বায়ু গুণমান নজর রাখুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How should I handle hypertension (high blood pressure) during the pilgrimage?',
          fr: "Comment devrais-je gérer l'hypertension artérielle pendant le pèlerinage ?",
          ur: 'حج کے دوران ہائی بلڈ پریشر (ہائی بلڈ پریشر) کو کس طرح سے سنبھالا جائے؟',
          de: 'Wie sollte ich während der Pilgerreise mit Bluthochdruck umgehen?',
          ar: 'كيف يجب أن أتعامل مع ارتفاع ضغط الدم خلال الحج؟',
          bm: 'Bagaimanakah saya patut mengendalikan hipertensi (tekanan darah tinggi) semasa perjalanan haji?',
          tr: 'Hac sırasında hipertansiyonu (yüksek tansiyon) nasıl ele almalıyım?',
          bn: 'পথযাত্রায় হাইপারটেনশন (উচ্চ রক্তচাপ) কিভাবে ব্যবস্থা নেব?',
        },
        answer: {
          en: 'Monitor blood pressure regularly, take prescribed medications, and avoid stress and excessive physical strain.',
          fr: 'Contrôlez régulièrement votre tension artérielle, prenez les médicaments prescrits et évitez le stress et les efforts physiques excessifs.',
          ur: 'بلڈ پریشر کا باقاعدہ نگرانی کریں، مقررہ دوائیاں لیں، اور تناو اور زیادہ شدت والا جسمانی دباؤ سے بچیں۔',
          de: 'Überwachen Sie regelmäßig den Blutdruck, nehmen Sie verschriebene Medikamente ein und vermeiden Sie Stress und übermäßige körperliche Belastung.',
          ar: 'راقب ضغط الدم بانتظام، واستخدم الأدوية الموصوفة، وتجنب التوتر والإجهاد الجسدي الزائد.',
          bm: 'Pantau tekanan darah secara berkala, ambil ubat yang ditetapkan, dan elakkan stres dan tekanan fizikal berlebihan.',
          tr: 'Düzenli olarak kan basıncını izleyin, reçeteli ilaçları alın ve stres ve aşırı fiziksel zorlamadan kaçının.',
          bn: 'নিয়মিতভাবে রক্তচাপ মনিটর করুন, নির্ধারিত ওষুধ নিন, এবং তানাব্যথা এবং অতিরিক্ত শারীরিক চাপের সংক্রান্তে পরিহার করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What steps can I take to manage chronic back pain during Hajj?',
          fr: 'Quelles mesures puis-je prendre pour gérer les douleurs chroniques du dos pendant le Hajj ?',
          ur: 'حج کے دوران طویل عرصے تک کمر درد کا انتظام کیسے کیا جا سکتا ہے؟',
          de: 'Welche Schritte kann ich unternehmen, um chronische Rückenschmerzen während der Hajj zu bewältigen?',
          ar: 'ما هي الخطوات التي يمكنني اتخاذها لإدارة الألم المزمن في الظهر خلال الحج؟',
          bm: 'Apakah langkah-langkah yang boleh saya ambil untuk menguruskan sakit belakang kronik semasa Haji?',
          tr: 'Hac sırasında kronik bel ağrısını yönetmek için hangi adımları atabilirim?',
          bn: 'হজে চ্রনিক পিঠ ব্যাথা সম্পর্কে কী ধাপ নিতে পারি?',
        },
        answer: {
          en: 'Use supportive footwear, carry pain relief medication, and take regular breaks to rest.',
          fr: 'Utilisez des chaussures de soutien, emportez des médicaments contre la douleur et faites régulièrement des pauses pour vous reposer.',
          ur: 'سپورٹویٹ فوٹ وئیر استعمال کریں، درد سہارا دینے والی دوائیاں ساتھ لیں، اور بناوٹ کے لیے باقاعدہ وقفے لیں۔',
          de: 'Verwenden Sie unterstützende Schuhe, tragen Sie Schmerzlinderungsmedikamente bei sich und machen Sie regelmäßig Pausen, um sich auszuruhen.',
          ar: 'استخدم أحذية داعمة، واحمل أدوية تخفيف الألم، وخذ استراحات منتظمة للراحة.',
          bm: 'Gunakan kasut yang memberi sokongan, bawa ubat penawar sakit, dan ambil rehat secara berkala.',
          tr: 'Destekleyici ayakkabılar kullanın, ağrı kesici ilaçları yanınızda taşıyın ve düzenli aralıklarla dinlenme molası verin.',
          bn: 'সহায়ক ফুটওয়্যার ব্যবহার করুন, ব্যথা শান্তি ওষুধ নিয়ে যান, এবং নিয়মিত বিশ্রাম নেওয়ার জন্য সময় নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I prepare for Hajj if I suffer from arthritis?',
          fr: "Comment puis-je me préparer au Hajj si je souffre d'arthrite ?",
          ur: 'اگر میں گٹھیا کی بیماری سے متاثر ہوں تو حج کیلئے کیسے تیاری کروں؟',
          de: 'Wie kann ich mich auf die Hajj vorbereiten, wenn ich unter Arthritis leide?',
          ar: 'كيف يمكنني التحضير لأداء الحج إذا كنت أعاني من التهاب المفاصل؟',
          bm: 'Bagaimanakah saya boleh bersedia untuk Haji jika saya mengalami artritis?',
          tr: 'Eğer romatizma sorunu yaşıyorsam Hac için nasıl hazırlanabilirim?',
          bn: 'আমি যদি অ্যার্থ্রাইটিস অসুস্থ হই, তাহলে হজের জন্য কিভাবে প্রস্তুতি নিতে পারি?',
        },
        answer: {
          en: 'Take anti-inflammatory medications, use supportive braces, and plan for mobility assistance if needed.',
          fr: 'Prenez des médicaments anti-inflammatoires, utilisez des attelles de soutien et prévoyez une assistance à la mobilité si nécessaire.',
          ur: 'ضد التہابی دوائیاں استعمال کریں، سہارا دینے والی بریسز استعمال کریں، اور ضرورت پڑنے پر حرکت میں مدد کی منصوبہ بنائیں۔',
          de: 'Nehmen Sie entzündungshemmende Medikamente ein, verwenden Sie unterstützende Bandagen und planen Sie bei Bedarf eine Mobilitätshilfe.',
          ar: 'تناول أدوية مضادة للالتهابات، استخدم أقواس دعم وخطط للحصول على مساعدة في التنقل إذا لزم الأمر.',
          bm: 'Ambil ubat anti-radang, gunakan brese sokongan, dan rancang bantuan mobiliti jika diperlukan.',
          tr: 'Anti-enflamatuar ilaçlar alın, destekleyici ateller kullanın ve gerekirse hareketlilik yardımı planlayın.',
          bn: 'প্রয়োজন হলে এন্টি-ইনফ্লামেটরি ওষুধ নিন, সমর্থনকারী ব্রেস ব্যবহার করুন, এবং চলাফেরার সাহায্য পরিকল্পনা করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I have a kidney condition and need dialysis?',
          fr: "Que dois-je faire si j'ai un problème rénal et que j'ai besoin de dialyse ?",
          ur: 'اگر میرے پاس گردے کی بیماری ہو اور مجھے ڈائیالیسس کی ضرورت ہو تو میں کیا کروں؟',
          de: 'Was sollte ich tun, wenn ich eine Nierenerkrankung habe und Dialyse benötige?',
          ar: 'ماذا يجب أن أفعل إذا كانت لدي حالة كلوية وأحتاج إلى غسيل كلوي؟',
          bm: 'Apa yang patut saya lakukan jika saya mempunyai masalah buah pinggang dan memerlukan dialisis?',
          tr: 'Böbrek sorunum var ve diyalize ihtiyacım varsa ne yapmalıyım?',
          bn: 'আমার যদি কিডনি সমস্যা হয় এবং ডায়ালিসিসের প্রয়োজন হয়, তবে আমি কী করব?',
        },
        answer: {
          en: 'Coordinate with a local hospital for dialysis, carry all necessary medical records, and stay hydrated.',
          fr: 'Coordonnez-vous avec un hôpital local pour la dialyse, emportez tous les dossiers médicaux nécessaires et restez hydraté.',
          ur: 'ڈائیالیسس کے لیے مقامی ہسپتال کے ساتھ تعاون کریں، تمام ضروری طبی ریکارڈس ساتھ لیں، اور پانی کافی مقدار میں پیئیں۔',
          de: 'Koordinieren Sie sich mit einem örtlichen Krankenhaus für die Dialyse, tragen Sie alle notwendigen medizinischen Aufzeichnungen bei sich und bleiben Sie hydratisiert.',
          ar: 'تنسق مع مستشفى محلي للحصول على جلسات غسيل الكلى، واحمل جميع السجلات الطبية الضرورية، وابقَ مترطبًا.',
          bm: 'Berkomunikasi dengan hospital tempatan untuk dialisis, bawa semua rekod perubatan yang diperlukan, dan pastikan diri sentiasa terhidrasi.',
          tr: 'Diyaliz için yerel bir hastane ile koordine olun, gerekli tüm tıbbi kayıtları yanınızda bulundurun ve yeterli miktarda su için.',
          bn: 'ডায়ালিসিসের জন্য স্থানীয় হাসপাতালের সাথে সমযোজন করুন, সমস্ত প্রয়োজনীয় চিকিৎসাগত রেকর্ড নিয়ে চলে যান, এবং পর্যাপ্ত পানি পান করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I manage my mental health, such as anxiety or depression, during Hajj?',
          fr: "Comment puis-je gérer ma santé mentale, telle que l'anxiété ou la dépression, pendant le Hajj ?",
          ur: 'حج کے دوران اپنی دماغی صحت، جیسے کہ فکر یا افسردگی، کو کس طرح سے انتظام دیا جا سکتا ہے؟',
          de: 'Wie kann ich meine geistige Gesundheit, wie Angst oder Depression, während der Hajj verwalten?',
          ar: 'كيف يمكنني إدارة صحتي العقلية، مثل القلق أو الاكتئاب، خلال الحج؟',
          bm: 'Bagaimanakah saya boleh menguruskan kesihatan mental saya, seperti kebimbangan atau kemurungan, semasa Haji?',
          tr: 'Hac sırasında anksiyete veya depresyon gibi ruh sağlığımı nasıl yönetebilirim?',
          bn: 'হজ মেলায় আমি যেসব মানসিক স্বাস্থ্য, যেমন উদ্বিগ্নতা বা মনোযোগ সম্পর্কে কীভাবে যত্ন নিতে পারি?',
        },
        answer: {
          en: 'Engage in relaxation techniques, stay connected with a support group, and seek help from mental health professionals.',
          fr: "Pratiquez des techniques de relaxation, restez connecté avec un groupe de soutien et demandez de l'aide à des professionnels de la santé mentale.",
          ur: 'دماغی تشویشات کو دور کرنے کے طریقوں میں شامل ہوں، ایک سپورٹ گروپ کے ساتھ منسلک رہیں، اور دماغی صحت کے پیشے ور افراد سے مدد لیں۔',
          de: 'Beteiligen Sie sich an Entspannungstechniken, bleiben Sie mit einer Unterstützungsgruppe verbunden und suchen Sie Hilfe von Fachleuten für psychische Gesundheit.',
          ar: 'شارك في تقنيات الاسترخاء، وابق متصلاً بمجموعة دعم، وابحث عن المساعدة من المتخصصين في الصحة العقلية.',
          bm: 'Terlibat dalam teknik penenangan, kekal berhubung dengan kumpulan sokongan, dan dapatkan bantuan dari profesional kesihatan mental.',
          tr: 'Rahatlama tekniklerine katılın, bir destek grubu ile bağlantıda kalın ve ruh sağlığı profesyonellerinden yardım isteyin.',
          bn: 'নিজেকে শান্তি প্রাপ্তির কৌশলে লিপ্ত হন, একটি সহায়তা গ্রুপের সাথে যোগাযোগ বজায় রাখুন, এবং মানসিক স্বাস্থ্য পেশাদারদের থেকে সাহায্য চান।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What precautions should pregnant women take during Hajj?',
          fr: 'Quelles précautions les femmes enceintes doivent-elles prendre pendant le Hajj ?',
          ur: 'حج کے دوران حاملہ خواتین کو کون سی احتیاطی تدابیر اختیار کرنی چاہئیں؟',
          de: 'Welche Vorsichtsmaßnahmen sollten schwangere Frauen während der Hajj treffen?',
          ar: 'ما هي الاحتياطات التي يجب أن تتخذها النساء الحوامل خلال الحج؟',
          bm: 'Apakah langkah-langkah berjaga-jaga yang perlu diambil oleh wanita hamil semasa Haji?',
          tr: 'Hac sırasında hamile kadınlar hangi önlemleri almalıdır?',
          bn: 'হজ মেলায় গর্ভবতী মহিলাদের কি সতর্কতা অবলম্বন করা উচিত?',
        },
        answer: {
          en: 'Consult with your healthcare provider, avoid strenuous activities, stay hydrated, and rest frequently.',
          fr: 'Consultez votre prestataire de soins de santé, évitez les activités vigoureuses, restez hydraté et reposez-vous régulièrement.',
          ur: 'اپنے صحت کی دیکھ بھال فراہم کنندہ کے ساتھ مشاورت کریں، زور دار مشقتوں سے بچیں، پانی کافی مقدار میں پیئیں، اور باقاعدہ طور پر آرام کریں۔',
          de: 'Konsultieren Sie Ihren Gesundheitsdienstleister, vermeiden Sie anstrengende Aktivitäten, bleiben Sie hydratisiert und ruhen Sie sich regelmäßig aus.',
          ar: 'استشر طبيبك، وتجنب الأنشطة الشاقة، وابقَ مترطبًا، وراح بانتظام.',
          bm: 'Berkonsultasi dengan penyedia penjagaan kesihatan anda, elakkan aktiviti yang mencabar, pastikan diri sentiasa terhidrasi, dan berehat secara berkala.',
          tr: 'Sağlık uzmanınızla danışın, zorlu aktivitelerden kaçının, yeterli miktarda su için ve düzenli aralıklarla dinlenin.',
          bn: 'আপনার স্বাস্থ্য যোগাযোগ করুন, কঠোর ক্রিয়াকলাপ এড়িয়ে চলুন, পর্যাপ্ত পানি পান করুন, এবং নিয়মিতভাবে বিশ্রাম নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How should I manage epilepsy or seizure disorders during Hajj?',
          fr: "Comment puis-je gérer l'épilepsie ou les troubles convulsifs pendant le Hajj ?",
          ur: 'حج کے دوران میرے پاس مرض نفسیت یا جھٹکے کی بیماری ہے، میں اسے کس طرح سے انتظام دے؟',
          de: 'Wie sollte ich Epilepsie oder Anfallsstörungen während der Hajj verwalten?',
          ar: 'كيف يجب أن أدير الصرع أو اضطرابات النوبات خلال الحج؟',
          bm: 'Bagaimanakah saya harus menguruskan penyakit epilepsi atau gangguan kejang semasa Haji?',
          tr: 'Hac sırasında epilepsi veya nöbet bozukluklarını nasıl yönetmeliyim?',
          bn: 'হজ মেলায় আমি যেমন অপ্রসারণ অস্থিরতা বা জ্বারের অস্থিরতা সম্পর্কে কিভাবে যত্ন নিতে পারি?',
        },
        answer: {
          en: 'Take your medications as prescribed, avoid triggers, and inform your group leader about your condition.',
          fr: 'Prenez vos médicaments comme prescrits, évitez les déclencheurs et informez votre chef de groupe de votre état.',
          ur: 'مقرر کی گئی دوائیاں استعمال کریں، مواد کو بچائیں، اور اپنے گروپ کے رہنما کو اپنی حالت کے بارے میں آگاہ کریں۔',
          de: 'Nehmen Sie Ihre Medikamente wie verschrieben ein, meiden Sie Auslöser und informieren Sie Ihren Gruppenleiter über Ihren Zustand.',
          ar: 'تناول الأدوية كما وصفت، وتجنب المحفزات، وأبلغ قائد مجموعتك عن حالتك.',
          bm: 'Ambil ubat anda seperti yang ditetapkan, elakkan pemicu, dan beritahu pemimpin kumpulan anda tentang keadaan anda.',
          tr: 'Reçeteye göre ilaçlarınızı alın, tetikleyicilerden kaçının ve durumunuz hakkında grup liderinizi bilgilendirin.',
          bn: 'নির্ধারিত অনুযায়ী আপনার ঔষধ নিন, ট্রিগার এবং আপনার অবস্থার সম্পর্কে আপনার গ্রুপ নেতাকে জানান।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I get my period during Hajj?',
          fr: "Que dois-je faire si j'ai mes règles pendant le Hajj ?",
          ur: 'اگر حج کے دوران مجھے ماہواری ہو تو میں کیا کروں؟',
          de: 'Was soll ich tun, wenn ich meine Periode während der Hajj bekomme?',
          ar: 'ماذا يجب أن أفعل إذا حانت فترة الحيض خلال الحج؟',
          bm: 'Apakah yang perlu saya lakukan jika saya mendapat haid semasa Haji?',
          tr: 'Hac sırasında adetim gelirse ne yapmalıyım?',
          bn: 'হজে আমি যদি আমার মাসিক ধরা হয়, তবে আমি কী করব?',
        },
        answer: {
          en: 'Continue with the permissible rituals, practice good hygiene, and manage cramps with medications as needed.',
          fr: 'Continuez avec les rituels autorisés, pratiquez une bonne hygiène et gérez les crampes avec des médicaments au besoin.',
          ur: 'اجازت دی گئی رسومات جاری رکھیں، اچھی صحت کا عمل کریں، اور ضرورت کے مطابق ادویات کے ساتھ کریمپس کا انتظام کریں۔',
          de: 'Fahren Sie mit den erlaubten Ritualen fort, praktizieren Sie gute Hygiene und verwalten Sie Krämpfe bei Bedarf mit Medikamenten.',
          ar: 'تابع مع الطقوس المباحة، ومارس النظافة الجيدة، وتدبير التقلصات بالأدوية عند الحاجة.',
          bm: 'Teruskan dengan ritual yang dibenarkan, amalkan kebersihan yang baik, dan kawal keram dengan ubat mengikut keperluan.',
          tr: 'Müsaade edilen ritüellerle devam edin, iyi hijyen uygulayın ve gerektiğinde ilaçlarla kramp yönetin.',
          bn: 'অনুমোদিত ধর্মীয় অনুষ্ঠানে অবলম্বন করুন, ভাল স্বাস্থ্যসম্পর্কে অনুশীলন করুন, এবং প্রয়োজন হলে ঔষধ দ্বারা ক্র্যাম্পগুলি পরিচালনা করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I manage menstrual hygiene during the pilgrimage?',
          fr: "Comment puis-je gérer l'hygiène menstruelle pendant le pèlerinage ?",
          ur: 'حج کے دوران ماہواری کی صفائی کیسے کی جائے؟',
          de: 'Wie kann ich die Menstruationshygiene während der Pilgerfahrt verwalten?',
          ar: 'كيف يمكنني إدارة النظافة الشهرية خلال الحج؟',
          bm: 'Bagaimanakah saya boleh menguruskan kebersihan haid semasa menunaikan ibadah haji?',
          tr: 'Hac sırasında adet hijyenini nasıl yönetebilirim?',
          bn: 'হজে মাসিক পরিস্থিতির সাথে কিভাবে সাফল্যের হারিয়ে যাব?',
        },
        answer: {
          en: 'Carry sanitary pads or tampons, change them regularly, and dispose of them properly.',
          fr: 'Emportez des serviettes hygiéniques ou des tampons, changez-les régulièrement et jetez-les correctement.',
          ur: 'صحیح پیڈ یا ٹیمپن لے کر رکھیں، انہیں باقاعدہ طور پر تبدیل کریں، اور انہیں مناسب طریقے سے نجاستی کریں۔',
          de: 'Tragen Sie Damenbinden oder Tampons, wechseln Sie sie regelmäßig und entsorgen Sie sie ordnungsgemäß.',
          ar: 'قومي بحمل فوط صحية أو التمبونات، وغيّريها بانتظام، وتخلصي منها بالطريقة الصحيحة.',
          bm: 'Bawa pembalut atau tampon, tukar secara berkala, dan buang dengan betul.',
          tr: 'Kadın pedi veya tampon taşıyın, düzenli olarak değiştirin ve uygun şekilde atın.',
          bn: 'স্যানিটারি প্যাড বা ট্যামপন নিন, তাদের নিয়মিতভাবে পরিবর্তন করুন, এবং সঠিকভাবে প্রস্তুতিকরণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Are there any specific rituals women cannot perform during menstruation?',
          fr: 'Y a-t-il des rituels spécifiques que les femmes ne peuvent pas accomplir pendant les menstruations ?',
          ur: 'حیض کی حالت میں خواتین کوئی مخصوص عبادات نہیں انجام دے سکتیں؟',
          de: 'Gibt es spezifische Rituale, die Frauen während der Menstruation nicht ausführen können?',
          ar: 'هل هناك طقوس محددة لا يمكن للنساء أداؤها خلال فترة الحيض؟',
          bm: 'Adakah ritual khusus yang wanita tidak boleh lakukan semasa haid?',
          tr: 'Adet döneminde kadınların gerçekleştiremeyeceği belirli ibadetler var mı?',
          bn: 'মাসিকের সময় মহিলারা কি কোনো নির্দিষ্ট ধর্মীয় অনুষ্ঠান সম্পাদন করতে পারেন না?',
        },
        answer: {
          en: 'Women cannot perform Tawaf or prayers in the state of menstruation, but they can still do other rituals.',
          fr: "Les femmes ne peuvent pas effectuer le Tawaf ou les prières à l'état de menstruation, mais elles peuvent toujours accomplir d'autres rituels.",
          ur: 'حیض کی حالت میں خواتین تواف یا نماز ادا نہیں کر سکتیں، لیکن وہ دوسرے عبادات کر سکتیں ہیں۔',
          de: 'Frauen können den Tawaf oder Gebete im Zustand der Menstruation nicht verrichten, aber sie können immer noch andere Rituale durchführen.',
          ar: 'النساء لا يمكنهن أداء الطواف أو الصلوات في حالة الحيض، لكن يمكنهن ما زال القيام بطقوس أخرى.',
          bm: 'Wanita tidak boleh melakukan Tawaf atau sembahyang dalam keadaan haid, tetapi mereka masih boleh melakukan ritual lain.',
          tr: 'Kadınlar adet döneminde Tavaf veya namaz kılamazlar, ancak diğer ritülleri hala yapabilirler.',
          bn: 'নারীরা মাসিকের অবস্থায় তাওয়াফ বা নামাজ পড়তে পারেন না, তবে তারা অন্যান্য ধর্মীয় অনুষ্ঠান করতে পারেন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What vaccinations are recommended for women before traveling for Hajj?',
          fr: 'Quelles vaccinations sont recommandées pour les femmes avant de voyager pour le Hajj ?',
          ur: 'حج سفر کرنے سے پہلے خواتین کے لئے کون سی ویکسینیشنز مشورہ دی جاتی ہیں؟',
          de: 'Welche Impfungen werden Frauen vor der Reise zum Hajj empfohlen?',
          ar: 'ما هي التطعيمات الموصى بها للنساء قبل السفر لأداء الحج؟',
          bm: 'Apakah vaksin yang disyorkan untuk wanita sebelum melancong untuk Hajj?',
          tr: 'Hacca seyahat etmeden önce kadınlar için hangi aşılar önerilir?',
          bn: 'হজ্জের জন্য ভ্রমণ করার আগে মহিলাদের কোনটি টিকা প্রস্তাবিত?',
        },
        answer: {
          en: 'Vaccinations recommended include meningococcal meningitis, influenza, hepatitis, polio, and tetanus.',
          fr: "Les vaccinations recommandées comprennent la méningite à méningocoque, la grippe, l'hépatite, la polio et le tétanos.",
          ur: 'تجویز شدہ ویکسینیشنز میں منجنوکوکل مننجائٹس، انفلوانزا، ہیپاٹائیٹس، پولیو، اور ٹیٹنس شامل ہیں۔',
          de: 'Empfohlene Impfungen umfassen Meningokokken-Meningitis, Influenza, Hepatitis, Polio und Tetanus.',
          ar: 'التطعيمات الموصى بها تشمل التهاب السحايا الناجم عن السلالة النزوجية، والإنفلونزا، والتهاب الكبد، وشلل الأطفال، والكزاز.',
          bm: 'Vaksin yang disyorkan termasuk meningitis meningokokus, influenza, hepatitis, polio, dan tetanus.',
          tr: 'Önerilen aşılar arasında menenjit, influenza, hepatit, polio ve tetanoz bulunur.',
          bn: 'প্রস্তাবিত টিকাবিশিষ্টগুলির মধ্যে মেনিঞ্জোককাল মেনিংজাইটিস, ইনফ্লুয়েঞ্জা, হেপাটাইটিস, পোলিও, এবং টেটানাস রয়েছে।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Can pregnant women perform Hajj, and what precautions should they take?',
          fr: 'Les femmes enceintes peuvent-elles effectuer le Hajj et quelles précautions doivent-elles prendre ?',
          ur: 'کیا حاملہ خواتین حج ادا کر سکتی ہیں، اور وہ کون سی احتیاطی تدابیر اختیار کرنا چاہئیں؟',
          de: 'Können schwangere Frauen den Hajj durchführen und welche Vorsichtsmaßnahmen sollten sie treffen?',
          ar: 'هل يمكن للنساء الحوامل أداء الحج، وما هي الاحتياطات التي يجب عليهن اتخاذها؟',
          bm: 'Adakah wanita hamil boleh melakukan Hajj, dan apa langkah berjaga-jaga yang perlu mereka ambil?',
          tr: 'Hamile kadınlar Hac yapabilir mi ve hangi önlemleri almalılar?',
          bn: 'গর্ভবতী মহিলা হজ্জ করতে পারেন কি, এবং তারা কি সতর্কতা নেওয়া উচিত?',
        },
        answer: {
          en: 'Yes, consult with a healthcare provider, stay hydrated, avoid strenuous activities, and rest frequently.',
          fr: 'Oui, consultez un prestataire de soins de santé, restez hydraté, évitez les activités vigoureuses et reposez-vous fréquemment.',
          ur: 'جی ہاں، اپنے صحت کی دیکھ بھال فراہم کنندہ سے مشاورت کریں، پانی کافی مقدار میں پیئیں، زور دار مشقتوں سے بچیں، اور باقاعدہ طور پر آرام کریں۔',
          de: 'Ja, konsultieren Sie einen Gesundheitsdienstleister, bleiben Sie hydratisiert, vermeiden Sie anstrengende Aktivitäten und ruhen Sie sich regelmäßig aus.',
          ar: 'نعم، استشر طبيبك، وابقَ مترطبًا، وتجنب الأنشطة الشاقة، وراح بانتظام.',
          bm: 'Ya, berunding dengan penyedia penjagaan kesihatan, pastikan diri sentiasa terhidrasi, elakkan aktiviti yang mencabar, dan berehat secara berkala.',
          tr: 'Evet, bir sağlık uzmanıyla danışın, yeterli miktarda su için, zorlu aktivitelerden kaçının ve düzenli aralıklarla dinlenin.',
          bn: 'হ্যাঁ, একজন স্বাস্থ্য পরিষেবা প্রদানকারীর সাথে পরামর্শ করুন, পানি পূর্ণতা বজায় রাখুন, কঠোর ক্রিয়াকলাপ থেকে বিরত থাকুন, এবং নিয়মিতভাবে বিশ্রাম নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I ensure privacy for personal hygiene in shared accommodations?',
          fr: "Comment puis-je garantir la confidentialité pour l'hygiène personnelle dans des logements partagés ?",
          ur: 'مشترکہ رہائشیں میں شخصی صحت کی حفاظت کیلئے خصوصیت کی تصدیق کیسے کر سکتا ہوں؟',
          de: 'Wie kann ich die Privatsphäre für die persönliche Hygiene in gemeinsamen Unterkünften gewährleisten?',
          ar: 'كيف يمكنني ضمان الخصوصية للنظافة الشخصية في الإقامات المشتركة؟',
          bm: 'Bagaimana saya boleh memastikan privasi untuk kebersihan peribadi di penginapan berkongsi?',
          tr: 'Paylaşılan konaklamalarda kişisel hijyen için gizliliği nasıl sağlayabilirim?',
          bn: 'যে কোনও ভাগাভাগি বাসস্থানে ব্যক্তিগত স্বাস্থ্য সংরক্ষণের জন্য গোপনীয়তা কীভাবে নিশ্চিত করা যায়?',
        },
        answer: {
          en: "Use privacy screens, communicate with your companions, and use designated women's facilities.",
          fr: 'Utilisez des écrans de confidentialité, communiquez avec vos compagnons et utilisez les installations désignées pour les femmes.',
          ur: 'خصوصیت کی اسکرینوں کا استعمال کریں، اپنے ساتھیوں سے اطلاعاتی تبادلہ کریں، اور مخصوص خواتین کی سہولتوں کا استعمال کریں۔',
          de: 'Verwenden Sie Sichtschutzwände, kommunizieren Sie mit Ihren Begleitern und nutzen Sie die dafür vorgesehenen Einrichtungen für Frauen.',
          ar: 'استخدم الشاشات الخصوصية، وتواصل مع رفاقك، واستخدم المرافق المخصصة للنساء.',
          bm: 'Gunakan skrin privasi, berkomunikasi dengan rakan-rakan anda, dan gunakan kemudahan khusus untuk wanita.',
          tr: 'Gizlilik perdeleri kullanın, arkadaşlarınızla iletişim kurun ve belirlenmiş kadın tesislerini kullanın.',
          bn: 'গোপনীয়তা স্ক্রিন ব্যবহার করুন, আপনার সঙ্গীদের সাথে যোগাযোগ করুন, এবং নির্দিষ্ট মহিলা সুবিধা ব্যবহার করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I experience severe menstrual cramps during Hajj?',
          fr: 'Que dois-je faire si je ressens des crampes menstruelles sévères pendant le Hajj ?',
          ur: 'اگر حج کے دوران شدید ماہواری کی درد احساس ہو تو میں کیا کروں؟',
          de: 'Was soll ich tun, wenn ich während des Hajj starke Menstruationskrämpfe habe?',
          ar: 'ماذا يجب أن أفعل إذا كنت أعاني من آلام شديدة أثناء الحج؟',
          bm: 'Apa yang harus saya lakukan jika saya mengalami sakit perut haid yang teruk semasa Hajj?',
          tr: 'Hac sırasında şiddetli adet krampı yaşarsam ne yapmalıyım?',
          bn: 'হজে মাসিকের জন্য কঠোর ব্যথা অনুভব করলে আমি কি করব?',
        },
        answer: {
          en: 'Use over-the-counter pain relief, rest, hydrate well, and apply heat pads if necessary.',
          fr: 'Utilisez des analgésiques en vente libre, reposez-vous, hydratez-vous bien et appliquez des coussins chauffants si nécessaire.',
          ur: 'دکان سے آزاد درد کی راحت کا استعمال کریں، آرام کریں، اچھی طرح سے پانی پیئیں، اور ضرورت پڑنے پر گرمائی پیڈز کا استعمال کریں۔',
          de: 'Verwenden Sie rezeptfreie Schmerzlinderungsmittel, ruhen Sie sich aus, trinken Sie ausreichend Wasser und verwenden Sie bei Bedarf Wärmekissen.',
          ar: 'استخدموا مسكنات بدون وصفة طبية، واسترخوا، واشربوا الماء بكمية كافية، واستخدموا وسائد الحرارة إذا لزم الأمر.',
          bm: 'Gunakan ubat penahan sakit tanpa preskripsi, berehat, minum air dengan cukup, dan gunakan bantalan haba jika perlu.',
          tr: 'Reçetesiz ağrı kesicileri kullanın, dinlenin, iyi hidrasyon sağlayın ve gerekiyorsa ısı pedleri uygulayın.',
          bn: 'ওভার-দ্য-কাউন্টার ব্যথা নিবারক ব্যবহার করুন, বিশ্রাম নিন, ভালো ভাবে পানি পান করুন, এবং প্রয়োজনে হিট প্যাড প্রয়োগ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I manage urinary tract infections (UTIs)?',
          fr: 'Comment puis-je gérer les infections des voies urinaires (IVU) ?',
          ur: 'مثانی کی انفیکشن (یوٹی آئی) کی کیسے انتظام کیا جا سکتا ہے؟',
          de: 'Wie kann ich Harnwegsinfektionen (HWIs) behandeln?',
          ar: 'كيف يمكنني التعامل مع التهابات المسالك البولية (التهابات المثانة)؟',
          bm: 'Bagaimana saya boleh menguruskan jangkitan saluran kencing (UTI)?',
          tr: 'Üriner sistem enfeksiyonlarını (İYE) nasıl yönetebilirim?',
          bn: 'আমি মূত্রনালী সংক্রান্ত সমস্যা (ইউটি) কীভাবে পরিচালনা করতে পারি?',
        },
        answer: {
          en: 'Drink plenty of water, use the restroom regularly, maintain good hygiene, and take prescribed medications if infected.',
          fr: "Buvez beaucoup d'eau, utilisez les toilettes régulièrement, maintenez une bonne hygiène et prenez les médicaments prescrits en cas d'infection.",
          ur: 'پانی کافی مقدار میں پیئیں، باقاعدہ طور پر حمام استعمال کریں، اچھی صحت محافظت کریں، اور اگر متاثر ہو تو مقررہ دوائیں لیں۔',
          de: 'Trinken Sie viel Wasser, benutzen Sie regelmäßig die Toilette, halten Sie eine gute Hygiene ein und nehmen Sie bei Infektion verordnete Medikamente ein.',
          ar: 'اشرب الكثير من الماء، واستخدم الحمام بانتظام، وحافظ على نظافة جيدة، وتناول الأدوية الموصوفة إذا كنت مصابًا.',
          bm: 'Minum air banyak, gunakan tandas secara berkala, menjaga kebersihan yang baik, dan ambil ubat yang ditetapkan jika terinfeksi.',
          tr: 'Bol su için, düzenli olarak tuvalete gidin, iyi hijyen sağlayın ve enfekte olduğunuzda reçeteli ilaçları alın.',
          bn: 'অনেক পানি পান, নিয়মিতভাবে শৌচাগার ব্যবহার করুন, ভালো স্বাস্থ্যসংরক্ষণ রক্ষা করুন, এবং যদি আক্রান্ত হন তবে নির্ধারিত ওষুধ গ্রহণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What are the guidelines for breastfeeding mothers during Hajj?',
          fr: 'Quelles sont les directives pour les mères qui allaitent pendant le Hajj ?',
          ur: 'حج کے دوران دودھ پلانے والی ماں کے لئے ہدایات کیا ہیں؟',
          de: 'Was sind die Richtlinien für stillende Mütter während des Hajj?',
          ar: 'ما هي الإرشادات للأمهات المرضعات خلال الحج؟',
          bm: 'Apakah panduan untuk ibu menyusu semasa Hajj?',
          tr: 'Hac sırasında emziren anneler için yönergeler nelerdir?',
          bn: 'হজ্জে নর্সিং মায়েদের জন্য নির্দেশিকা কী?',
        },
        answer: {
          en: 'Breastfeeding mothers should carry enough supplies, stay hydrated, and find private areas for feeding if needed.',
          fr: 'Les mères qui allaitent doivent transporter suffisamment de fournitures, rester hydratées et trouver des endroits privés pour allaiter si nécessaire.',
          ur: 'دودھ پلانے والی ماں کو کافی مقدار میں سامان لے جانا چاہئے، پانی کافی پینا چاہئے، اور ضرورت پڑنے پر دودھ پلانے کے لئے نجی علاقوں کو تلاش کرنا چاہئے۔',
          de: 'Stillende Mütter sollten ausreichend Vorräte mitführen, hydratisiert bleiben und bei Bedarf private Bereiche zum Stillen finden.',
          ar: 'يجب على الأمهات المرضعات حمل ما يكفي من الإمدادات، والبقاء مترطبات، والعثور على مناطق خاصة للرضاعة إذا لزم الأمر.',
          bm: 'Ibu yang menyusukan anak harus membawa bekalan yang mencukupi, kekal hidrat, dan mencari kawasan persendirian untuk penyusuan jika diperlukan.',
          tr: 'Emziren anneler yeterli malzeme taşımalı, hidrasyonlarını sağlamalı ve gerektiğinde emzirme için özel alanlar bulmalıdır.',
          bn: 'নর্সিং মা যথেষ্ট সরবরাহ নিতে হবে, পর্যাপ্ত পানি পান করতে হবে, এবং প্রয়োজনে পুর্বের অঞ্চলের জন্য খোঁজ করতে হবে।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What can I do to avoid littering the pilgrimage sites?',
          fr: 'Que puis-je faire pour éviter de jeter des déchets sur les sites de pèlerinage ?',
          ur: 'حج کے مقامات پر کوڑے پھینکنے سے کیسے بچا جا سکتا ہے؟',
          de: 'Was kann ich tun, um das Vermüllen der Pilgerstätten zu vermeiden?',
          ar: 'ما الذي يمكنني فعله لتجنب التلوث في مواقع الحج؟',
          bm: 'Apakah yang boleh saya lakukan untuk mengelakkan tempat ziarah menjadi tempat pembuangan sampah?',
          tr: 'Hac mekanlarında çöp atmayı nasıl önleyebilirim?',
          bn: 'পথিকতা সাইটগুলিতে বিষুদ্ধির মুক্তি পেতে আমি কী করতে পারি?',
        },
        answer: {
          en: 'Dispose of litter in designated bins. Carry a small bag for waste until you find a proper disposal point.',
          fr: "Jetez les déchets dans des poubelles désignées. Transportez un petit sac pour les déchets jusqu'à ce que vous trouviez un point de collecte approprié.",
          ur: 'کوڑا کھانے کو مخصوص ڈبے میں فیک کریں۔ درست نکالنے کا نقطہ تلاش کرنے تک کچھ بچی ہوئی بیگ لے جائیں۔',
          de: 'Entsorgen Sie Abfälle in dafür vorgesehenen Behältern. Tragen Sie einen kleinen Beutel für Abfälle, bis Sie einen geeigneten Entsorgungspunkt finden.',
          ar: 'تخلص من الفضلات في الحاويات المخصصة. احمل حقيبة صغيرة للنفايات حتى تجد نقطة تخلص مناسبة.',
          bm: 'Buang sampah di dalam tong sampah yang ditetapkan. Bawa beg kecil untuk sampah sehingga anda menemui tempat pembuangan yang sesuai.',
          tr: 'Çöpleri belirlenen konteynerlere atın. Uygun bir atma noktası bulana kadar atıklar için küçük bir çanta taşıyın.',
          bn: 'নির্ধারিত ডাস্টবিনে ফেলা বাধ্যতামূলক। উপযুক্ত নিস্কাশন পয়েন্ট পাওয়া পর্যন্ত প্রায় বেগ বহন করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Are there specific rules about where I can and cannot dispose of waste?',
          fr: 'Y a-t-il des règles spécifiques sur où je peux et où je ne peux pas jeter les déchets ?',
          ur: 'کیا میں کوڑے کو کہاں پھینک سکتا ہوں اور کہاں نہیں؟',
          de: 'Gibt es spezifische Regeln darüber, wo ich Abfälle entsorgen kann und wo nicht?',
          ar: 'هل هناك قواعد محددة حول أين يمكنني التخلص من النفايات وأين لا يمكنني؟',
          bm: 'Adakah peraturan khusus tentang di mana saya boleh dan tidak boleh membuang sisa?',
          tr: 'Atıkları nereye atabileceğim ve nereye atamayacağım hakkında belirli kurallar var mı?',
          bn: 'আমি কোথায় প্রত্যাশিত অবস্থানে কোন নিষিদ্ধ প্রাচুর্য প্রাচুর্য ছেড়ে দিতে পারি না?',
        },
        answer: {
          en: 'Dispose of waste in designated areas only. Follow signs and guidelines provided by local authorities.',
          fr: 'Jetez les déchets dans les zones désignées uniquement. Suivez les panneaux et les directives fournies par les autorités locales.',
          ur: 'صرف مخصوص علاقوں میں کوڑے کو فیک کریں۔ مقامی حکومت کی طرف سے فراہم کردہ علامات اور رہنمائیوں کا پیروی کریں۔',
          de: 'Entsorgen Sie Abfälle nur in ausgewiesenen Bereichen. Befolgen Sie die Schilder und Richtlinien, die von den örtlichen Behörden bereitgestellt werden.',
          ar: 'تخلص من النفايات في المناطق المخصصة فقط. اتبع الإشارات والإرشادات المقدمة من قبل السلطات المحلية.',
          bm: 'Buang sisa di kawasan yang ditetapkan sahaja. Ikuti tanda dan panduan yang disediakan oleh pihak berkuasa tempatan.',
          tr: 'Atıkları sadece belirlenmiş alanlarda atın. Yerel yetkililer tarafından sağlanan işaretleri ve yönergeleri izleyin.',
          bn: 'কেবলমাত্র নির্ধারিত এলাকায় প্রাচুর্য ছাড়ান। স্থানীয় কর্তৃপক্ষ দ্বারা প্রদত্ত চিহ্ন এবং নির্দেশিকাগুলি অনুসরণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I stay informed about environmental safety measures during Hajj?',
          fr: 'Comment puis-je me tenir informé des mesures de sécurité environnementale pendant le Hajj ?',
          ur: 'حج کے دوران ماحولیاتی حفاظتی اقدامات کے بارے میں معلومات حاصل رکھنے کے لئے میں کیا کرسکتا ہوں؟',
          de: 'Wie kann ich über Umweltsicherheitsmaßnahmen während des Hajj informiert bleiben?',
          ar: 'كيف يمكنني البقاء على علم بتدابير السلامة البيئية خلال الحج؟',
          bm: 'Bagaimana saya boleh dimaklumkan tentang langkah-langkah keselamatan alam sekitar semasa Hajj?',
          tr: 'Hac sırasında çevresel güvenlik önlemleri hakkında nasıl bilgi alabilirim?',
          bn: 'হজ্জের সময় পরিবেশ সুরক্ষা ব্যবস্থার সম্পর্কে আমি কীভাবে সচেতন থাকতে পারি?',
        },
        answer: {
          en: 'Stay updated with announcements from local authorities. Use mobile apps and information centers for guidelines.',
          fr: "Restez informé des annonces des autorités locales. Utilisez des applications mobiles et des centres d'information pour les directives.",
          ur: 'مقامی حکومتیں کی تازہ ترین اطلاعات کے ساتھ اپ ڈیٹ رہیں۔ ہدایات کے لئے موبائل ایپلیکیشنز اور معلوماتی مراکز کا استعمال کریں۔',
          de: 'Bleiben Sie über Ankündigungen der örtlichen Behörden auf dem Laufenden. Verwenden Sie mobile Apps und Informationszentren für Richtlinien.',
          ar: 'ابق على اطلاع من الإعلانات الصادرة عن السلطات المحلية. استخدم تطبيقات الجوال ومراكز المعلومات للإرشادات.',
          bm: 'Mengikuti pengumuman dari pihak berkuasa tempatan. Gunakan aplikasi mudah alih dan pusat maklumat untuk panduan.',
          tr: 'Yerel yetkililerin duyurularını takip edin. Yönergeler için mobil uygulamaları ve bilgi merkezlerini kullanın.',
          bn: 'স্থানীয় কর্তৃপক্ষের ঘোষণা দেখুন। নির্দেশিকা জন্য মোবাইল অ্যাপস এবং তথ্য কেন্দ্র ব্যবহার করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What are the common environmental hazards during Hajj, and how can I avoid them?',
          fr: 'Quels sont les dangers environnementaux courants pendant le Hajj, et comment puis-je les éviter ?',
          ur: 'حج کے دوران عام ماحولیاتی خطرات کیا ہیں، اور میں ان سے کیسے بچ سکتا ہوں؟',
          de: 'Was sind die häufigsten Umweltrisiken während des Hajj und wie kann ich sie vermeiden?',
          ar: 'ما هي المخاطر البيئية الشائعة خلال الحج، وكيف يمكنني تجنبها؟',
          bm: 'Apakah bahaya alam sekitar yang biasa semasa Hajj, dan bagaimana saya boleh mengelakkannya?',
          tr: 'Hac sırasında yaygın çevresel tehlikeler nelerdir ve bunlardan nasıl kaçınabilirim?',
          bn: 'হজ্জে সাধারণত পরিবেশগত ঝুঁকি কী এবং আমি তাদের থেকে কীভাবে বিরতি নিতে পারি?',
        },
        answer: {
          en: 'Common hazards include heat, waste accumulation, and air pollution. Follow guidelines to avoid these.',
          fr: "Les dangers courants comprennent la chaleur, l'accumulation des déchets et la pollution de l'air. Suivez les directives pour les éviter.",
          ur: 'عام خطرات میں گرمی، کوڑے کی انبار اور ہوا کی آلودگی شامل ہیں۔ ان سے بچنے کے لئے ہدایات کا پیروی کریں۔',
          de: 'Häufige Gefahren umfassen Hitze, Abfallansammlungen und Luftverschmutzung. Befolgen Sie Richtlinien, um diesen zu entgehen.',
          ar: 'تشمل المخاطر الشائعة الحرارة وتراكم النفايات وتلوث الهواء. اتبع الإرشادات لتجنب هذه المخاطر.',
          bm: 'Bahaya-bahaya biasa termasuk panas, penumpukan sisa dan pencemaran udara. Ikuti panduan untuk mengelakkannya.',
          tr: 'Yaygın tehlikeler arasında sıcaklık, atık birikimi ve hava kirliliği bulunmaktadır. Bunlardan kaçınmak için yönergeleri takip edin.',
          bn: 'সাধারণ ঝুঁকিগুলির মধ্যে তাপমাত্রা, পদার্থ সংগ্রহ, এবং বায়ু দূষণ রয়েছে। এগুলি পরিহার করতে নির্দেশিকা অনুসরণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I help educate my fellow pilgrims about environmental responsibility?',
          fr: 'Comment puis-je aider à sensibiliser mes compagnons pèlerins à la responsabilité environnementale ?',
          ur: 'میں کس طرح اپنے ساتھی حجاج کو ماحولیاتی ذمہ داری کے بارے میں تعلیم دینے میں مدد کر سکتا ہوں؟',
          de: 'Wie kann ich meinen Mitpilgern helfen, sich über Umweltverantwortung zu informieren?',
          ar: 'كيف يمكنني مساعدة زملائي الحجاج في التوعية بالمسؤولية البيئية؟',
          bm: 'Bagaimana saya boleh membantu mendidik rakan-rakan haji saya tentang tanggungjawab alam sekitar?',
          tr: 'Nasıl meslektaşlarımı çevresel sorumluluklar konusunda eğitmeme yardımcı olabilirim?',
          bn: 'আমি কিভাবে আমার সহযাত্রী পর্যটকদের পরিবেশ দায়িত্ব সম্পর্কে শিক্ষা দেওয়ার সাহায্য করতে পারি?',
        },
        answer: {
          en: 'Share information on proper waste disposal and environmental guidelines. Lead by example.',
          fr: "Partagez des informations sur l'élimination appropriée des déchets et les directives environnementales. Montrez l'exemple.",
          ur: 'درست کوڑے کی انتظامیہ اور ماحولیاتی ہدایات پر معلومات کا تبادلہ کریں۔ مثال قائم کریں۔',
          de: 'Teilen Sie Informationen über die ordnungsgemäße Entsorgung von Abfällen und Umweltrichtlinien. Führen Sie durch Beispiel voran.',
          ar: 'شارك المعلومات حول التخلص السليم من النفايات والإرشادات البيئية. قد بالمثال.',
          bm: 'Kongsi maklumat tentang pembuangan sisa yang betul dan panduan alam sekitar. Memimpin dengan contoh.',
          tr: 'Doğru atık bertarafı ve çevresel yönergeler hakkında bilgi paylaşın. Örnek olun.',
          bn: 'ঠিকমতো প্রচুর্য ও পরিবেশ নির্দেশিকা সম্পর্কে তথ্য শেয়ার করুন। উদাহরণের মাধ্যমে নেতৃত্ব দিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What impact does Hajj have on the local environment?',
          fr: "Quel impact le Hajj a-t-il sur l'environnement local ?",
          ur: 'حج کا مقامی ماحول پر کیا اثر ہوتا ہے؟',
          de: 'Welche Auswirkungen hat der Hajj auf die lokale Umwelt?',
          ar: 'ما هو تأثير الحج على البيئة المحلية؟',
          bm: 'Apakah impak Hajj ke atas alam sekitar tempatan?',
          tr: 'Hac, yerel çevre üzerinde nasıl bir etkiye sahiptir?',
          bn: 'হজ্জের স্থানীয় পরিবেশের উপর কি প্রভাব ফেলে?',
        },
        answer: {
          en: 'Hajj has a significant impact on local resources and waste. Efforts are made to manage this and reduce harm.',
          fr: 'Le Hajj a un impact significatif sur les ressources locales et les déchets. Des efforts sont déployés pour gérer cela et réduire les dommages.',
          ur: 'حج مقامی وسائل اور کوڑے پر اثر انداز ہوتا ہے۔ اسے مدیریت کرنے اور نقصان کم کرنے کے لئے کوشش کی جاتی ہے۔',
          de: 'Der Hajj hat einen erheblichen Einfluss auf lokale Ressourcen und Abfälle. Es werden Anstrengungen unternommen, dies zu verwalten und Schaden zu reduzieren.',
          ar: 'الحج له تأثير كبير على الموارد المحلية والنفايات. يبذل جهوداً لإدارة هذا وتقليل الضرر.',
          bm: 'Hajj mempunyai impak yang besar ke atas sumber tempatan dan sisa. Usaha dilakukan untuk menguruskan ini dan mengurangkan kerosakan.',
          tr: 'Hac, yerel kaynaklar ve atıklar üzerinde önemli bir etkiye sahiptir. Bunun yönetilmesi ve zararın azaltılması için çaba gösterilmektedir.',
          bn: 'হজ্জ স্থানীয় সম্পদ এবং পদার্থ ও কুড়ার উপর গুরুত্বপূর্ণ প্রভাব ফেলে। এটি পরিচালনা করার এবং ক্ষতি হ্রাসের জন্য প্রচেষ্টা করা হয়।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Are there any ongoing efforts to make Hajj more environmentally friendly?',
          fr: "Y a-t-il des efforts en cours pour rendre le Hajj plus respectueux de l'environnement ?",
          ur: 'کیا حج کو ماحولیاتی طور پر دوستانہ بنانے کے لئے کوئی مسلسل کوششیں ہیں؟',
          de: 'Gibt es laufende Bemühungen, den Hajj umweltfreundlicher zu gestalten?',
          ar: 'هل هناك جهود مستمرة لجعل الحج أكثر صداقة للبيئة؟',
          bm: 'Adakah usaha berterusan untuk menjadikan Hajj lebih mesra alam?',
          tr: "Hac'ı daha çevre dostu hale getirmek için devam eden çabalar var mı?",
          bn: 'হজ্জকে আরও পরিবেশ বন্ধুত্বপূর্ণ করতে চলতি কোনও প্রচেষ্টা রয়েছে কি?',
        },
        answer: {
          en: 'Yes, ongoing efforts include waste reduction, water conservation, and promoting eco-friendly practices.',
          fr: "Oui, les efforts en cours comprennent la réduction des déchets, la conservation de l'eau et la promotion des pratiques respectueuses de l'environnement.",
          ur: 'جی ہاں، جاری کوششیں کوڑے کمی، پانی کی محافظت، اور ماحول دوست عمل کرانے شامل ہیں۔',
          de: 'Ja, laufende Bemühungen umfassen die Reduzierung von Abfällen, Wasserschutz und die Förderung umweltfreundlicher Praktiken.',
          ar: 'نعم، تتضمن الجهود المستمرة تقليل النفايات، وحفظ المياه، وتعزيز الممارسات الصديقة للبيئة.',
          bm: 'Ya, usaha berterusan termasuk pengurangan sisa, pemuliharaan air, dan mempromosikan amalan mesra alam.',
          tr: 'Evet, devam eden çabalar arasında atık azaltma, su koruma ve çevre dostu uygulamaların teşviki bulunmaktadır.',
          bn: 'হ্যাঁ, চলমান প্রচেষ্টা সম্প্রতি কোড কমানো, জল সংরক্ষণ, এবং পরিবেশবান্ধব অভ্যন্তরীণ প্রথা বিপুল করা।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I be respectful of the natural environment while performing Hajj rituals?',
          fr: "Comment puis-je respecter l'environnement naturel tout en accomplissant les rituels du Hajj ?",
          ur: 'حج رسومات انجام دیتے وقت میں میں فطری ماحول کا احترام کیسے کر سکتا ہوں؟',
          de: 'Wie kann ich die natürliche Umgebung respektieren, während ich die Hajj-Rituale durchführe?',
          ar: 'كيف يمكنني أن أحترم البيئة الطبيعية أثناء أداء طقوس الحج؟',
          bm: 'Bagaimana saya boleh menghormati alam semula jadi semasa menjalankan ibadah Hajj?',
          tr: 'Hac ritüellerini yerine getirirken doğal çevreye saygılı olabilir miyim?',
          bn: 'হজ্জ রীতির সময় প্রাকৃতিক পরিবেশের সম্মান করা কীভাবে সম্ভব?',
        },
        answer: {
          en: 'Avoid damaging vegetation and wildlife. Follow designated paths and guidelines.',
          fr: 'Évitez de nuire à la végétation et à la faune. Suivez les chemins et les directives désignés.',
          ur: 'پودوں اور جانوروں کو نقصان پہنچانے سے بچیں۔ مخصوص راستوں اور ہدایات کا پیروی کریں۔',
          de: 'Vermeiden Sie es, Vegetation und Tierwelt zu beschädigen. Folgen Sie den ausgewiesenen Wegen und Richtlinien.',
          ar: 'تجنب إتلاف النباتات والحياة البرية. اتبع المسارات والإرشادات المحددة.',
          bm: 'Elakkan merosakkan vegetasi dan hidupan liar. Ikuti laluan dan panduan yang ditetapkan.',
          tr: 'Bitki örtüsüne ve yaban hayatına zarar vermekten kaçının. Belirlenmiş yollara ve yönergeleri takip edin.',
          bn: 'উদ্ভিদ এবং জীবজন্তু ক্ষতি না করার চেষ্টা করুন। নির্ধারিত পথ এবং নির্দেশিকা অনুসরণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I see someone littering or violating environmental guidelines?',
          fr: "Que dois-je faire si je vois quelqu'un jeter des déchets ou violer les directives environnementales ?",
          ur: 'اگر میں کسی کو کوڑا پھینکتے ہوئے یا ماحولیاتی ہدایات کی خلاف ورزی کرتے ہوئے دیکھتا ہوں تو میں کیا کروں؟',
          de: 'Was soll ich tun, wenn ich sehe, dass jemand Abfall wirft oder Umweltrichtlinien verletzt?',
          ar: 'ماذا يجب أن أفعل إذا رأيت شخصاً يلقي القمامة أو ينتهك الإرشادات البيئية؟',
          bm: 'Apa yang harus saya lakukan jika saya melihat seseorang membuang sampah atau melanggar garis panduan alam sekitar?',
          tr: 'Eğer birinin çöp atmasını veya çevresel yönergeleri ihlal ettiğini görürsem ne yapmalıyım?',
          bn: 'যদি আমি কাউকে প্রস্তুতি করার জন্য বা পরিবেশ নির্দেশিকা লঙ্ঘন করতে দেখি তবে আমি কী করব?',
        },
        answer: {
          en: 'Politely remind them of the guidelines. Report to local authorities if necessary.',
          fr: 'Rappelez-leur poliment les directives. Signalez aux autorités locales si nécessaire.',
          ur: 'اہم ہو تو انہیں ہدایات کی یاد دلائیں۔ ضرورت پڑنے پر مقامی حکومت کو رپورٹ کریں۔',
          de: 'Erinnern Sie sie höflich an die Richtlinien. Melden Sie dies gegebenenfalls den örtlichen Behörden.',
          ar: 'ذكر لهم بلطف الإرشادات. قم بالإبلاغ إلى السلطات المحلية إذا لزم الأمر.',
          bm: 'Ingatkan mereka secara sopan tentang garis panduan. Laporkan kepada pihak berkuasa tempatan jika perlu.',
          tr: 'Onlara yönergeleri nazikçe hatırlatın. Gerekirse yerel yetkililere bildirin.',
          bn: 'তাদেরকে সাহায্যের গাইডলাইন মনে করান। প্রয়োজনে স্থানীয় কর্তৃপক্ষের কাছে রিপোর্ট করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can using reusable items help during Hajj?',
          fr: "Comment l'utilisation d'articles réutilisables peut-elle aider pendant le Hajj ?",
          ur: 'حج کے دوران قابل دوبارہ استعمال مواد کا استعمال کس طرح مدد فراہم کر سکتا ہے؟',
          de: 'Wie kann die Verwendung wiederverwendbarer Artikel während des Hajj helfen?',
          ar: 'كيف يمكن أن يساعد استخدام العناصر القابلة لإعادة الاستخدام خلال الحج؟',
          bm: 'Bagaimanakah penggunaan barang yang boleh digunakan semula membantu semasa Hajj?',
          tr: 'Hac sırasında yeniden kullanılabilir öğelerin kullanımı nasıl yardımcı olabilir?',
          bn: 'হজ্জে পুনঃব্যবহারযোগ্য জিনিস ব্যবহার করা কীভাবে সাহায্য করতে পারে?',
        },
        answer: {
          en: 'Using reusable items reduces waste. Carry items such as water bottles, utensils, and bags.',
          fr: "L'utilisation d'articles réutilisables réduit les déchets. Transportez des articles tels que des bouteilles d'eau, des ustensiles et des sacs.",
          ur: 'قابل دوبارہ استعمال مواد استعمال کرنے سے کوڑا کم ہوتا ہے۔ پانی کی بوتل، برتن، اور بیگ وغیرہ جیسے اشیاء لے کر جائیں۔',
          de: 'Die Verwendung wiederverwendbarer Artikel reduziert Abfall. Tragen Sie Gegenstände wie Wasserflaschen, Besteck und Taschen.',
          ar: 'استخدام العناصر القابلة لإعادة الاستخدام يقلل من النفايات. قم بحمل العناصر مثل زجاجات المياه والأواني والأكياس.',
          bm: 'Menggunakan barang yang boleh digunakan semula mengurangkan sisa. Bawa barang-barang seperti botol air, peralatan makan, dan beg.',
          tr: 'Yeniden kullanılabilir öğelerin kullanılması atığı azaltır. Su şişeleri, mutfak eşyaları ve çantalar gibi öğeleri taşıyın.',
          bn: 'পুনঃব্যবহারযোগ্য জিনিস ব্যবহার করা কুড়া হ্রাস করে। পানির বোতল, পাত্র, ও ব্যাগ সহ জিনিসপত্র নিয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I experience eye irritation or injury?',
          fr: "Que dois-je faire si j'éprouve une irritation ou une blessure oculaire ?",
          ur: 'اگر مجھے آنکھوں میں خارش یا زخم ہو تو میں کیا کروں؟',
          de: 'Was soll ich tun, wenn ich Augenreizungen oder Verletzungen habe?',
          ar: 'ماذا يجب أن أفعل إذا شعرت بتهيج أو إصابة في العين؟',
          bm: 'Apa yang harus saya lakukan jika saya mengalami iritasi mata atau kecederaan?',
          tr: 'Gözlerimde tahriş veya yaralanma yaşarsam ne yapmalıyım?',
          bn: 'যদি আমি চোখে চোখে ব্যথা বা আহতি অনুভব করি তবে আমি কী করব?',
        },
        answer: {
          en: 'Rinse the eye with clean water and seek medical attention if irritation persists.',
          fr: "Rincez l'œil avec de l'eau propre et consultez un médecin si l'irritation persiste.",
          ur: 'آنکھوں کو صاف پانی سے دھوئیں اور اگر خارش جاری ہو تو طبی امداد حاصل کریں۔',
          de: 'Spülen Sie das Auge mit sauberem Wasser aus und suchen Sie ärztliche Hilfe, wenn die Reizung anhält.',
          ar: 'اغسل العين بالماء النظيف وابحث عن العناية الطبية إذا استمر التهيج.',
          bm: 'Bilas mata dengan air bersih dan dapatkan bantuan perubatan jika iritasi berterusan.',
          tr: 'Gözü temiz su ile durulayın ve tahriş devam ederse tıbbi yardım alın.',
          bn: 'চোখকে পরিষ্কার পানিতে ধোয়া দিন এবং যদি চোখে ব্যথা অবিরত থাকে তবে চিকিৎসা পেতে যোগাযোগ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I avoid injuries caused by insect bites or stings?',
          fr: "Comment puis-je éviter les blessures causées par les piqûres ou les piqûres d'insectes ?",
          ur: 'کیسے میں کیڑوں کی کاٹن یا ڈنگ سے ہونے والی زخموں سے بچ سکتا ہوں؟',
          de: 'Wie kann ich Verletzungen durch Insektenstiche oder -stiche vermeiden?',
          ar: 'كيف يمكنني تجنب الإصابات الناجمة عن لدغات الحشرات أو اللسعات؟',
          bm: 'Bagaimana saya boleh mengelakkan kecederaan disebabkan gigitan atau sengatan serangga?',
          tr: 'Böcek ısırıkları veya sokmaları nedeniyle oluşan yaralanmalardan nasıl kaçınabilirim?',
          bn: 'কীটপতঙ্গের কামুক বা স্টিংগের দ্বারা সন্ত্রাসিত আহতি থেকে কিভাবে বিরতি নিতে পারি?',
        },
        answer: {
          en: 'Use insect repellent, wear protective clothing, and avoid stagnant water areas.',
          fr: "Utilisez un répulsif contre les insectes, portez des vêtements de protection et évitez les zones d'eau stagnante.",
          ur: 'کیڑوں کے خلاف مدافع استعمال کریں، محافظتی کپڑے پہنیں، اور ساکن پانی کے علاقوں سے بچیں۔',
          de: 'Verwenden Sie Insektenschutzmittel, tragen Sie schützende Kleidung und meiden Sie stehende Wasserflächen.',
          ar: 'استخدم مبيدات الحشرات، وارتدي الملابس الواقية، وتجنب مناطق المياه الراكدة.',
          bm: 'Gunakan penolak serangga, pakai pakaian perlindungan, dan elakkan kawasan air yang tenang.',
          tr: 'Böcek kovucu kullanın, koruyucu giysiler giyin ve durgun su alanlarından kaçının.',
          bn: 'কীটনাশক ব্যবহার করুন, সুরক্ষামূলক পোশাক পরিধান করুন, এবং নিরপেক্ষ পানির অঞ্চল থেকে দূরে থাকুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What are the safe practices for using sharp objects such as razors?',
          fr: "Quelles sont les pratiques sûres pour l'utilisation d'objets tranchants tels que les rasoirs ?",
          ur: 'ریزر وغیرہ جیسے تیز اشیاء کا استعمال کرنے کے لئے محفوظ طریقے کیا ہیں؟',
          de: 'Welche sicheren Praktiken gibt es für den Umgang mit scharfen Gegenständen wie Rasierern?',
          ar: 'ما هي الممارسات الآمنة لاستخدام الأدوات الحادة مثل الحلاقة؟',
          bm: 'Apakah amalan selamat untuk menggunakan benda tajam seperti pisau cukur?',
          tr: 'Jilet gibi keskin nesneleri kullanma için güvenli uygulamalar nelerdir?',
          bn: 'রেজার সহ অন্যান্য ক্যাটিং উপকরণ ব্যবহারের জন্য কি নিরাপদ অনুশাসন আছে?',
        },
        answer: {
          en: 'Use sharp objects with care, follow proper disposal methods, and avoid distractions.',
          fr: "Utilisez les objets tranchants avec précaution, suivez les méthodes appropriées d'élimination et évitez les distractions.",
          ur: 'تیز اشیاء کو محتاطی سے استعمال کریں، مناسب نجیف کرنے کے طریقوں کا پیروی کریں، اور توجہ سے بچیں۔',
          de: 'Verwenden Sie scharfe Gegenstände mit Vorsicht, befolgen Sie die richtigen Entsorgungsmethoden und vermeiden Sie Ablenkungen.',
          ar: 'استخدم الأدوات الحادة بحذر، واتبع الطرق الصحيحة للتخلص منها، وتجنب الانشغالات.',
          bm: 'Gunakan benda tajam dengan berhati-hati, ikuti kaedah pembuangan yang betul, dan elakkan gangguan.',
          tr: 'Keskin nesneleri dikkatli kullanın, uygun atma yöntemlerini takip edin ve dikkat dağıtıcıları önleyin.',
          bn: 'ক্যাটিং উপকরণ সাবধানে ব্যবহার করুন, সঠিক বিনামূল্যে মূল্যবান পদ্ধতিগুলি অনুসরণ করুন, এবং বিব্রত থেকে বিরতি নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I protect my knees and joints during long walks?',
          fr: 'Comment puis-je protéger mes genoux et mes articulations lors de longues marches ?',
          ur: 'طویل عرصے تک چلتے وقت اپنے گھٹنوں اور جوڑوں کی حفاظت کیسے کروں؟',
          de: 'Wie kann ich meine Knie und Gelenke bei langen Spaziergängen schützen?',
          ar: 'كيف يمكنني حماية ركبتي ومفاصلي خلال المشي لفترات طويلة؟',
          bm: 'Bagaimanakah saya boleh melindungi lutut dan sendi saya semasa berjalan jauh?',
          tr: 'Uzun yürüyüşler sırasında dizlerimi ve eklemlerimi nasıl koruyabilirim?',
          bn: 'দীর্ঘ হাঁটার সময়ে আমি কীভাবে আমার হাঁটু এবং সংযুক্তিগুলির সুরক্ষা করতে পারি?',
        },
        answer: {
          en: 'Wear supportive shoes, use knee braces if needed, and do strengthening exercises.',
          fr: 'Portez des chaussures de soutien, utilisez des genouillères si nécessaire et faites des exercices de renforcement.',
          ur: 'محافظتی جوتے پہنیں، ضرورت پڑنے پر گھٹنوں کے بریسز استعمال کریں، اور مضبوطی کی ورزشیں کریں۔',
          de: 'Tragen Sie unterstützende Schuhe, verwenden Sie bei Bedarf Kniebandagen und machen Sie Kräftigungsübungen.',
          ar: 'ارتدي الأحذية الداعمة، استخدم الأقواس الصناعية إذا لزم الأمر، وقم بتمارين تقوية.',
          bm: 'Pakai kasut penyokong, gunakan brek lutut jika perlu, dan lakukan senaman penambah kuat.',
          tr: 'Destekleyici ayakkabılar giyin, ihtiyaç duyulursa diz korsesi kullanın ve güçlendirme egzersizleri yapın.',
          bn: 'সহায়ক জুতা পরো, প্রয়োজনে গোড়ার ব্রেস ব্যবহার করুন, এবং শক্তিশালী অনুশীলন করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What safety measures should I take while staying in multi-story buildings or hotels?',
          fr: 'Quelles mesures de sécurité dois-je prendre lorsque je séjourne dans des immeubles à plusieurs étages ou des hôtels ?',
          ur: 'ملٹی سٹوری عمارات یا ہوٹلوں میں رہتے ہوئے میں کس طرح کی حفاظتی تدابیر اختیار کروں؟',
          de: 'Welche Sicherheitsmaßnahmen sollte ich in Mehrfamilienhäusern oder Hotels ergreifen?',
          ar: 'ما هي التدابير الأمنية التي يجب اتخاذها أثناء الإقامة في مبانٍ متعددة الطوابق أو الفنادق؟',
          bm: 'Apakah langkah-langkah keselamatan yang perlu saya ambil semasa tinggal di bangunan bertingkat atau hotel?',
          tr: 'Çok katlı binalarda veya otellerde kalırken hangi güvenlik önlemlerini almalıyım?',
          bn: 'বহুতলের বা হোটেলে থাকার সময় আমি কী সুরক্ষা ব্যবস্থা নিতে পারি?',
        },
        answer: {
          en: 'Know the fire escape routes and avoid using elevators during a fire.',
          fr: "Connaître les itinéraires d'évacuation en cas d'incendie et éviter d'utiliser les ascenseurs pendant un incendie.",
          ur: 'آگ لگنے کی صورت میں آگ کی فراری راستے کا علم ہونا اور آگ لگنے کی صورت میں لفٹ کا استعمال نہ کریں۔',
          de: 'Kennen Sie die Fluchtwege im Brandfall und vermeiden Sie die Benutzung von Aufzügen während eines Brandes.',
          ar: 'تعرف على طرق الهروب من الحرائق وتجنب استخدام المصاعد أثناء الحرائق.',
          bm: 'Kenali laluan larian kebakaran dan elakkan menggunakan lif semasa kebakaran.',
          tr: 'Yangın kaçış yollarını bilin ve yangın sırasında asansör kullanmaktan kaçının.',
          bn: 'অগ্নিবন্ধনের ফিরে যাওয়ার মার্গগুলি জানুন এবং অগ্নিবন্ধনের সময় লিফ্ট ব্যবহার করা এড়ানোর সাথে বিরতি অবলম্বন করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How should I handle smoke or fire hazards in crowded areas?',
          fr: "Comment dois-je gérer les risques de fumée ou d'incendie dans les zones bondées ?",
          ur: 'بھرے علاقوں میں دھواں یا آگ کے خطرات کا سامنا کیسے کیا جائے؟',
          de: 'Wie sollte ich Rauch- oder Feuergefahren in überfüllten Bereichen handhaben?',
          ar: 'كيف يجب علي التعامل مع مخاطر الدخان أو الحرائق في المناطق المزدحمة؟',
          bm: 'Bagaimanakah saya harus mengendalikan bahaya asap atau kebakaran di kawasan sesak?',
          tr: 'Kalabalık alanlarda duman veya yangın tehlikeleri nasıl ele alınmalıdır?',
          bn: 'সমুদ্র অঞ্চলে ধোঁয়া বা অগ্নিশিখা প্রতিকূলতা কীভাবে পরিচালনা করা উচিত?',
        },
        answer: {
          en: "Keep calm, move towards exits, and follow the authorities' instructions.",
          fr: 'Gardez votre calme, dirigez-vous vers les sorties et suivez les instructions des autorités.',
          ur: 'پر سکون رہیں، باہر کی طرف چلیں، اور حکومت کی ہدایات کا پیروی کریں۔',
          de: 'Bleiben Sie ruhig, bewegen Sie sich zu den Ausgängen und folgen Sie den Anweisungen der Behörden.',
          ar: 'ابقى هادئًا، اتجه نحو الخروج، واتبع تعليمات السلطات.',
          bm: 'Kee calm, bergerak ke arah pintu keluar, dan ikut arahan pihak berkuasa.',
          tr: 'Sakin kalın, çıkışlara doğru hareket edin ve yetkililerin talimatlarını izleyin.',
          bn: 'শান্ত থাকুন, প্রস্থ দিকে চলুন, এবং কর্তৃপক্ষের নির্দেশাবলী অনুসরণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What basic first aid steps should I know for common injuries?',
          fr: 'Quelles sont les étapes de premiers secours de base que je devrais connaître pour les blessures courantes ?',
          ur: 'عام زخموں کے لئے میں کون سے بنیادی پہلی مدد کے اقدامات جاننا چاہئیں؟',
          de: 'Welche grundlegenden Erste-Hilfe-Maßnahmen sollte ich bei häufigen Verletzungen kennen?',
          ar: 'ما هي الخطوات الأولية الأساسية التي يجب أن أعرفها للإسعافات الأولية للإصابات الشائعة؟',
          bm: 'Apakah langkah-langkah pertolongan cemas asas yang perlu saya ketahui untuk kecederaan biasa?',
          tr: 'Yaygın yaralanmalar için bilmem gereken temel ilk yardım adımları nelerdir?',
          bn: 'সাধারণ আঘাতের জন্য আমার কি মৌলিক প্রাথমিক প্রাথমিক প্রাথমিক প্রথাগতি দেখতে হবে?',
        },
        answer: {
          en: 'Learn the R.I.C.E. method: Rest, Ice, Compression, Elevation.',
          fr: 'Apprenez la méthode R.I.C.E. : Repos, Glace, Compression, Élévation.',
          ur: 'R.I.C.E. میتھڈ سیکھیں: آرام، برف، دباؤ، اور اونچائی۔',
          de: 'Lernen Sie die R.I.C.E.-Methode: Ruhe, Eis, Kompression, Elevation.',
          ar: 'تعلم طريقة R.I.C.E.: الراحة، الثلج، الضغط، والارتفاع.',
          bm: 'Pelajari kaedah R.I.C.E.: Rehat, Ais, Penyekatan, Kenaikan.',
          tr: 'R.I.C.E. yöntemini öğrenin: Dinlenme, Buz, Sıkıştırma, Yükseltme.',
          bn: 'R.I.C.E. পদ্ধতি শেখান: বিশ্রাম, বরফ, কম্প্রেশন, ঊর্ধ্বতন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I protect my skin from cuts and abrasions?',
          fr: 'Comment puis-je protéger ma peau contre les coupures et les abrasions ?',
          ur: 'میں اپنی جلد کو کٹاؤ اور رگڑوں سے کیسے بچا سکتا ہوں؟',
          de: 'Wie kann ich meine Haut vor Schnitten und Abschürfungen schützen?',
          ar: 'كيف يمكنني حماية بشرتي من الجروح والخدوش؟',
          bm: 'Bagaimanakah saya boleh melindungi kulit saya daripada kecederaan dan hentakan?',
          tr: 'Ciltimi kesiklerden ve sürtünmelerden nasıl koruyabilirim?',
          bn: 'কিভাবে আমি আমার চামড়াকে কাটা এবং আঘাত থেকে সুরক্ষিত রাখতে পারি?',
        },
        answer: {
          en: 'Wear protective clothing and be cautious around sharp objects.',
          fr: 'Portez des vêtements de protection et soyez prudent autour des objets tranchants.',
          ur: 'محافظتی لباس پہنیں اور تیز اشیاء کے قریب احتیاط کریں۔',
          de: 'Tragen Sie Schutzkleidung und seien Sie vorsichtig im Umgang mit scharfen Gegenständen.',
          ar: 'ارتدي ملابس واقية وكن حذرًا حول الأشياء الحادة.',
          bm: 'Pakai pakaian perlindungan dan berhati-hati di sekitar benda tajam.',
          tr: 'Koruyucu giysi giyin ve keskin nesnelerin etrafında dikkatli olun.',
          bn: 'রক্ষাকারী পোশাক পরে এবং ধরনের তীক্ষ্ণ বস্তুগুলির চারে সাবধান থাকুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What are the best practices for maintaining hand hygiene to avoid infections?',
          fr: "Quelles sont les meilleures pratiques pour maintenir une bonne hygiène des mains afin d'éviter les infections ?",
          ur: 'انفیکشن سے بچنے کے لئے ہینڈ ہائجین کو برقرار رکھنے کی بہترین تجاویز کیا ہیں؟',
          de: 'Was sind die besten Praktiken zur Aufrechterhaltung der Handhygiene, um Infektionen zu vermeiden?',
          ar: 'ما هي أفضل الممارسات للحفاظ على نظافة اليدين لتجنب العدوى؟',
          bm: 'Apakah amalan terbaik untuk mengekalkan kebersihan tangan untuk mengelakkan jangkitan?',
          tr: 'Enfeksiyonlardan kaçınmak için el hijyenini korumanın en iyi uygulamaları nelerdir?',
          bn: 'সংক্রামণ থেকে বাঁচার জন্য হাত সাফাই বজায় রাখার জন্য সেরা অনুশাসন কী?',
        },
        answer: {
          en: 'Wash hands with soap regularly, use hand sanitizers, and avoid touching your face.',
          fr: 'Lavez-vous régulièrement les mains avec du savon, utilisez des désinfectants pour les mains et évitez de toucher votre visage.',
          ur: 'اپنے ہاتھوں کو باقاعدگی سے صابن سے دھوئیں، ہینڈ سینیٹائزر استعمال کریں، اور اپنا چہرہ چھونے سے باز رہیں۔',
          de: 'Waschen Sie regelmäßig Ihre Hände mit Seife, verwenden Sie Handdesinfektionsmittel und vermeiden Sie es, sich ins Gesicht zu fassen.',
          ar: 'اغسل يديك بانتظام بالصابون، استخدم مطهرات اليدين، وتجنب لمس وجهك.',
          bm: 'Basuh tangan dengan sabun secara berkala, gunakan pembunuh kuman tangan, dan elakkan menyentuh muka anda.',
          tr: 'Ellerinizi düzenli olarak sabunla yıkayın, el dezenfektanları kullanın ve yüzünüze dokunmaktan kaçının.',
          bn: 'নিয়মিতভাবে সাবান দিয়ে হাত ধুয়ে নিন, হ্যান্ড স্যানিটাইজার ব্যবহার করুন, এবং আপনার মুখে স্পর্শ করার উপযোগী না হয়ে থাকুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: "How can I stay safe while performing Tawaf and Sa'i without causing injuries to myself or others?",
          fr: "Comment puis-je rester en sécurité tout en effectuant le Tawaf et le Sa'i sans causer de blessures à moi-même ou à autrui ?",
          ur: 'تواف اور سائی کرتے ہوئے میں اپنے اور دوسروں کو زخمی نہ کرنے کے بغیر کیسے محفوظ رہ سکتا ہوں؟',
          de: "Wie kann ich sicher bleiben, während ich Tawaf und Sa'i ausführe, ohne mir selbst oder anderen Verletzungen zuzufügen?",
          ar: 'كيف يمكنني البقاء بأمان أثناء أداء الطواف والسعي دون تسبب إصابات لنفسي أو للآخرين؟',
          bm: "Bagaimanakah saya boleh kekal selamat semasa melakukan Tawaf dan Sa'i tanpa menyebabkan kecederaan kepada diri sendiri atau orang lain?",
          tr: "Tawaf ve Sa'i yaparken kendime veya başkalarına zarar vermeden nasıl güvende kalabilirim?",
          bn: "আমি কিভাবে আমার অথবা অন্যকে ক্ষতি করার সাথে সাথে তাওয়াফ এবং সা'ই পরিচালনা করার সময় নিরাপদে থাকতে পারি?",
        },
        answer: {
          en: 'Stay close to your group, maintain a steady pace, and watch your step.',
          fr: 'Restez près de votre groupe, maintenez un rythme régulier et faites attention à vos pas.',
          ur: 'اپنے گروپ کے قریب رہیں، ایک مستقل رفتار برقرار رکھیں، اور اپنے قدموں کا خیال رکھیں۔',
          de: 'Bleiben Sie in der Nähe Ihrer Gruppe, halten Sie ein gleichmäßiges Tempo ein und achten Sie auf Ihre Schritte.',
          ar: 'ابق بالقرب من مجموعتك، واحفظ وتيرتك، وانتبه لخطواتك.',
          bm: 'Kekal rapat dengan kumpulan anda, mengekalkan kelajuan yang mantap, dan berhati-hati dengan langkah anda.',
          tr: 'Grubunuza yakın kalın, istikrarlı bir tempoda ilerleyin ve adımlarınıza dikkat edin.',
          bn: 'আপনার গ্রুপের কাছে থাকুন, একটি স্থিতিশীল গতিতে থাকুন, এবং আপনার পদক্ষেপ সতর্কতার সাথে পর্যবেক্ষণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What steps can I take to handle gastrointestinal conditions like IBS or GERD?',
          fr: 'Quelles étapes puis-je suivre pour gérer les conditions gastro-intestinales telles que le SCI ou le RGO ?',
          ur: 'آئی بی ایس یا جرڈ جیسی آنتوں کی حالتوں کا سامنا کرنے کے لئے میں کیا اقدام اٹھا سکتا ہوں؟',
          de: 'Welche Schritte kann ich unternehmen, um gastrointestinale Erkrankungen wie Reizdarmsyndrom oder gastroösophagealen Reflux zu bewältigen?',
          ar: 'ما هي الخطوات التي يمكنني اتخاذها للتعامل مع حالات الجهاز الهضمي مثل القولون العصبي أو الارتجاع المعدي المريئي؟',
          bm: 'Langkah-langkah apakah yang boleh saya ambil untuk mengendalikan keadaan gastrointestinal seperti IBS atau GERD?',
          tr: 'IBS veya GERD gibi gastrointestinal koşullarla başa çıkmak için neler yapabilirim?',
          bn: 'আইবিএস বা জার্ডের মতো পেটের অবস্থার সাথে কিভাবে সম্পর্কিত দুশ্চিন্তা সম্পর্কে কি ধাপ নিতে পারি?',
        },
        answer: {
          en: 'Follow your dietary plan, carry any necessary medications, and avoid trigger foods.',
          fr: 'Suivez votre plan alimentaire, emportez tout médicament nécessaire et évitez les aliments déclencheurs.',
          ur: 'اپنی خوراک کی منصوبہ بندی کو پیروی کریں، ضروری دوائیں لے جائیں، اور ٹریگر کھانے سے بچیں۔',
          de: 'Befolgen Sie Ihren Ernährungsplan, nehmen Sie alle notwendigen Medikamente mit und vermeiden Sie Auslöse-Lebensmittel.',
          ar: 'اتبع خطة غذائك، واحمل أي أدوية ضرورية، وتجنب الأطعمة المثيرة.',
          bm: 'Ikuti rancangan diet anda, bawa sebarang ubat yang diperlukan, dan elakkan makanan pencetus.',
          tr: 'Diyet planınıza uyun, gerekli ilaçları yanınızda bulundurun ve tetikleyici yiyeceklerden kaçının.',
          bn: 'আপনার খাদ্য পরিকল্পনা অনুসরণ করুন, প্রয়োজনীয় ওষুধ নিয়ে নিন, এবং ট্রিগার খাবার এড়াতে বিরত থাকুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I manage my medications for a thyroid condition during Hajj?',
          fr: 'Comment puis-je gérer mes médicaments pour une condition thyroïdienne pendant le Hajj ?',
          ur: 'حج کے دوران اپنی تھائیرائیڈ کی حالت کے لیے میری دوائیوں کا انتظام کیسے کر سکتا ہوں؟',
          de: 'Wie kann ich meine Medikamente für eine Schilddrüsenerkrankung während der Hajj verwalten?',
          ar: 'كيف يمكنني إدارة أدويتي لحالة الغدة الدرقية خلال الحج؟',
          bm: 'Bagaimanakah saya boleh menguruskan ubat-ubatan saya untuk keadaan tiroid semasa Hajj?',
          tr: 'Hac sırasında tiroid durumu için ilaçlarımı nasıl yönetebilirim?',
          bn: 'হজ পালন করার সময় আমি কিভাবে থাইরোয়েড অবস্থার জন্য আমার ঔষধ ব্যবস্থাপনা করতে পারি?',
        },
        answer: {
          en: 'Carry enough medication for the duration of Hajj, manage your dosages carefully, and avoid missed doses.',
          fr: 'Emportez suffisamment de médicaments pour la durée du Hajj, gérez vos doses avec soin et évitez les doses manquées.',
          ur: 'حج کے دوران کافی دوائی لے جائیں، اپنے ڈوز کو با احتیاط منظم کریں، اور گمشدہ ڈوز سے بچیں۔',
          de: 'Nehmen Sie genug Medikamente für die Dauer der Hajj mit, verwalten Sie Ihre Dosierungen sorgfältig und vermeiden Sie verpasste Dosen.',
          ar: 'احمل كمية كافية من الأدوية لفترة الحج، وادارة جرعاتك بعناية، وتجنب الجرعات المفقودة.',
          bm: 'Bawa cukup ubat untuk tempoh Hajj, urus dos anda dengan berhati-hati, dan elakkan dos yang terlepas.',
          tr: 'Hac süresince yeterli miktarda ilaç taşıyın, dozlarınızı dikkatlice yönetin ve kaçırılmış dozları önleyin.',
          bn: 'হজের সময়কাল ধরে যতটুকু ঔষধ প্রয়োজন তা নিয়ে নিন, আপনার ডোজ সাবধানে পরিচালনা করুন, এবং অনুপস্থিত ডোজ এড়াতে বিরত থাকুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I know about managing multiple sclerosis (MS) during Hajj?',
          fr: 'Que dois-je savoir sur la gestion de la sclérose en plaques (SEP) pendant le Hajj ?',
          ur: 'حج کے دوران ملٹیپل سیکلروسس (ایم ایس) کا انتظام کرنے کے بارے میں میں کیا جاننا چاہئے؟',
          de: 'Was sollte ich über die Bewältigung von Multipler Sklerose (MS) während der Hajj wissen?',
          ar: 'ما الذي يجب أن أعرفه حول إدارة التصلب اللويحي (MS) خلال الحج؟',
          bm: 'Apa yang perlu saya ketahui tentang mengurus sklerosis berganda (MS) semasa Hajj?',
          tr: 'Hac sırasında multipl skleroz (MS) yönetimi hakkında ne bilmeliyim?',
          bn: 'হজ পালন করার সময় মাল্টিপল স্ক্লেরোসিস (এমএস) পরিচালনা সম্পর্কে আমার কী জানা উচিত?',
        },
        answer: {
          en: 'Stay hydrated, avoid extreme heat, and take medications as prescribed. Inform your group of your condition.',
          fr: 'Restez hydraté, évitez la chaleur extrême et prenez vos médicaments comme prescrits. Informez votre groupe de votre état.',
          ur: 'آپ پانی پئیں، انتہائی گرمی سے بچیں، اور طبیب کی ہدایات کے مطابق ادویات لیں۔ اپنے گروپ کو اپنی صحت کی صورتحال سے آگاہ کریں۔',
          de: 'Bleiben Sie hydratisiert, vermeiden Sie extreme Hitze und nehmen Sie die verordneten Medikamente ein. Informieren Sie Ihre Gruppe über Ihren Zustand.',
          ar: 'ابق رطبًا، وتجنب الحرارة الشديدة، وخذ الأدوية كما هو موصوف لك. أبلغ مجموعتك بحالتك.',
          bm: 'Kekalkan tahap penghidratan, elakkan haba melampau, dan ambil ubat seperti yang diarahkan. Maklumkan kepada kumpulan anda mengenai keadaan anda.',
          tr: 'Hidrate kalın, aşırı sıcaktan kaçının ve ilaçlarınızı reçeteye göre alın. Durumunuzu grubunuza bildirin.',
          bn: 'শরীর ভালভাবে জলযোগান রাখুন, চরম গরমের পরিবেশ এড়িয়ে চলুন, এবং নির্দেশ অনুযায়ী ওষুধ গ্রহণ করুন। আপনার অবস্থা সম্পর্কে আপনার দলকে অবহিত করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What precautions should be taken for people with severe allergies or anaphylaxis?',
          fr: "Quelles précautions doivent être prises pour les personnes souffrant d'allergies sévères ou d'anaphylaxie ?",
          ur: 'شدید الرجیوں یا اینافلیکسس کے شکار لوگوں کے لیے کیا احتیاطی تدابیر لینے چاہیئں؟',
          de: 'Welche Vorsichtsmaßnahmen sollten für Menschen mit schweren Allergien oder Anaphylaxie getroffen werden?',
          ar: 'ما هي الاحتياطات التي يجب اتخاذها للأشخاص الذين يعانون من حساسية شديدة أو حالة صدمة حادة؟',
          bm: 'Apakah langkah berjaga-jaga yang harus diambil untuk orang yang mengalami alahan teruk atau anafilaksis?',
          tr: 'Şiddetli alerjisi veya anafilaksisi olan kişiler için hangi önlemler alınmalıdır?',
          bn: 'তীব্র এলার্জি বা অ্যানাফাইলেক্সিসের সমস্যা রয়েছে এমন ব্যক্তিদের জন্য কি কি সতর্কতা অবলম্বন করা উচিত?',
        },
        answer: {
          en: 'Carry an epinephrine auto-injector (EpiPen), avoid allergens, and inform your companions about your condition.',
          fr: "Portez un auto-injecteur d'épinéphrine (EpiPen), évitez les allergènes et informez vos compagnons de votre état.",
          ur: 'ایپی نیفرین آٹو انجکٹر (ایپی پین) لے جائیں، اللرجنز سے بچیں، اور اپنے ساتھیوں کو اپنی صحت کی صورتحال سے آگاہ کریں۔',
          de: 'Tragen Sie einen Epinephrin-Autoinjektor (EpiPen) bei sich, vermeiden Sie Allergene und informieren Sie Ihre Begleiter über Ihren Zustand.',
          ar: 'احمل جهاز حقن الأدرينالين الذاتي (إبي بين)، وتجنب المواد المسببة للحساسية، وأبلغ رفاقك بحالتك.',
          bm: 'Bawa satu penyuntik epinefrin automatik (EpiPen), elakkan alergen, dan maklumkan kepada rakan-rakan anda tentang keadaan anda.',
          tr: 'Bir epinefrin otoenjektörü (EpiPen) taşıyın, alerjenlerden kaçının ve durumunuzu arkadaşlarınıza bildirin.',
          bn: 'একটি এপিনেফ্রিন অটো-ইনজেক্টর (এপিপেন) নিয়ে যান, এলার্জেন এড়িয়ে চলুন, এবং আপনার অবস্থা সম্পর্কে আপনার সঙ্গীদের অবহিত করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I manage sickle cell anemia or other blood disorders during Hajj?',
          fr: "Comment puis-je gérer la drépanocytose ou d'autres troubles sanguins pendant le Hajj ?",
          ur: 'میں حج کے دوران سکل سیل انیمیا یا دیگر خون کے امراض کا کیسے انتظام کر سکتا ہوں؟',
          de: 'Wie kann ich während der Hadsch eine Sichelzellenkrankheit oder andere Bluterkrankungen managen?',
          ar: 'كيف يمكنني التعامل مع فقر الدم المنجلي أو اضطرابات الدم الأخرى أثناء الحج؟',
          bm: 'Bagaimanakah saya boleh menguruskan anemia sel bergendala atau gangguan darah lain semasa Haji?',
          tr: 'Hac sırasında öküzürme (sickle cell anemia) veya diğer kan bozukluklarını nasıl yönetebilirim?',
          bn: 'হজ্জের সময় কীভাবে আমি থ্যালাসেমিয়া বা অন্যান্য রক্তজনিত রোগ পরিচালনা করতে পারি?',
        },
        answer: {
          en: 'Stay hydrated, avoid extreme temperatures, carry prescribed medications, and consult your doctor before traveling.',
          fr: 'Restez hydraté, évitez les températures extrêmes, emportez les médicaments prescrits et consultez votre médecin avant de voyager.',
          ur: 'آپ پانی پیئیں، انتہائی درجہ حرارت سے بچیں، تجویز کردہ ادویات ساتھ لے جائیں، اور سفر کرنے سے پہلے اپنے ڈاکٹر سے مشورہ کریں۔',
          de: 'Bleiben Sie hydratisiert, vermeiden Sie extreme Temperaturen, nehmen Sie die verschriebenen Medikamente mit und konsultieren Sie Ihren Arzt vor der Reise.',
          ar: 'ابق رطبًا، تجنب درجات الحرارة القصوى، احمل الأدوية الموصوفة، واستشر طبيبك قبل السفر.',
          bm: 'Kekalkan tahap penghidratan, elakkan suhu melampau, bawa ubat-ubatan yang diarahkan, dan berbincang dengan doktor anda sebelum melancong.',
          tr: 'Hidrate kalın, aşırı sıcaklıklardan kaçının, reçeteli ilaçlarınızı yanınızda bulundurun ve seyahat etmeden önce doktorunuza danışın.',
          bn: 'শরীর ভালভাবে জলযোগান রাখুন, চরম তাপমাত্রা এড়িয়ে চলুন, নির্দিষ্ট ওষুধগুলি সঙ্গে নিন এবং ভ্রমণের আগে আপনার চিকিৎসকের পরামর্শ নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Are there any specific preparations for people with HIV/AIDS?',
          fr: 'Y a-t-il des préparatifs spécifiques pour les personnes atteintes du VIH/sida ?',
          ur: 'کیا HIV/AIDS کے شکار افراد کے لیے کوئی خاص تیاریاں ہیں؟',
          de: 'Gibt es spezielle Vorbereitungen für Menschen mit HIV/AIDS?',
          ar: 'هل هناك إعدادات محددة للأشخاص المصابين بفيروس نقص المناعة البشرية/الإيدز؟',
          bm: 'Adakah sebarang persediaan khusus untuk orang yang menghidap HIV/AIDS?',
          tr: "HIV/AIDS'li kişiler için herhangi bir özel hazırlık var mı?",
          bn: 'HIV/এইডস রোগীদের জন্য কি কোনও বিশেষ প্রস্তুতি প্রয়োজন?',
        },
        answer: {
          en: 'Carry necessary medications, avoid exposure to infections, and maintain good hygiene.',
          fr: "Emportez les médicaments nécessaires, évitez l'exposition aux infections et maintenez une bonne hygiène.",
          ur: 'ضروری ادویات ساتھ لے جائیں، انفیکشنز سے بچیں، اور اچھی صفائی ستھرائی برقرار رکھیں۔',
          de: 'Nehmen Sie die notwendigen Medikamente mit, vermeiden Sie eine Exposition gegenüber Infektionen und halten Sie eine gute Hygiene aufrecht.',
          ar: 'احمل الأدوية الضرورية، وتجنب التعرض للعدوى، وحافظ على النظافة الجيدة.',
          bm: 'Bawa ubat-ubatan yang diperlukan, elakkan pendedahan kepada jangkitan, dan kekalkan kebersihan yang baik.',
          tr: 'Gerekli ilaçları yanınıza alın, enfeksiyonlara maruz kalmaktan kaçının ve iyi bir hijyen sağlayın.',
          bn: 'প্রয়োজনীয় ওষুধগুলি সঙ্গে নিন, সংক্রমণের সম্মুখীন হওয়া এড়িয়ে চলুন এবং ভাল স্বাস্থ্যবিধি বজায় রাখুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I prepare for Hajj if I have chronic obstructive pulmonary disease (COPD)?',
          fr: "Comment puis-je me préparer pour le Hajj si j'ai une maladie pulmonaire obstructive chronique (MPOC) ?",
          ur: 'اگر میں کرونک آبسٹرکٹو پلمونری ڈزآرڈر (سی او پی ڈی) کا شکار ہوں تو میں حج کے لیے کس طرح تیاری کر سکتا ہوں؟',
          de: 'Wie kann ich mich auf die Hadsch vorbereiten, wenn ich eine chronisch obstruktive Lungenerkrankung (COPD) habe?',
          ar: 'كيف يمكنني الاستعداد للحج إذا كنت مصابًا بمرض انسداد الشعب الهوائية المزمن (COPD)؟',
          bm: 'Bagaimanakah saya boleh membuat persediaan untuk Haji jika saya menghidap penyakit paru-paru obstruktif kronik (COPD)?',
          tr: 'Kronik obstrüktif akciğer hastalığına (KOAH) sahipsem Hac için nasıl hazırlanabilirim?',
          bn: 'যদি আমি ক্রনিক অবস্ট্রাকটিভ পালমোনারি ডিজিজ (কোপড) রোগে ভুগি তাহলে হজ্জের জন্য কিভাবে প্রস্তুত হব?',
        },
        answer: {
          en: 'Use prescribed inhalers, avoid crowded and dusty areas, and stay hydrated.',
          fr: 'Utilisez les inhalateurs prescrits, évitez les endroits bondés et poussiéreux, et restez hydraté.',
          ur: 'تجویز کردہ انہیلرز استعمال کریں، بھیڑ بھاڑ اور گرد آلود علاقوں سے بچیں، اور آپ پانی پیتے رہیں۔',
          de: 'Verwenden Sie die verschriebenen Inhalatoren, meiden Sie überfüllte und staubige Bereiche und bleiben Sie hydriert.',
          ar: 'استخدم أجهزة الاستنشاق الموصوفة، وتجنب المناطق المزدحمة والمليئة بالغبار، وابق رطبًا.',
          bm: 'Gunakan inhaler seperti yang diarahkan, elakkan kawasan sesak dan berdebu, dan kekalkan tahap penghidratan.',
          tr: "Reçeteli inhaler'leri kullanın, kalabalık ve tozlu alanlardan kaçının ve hidrate kalın.",
          bn: 'নির্দিষ্ট ইনহেলার ব্যবহার করুন, ভিড় ও ধূলোবালির এলাকা এড়িয়ে চলুন এবং শরীর ভালভাবে জলযোগান রাখুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How should I manage lupus during Hajj?',
          fr: 'Comment dois-je gérer le lupus pendant le Hajj ?',
          ur: 'مجھے حج کے دوران لپس کا کیسے انتظام کرنا چاہیے؟',
          de: 'Wie sollte ich während der Hadsch mit Lupus umgehen?',
          ar: 'كيف ينبغي لي التعامل مع الذئبة أثناء الحج؟',
          bm: 'Bagaimanakah saya harus menguruskan lupus semasa Haji?',
          tr: 'Hac sırasında lupusu nasıl yönetmeliyim?',
          bn: 'হজ্জের সময় আমি কীভাবে লুপাস রোগ পরিচালনা করব?',
        },
        answer: {
          en: 'Seek medical clearance, take prescribed medications, and avoid excessive sun exposure.',
          fr: "Obtenez l'autorisation médicale, prenez les médicaments prescrits et évitez une exposition excessive au soleil.",
          ur: 'طبی کلیئرنس حاصل کریں، تجویز کردہ ادویات لیں، اور زیادہ دھوپ میں جانے سے گریز کریں۔',
          de: 'Holen Sie die ärztliche Freigabe ein, nehmen Sie die verschriebenen Medikamente und vermeiden Sie übermäßige Sonnenbestrahlung.',
          ar: 'احصل على إذن طبي، وتناول الأدوية الموصوفة، وتجنب التعرض المفرط لأشعة الشمس.',
          bm: 'Dapatkan kebenaran perubatan, ambil ubat-ubatan yang diarahkan, dan elakkan pendedahan berlebihan kepada cahaya matahari.',
          tr: 'Tıbbi onay alın, reçeteli ilaçlarınızı kullanın ve aşırı güneş ışığına maruz kalmaktan kaçının.',
          bn: 'চিকিত্সা অনুমোদন নিন, নির্দিষ্ট ওষুধগুলি গ্রহণ করুন এবং অতিরিক্ত সৌর আলোর সম্মুখীন হওয়া এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I have had a recent surgery and am planning to perform Hajj?',
          fr: "Que dois-je faire si j'ai subi une chirurgie récente et que je prévois de faire le Hajj ?",
          ur: 'اگر میری حال ہی میں سرجری ہوئی ہے اور میں حج کرنے کا ارادہ رکھتا ہوں تو مجھے کیا کرنا چاہئے؟',
          de: 'Was soll ich tun, wenn ich kürzlich operiert wurde und plane, den Hadsch zu machen?',
          ar: 'ماذا يجب أن أفعل إذا كنت قد أجريت عملية جراحية مؤخرًا وأخطط لأداء الحج؟',
          bm: 'Apa yang perlu saya lakukan jika saya baru menjalani pembedahan dan merancang untuk menunaikan Haji?',
          tr: 'Yakın zamanda bir ameliyat geçirdiysem ve Hac yapmayı planlıyorsam ne yapmalıyım?',
          bn: 'যদি আমার সাম্প্রতিককালে অস্ত্রোপচার হয়ে থাকে এবং আমি হজ্জ পালন করার পরিকল্পনা করি, তাহলে কী করা উচিত?',
        },
        answer: {
          en: 'Consult with your surgeon, take it easy, and avoid activities that may strain your recent surgical site.',
          fr: 'Consultez votre chirurgien, prenez-le doucement et évitez les activités qui pourraient solliciter votre site chirurgical récent.',
          ur: 'اپنے سرجن سے مشورہ کریں، آرام کریں، اور ایسی سرگرمیوں سے پرہیز کریں جو آپ کی حالیہ سرجری کی جگہ پر دباؤ ڈال سکتی ہیں۔',
          de: 'Konsultieren Sie Ihren Chirurgen, gehen Sie es ruhig an und vermeiden Sie Aktivitäten, die Ihre kürzliche Operationsstelle belasten könnten.',
          ar: 'استشر جراحك، خذ الأمور ببساطة، وتجنب الأنشطة التي قد تجهد موقع الجراحة الأخير.',
          bm: 'Berunding dengan pakar bedah anda, berehat, dan elakkan aktiviti yang boleh memberi tekanan pada kawasan pembedahan anda yang baru.',
          tr: 'Cerrahınıza danışın, rahatlayın ve ameliyat yerinizi zorlayabilecek aktivitelerden kaçının.',
          bn: 'আপনার সার্জনের সাথে পরামর্শ করুন, ধীরে চলুন এবং এমন কার্যকলাপ এড়িয়ে চলুন যা আপনার সাম্প্রতিক সার্জিকাল সাইটে চাপ সৃষ্টি করতে পারে।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I handle my dietary restrictions due to celiac disease?',
          fr: 'Comment puis-je gérer mes restrictions alimentaires dues à la maladie cœliaque ?',
          ur: 'میں سیلیک بیماری کی وجہ سے اپنی غذائی پابندیوں کو کیسے سنبھال سکتا ہوں؟',
          de: 'Wie kann ich meine diätetischen Einschränkungen aufgrund von Zöliakie handhaben?',
          ar: 'كيف يمكنني التعامل مع قيود النظام الغذائي بسبب مرض الاضطرابات الهضمية؟',
          bm: 'Bagaimanakah saya boleh mengendalikan sekatan pemakanan saya kerana penyakit seliak?',
          tr: 'Çölyak hastalığı nedeniyle diyet kısıtlamalarımı nasıl yönetebilirim?',
          bn: 'সিলিয়াক রোগের কারণে আমার খাদ্য সীমাবদ্ধতা কীভাবে পরিচালনা করতে পারি?',
        },
        answer: {
          en: 'Carry gluten-free food options, avoid cross-contamination, and read food labels carefully.',
          fr: 'Emportez des options alimentaires sans gluten, évitez la contamination croisée et lisez attentivement les étiquettes des aliments.',
          ur: 'گلوٹین سے پاک غذائی اختیارات اپنے ساتھ رکھیں، کراس کنٹامینیشن سے بچیں، اور کھانے کے لیبلز کو احتیاط سے پڑھیں۔',
          de: 'Tragen Sie glutenfreie Lebensmittel mit sich, vermeiden Sie Kreuzkontaminationen und lesen Sie die Lebensmitteletiketten sorgfältig.',
          ar: 'احمل خيارات الطعام الخالية من الغلوتين، وتجنب التلوث المتبادل، واقرأ ملصقات الطعام بعناية.',
          bm: 'Bawa makanan tanpa gluten, elakkan pencemaran silang, dan baca label makanan dengan teliti.',
          tr: 'Glütensiz gıda seçenekleri taşıyın, çapraz bulaşmayı önleyin ve gıda etiketlerini dikkatlice okuyun.',
          bn: 'গ্লুটেন-মুক্ত খাবারের বিকল্প বহন করুন, ক্রস-দূষণ এড়িয়ে চলুন এবং খাবারের লেবেলগুলি সাবধানে পড়ুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I handle menopause symptoms during the pilgrimage?',
          fr: 'Comment puis-je gérer les symptômes de la ménopause pendant le pèlerinage ?',
          ur: 'میں حج کے دوران رجونورتی کی علامات کو کیسے سنبھال سکتی ہوں؟',
          de: 'Wie kann ich die Symptome der Menopause während der Pilgerreise bewältigen?',
          ar: 'كيف يمكنني التعامل مع أعراض انقطاع الطمث أثناء الحج؟',
          bm: 'Bagaimanakah saya boleh mengendalikan gejala menopaus semasa menunaikan ibadah haji?',
          tr: 'Hac sırasında menopoz semptomlarıyla nasıl başa çıkabilirim?',
          bn: 'তীর্থযাত্রার সময় কীভাবে মেনোপজের উপসর্গগুলি পরিচালনা করতে পারি?',
        },
        answer: {
          en: 'Stay cool, hydrated, and use fans or cooling towels. Carry menopause medications if needed.',
          fr: 'Restez au frais, hydratez-vous et utilisez des ventilateurs ou des serviettes rafraîchissantes. Emportez des médicaments pour la ménopause si nécessaire.',
          ur: 'ٹھنڈا رہیں، ہائیڈریٹ رہیں، اور پنکھے یا کولنگ تولیے استعمال کریں۔ اگر ضروری ہو تو رجونورتی کی ادویات ساتھ رکھیں۔',
          de: 'Bleiben Sie kühl, hydratisieren Sie sich und verwenden Sie Ventilatoren oder Kühlhandtücher. Tragen Sie bei Bedarf Medikamente gegen die Wechseljahre bei sich.',
          ar: 'ابقى بارداً ورطب جسمك واستخدم المراوح أو المناشف المبردة. احمل أدوية انقطاع الطمث إذا لزم الأمر.',
          bm: 'Kekal sejuk, terhidrat, dan gunakan kipas atau tuala penyejuk. Bawa ubat menopaus jika diperlukan.',
          tr: 'Serin kalın, bol su için ve fan veya soğutucu havlular kullanın. Gerekirse menopoz ilaçları taşıyın.',
          bn: 'ঠান্ডা থাকুন, জল পান করুন এবং ফ্যান বা কুলিং টাওয়েল ব্যবহার করুন। প্রয়োজন হলে মেনোপজের ওষুধ সঙ্গে রাখুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What’s the best way to store and use feminine hygiene products?',
          fr: "Quelle est la meilleure façon de stocker et d'utiliser les produits d'hygiène féminine ?",
          ur: 'خواتین کی صفائی کے مصنوعات کو ذخیرہ کرنے اور استعمال کرنے کا بہترین طریقہ کیا ہے؟',
          de: 'Was ist der beste Weg, um Damenhygieneprodukte zu lagern und zu verwenden?',
          ar: 'ما هي أفضل طريقة لتخزين واستخدام منتجات النظافة النسائية؟',
          bm: 'Apakah cara terbaik untuk menyimpan dan menggunakan produk kebersihan wanita?',
          tr: 'Kadın hijyen ürünlerini saklamanın ve kullanmanın en iyi yolu nedir?',
          bn: 'নারীস্বাস্থ্য সম্পর্কিত পণ্য সংরক্ষণ এবং ব্যবহারের সেরা উপায় কী?',
        },
        answer: {
          en: 'Store in a cool, dry place, use sealed bags for disposal, and change them regularly.',
          fr: "Stockez-les dans un endroit frais et sec, utilisez des sacs scellés pour l'élimination et changez-les régulièrement.",
          ur: 'انہیں ٹھنڈے اور خشک جگہ میں رکھیں، انخلاف کے لیے محفوظ بیگ استعمال کریں، اور انہیں باقاعدہ طور پر تبدیل کریں۔',
          de: 'Lagern Sie sie an einem kühlen, trockenen Ort, verwenden Sie versiegelte Taschen zur Entsorgung und wechseln Sie sie regelmäßig.',
          ar: 'قم بتخزينها في مكان بارد وجاف، استخدم الأكياس المختومة للتخلص منها، وغيرها بانتظام.',
          bm: 'Simpan di tempat yang sejuk dan kering, gunakan beg yang dipersempit untuk pembuangan, dan tukar secara berkala.',
          tr: 'Serin, kuru bir yerde saklayın, imha için mühürlü çantalar kullanın ve düzenli olarak değiştirin.',
          bn: 'শীতল, শুষ্ক জায়গায় সংরক্ষণ করুন, নিস্তারণের জন্য সিলড ব্যাগ ব্যবহার করুন এবং নিয়মিতভাবে পরিবর্তন করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I manage polycystic ovary syndrome (PCOS) symptoms during Hajj?',
          fr: 'Comment puis-je gérer les symptômes du syndrome des ovaires polykystiques (SOPK) pendant le Hajj ?',
          ur: 'حج کے دوران پولی سسٹک اوواری سنڈروم (پی سی او ایس) کے علامات کیسے کنٹرول کیے جا سکتے ہیں؟',
          de: 'Wie kann ich während der Hadsch-Symptome des polyzystischen Ovarialsyndroms (PCOS) behandeln?',
          ar: 'كيف يمكنني التعامل مع أعراض متلازمة المبايض المتعددة الكيسات (PCOS) أثناء الحج؟',
          bm: 'Bagaimanakah saya boleh menguruskan gejala sindrom ovari polikistik (PCOS) semasa Haji?',
          tr: 'Hac sırasında polikistik over sendromu (PCOS) semptomlarını nasıl yönetebilirim?',
          bn: 'হজে পলিসিস্টিক ওভারি সিন্ড্রোম (পিসিওএস) লক্ষণগুলি কীভাবে পরিচালনা করা যাবে?',
        },
        answer: {
          en: 'Monitor symptoms, take prescribed medications, and rest frequently.',
          fr: 'Surveillez les symptômes, prenez les médicaments prescrits et reposez-vous fréquemment.',
          ur: 'علامات کی نگرانی کریں، مقرر کی گئی دوائیاں استعمال کریں، اور بار بار آرام کریں۔',
          de: 'Überwachen Sie die Symptome, nehmen Sie verschriebene Medikamente ein und ruhen Sie sich häufig aus.',
          ar: 'راقب الأعراض، وتناول الأدوية الموصوفة، واسترح بانتظام.',
          bm: 'Pantau gejala, ambil ubat yang ditetapkan, dan berehat secara kerap.',
          tr: 'Semptomları izleyin, reçete edilen ilaçları alın ve sık sık dinlenin.',
          bn: 'লক্ষণগুলি মনিটর করুন, প্রেস্ক্রাইব করা ঔষধ নিন, এবং প্রায়শই বিশ্রাম নিন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Are there any specific health concerns for women over the age of 50?',
          fr: 'Y a-t-il des préoccupations de santé spécifiques pour les femmes de plus de 50 ans?',
          ur: '50 سال سے زیادہ عمر کی خواتین کے لیے کوئی خاص صحت کی پریشانیاں ہیں؟',
          de: 'Gibt es spezifische Gesundheitsprobleme für Frauen über 50?',
          ar: 'هل هناك أي مخاوف صحية محددة للنساء فوق سن الخمسين؟',
          bm: 'Adakah sebarang kebimbangan kesihatan khusus untuk wanita berusia 50 tahun ke atas?',
          tr: '50 yaşın üzerindeki kadınlar için belirli sağlık endişeleri var mı?',
          bn: '৫০ বছরের বেশী বয়সী মহিলাদের জন্য কোনও বিশেষ স্বাস্থ্য সমস্যা আছে?',
        },
        answer: {
          en: 'Women over 50 should monitor chronic conditions, stay hydrated, and take regular medications as prescribed.',
          fr: 'Les femmes de plus de 50 ans doivent surveiller les conditions chroniques, rester hydratées et prendre régulièrement les médicaments prescrits.',
          ur: '50 سال سے زیادہ عمر کی خواتین کو مزیدہ حالتوں کی نگرانی کرنی چاہئے، ہائیڈریٹ رہنا چاہئے، اور مقرر کردہ ادویات کو باقاعدگی سے استعمال کرنا چاہئے۔',
          de: 'Frauen über 50 sollten chronische Erkrankungen überwachen, ausreichend Flüssigkeit zu sich nehmen und regelmäßig die verschriebenen Medikamente einnehmen.',
          ar: 'يجب على النساء اللاتي تجاوزن سن الخمسين مراقبة الحالات المزمنة والبقاء مترطبات وتناول الأدوية بانتظام حسب التوصية.',
          bm: 'Wanita berusia 50 tahun ke atas perlu memantau keadaan kronik, kekal hidrasi, dan mengambil ubat-ubatan secara berkala seperti yang ditetapkan.',
          tr: '50 yaşın üzerindeki kadınlar kronik durumları izlemeli, hidrasyonlarını sağlamalı ve reçete edilen düzenli ilaçları almalıdır.',
          bn: '৫০ বছরের বেশী বয়সী মহিলারা ক্রনিক অবস্থার নজর রাখতে হবে, তরল অবস্থায় থাকতে হবে এবং নির্ধারিত নিয়মে ঔষধ গ্রহণ করতে হবে।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I ensure adequate nutrition if I am pregnant or breastfeeding?',
          fr: "Comment puis-je m'assurer une nutrition adéquate si je suis enceinte ou si j'allaite?",
          ur: 'اگر میں حاملہ ہوں یا دودھ پلانے والی ماں ہوں تو میں کیسے یقینی بناؤں کہ میری غذائیت کافی ہے؟',
          de: 'Wie kann ich eine ausreichende Ernährung sicherstellen, wenn ich schwanger bin oder stille?',
          ar: 'كيف يمكنني ضمان التغذية الكافية إذا كنت حامل أو أرضع؟',
          bm: 'Bagaimanakah saya boleh memastikan pemakanan yang mencukupi jika saya hamil atau menyusukan?',
          tr: 'Hamile ya da emziriyorsam yeterli beslenmeyi nasıl sağlayabilirim?',
          bn: 'আমি যদি গর্ভবতী বা স্ত্রীত্বাধীন হই, তাহলে কিভাবে নিশ্চিত করবো যে আমার পুরোপুরি পুষ্টিগুলি পাচ্ছে?',
        },
        answer: {
          en: 'Eat a balanced diet, carry nutritional supplements, and stay hydrated.',
          fr: 'Mangez un régime équilibré, emportez des suppléments nutritionnels et restez hydraté.',
          ur: 'متوازن غذا کھائیں، غذائیتی مکملات ساتھ رکھیں، اور ہائیڈریٹ رہیں۔',
          de: 'Essen Sie eine ausgewogene Ernährung, tragen Sie Nahrungsergänzungsmittel bei sich und bleiben Sie hydratisiert.',
          ar: 'تناول النظام الغذائي المتوازن، واحمل المكملات الغذائية، وابقَ مترطبًا.',
          bm: 'Makan makanan seimbang, bawa supplement pemakanan, dan kekal dihidrasi.',
          tr: 'Dengeli bir diyet yiyin, besin takviyeleri taşıyın ve hidrasyonunuzu koruyun.',
          bn: 'একটি বিন্যাসিত খাদ্য গ্রহণ করুন, পুষ্টি সাপ্লিমেন্ট বাহিয়ে নিন, এবং সঠিক পরিমাণে পানি খাওয়ান।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What should I do if I experience pregnancy complications during Hajj?',
          fr: 'Que dois-je faire si je rencontre des complications pendant ma grossesse pendant le Hajj?',
          ur: 'اگر حج کے دوران میرے حمل میں پیچیدگیاں آئیں تو میں کیا کرنا چاہئے؟',
          de: 'Was soll ich tun, wenn ich während der Hadsch Schwangerschaftskomplikationen habe?',
          ar: 'ماذا يجب أن أفعل إذا واجهت مضاعفات الحمل أثناء الحج؟',
          bm: 'Apa yang harus saya lakukan jika saya mengalami komplikasi kehamilan semasa Haji?',
          tr: 'Hac sırasında hamilelik komplikasyonları yaşarsam ne yapmalıyım?',
          bn: 'হজে গর্ভাবস্থায় সমস্যা অনুভব করলে আমি কী করব?',
        },
        answer: {
          en: 'Seek immediate medical help, rest, and avoid physical strain.',
          fr: "Demandez immédiatement de l'aide médicale, reposez-vous et évitez les efforts physiques.",
          ur: 'فوری طبی مدد حاصل کریں، آرام کریں، اور جسمانی زحمت سے بچیں۔',
          de: 'Suchen Sie sofort medizinische Hilfe, ruhen Sie sich aus und vermeiden Sie körperliche Belastung.',
          ar: 'ابحث عن المساعدة الطبية على الفور، واسترح، وتجنب الإجهاد الجسدي.',
          bm: 'Minta bantuan perubatan dengan segera, berehat, dan elakkan tekanan fizikal.',
          tr: 'Hemen tıbbi yardım arayın, dinlenin ve fiziksel zorlanmadan kaçının.',
          bn: 'তাৎক্ষণিকভাবে চিকিৎসা প্রাপ্ত করুন, বিশ্রাম নিন, এবং শারীরিক চাপ এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I manage back pain or discomfort during pregnancy?',
          fr: 'Comment puis-je gérer les douleurs ou les inconforts dorsaux pendant la grossesse?',
          ur: 'حمل کے دوران کمر درد یا بے چینی کو کیسے کنٹرول کیا جا سکتا ہے؟',
          de: 'Wie kann ich Rückenschmerzen oder Unbehagen während der Schwangerschaft bewältigen?',
          ar: 'كيف يمكنني التعامل مع آلام الظهر أو الانزعاج أثناء الحمل؟',
          bm: 'Bagaimana saya boleh menguruskan sakit belakang atau ketidakselesaan semasa hamil?',
          tr: 'Hamilelikte sırt ağrısı veya rahatsızlık nasıl yönetilebilir?',
          bn: 'গর্ভাবস্থায় কিভাবে পিঠ ব্যথা বা অসুবিধা ব্যবস্থাপনা করা যায়?',
        },
        answer: {
          en: 'Use supportive shoes, take regular breaks, and practice gentle stretching exercises.',
          fr: "Utilisez des chaussures de soutien, prenez des pauses régulières et pratiquez des exercices d'étirement doux.",
          ur: 'سہارا دینے والے جوتے استعمال کریں، باقاعدہ وقفے لیں، اور نرم مساج ورزش کریں۔',
          de: 'Verwenden Sie stützende Schuhe, machen Sie regelmäßige Pausen und üben Sie sanfte Dehnübungen aus.',
          ar: 'استخدم الأحذية الداعمة، وخذ فترات استراحة منتظمة، ومارس تمارين التمدد اللطيفة.',
          bm: 'Gunakan kasut sokongan, ambil istirahat secara berkala, dan amalkan senaman regangan yang lembut.',
          tr: 'Destekleyici ayakkabılar giyin, düzenli aralar verin ve hafif esneme egzersizleri yapın.',
          bn: 'সাপোর্টিভ জুতা ব্যবহার করুন, নিয়মিত বিরতি নিন, এবং নরম স্ট্রেচিং ব্যায়াম করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'Are there facilities for childbirth in emergencies?',
          fr: "Y a-t-il des installations pour l'accouchement en cas d'urgence?",
          ur: 'کیا ضرورت کی صورت میں ولادت کے لیے سہولت فراہم ہے؟',
          de: 'Gibt es Einrichtungen für die Entbindung in Notfällen?',
          ar: 'هل هناك مرافق للولادة في حالات الطوارئ؟',
          bm: 'Adakah kemudahan untuk bersalin dalam kecemasan?',
          tr: 'Acil durumlarda doğum için tesisler var mı?',
          bn: 'জরুরী অবস্থায় শিশুত্বের জন্য সুবিধা আছে কি?',
        },
        answer: {
          en: 'Yes, there are emergency medical facilities available for childbirth.',
          fr: "Oui, il existe des installations médicales d'urgence disponibles pour l'accouchement.",
          ur: 'جی ہاں، ولادت کے لیے ایمرجنسی طبی سہولتیں موجود ہیں۔',
          de: 'Ja, es gibt Notfallmedizinische Einrichtungen für die Entbindung.',
          ar: 'نعم، هناك مرافق طبية للولادة في حالات الطوارئ.',
          bm: 'Ya, terdapat kemudahan perubatan kecemasan yang tersedia untuk bersalin.',
          tr: 'Evet, doğum için acil tıbbi tesisler mevcuttur.',
          bn: 'হ্যাঁ, জরুরী শিশুত্বের জন্য মেডিকেল সুবিধা প্রাপ্ত।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'What are the local laws and customs regarding women’s health and safety?',
          fr: 'Quelles sont les lois et les coutumes locales concernant la santé et la sécurité des femmes?',
          ur: 'خواتین کی صحت اور محفوظت کے بارے میں مقامی قوانین اور رسومات کیا ہیں؟',
          de: 'Was sind die lokalen Gesetze und Bräuche in Bezug auf die Gesundheit und Sicherheit von Frauen?',
          ar: 'ما هي القوانين والعادات المحلية المتعلقة بصحة وسلامة النساء؟',
          bm: 'Apakah undang-undang dan adat tempatan mengenai kesihatan dan keselamatan wanita?',
          tr: 'Kadınların sağlık ve güvenliğiyle ilgili yerel yasalar ve gelenekler nelerdir?',
          bn: 'নারীদের স্বাস্থ্য ও নিরাপত্তার সাথে সম্পর্কিত স্থানীয় আইন এবং ঐতিহাসিক কি?',
        },
        answer: {
          en: 'Familiarize yourself with local customs, dress modestly, and follow local health and safety guidelines.',
          fr: 'Familiarisez-vous avec les coutumes locales, habillez-vous modestement et suivez les directives locales en matière de santé et de sécurité.',
          ur: 'مقامی رسومات سے واقف ہوں، معمولی طریقے سے لباس پہنیں، اور مقامی صحت اور حفاظتیہ ہدایات کا اتباع کریں۔',
          de: 'Machen Sie sich mit den örtlichen Bräuchen vertraut, kleiden Sie sich bescheiden und befolgen Sie die örtlichen Gesundheits- und Sicherheitsrichtlinien.',
          ar: 'تعرف على العادات المحلية، والبس بشكل متواضع، واتبع الإرشادات المحلية للصحة والسلامة.',
          bm: 'Kenali adat tempatan, berpakaian secara sederhana, dan ikuti garis panduan kesihatan dan keselamatan tempatan.',
          tr: 'Yerel adetlere aşina olun, mütevazı bir şekilde giyinin ve yerel sağlık ve güvenlik yönergelerini izleyin.',
          bn: 'স্থানীয় ঐতিহাসিক সাথে পরিচিত হন, মধ্যম ধরনের পোশাক পরেন, এবং স্থানীয় স্বাস্থ্য এবং নিরাপত্তা নির্দেশিকা অনুসরণ করুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {
          en: 'How can I stay hydrated and avoid heatstroke while pregnant?',
          fr: 'Comment puis-je rester hydraté et éviter les coups de chaleur pendant la grossesse?',
          ur: 'حمل کے دوران کیسے آپ خود کو ہائیڈریٹ رکھ سکتے ہیں اور لو ہیٹ سٹروک سے بچ سکتے ہیں؟',
          de: 'Wie kann ich während der Schwangerschaft hydriert bleiben und einen Hitzschlag vermeiden?',
          ar: 'كيف يمكنني البقاء مترطبًا وتجنب الإغماء الحراري أثناء الحمل؟',
          bm: 'Bagaimana saya boleh kekal dihidrasi dan mengelakkan stroke haba semasa hamil?',
          tr: 'Hamileyken hidrasyonu nasıl sağlar ve sıcak çarpmasını nasıl önlerim?',
          bn: 'গর্ভধারণ করার সময় আমি কিভাবে জলবায়ুশীতল থাকব এবং হিটস্ট্রোক থেকে বিরতি নিব?',
        },
        answer: {
          en: 'Drink water frequently, rest in shaded or air-conditioned areas, and avoid peak sun hours.',
          fr: "Buvez de l'eau fréquemment, reposez-vous dans des zones ombragées ou climatisées, et évitez les heures de forte chaleur.",
          ur: 'بار بار پانی پیئیں، سائے دار یا ایئر کنڈیشنڈ علاقوں میں آرام کریں، اور زیادہ دھوپ کے وقت سے بچیں۔',
          de: 'Trinken Sie häufig Wasser, ruhen Sie sich in schattigen oder klimatisierten Bereichen aus und vermeiden Sie die Spitzenzeiten der Sonne.',
          ar: 'اشرب الماء بانتظام، واسترح في المناطق المظللة أو المكيفة، وتجنب ساعات الشمس الذروة.',
          bm: 'Minum air secara kerap, berehat di kawasan berbayang atau berhawa dingin, dan elakkan jam matahari puncak.',
          tr: 'Sık sık su için, gölgeli veya klima alanlarda dinlenin ve güneşin en sıcak saatlerinden kaçının.',
          bn: 'পানি প্রায়ই খান, ছায়াযুক্ত বা এয়ার-কন্ডিশনযুক্ত এলাকায় বিশ্রাম নিন, এবং সেরা সূর্যের সময় এড়িয়ে চলুন।',
        },
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
      {
        category: {
          en: 'Hajj',
          fr: 'Hajj',
          ud: 'حج',
          de: 'Haddsch',
          ar: 'الحج',
          bm: 'Haji',
          tr: 'Hac',
          bn: 'হজ্জ',
        },
        question: {},
        answer: {},
      },
    ];
    setPredefinedQuestions([]);
  };

  useEffect(() => {
    getQuestions();
  }, []);

  function filterSuggestions(input, allQuestions) {
    if (!allQuestions || !Array.isArray(allQuestions)) {
      return [];
    }

    const keyword = input.trim().toLowerCase();

    // If the keyword is an empty string, return all questions
    if (keyword === '') {
      return allQuestions;
    }

    // Escape the keyword to safely use it in a regex
    const escapedKeyword = decodeURIComponent(keyword).replace(
      /[-/\\^$*+?.()|[\]{}]/g,
      '\\$&'
    );
    const regex = new RegExp(`${escapedKeyword}`, 'g');

    // 'i' for case-insensitive match
    // console.log('Input:', input);
    // console.log('Escaped Keyword:', escapedKeyword);
    // console.log('Regex:', regex);

    return allQuestions.filter((question) => {
      const questionText = decodeURIComponent(
        question?.question[currentLanguage]
      )?.toLowerCase();
      //   console.log('Question:', question);
      const match = regex.test(questionText);
      //   console.log('Matches:', match);
      return match;
    });
  }

  const handleAnswerGet = async (questionP) => {
    setAnswer(questionP);
    setAnswerBox(true);
    setSuggestions([]);
  };

  console.log('bg images', bgImage);

  const hanleCloseClick = () => {
    setAnswerBox(false);
    setAnswer({});
    setUserInput('');
    setSuggestionLinks(true);
  };

  const arrived = predefinedQuestions.length > 0;
  if (arrived) {
    console.log(predefinedQuestions);
  } else {
    console.log('not arrived');
  }

  async function handleSubmitOpenAi(e, propmts) {
    e.preventDefault();

    console.log('prompts', propmts);

    // API.post('/api/chat', { inputText: userInput || propmts?.description, lang: currentLanguage });
    if (suggesstions?.length) return;
    // clear streaming message
    setStreamingMessage({
      id: 'Thinking...',
      role: 'assistant',
      content: '_Thinking..._',
      createdAt: new Date(),
    });

    // add busy indicator
    setIsLoading(true);

    // add user message to list of messages
    messageId.current++;
    setMessages([
      ...messages,
      {
        id: messageId.current.toString(),
        role: 'user',
        content: userInput || propmts?.description,
        createdAt: new Date(),
      },
    ]);
    setUserInput('');

    // post new message to server and stream OpenAI Assistant response
    const response = await fetch('/api/openai-assistant', {
      method: 'POST',
      body: JSON.stringify({
        assistantId: assistantId,
        threadId: threadId,
        content: decodeURIComponent(userInput || propmts?.description),
      }),
    });

    if (!response.body) {
      return;
    }
    const runner = AssistantStream.fromReadableStream(response.body);

    runner.on('messageCreated', (message) => {
      setThreadId(message.thread_id);
    });

    runner.on('textDelta', (_delta, contentSnapshot) => {
      const newStreamingMessage = {
        ...streamingMessage,
        content: contentSnapshot.value,
      };
      setStreamingMessage(newStreamingMessage);
    });

    runner.on('messageDone', (message) => {
      //   console.log(message, 'messagemessagemessage');
      // get final message content
      const finalContent =
        message.content[0].type == 'text' ? message.content[0].text.value : '';

      // add assistant message to list of messages
      messageId.current++;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...message,
          id: messageId.current.toString(),
          role: 'assistant',
          content: finalContent,
          createdAt: new Date(),
        },
      ]);
      if (finalContent) {
        API.post('/api/chat', {
          responseText: finalContent,
          inputText: userInput || propmts?.description,
          lang: currentLanguage,
          location: localStorage.getItem('location') || '',
        });
      }

      // remove busy indicator
      setIsLoading(false);
    });

    runner.on('error', (error) => {
      console.error(error);
    });
  }

  const handleSelectQuestion = (e, prompt) => {
    // setUserInput(prompt?.description);
    handleSubmitOpenAi(e, prompt);
  };

  // handles changes to the prompt input field
  function handlePromptChange(e) {
    hanleCloseClick();
    // console.log(window.gtag)
    // Send event to Google Analytics
    if (window?.gtag) {
      window.gtag('event', 'chat_input', {
        event_category: 'chat-input-prompt-category',
        event_label: decodeURIComponent(e.target.value),
        value: 1,
      });
    }
    setUserInput(decodeURIComponent(e.target.value));
    if (e.target.value) {
      const filtered = filterSuggestions(
        decodeURIComponent(e.target.value),
        predefinedQuestions
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }

  const isRtl =
    currentLanguage === 'ar' ||
    currentLanguage === 'ud' ||
    currentLanguage === 'fs';

  return (
    <>
      <div
        className="flex flex-col items-center relative w-full px-12 md:px-0 bg-transparent"
        dir={isRtl ? 'rtl' : 'ltr'}
        // style={{background: `url(${bgImage.src})`}}
      >
        {/* <HealthcareSelector
          handleSelectQuestion={(e, prompt) => handleSelectQuestion(e, prompt)}
        /> */}

        {selectedOption ? null : (
          <div className="">
            <p className="flex items-center gap-2">
              {instructions.selectButton[currentLanguage]}
            </p>
          </div>
        )}

        {/* Toggle Buttons */}
        <div className="flex space-x-4 md:space-x-10  my-4">
          <div className="flex items-center gap-2">
            {selectedOption ? null : (
              <button disabled className="bg-[#2ca9e0] p-2 rounded-full">
                <TfiHandPointRight className="h-6 w-6 text-white" />
              </button>
            )}
            <button
              onClick={() => handleOptionSelect('hospitals')}
              className={`
              flex items-center justify-center gap-2 py-2 px-3 md:px-6 md:min-w-28 text-sm md:text-base max-w-36 rounded-xl font-medium
              ${
                selectedOption !== 'hospitals'
                  ? 'bg-gray-400 text-white '
                  : 'bg-[#2ca9e0] text-white'
              }
            `}
            >
              Hospitals
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOptionSelect('phc')}
              className={`
              flex items-center justify-center gap-2  py-2 px-7 md:min-w-28 md:px-6 text-sm md:text-base max-w-36 rounded-xl font-medium
              ${
                selectedOption !== 'phc'
                  ? 'bg-gray-400 text-white '
                  : 'bg-[#2ca9e0] text-white'
              }
            `}
            >
              PHC
            </button>
            {selectedOption ? null : (
              <button disabled className="bg-[#2ca9e0] p-2 rounded-full">
                <TfiHandPointLeft className="h-6 w-6 text-white" />
              </button>
            )}
          </div>
        </div>

        {messages.map((m) => (
          <OpenAIAssistantMessage key={m.id} message={m} />
        ))}
        {isLoading && <OpenAIAssistantMessage message={streamingMessage} />}

        {!selectedOption ? null : (
          <form
            onSubmit={handleSubmitOpenAi}
            className={`py-3 md:py-4 h-fit ring-1 ${
              selectedOption ? 'ring-[#2ca9e0]' : 'ring-gray-500'
            } outline-none focus:ring-[#2ca9e0] bg-white rounded-[10px] flex items-center justify-center relative w-full ${
              isRtl ? 'pr-2 pl-11' : 'pl-2 pr-11'
            }`}
          >
            <textarea
              disabled={!selectedOption}
              autoFocus
              className={`max-h-[60px] text-xs md:text-base placeholder:text-black resize-none order-2 pl-2 h-fit pt-[18px] pr-11 ring-1 ring-transparent outline-none focus:ring-[#2ca9e0] bg-white rounded-[10px] w-full `}
              onChange={handlePromptChange}
              value={
                answer?.question
                  ? decodeURIComponent(answer?.question[currentLanguage])
                  : typeof userInput == 'object'
                  ? decodeURIComponent(userInput[currentLanguage])
                  : decodeURIComponent(userInput)
              }
              placeholder={
                decodeURIComponent(
                  selectedOption
                    ? placeholder[currentLanguage]
                    : disabledPlaceholder[currentLanguage]
                ) || ''
              }
            />

            {isLoading ? (
              <button
                className={`absolute ml-2 order-1 bg-[#2ca9e0] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  isRtl ? 'left-2.5 md:left-1' : 'right-2.5 md:right-1'
                }`}
              >
                <OpenAISpinner />
              </button>
            ) : (
              <button
                disabled={suggesstions?.length || !selectedOption}
                className={`absolute ${
                  isRtl ? 'left-2.5 md:left-1' : 'right-2.5 md:right-1'
                }`}
              >
                <Image
                  src={'/Send _icon.svg'}
                  alt="search"
                  width={30}
                  height={30}
                  className="h-8 md:h-10 w-8 md:w-10"
                />
              </button>
            )}
          </form>
        )}

        <div className="w-full mt-4">
          <p className="text-center text-lg font-bold text-gray-800">
            {instructions.infectionText[currentLanguage]}
          </p>
        </div>

        {suggesstions.length > 0 ? (
          <div className="w-full">
            <div
              className={`flex flex-col w-full items-center py-4 ${
                isRtl ? 'flex-row-reverse' : ''
              }`}
            >
              <div className="w-full my-4 flex items-center justify-center  ">
                {userInput && (
                  <ul
                    className={`${
                      suggestionLinks
                        ? ' mx-4   grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4   '
                        : 'hidden'
                    }`}
                  >
                    {suggesstions.map((suggestion, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setUserInput(
                            decodeURIComponent(
                              suggestion?.question[currentLanguage]
                            )
                          );
                          setSuggestionLinks(false);

                          handleAnswerGet(suggestion);
                        }}
                        className="border-2 border-[#2ca9e0] text-center rounded-lg py-2 sm:text-sm leading-6  text-md shadow-md px-2 bg-white cursor-pointer "
                      >
                        {decodeURIComponent(
                          suggestion?.question[currentLanguage]
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div
                className={`answer w-4/5 rounded-lg relative bg-[#F0F4F9] p-4 ${
                  answerBox ? 'block' : 'hidden'
                }`}
              >
                <span
                  className=" h-6 flex items-center justify-center w-6 absolute  text-black font-bold  right-1 top-1  bg-white  rounded-full cursor-pointer "
                  onClick={hanleCloseClick}
                >
                  x
                </span>
                <p className="bg-teal-600 w-fit  px-4 py-3 md:font-semibold right-2 text-white  mb-8 rounded-lg">
                  {answer?.question
                    ? decodeURIComponent(answer?.question[currentLanguage])
                    : decodeURIComponent(userInput)}
                </p>

                <div className="bg-white rounded-lg sm:text-sm p-4 flex items-center gap-6">
                  {answer?.answer && (
                    <ReactTyped
                      strings={[
                        decodeURIComponent(answer?.answer[currentLanguage]),
                      ]}
                      typeSpeed={10}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <HealthcareSelector
          handleSelectQuestion={(e, prompt) => handleSelectQuestion(e, prompt)}
        />
      </div>
    </>
  );
}

export function OpenAIAssistantMessage({ message }) {
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const isRtl =
    currentLanguage === 'ar' ||
    currentLanguage === 'ud' ||
    currentLanguage === 'fs';
  function displayRole(roleName) {
    switch (roleName) {
      case 'user':
        return <AiOutlineUser />;
      case 'assistant':
        return <AiOutlineRobot />;
    }
  }
  return (
    <div
      className={`mb-3 w-full px-4 py-6 bg-gray-100 rounded-lg ${
        isRtl ? 'text-right' : 'text-left'
      }`}
    >
      <div
        className={`mx-4 ${
          message.role == 'user'
            ? ' bg-[#2ca9e0] text-white w-fit px-2 py-2 rounded-md'
            : ' text-black leading-7'
        } ${
          isRtl ? 'text-right' : 'text-left'
        } overflow-auto openai-text relative`}
      >
        {/* {console.log(message?.content)} */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            ol: ({ children, depth = 0 }) => (
              <ol
                className={`list-decimal pl-6 my-2 space-y-2 ${
                  depth > 0 ? 'ml-4' : ''
                }`}
              >
                {children}
              </ol>
            ),
            ul: ({ children, depth = 0 }) => (
              <ul
                className={`list-disc pl-6 my-2 space-y-2 ${
                  depth > 0 ? 'ml-4' : ''
                }`}
              >
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
          }}
          //         components={{
          //     ol: ({children}) => (
          //       <ol className="list-decimal pl-6 space-y-2 my-4">
          //         {children}
          //       </ol>
          //     ),
          //     li: ({children}) => (
          //       <li className="leading-relaxed">
          //         {children}
          //       </li>
          //     )
          //   }}
          // components={{
          //           // Style unordered lists
          //           ul: ({depth = 0, children}) => (
          //             <ul className={`list-disc pl-6 my-2 space-y-2 ${depth > 0 ? 'ml-4' : ''}`}>
          //               {children}
          //             </ul>
          //           ),
          //           // Style list items
          //           li: ({children, ordered}) => (
          //             <li className="leading-relaxed">
          //               {children}
          //             </li>
          //           ),
          //           // Style paragraphs
          //           p: ({children}) => (
          //             <p className="my-1">
          //               {children}
          //             </p>
          //           ),
          //           // Style strong/bold text
          //           strong: ({children}) => (
          //             <strong className="font-bold">
          //               {children}
          //             </strong>
          //           )
          //         }}
        >
          {message?.content}
        </ReactMarkdown>
        {/* {console.log('I am from answer', )} */}
        {/* <MarkdownRenderer markdown={message?message?.content.content} /> */}
        {/* <Markdown remarkPlugins={[remarkGfm]}>

          {message?.content}
        </Markdown> */}
      </div>
    </div>
  );
}

// Based on https://flowbite.com/docs/components/spinner/
function OpenAISpinner() {
  return (
    <svg
      aria-hidden="true"
      role="status"
      className="inline w-4 h-4 text-white animate-spin"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="#E5E7EB"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentColor"
      />
    </svg>
  );
}
