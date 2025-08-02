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
    link: "",
  },
  {
    id: 2,
    name: "NHSN 2025",
    link: "",
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

          <div
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
          </div>


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
