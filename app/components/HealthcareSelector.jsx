'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Feedbacks from './Feedbacks';
import GuidancePopup from './GuidancePopup';

const data1 = [
  {
    title: 'ICA for Permenant Hospitals',
    link: 'https://drive.google.com/file/d/1A9t5jAzY38yX8iHpYjIUQt2xxHVcxMhP/view?usp=sharing',
  },
  {
    title: 'CEBAHI for Permanent Hospitals.',
    link: 'https://drive.google.com/file/d/19lFhgqHPi3rj7MbBTskJhVyVC_P0Qyq2/view?usp=sharing',
  },
  {
    title: 'CEBAHI for Seasonal Hospitals',
    link: 'https://drive.google.com/file/d/1iOjZYgvHOp8C5CJUCKwIHx9_nR42pIvA/view?usp=sharing',
  },
];

const data2 = [
  {
    title: 'HAND HYGIENE (HH)',
    link: 'https://drive.google.com/file/d/1NFyjj8nnHRXp7GtM6qMb5xBUoBRBU6JC/view?usp=sharing',
  },
  {
    title: 'PERSONAL PROTECTIVE EQUIPMENT (PPE)',
    link: 'https://drive.google.com/file/d/1ZHD6si_HJe1ay6BQHbcDKibadN069gtT/view?usp=sharing',
  },
  {
    title: 'BIOLOGICAL SPILL MANAGEMENT',
    link: 'https://drive.google.com/file/d/1_FvRAByQY7FgvDQDK6e4EvYkZptzShY0/view?usp=sharing',
  },
  {
    title: 'SHARP INJURIES / NEEDLE STICK INJURIES (NSI) MANAGEMENT',
    link: 'https://drive.google.com/file/d/1CRr87aBcfFPzeL73NsAksrZ3nPudpXbF/view?usp=sharing',
  },
  {
    title: 'TRANSMISSION BASED PRECAUTIONS',
    link: 'https://drive.google.com/file/d/1cXrm-WUlvIrMsIT9I7rGA3iTs8QIaj-n/view?usp=sharing',
  },
  {
    title: 'RESPIRATOR FIT TEST',
    link: 'https://drive.google.com/file/d/1YLsgI9q6hJoVYpqeOcZX8EvACdZ-b_Yu/view?usp=sharing',
  },
  {
    title: 'POWERED AIR PURIFYING RESPIRATOR (PAPR)',
    link: 'https://drive.google.com/file/d/11cjZUWe8lTi1SpircKU70IR6gJ11e2G5/view?usp=sharing',
  },
];



//   const cardData = [
//     {
//       id: 1,
//       title: "Standards & Requirements for IC in Healthcare",
//       backgroundColor: "#24468d", // Blue
//       link: "https://drive.google.com/drive/folders/1SEzJkLja4KpeCWyuX_A42CyCCvJKXPtR?usp=sharing",
//       description: "Comprehensive guidelines and standards for infection control in healthcare settings",
//       short_id: "",
//     },
//     {
//       id: 2,
//       title: "Basic IC License BICSL",
//       backgroundColor: "#31bfc0", // Teal
//       link: "https://drive.google.com/drive/folders/1MFHkAZcobSry5F_Lm5HaTVXvU5gflr_x?usp=drive_link",
//       description: "Basic Infection Control Skills License certification program",
//       short_id: "",
//     },
//     {
//       id: 3,
//       title: "National IPC Guidelines",
//       backgroundColor: "#10798f", // Dark Teal
//       link: "https://drive.google.com/drive/folders/1pdBhL1v-fL04Pbt0uFmKMqAAK1KVs916?usp=drive_link",
//       description: "National infection prevention and control guidelines",
//       short_id: "",
//     },
//     {
//         id: 4,
//         title: "HATs Surveillance & Outbreak",
//         backgroundColor: "#48b558", // Green
//         link: "https://drive.google.com/drive/folders/1ImK_Poq3vDtmovzqGEeOkCx6sPKXhmZC?usp=drive_link",
//         description: "Healthcare-associated infections tracking and outbreak management",
//         short_id: "",
//     },
//     {
//       id: 5,
//       title: "International IPC Guidelines",
//       backgroundColor: "#1a94d3", // Light Blue
//       link: "https://drive.google.com/drive/folders/1V5HAAqkCk-bk1uUa5pJufC9_cev5EaiF?usp=drive_link",
//       description: "International infection prevention and control standards",
//       short_id: "",
//     },
//     {
//       id: 6,
//       title: "Contacts & Posters",
//       backgroundColor: "#93c951", // Light Green
//       link: "https://drive.google.com/drive/folders/1ODgVwJfaR3SrTW_dNBUVC8P7sMfgO9S2?usp=drive_link",
//       description: "Contact information and educational materials",
//       short_id: "",
//     }
//   ];


