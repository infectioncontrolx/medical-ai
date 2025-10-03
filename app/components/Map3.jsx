'use client';
import GlobalApi from '../Shared/GlobalApi';
import BusinessList from '../components/BusinessList';

import GoogleMapView from '../components/GoogleMapView';

import SkeltonLoading from '../components/SkeltonLoading';
import { UserLocationContext } from '../context/UserLocationContext';

import { useContext, useEffect, useState } from 'react';
const specificHospitals = [
  {
    name: {
      en: 'King Abdulaziz Hospital - Makkah',
      ud: 'کنگ عبد العزیز ہسپتال - مکہ',
      fr: 'Hôpital King Abdulaziz - La Mecque',
      ar: 'مستشفى الملك عبدالعزيز - مكة',
      bm: 'Hospital King Abdulaziz - Mekah',
      in: 'Rumah Sakit King Abdulaziz - Mekah',
      tr: 'Kral Abdulaziz Hastanesi - Mekke',
      hn: 'किंग अब्दुलअज़ीज़ अस्पताल - मक्का',
      ks: 'Hospitali ya Mfalme Abdulaziz - Makkah',
      bn: 'কিং আব্দুলআজিজ হাসপাতাল - মক্কা',
      fa: 'بیمارستان ملک عبدالعزیز - مکه',
    },
    type: 'hospital',
    geometry: {
      location: {
        lat: 21.442257581097703,
        lng: 39.80794875795585,
      },
    },
    rating: 3,
    formatted_address: {
      en: 'Al-Hajoun, 24222, Saudi Arabia',
      ud: 'الحجون، 24222، سعودی عرب',
      fr: 'Al-Hajoun, 24222, Arabie Saoudite',
      ar: 'الحجون، 24222، المملكة العربية السعودية',
      bm: 'Al-Hajoun, 24222, Arab Saudi',
      in: 'Al-Hajoun, 24222, Arab Saudi',
      tr: 'Al-Hajoun, 24222, Suudi Arabistan',
      hn: 'अल-हजौन, 24222, सऊदी अरब',
      ks: 'Al-Hajoun, 24222, Saudi Arabia',
      bn: 'আল-হাজুন, 24222, সৌদি আরব',
      fa: 'الحجون، 24222، عربستان سعودی',
    },
  },
  {
    name: {
      en: 'King Faisal Hospital - Makkah',
      ud: 'کنگ فیصل ہسپتال - مکہ',
      fr: 'Hôpital King Faisal - La Mecque',
      ar: 'مستشفى الملك فيصل - مكة',
      bm: 'Hospital King Faisal - Mekah',
      in: 'Rumah Sakit King Faisal - Mekah',
      tr: 'Kral Faisal Hastanesi - Mekke',
      hn: 'किंग फैसल अस्पताल - मक्का',
      ks: 'Hospitali ya Mfalme Faisal - Makkah',
      bn: 'কিং ফয়সাল হাসপাতাল - মক্কা',
      fa: 'بیمارستان ملک فیصل - مکه',
    },
    type: 'hospital',
    geometry: {
      location: {
        lat: 21.435291128147036,
        lng: 39.85349402727167,
      },
    },
    rating: 3,
    formatted_address: {
      en: '4588, Prince Majed Ibn Abd Al Aziz, 7451, Al Maabdah, Makkah 24236, Saudi Arabia',
      ud: '4588، پرنس ماجد ابن عبد العزیز، 7451، المعابدہ، مکہ 24236، سعودی عرب',
      fr: '4588, Prince Majed Ibn Abd Al Aziz, 7451, Al Maabdah, La Mecque 24236, Arabie Saoudite',
      ar: '4588، الأمير ماجد بن عبدالعزيز، 7451، المعابدة، مكة 24236، المملكة العربية السعودية',
      bm: '4588, Putera Majed Ibn Abd Al Aziz, 7451, Al Maabdah, Mekah 24236, Arab Saudi',
      in: '4588, Pangeran Majed Ibn Abd Al Aziz, 7451, Al Maabdah, Mekah 24236, Arab Saudi',
      tr: '4588, Prens Majed Ibn Abd Al Aziz, 7451, Al Maabdah, Mekke 24236, Suudi Arabistan',
      hn: '4588, प्रिंस माजिद इब्न अब्द अल अजीज, 7451, अल माब्दा, मक्का 24236, सऊदी अरब',
      ks: '4588, Mfalme Majed Ibn Abd Al Aziz, 7451, Al Maabdah, Makkah 24236, Saudi Arabia',
      bn: '4588, প্রিন্স মাজেদ ইবনে আব্দ আল আজিজ, 7451, আল মাবদাহ, মক্কা 24236, সৌদি আরব',
      fa: '4588، شاهزاده ماجد ابن عبد العزیز، 7451، المعابده، مکه 24236، عربستان سعودی',
    },
  },
  {
    name: {
      en: 'Heraa General Hospital',
      ud: 'حرا جنرل ہسپتال',
      fr: 'Hôpital Général Heraa',
      ar: 'مستشفى حراء العام',
      bm: 'Hospital Umum Heraa',
      in: 'Rumah Sakit Umum Heraa',
      tr: 'Heraa Genel Hastanesi',
      hn: 'हेरा जनरल अस्पताल',
      ks: 'Hospitali Kuu ya Heraa',
      bn: 'হেরা জেনারেল হাসপাতাল',
      fa: 'بیمارستان عمومی حراء',
    },
    type: 'hospital',
    geometry: {
      location: {
        lat: 21.48657495612166,
        lng: 39.78897546256912,
      },
    },
    rating: 2.8,
    formatted_address: {
      en: 'Al Madinah Al Munawarah Rd, Makkah 24227, Saudi Arabia',
      ud: 'المدینہ المنورہ روڈ، مکہ 24227، سعودی عرب',
      fr: 'Route Al Madinah Al Munawarah, La Mecque 24227, Arabie Saoudite',
      ar: 'طريق المدينة المنورة، مكة 24227، المملكة العربية السعودية',
      bm: 'Jalan Al Madinah Al Munawarah, Mekah 24227, Arab Saudi',
      in: 'Jalan Al Madinah Al Munawarah, Mekah 24227, Arab Saudi',
      tr: 'Al Madinah Al Munawarah Yolu, Mekke 24227, Suudi Arabistan',
      hn: 'अल मदीना अल मुनाव्वराह रोड, मक्का 24227, सऊदी अरब',
      ks: 'Barabara ya Al Madinah Al Munawarah, Makkah 24227, Saudi Arabia',
      bn: 'আল মদিনা আল মুনাওয়ারাহ রোড, মক্কা 24227, সৌদি আরব',
      fa: 'جاده المدینه المنوره، مکه 24227، عربستان سعودی',
    },
  },
  {
    name: {
      en: 'Al-Noor Specialist Hospital',
      ud: 'النور سپیشلسٹ ہسپتال',
      fr: 'Hôpital Spécialiste Al-Noor',
      ar: 'مستشفى النور التخصصي',
      bm: 'Hospital Pakar Al-Noor',
      in: 'Rumah Sakit Spesialis Al-Noor',
      tr: 'Al-Noor Uzman Hastanesi',
      hn: 'अल-नूर विशेषज्ञ अस्पताल',
      ks: 'Hospitali Maalum ya Al-Noor',
      bn: 'আল-নূর বিশেষজ্ঞ হাসপাতাল',
      fa: 'بیمارستان تخصصی النور',
    },
    type: 'hospital',
    geometry: {
      location: {
        lat: 21.38637481743355,
        lng: 39.86021063743089,
      },
    },
    rating: 3.1,
    formatted_address: {
      en: '3rd Ring Rd, Al Hijrah, Makkah 24241, Saudi Arabia',
      ud: '3rd رنگ روڈ، الہجرہ، مکہ 24241، سعودی عرب',
      fr: '3ème Ring Rd, Al Hijrah, La Mecque 24241, Arabie Saoudite',
      ar: 'الدائري الثالث، الهجرة، مكة 24241، المملكة العربية السعودية',
      bm: '3rd Ring Rd, Al Hijrah, Mekah 24241, Arab Saudi',
      in: '3rd Ring Rd, Al Hijrah, Mekah 24241, Arab Saudi',
      tr: '3. Çevre Yolu, Al Hijrah, Mekke 24241, Suudi Arabistan',
      hn: '3rd रिंग रोड, अल हिजराह, मक्का 24241, सऊदी अरब',
      ks: '3rd Ring Rd, Al Hijrah, Makkah 24241, Saudi Arabia',
      bn: '3rd রিং রোড, আল হিজরাহ, মক্কা 24241, সৌদি আরব',
      fa: 'جاده 3rd Ring، الهجره، مکه 24241، عربستان سعودی',
    },
  },
  {
    name: {
      en: 'Makkah Ajyad Emergency Hospital',
      ud: 'مکہ اجیاد ایمرجنسی ہسپتال',
      fr: "Hôpital d'Urgence Makkah Ajyad",
      ar: 'مستشفى طوارئ مكة أجياد',
      bm: 'Hospital Kecemasan Makkah Ajyad',
      in: 'Rumah Sakit Darurat Makkah Ajyad',
      tr: 'Mekke Ajyad Acil Hastanesi',
      hn: 'मक्का अज्याद आपातकालीन अस्पताल',
      ks: 'Hospitali ya Dharura ya Makkah Ajyad',
      bn: 'মক্কা আজিয়াদ জরুরি হাসপাতাল',
      fa: 'بیمارستان اورژانس مکه اجیاد',
    },
    type: 'hospital',
    geometry: {
      location: {
        lat: 21.41998062520587,
        lng: 39.82639449325329,
      },
    },
    rating: 3.2,
    formatted_address: {
      en: 'Alsafwah Tower, Ajyad St, Al Haram, Makkah 24231, Saudi Arabia',
      ud: 'الصافواہ ٹاور، اجیاد سٹریٹ، الحرم، مکہ 24231، سعودی عرب',
      fr: 'Tour Alsafwah, Rue Ajyad, Al Haram, La Mecque 24231, Arabie Saoudite',
      ar: 'برج الصفا، شارع أجياد، الحرم، مكة 24231، المملكة العربية السعودية',
      bm: 'Menara Alsafwah, Jalan Ajyad, Al Haram, Mekah 24231, Arab Saudi',
      in: 'Menara Alsafwah, Jalan Ajyad, Al Haram, Mekah 24231, Arab Saudi',
      tr: 'Alsafwah Kulesi, Ajyad Cad, Al Haram, Mekke 24231, Suudi Arabistan',
      hn: 'अलसफवाह टॉवर, अज्याद स्ट्रीट, अल हरम, मक्का 24231, सऊदी अरब',
      ks: 'Mnara wa Alsafwah, Ajyad St, Al Haram, Makkah 24231, Saudi Arabia',
      bn: 'আলসাফওয়া টাওয়ার, আজিয়াদ স্ট্রিট, আল হারাম, মক্কা 24231, সৌদি আরব',
      fa: 'برج الصفاوه، خیابان اجیاد، الحرم، مکه 24231، عربستان سعودی',
    },
  },
  {
    name: {
      en: 'King Abdullah Medical City Specialist Hospital',
      ud: 'کنگ عبد اللہ میڈیکل سٹی سپیشلسٹ ہسپتال',
      fr: 'Hôpital Spécialiste King Abdullah Medical City',
      ar: 'مدينة الملك عبدالله الطبية مستشفى التخصصي',
      bm: 'Hospital Pakar Bandar Perubatan King Abdullah',
      in: 'Rumah Sakit Spesialis Kota Medis King Abdullah',
      tr: 'Kral Abdullah Tıp Şehri Uzman Hastanesi',
      hn: 'किंग अब्दुल्ला मेडिकल सिटी विशेषज्ञ अस्पताल',
      ks: 'Hospitali Maalum ya King Abdullah Medical City',
      bn: 'কিং আব্দুল্লাহ মেডিকেল সিটি বিশেষজ্ঞ হাসপাতাল',
      fa: 'بیمارستان تخصصی شهر پزشکی ملک عبدالله',
    },
    type: 'hospital',
    geometry: {
      location: {
        lat: 21.382198883290332,
        lng: 39.881196579759845,
      },
    },
    rating: 4.1,
    formatted_address: {
      en: 'Muzdalifah Rd, Al Mashair, Makkah 24246, Saudi Arabia',
      ud: 'مزدلفہ روڈ، المشاعر، مکہ 24246، سعودی عرب',
      fr: 'Route Muzdalifah, Al Mashair, La Mecque 24246, Arabie Saoudite',
      ar: 'طريق مزدلفة، المشاعر، مكة 24246، المملكة العربية السعودية',
      bm: 'Jalan Muzdalifah, Al Mashair, Mekah 24246, Arab Saudi',
      in: 'Jalan Muzdalifah, Al Mashair, Mekah 24246, Arab Saudi',
      tr: 'Muzdalifah Yolu, Al Mashair, Mekke 24246, Suudi Arabistan',
      hn: 'मुसदलिफा रोड, अल मशैर, मक्का 24246, सऊदी अरब',
      ks: 'Barabara ya Muzdalifah, Al Mashair, Makkah 24246, Saudi Arabia',
      bn: 'মুজদালিফা রোড, আল মাশাইর, মক্কা 24246, সৌদি আরব',
      fa: 'جاده مزدلفه، المشاعر، مکه 24246، عربستان سعودی',
    },
  },
  {
    name: {
      en: 'Maternity and Children Hospital',
      ud: 'مادری اور بچوں کا ہسپتال',
      fr: "Hôpital de Maternité et d'Enfants",
      ar: 'مستشفى الولادة والأطفال',
      bm: 'Hospital Bersalin dan Kanak-kanak',
      in: 'Rumah Sakit Bersalin dan Anak',
      tr: 'Doğum ve Çocuk Hastanesi',
      hn: 'मातृत्व और बाल अस्पताल',
      ks: 'Hospitali ya Uzazi na Watoto',
      bn: 'মাতৃত্ব ও শিশু হাসপাতাল',
      fa: 'بیمارستان زنان و کودکان',
    },
    type: 'hospital',
    geometry: {
      location: {
        lat: 21.376457755185566,
        lng: 39.880609450924325,
      },
    },
    rating: 2.8,
    formatted_address: {
      en: 'An Naseem, Makkah Saudi Arabia',
      ud: 'النصیم، مکہ سعودی عرب',
      fr: 'An Naseem, La Mecque, Arabie Saoudite',
      ar: 'حي النسيم، مكة، المملكة العربية السعودية',
      bm: 'An Naseem, Mekah Arab Saudi',
      in: 'An Naseem, Mekah Arab Saudi',
      tr: 'An Naseem, Mekke Suudi Arabistan',
      hn: 'अन नसीम, मक्का सऊदी अरब',
      ks: 'An Naseem, Makkah Saudi Arabia',
      bn: 'আন নাসিম, মক্কা সৌদি আরব',
      fa: 'النسیم، مکه، عربستان سعودی',
    },
  },
  // {
  //   name: {
  //     en: 'Al-Nawariya Public Health Center (Walk in Clinic)',
  //     ud: 'النواریا پبلک ہیلتھ سینٹر (واک ان کلینک)',
  //     fr: 'Centre de Santé Publique Al-Nawariya (Clinique sans Rendez-vous)',
  //     ar: 'مركز صحي النوارية (عيادة بدون موعد)',
  //     bm: 'Pusat Kesihatan Awam Al-Nawariya (Klinik Tanpa Janji Temu)',
  //     in: 'Pusat Kesehatan Umum Al-Nawariya (Klinik Tanpa Janji Temu)',
  //     tr: 'Al-Nawariya Halk Sağlığı Merkezi (Randevusuz Klinik)',
  //     hn: 'अल-नुवारियाह सार्वजनिक स्वास्थ्य केंद्र (वॉक-इन क्लिनिक)',
  //     ks: 'Kituo cha Afya cha Umma cha Al-Nawariya (Kliniki ya Kuingia Bila Miadi)',
  //     bn: 'আল-নুওয়ারিয়াহ পাবলিক হেলথ সেন্টার (ওয়াক ইন ক্লিনিক)',
  //     fa: 'مرکز بهداشت عمومی النواریا (کلینیک سرپایی)',
  //   },
  //   type:"clinic",
  //   geometry: {
  //     location: {
  //       lat: 21.563490347790797,
  //       lng: 39.77365020674671,
  //     },
  //   },
  //   rating: 2.1,
  //   formatted_address: {
  //     en: '7733, Makkah Al Madinah Munawawrah Road, 24416, Makkah',
  //     ud: '7733، مکہ المدینہ منورہ روڈ، 24416، مکہ',
  //     fr: '7733, Route Makkah Al Madinah Munawawrah, 24416, La Mecque',
  //     ar: '7733، طريق مكة المدينة المنورة، 24416، مكة',
  //     bm: '7733, Jalan Makkah Al Madinah Munawawrah, 24416, Mekah',
  //     in: '7733, Jalan Makkah Al Madinah Munawawrah, 24416, Mekah',
  //     tr: '7733, Mekke Medine Munavverah Yolu, 24416, Mekke',
  //     hn: '7733, मक्का अल मदीना मुनव्वराह रोड, 24416, मक्का',
  //     ks: '7733, Barabara ya Makkah Al Madinah Munawawrah, 24416, Makkah',
  //     bn: '7733, মক্কা আল মদিনা মুনাওয়ারাহ রোড, 24416, মক্কা',
  //     fa: '7733، جاده مکه به مدینه منوره، 24416، مکه',
  //   },
  // },
  // {
  //   name: {
  //     en: 'Alsharayie Public Health Center (Walk in Clinic)',
  //     ud: 'الشرائع پبلک ہیلتھ سینٹر (واک ان کلینک)',
  //     fr: 'Centre de Santé Publique Alsharayie (Clinique sans Rendez-vous)',
  //     ar: 'مركز صحي الشرائع (عيادة بدون موعد)',
  //     bm: 'Pusat Kesihatan Awam Alsharayie (Klinik Tanpa Janji Temu)',
  //     in: 'Pusat Kesehatan Umum Alsharayie (Klinik Tanpa Janji Temu)',
  //     tr: 'Alsharayie Halk Sağlığı Merkezi (Randevusuz Klinik)',
  //     hn: 'अलशरायि सार्वजनिक स्वास्थ्य केंद्र (वॉक-इन क्लिनिक)',
  //     ks: 'Kituo cha Afya cha Umma cha Alsharayie (Kliniki ya Kuingia Bila Miadi)',
  //     bn: 'আলশারাইয়ে পাবলিক হেলথ সেন্টার (ওয়াক ইন ক্লিনিক)',
  //     fa: 'مرکز بهداشت عمومی الشرائع (کلینیک سرپایی)',
  //   },
  //   type:"clinic",
  //   geometry: {
  //     location: {
  //       lat: 21.471793745391125,
  //       lng: 39.92766744907568,
  //     },
  //   },
  //   rating: 2.2,
  //   formatted_address: {
  //     en: '8689 Muhammad Saleh Ibrahim Khouzami, Al Khadra, Makkah 24267',
  //     ud: '8689 محمد صالح ابراہیم خوزامی، الخضراء، مکہ 24267',
  //     fr: '8689 Muhammad Saleh Ibrahim Khouzami, Al Khadra, La Mecque 24267',
  //     ar: '8689 محمد صالح إبراهيم خوزامي، الخضراء، مكة 24267',
  //     bm: '8689 Muhammad Saleh Ibrahim Khouzami, Al Khadra, Mekah 24267',
  //     in: '8689 Muhammad Saleh Ibrahim Khouzami, Al Khadra, Mekah 24267',
  //     tr: '8689 Muhammad Saleh Ibrahim Khouzami, Al Khadra, Mekke 24267',
  //     hn: '8689 मुहम्मद सालेह इब्राहिम खौज़ामी, अल खद्रा, मक्का 24267',
  //     ks: '8689 Muhammad Saleh Ibrahim Khouzami, Al Khadra, Makkah 24267',
  //     bn: '8689 মুহাম্মদ সালেহ ইব্রাহিম খুজামি, আল খদ্রা, মক্কা 24267',
  //     fa: '8689 محمد صالح ابراهیم خوزامی، الخضراء، مکه 24267',
  //   },
  // },
  // {
  //   name: {
  //     en: 'Zahir Public Health Center (Walk in Clinic)',
  //     ud: 'ظاہر پبلک ہیلتھ سینٹر (واک ان کلینک)',
  //     fr: 'Centre de Santé Publique Zahir (Clinique sans Rendez-vous)',
  //     ar: 'مركز صحي الظاهر (عيادة بدون موعد)',
  //     bm: 'Pusat Kesihatan Awam Zahir (Klinik Tanpa Janji Temu)',
  //     in: 'Pusat Kesehatan Umum Zahir (Klinik Tanpa Janji Temu)',
  //     tr: 'Zahir Halk Sağlığı Merkezi (Randevusuz Klinik)',
  //     hn: 'जाहिर सार्वजनिक स्वास्थ्य केंद्र (वॉक-इन क्लिनिक)',
  //     ks: 'Kituo cha Afya cha Umma cha Zahir (Kliniki ya Kuingia Bila Miadi)',
  //     bn: 'জাহির পাবলিক হেলথ সেন্টার (ওয়াক ইন ক্লিনিক)',
  //     fa: 'مرکز بهداشت عمومی الظاهر (کلینیک سرپایی)',
  //   },
  //   type:"clinic",
  //   geometry: {
  //     location: {
  //       lat: 21.443324716875132,
  //       lng: 39.80681755092432,
  //     },
  //   },
  //   rating: 3.5,
  //   formatted_address: {
  //     en: '24222, Makkah',
  //     ud: '24222، مکہ',
  //     fr: '24222, La Mecque',
  //     ar: '24222، مكة',
  //     bm: '24222, Mekah',
  //     in: '24222, Mekah',
  //     tr: '24222, Mekke',
  //     hn: '24222, मक्का',
  //     ks: '24222, Makkah',
  //     bn: '24222, মক্কা',
  //     fa: '24222، مکه',
  //   },
  // },
  // {
  //   name: {
  //     en: 'Azizia Public Health Center (Walk in Clinic)',
  //     ud: 'مرکز العزیزیہ الصحی العام (واک ان کلینک)',
  //     fr: 'Centre de Santé Publique Azizia (Clinique sans Rendez-vous)',
  //     ar: 'مركز صحي العزيزية (عيادة بدون موعد)',
  //     bm: 'Pusat Kesihatan Awam Azizia (Klinik Tanpa Janji Temu)',
  //     in: 'Pusat Kesehatan Umum Azizia (Klinik Tanpa Janji Temu)',
  //     tr: 'Azizia Halk Sağlığı Merkezi (Randevusuz Klinik)',
  //     hn: 'अज़ीज़िया सार्वजनिक स्वास्थ्य केंद्र (वॉक-इन क्लिनिक)',
  //     ks: 'Kituo cha Afya cha Umma cha Azizia (Kliniki ya Kuingia Bila Miadi)',
  //     bn: 'আজিজিয়া পাবলিক হেলথ সেন্টার (ওয়াক ইন ক্লিনিক)',
  //     fa: 'مرکز بهداشت عمومی العزیزیه (کلینیک سرپایی)',
  //   },
  //   type:"clinic",
  //   geometry: {
  //     location: {
  //       lat: 21.403703420866773,
  //       lng: 39.88030726194499,
  //     },
  //   },
  //   rating: 3.4,
  //   formatted_address: {
  //     en: '2600 Al Nakhil, Makkah 24247',
  //     ud: '2600 النخیل، مکہ 24247',
  //     fr: '2600 Al Nakhil, La Mecque 24247',
  //     ar: '2600 النخيل، مكة 24247',
  //     bm: '2600 Al Nakhil, Mekah 24247',
  //     in: '2600 Al Nakhil, Mekah 24247',
  //     tr: '2600 Al Nakhil, Mekke 24247',
  //     hn: '2600 अल नाखिल, मक्का 24247',
  //     ks: '2600 Al Nakhil, Makkah 24247',
  //     bn: '2600 আল নাখিল, মক্কা 24247',
  //     fa: '2600 النخیل، مکه 24247',
  //   },
  // },
];
export default function Home() {
  const [category, setCategory] = useState('hospitals');
  const [exclude, setExclude] = useState([
    'clinic',
    'medical',
    'community',
    'diagnostic',
    'kilenik',
  ]);
  const [radius, setRadius] = useState(1000);
  const [businessList, setBusinessList] = useState(specificHospitals);
  const [businessListOrg, setBusinessListOrg] = useState([]);
  const [loading, setLoading] = useState(false);

  const { userLocation, setUserLocation } = useContext(UserLocationContext);

  useEffect(() => {
    if (category && userLocation) {
      // Ensure both category and userLocation are available
      setLoading(true);

      GlobalApi.getGooglePlace(
        category,
        radius,
        userLocation.lat,
        userLocation.lng,
        exclude
      ).then((resp) => {
        //   const joinedPlaces = resp.data.hospitals.results.filter(item => {
        //     return !exclude.some(pattern => new RegExp(pattern, 'i').test(item?.name));
        // });
        //   // specificHospitals
        //   const placesWithDistance = joinedPlaces?.map((place) => {
        //     const distance = calculateDistance(
        //       place.geometry.location.lat,
        //       place.geometry.location.lng,
        //       userLocation.lat,
        //       userLocation.lng
        //     );
        //     return { ...place, distance };
        //   });
        const specificHospitalsMap = specificHospitals?.map((place) => {
          const distance = calculateDistance(
            place.geometry.location.lat,
            place.geometry.location.lng,
            userLocation.lat,
            userLocation.lng
          );
          return { ...place, distance };
        });

        const sortedPlaces = specificHospitalsMap?.sort(
          (a, b) => a.distance - b.distance
        );
        const places = [...sortedPlaces];
        setBusinessList(places);
        setBusinessListOrg(places); // Assuming you need an unsorted copy
        setLoading(false);
      });
    }
  }, [category, radius, userLocation]);

  return (
    <div className="px-1 ">
      <GoogleMapView businessList={businessList} />
      <div className="mb-10">
        {!loading ? (
          <BusinessList businessList={businessList} />
        ) : (
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <SkeltonLoading key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371; // in kilometers

  const degToRad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance.toFixed(2); // Return the distance with 2 decimal places
};