const cardData = [
  {
    id: 1,
    title: "Standards & Requirements for IC in Healthcare",
    backgroundColor: "#24468d", // Blue
    link: "https://drive.google.com/drive/folders/1SEzJkLja4KpeCWyuX_A42CyCCvJKXPtR?usp=sharing",
    description: "Comprehensive guidelines and standards for infection control in healthcare settings",
    short_id: "standards_requirements_ic_healthcare",
  },
  {
    id: 2,
    title: "Basic IC License BICSL",
    backgroundColor: "#31bfc0", // Teal
    link: "https://drive.google.com/drive/folders/1MFHkAZcobSry5F_Lm5HaTVXvU5gflr_x?usp=drive_link",
    description: "Basic Infection Control Skills License certification program",
    short_id: "basic_ic_license_bicsl",
  },
  {
    id: 3,
    title: "National IPC Guidelines",
    backgroundColor: "#10798f", // Dark Teal
    link: "https://drive.google.com/drive/folders/1pdBhL1v-fL04Pbt0uFmKMqAAK1KVs916?usp=drive_link",
    description: "National infection prevention and control guidelines",
    short_id: "national_ipc_guidelines",
    documents: [
  // From Image 1
  { id: 1, name: "Selecting, Evaluating & Monitoring of IPC Supplies & Equipment 2024.pdf", link: "https://drive.google.com/file/d/1jm1nCigskvXU6_exBqDusLRWujief6-e/view?usp=drive_link" },
  { id: 2, name: "Antimicrobial Stewardship 2024.pdf", link: "https://drive.google.com/file/d/1CG20KOPYHvOZ0j678ctuR3XBTY4oFe5b/view?usp=drive_link" },
  { id: 3, name: "Best Practices of Environmental Health, cleaning & disinfection 2025.pdf", link: "https://drive.google.com/file/d/1x8dWAr8gQhZjXPKwaCCKv9TbjOlascY6/view?usp=drive_link" },
  { id: 4, name: "BICSL 2025.pdf", link: "https://drive.google.com/file/d/16D5gf-UqoKb1kV3ineyLjbED623ifax_/view?usp=drive_link" },
  { id: 5, name: "cleaning and disinfection Manual WEQAYAH Jan 2025.pdf", link: "https://drive.google.com/file/d/16USd1rMjIGdWSUqbN7pJK8vXjKxVIrTF/view?usp=drive_link" },
  { id: 6, name: "COVID-19 Guidelines March 2024.pdf", link: "https://drive.google.com/file/d/1vYGJ2V--VqTFf4br6uVnn4o0HxwImHpl/view?usp=drive_link" },
  { id: 7, name: "DENTAL IPC compliance monitoring 2024.pdf", link: "https://drive.google.com/file/d/1brLPpfOh-5tsmGRJ5ppC3XTdBPuek759/view?usp=drive_link" },
  { id: 8, name: "EBOLA AND MARBURG VIRUSES IPC 2022.pdf", link: "https://drive.google.com/file/d/121u_LcHoLzoZLyKR4x275jHRJQpHZeKQ/view?usp=drive_link" },
  { id: 9, name: "Environmental Health Manual 2018.pdf", link: "https://drive.google.com/file/d/1q4v5L1UVXQ5lYtB6ASSFAECibgo_hDVU/view?usp=drive_link" },
  { id: 10, name: "IPC in Medical Rehabilitation and Long Term Care Services 2024 .pdf", link: "https://drive.google.com/file/d/1VsN7ACCIq0cda-_OKV0YO-7Ws8He9h2q/view?usp=drive_link" },
  { id: 11, name: "IPC Requirements in Design Construction and Renovation in HCF 2021.pdf", link: "https://drive.google.com/file/d/12qdmfGSelliqH-8I4TfCXNzy90vncfBo/view?usp=drive_link" },
  
  // From Image 2
  { id: 12, name: "Maintenance of AIIR 2021.pdf", link: "https://drive.google.com/file/d/1iJzzFSiF8M60Bf-jWupKIuI76Pp1kBui/view?usp=drive_link" },
  { id: 13, name: "Marburg Ebola Guideline in IPC 2025.pdf", link: "https://drive.google.com/file/d/1-gAUfjOGDOvn4zQ3FfSTiNtAcGi81B0M/view?usp=drive_link" },
  { id: 14, name: "Policy HEPA Filters replacement in portable HEPA Filters equipment 2023.pdf", link: "https://drive.google.com/file/d/15FZo_sLoHAJ4YU6lZo_agopCLxJb-bg7/view?usp=drive_link" },
  { id: 15, name: "Prevention of SSI Feb 2024.pdf", link: "https://drive.google.com/file/d/1jW0vlwef6XSLhJenDfvtDLQzLW4mADZB/view?usp=drive_link" },
  { id: 16, name: "Prevention of VAP & VAEs (Adult, Pediatric & Neonatal) 2025.pdf", link: "https://drive.google.com/file/d/1L9hHWeSg7B1l5FkwfaODTY43SNy-whcn/view?usp=drive_link" },
  { id: 17, name: "Reprocessing of Linens in Healthcare Settings 2020.pdf", link: "https://drive.google.com/file/d/1ErtTpTZKx3OKV6Q2UscVhPvNd8HnqSdB/view?usp=drive_link" },
  { id: 18, name: "Respiratory protection program 2022.pdf", link: "https://drive.google.com/file/d/1WMA0MOMDtQKjIcMajIMBs9hZbXsiTUiP/view?usp=drive_link" },
  { id: 19, name: "Respiratory Protection Program RPP V4.1 Jan 2025.pdf", link: "https://drive.google.com/file/d/1bUULgd8JGU69ZaFohdkvlqXyttForum8/view?usp=drive_link" },
  { id: 20, name: "safe handling of deceased persons with suspected or confirmed COVID-19 2022.pdf", link: "https://drive.google.com/file/d/1NZricg7TDwatlh4ok_7d_axAkKfkDgib/view?usp=drive_link" },
  { id: 21, name: "Sterilization Services Manual (V.1 2024).pdf", link: "https://drive.google.com/file/d/1_6PalPm2_1RN_SaFsxm68YcTRVnK54V9/view?usp=drive_link" }
]
//     documents: [
//   { id: 1, name: "Selecting, Evaluating & Monitoring of IPC Supplies & Equipment 2024.pdf", link: "" },
//   { id: 2, name: "Antimicrobial Stewardship 2024.pdf", link: "" },
//   { id: 3, name: "Best Practices of Environmental Health, cleaning & disinfection 2025.pdf", link: "" },
//   { id: 4, name: "BICSL 2025.pdf", link: "" },
//   { id: 5, name: "cleaning and disinfection Manual WEQAYAH Jan 2025.pdf", link: "" },
//   { id: 6, name: "COVID-19 Guidelines March 2024.pdf", link: "" },
//   { id: 7, name: "DENTAL IPC compliance monitoring 2024.pdf", link: "" },
//   { id: 8, name: "EBOLA AND MARBURG VIRUSES IPC 2022.pdf", link: "" },
//   { id: 9, name: "Environmental Health Manual 2018.pdf", link: "" },
//   { id: 10, name: "IPC in Medical Rehabilitation and Long Term Care Services 2024 .pdf", link: "" },
//   { id: 11, name: "IPC Requirements in Design Construction and Renovation in HCF 2021.pdf", link: "" },
//   { id: 12, name: "Maintenance of AIIR 2021.pdf", link: "" },
//   { id: 13, name: "Marburg Ebola Guideline in IPC 2025.pdf", link: "" },
//   { id: 14, name: "Policy HEPA Filters replacement in portable HEPA Filters equipment 2023.pdf", link: "" },
//   { id: 15, name: "Prevention of SSI Feb 2024.pdf", link: "" },
//   { id: 16, name: "Prevention of VAP & VAEs (Adult, Pediatric & Neonatal) 2025.pdf", link: "" },
//   { id: 17, name: "Reprocessing of Linens in Healthcare Settings 2020.pdf", link: "" },
//   { id: 18, name: "Respiratory protection program 2022.pdf", link: "" },
//   { id: 19, name: "Respiratory Protection Program RPP V4.1 Jan 2025.pdf", link: "" },
//   { id: 20, name: "safe handling of deceased persons with suspected or confirmed COVID-19 2022.pdf", link: "" },
//   { id: 21, name: "Sterilization Services Manual (V.1 2024).pdf", link: "" }
// ]
  },
  {
    id: 4,
    title: "HATs Surveillance & Outbreak",
    backgroundColor: "#48b558", // Green
    link: "https://drive.google.com/drive/folders/1ImK_Poq3vDtmovzqGEeOkCx6sPKXhmZC?usp=drive_link",
    description: "Healthcare-associated infections tracking and outbreak management",
    short_id: "hats_surveillance_outbreak",
  },
  {
    id: 5,
    title: "International IPC Guidelines",
    backgroundColor: "#1a94d3", // Light Blue
    link: "https://drive.google.com/drive/folders/1V5HAAqkCk-bk1uUa5pJufC9_cev5EaiF?usp=drive_link",
    description: "International infection prevention and control standards",
    short_id: "international_ipc_guidelines",
    documents: [
  {
    id: 1,
    name: "APIC TEXT 2024",
    link: "https://drive.google.com/file/d/1a5G0DH9zcTBC1dVRINhIM5PeIGYpBGC-/view?usp=drive_link",
  },
  {
    id: 2,
    name: "NHSN 2025",
    link: "https://drive.google.com/file/d/1pe4NSUYIX2OtH7WvuVf6Q71J-RNMMhwL/view?usp=drive_link",
  }
]
  },
  {
    id: 6,
    title: "Contacts & Posters",
    backgroundColor: "#93c951", // Light Green
    link: "https://drive.google.com/drive/folders/1ODgVwJfaR3SrTW_dNBUVC8P7sMfgO9S2?usp=drive_link",
    description: "Contact information and educational materials",
    short_id: "contacts_posters",
     documents : [
  { id: 1, name: "إيبولا إنجليزي", link: "" },
  { id: 2, name: "إيبولا عربي", link: "" },
  { id: 3, name: "احتياطات العزل التلامسي أخضر", link: "" },
  { id: 4, name: "احتياطات العزل الذاتي أحمر", link: "" },
  { id: 5, name: "احتياطات العزل الهوائي أزرق", link: "" },
  { id: 6, name: "احتياطات نقل الحالات المعزولة تلامسي أخضر", link: "" },
  { id: 7, name: "احتياطات نقل الحالات المعزولة الذاتي أحمر", link: "" },
  { id: 8, name: "احتياطات نقل الحالات المعزولة هوائي أزرق", link: "" },
  { id: 9, name: "الملاحظات الخمس لتطهير الأيدي", link: "" },
    { id: 10, name: "انبوكس انجليزي", link: "" },
  { id: 11, name: "انبوكس عربي", link: "" },
  { id: 12, name: "بوستر آداب السجال", link: "" },
  { id: 13, name: "بوستر ارشاد ادوات الوقاية الشخصية", link: "" },
  { id: 14, name: "بوستر طقم ادوات الوقاية الشخصية", link: "" },
  { id: 15, name: "بوستر فصل الفلفيت الطبية", link: "" },
  { id: 16, name: "تغيير الايدي بالجل الكحولي", link: "" },
  { id: 17, name: "غسيل الايدي بالماء", link: "" },
  { id: 18, name: "كوفيد 19 انجليزي", link: "" },
  { id: 19, name: "كوفيد 19 عربي", link: "" },
  { id: 20, name: "ميرس انجليزي", link: "" },
  { id: 21, name: "ميرس عربي", link: "" },
]
  }
];


  const folders = [
  { name: "International guidelines", short_name: "international_guidelines" },
  { name: "IPC posters", short_name: "ipc_posters" },
  { name: "National guidelines", short_name: "national_guidelines" },
  {
    name: "Standards & Requirements for Infection Control in Health...",
    short_name: "standards_infection_control"
  },
  {
    name: "surveillance and outbreak program",
    short_name: "surveillance_outbreak_program"
  }
];


const HealthcareSelector = ({ handleSelectQuestion }) => {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null);
  const [modelOpened, setModelOpened] = useState(false);
  const [selectedGuidance, setSelectedGuidance] = useState([]);

  const prompts = [
    {
      id: 1,
      title: 'WAAW AMR',
      description: 'What is Antimicrobial Resistance (AMR)?',
    },
    {
      id: 2,
      title: 'WAAW AMR',
      description: 'What is the role of Infection Prevention in combating AMR?',
    },
    // {
    //     id: 3,
    //     title: "WAAW AMR",
    //     description: "What are AMR Awareness & Guidance Resources?",
    // },
    // {
    //     id: 4,
    //     title: "WAAW AMR",
    //     description: "What are the standard Infection Prevention and Control (IPC) precautions?",
    // }
  ];

  const handleCardClick = (e, prompt) => {
    setSelectedCard(prompt?.id === selectedCard ? null : prompt?.id);
    handleSelectQuestion(e, prompt);
  };

  const handleModalOpened = (data) => {
    setModelOpened(true);
    setSelectedGuidance(data);
  };
  const handleModalClosed = () => {
    setModelOpened(false);
  };

  return (
    <>
      <div className="w-full my-5 ">
        <div className="grid grid-cols-2 gap-x-10 gap-y-2">
          {/* {prompts.map((prompt) => (
            <div
              key={prompt.id}
              onClick={(e) => handleCardClick(e, prompt)}
              className={`
            rounded-lg border p-6
            cursor-pointer
            transition-all duration-200
            hover:shadow-lg
            ${
              selectedCard === prompt.id
                ? 'bg-blue-50 border-[#2ca9e0]'
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }
          `}
            >
              <div className="">
                <p className="text-md font-semibold text-center text-[#2ca9e0] cursor-pointer">
                  {prompt.description}
                </p>
              </div>
            </div>
          ))} */}

          {/* <div
            onClick={(e) => handleModalOpened(data1)}
            className={`
            rounded-lg border p-6
            cursor-pointer
            transition-all duration-200
            hover:shadow-lg bg-[#2ca9e0]
            flex
            items-center
          `}
          >
            <div className="space-y-2">
              <p className="text-md text-white cursor-pointer font-semibold text-center">
                Standards & Requirements for Infection Control in Healthcare
                Facilities
              </p>
            </div>
          </div>
          <div
            className={`
            rounded-lg border p-6
            transition-all duration-200
            hover:shadow-lg bg-[#2ca9e0]
            flex
            items-center
          `}
            onClick={(e) => handleModalOpened(data2)}
          >
            <div className="space-y-2">
              <p className="text-md text-white cursor-pointer font-semibold text-center">
                Basic Infection Control Skills Liscence
              </p>
            </div>
          </div> */}


          {cardData.map((card) => (
            <div
              key={card.id}
              className="rounded-lg border cursor-pointer p-2.5 md:p-3.5 min-h-20 md:min-h-24 flex justify-center items-center max-w-44 md:max-w-56 w-full mx-auto"
              style={{ backgroundColor: card.backgroundColor }}
            //   onClick={() => handleCardClick(card)}
              onClick={(e) => handleModalOpened(card)}
            >
              <div className="space-y-3 mx-auto">
                <h3 className="text-sm md:text-base text-white font-medium text-center leading-tight">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
          
        </div>

        <Feedbacks />
      </div>
      <GuidancePopup
        data={selectedGuidance}
        setIsOpen={setModelOpened}
        isOpen={modelOpened}
      />
    </>
  );
};

export default HealthcareSelector;
