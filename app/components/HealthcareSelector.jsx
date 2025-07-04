'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
      <div className="w-full my-5">
        <div className="grid grid-cols-2 gap-4">
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
                ? 'bg-blue-50 border-[#0CAFB8]'
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }
          `}
            >
              <div className="">
                <p className="text-md font-semibold text-center text-[#0CAFB8] cursor-pointer">
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
            hover:shadow-lg bg-[#0CAFB8]
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
            hover:shadow-lg bg-[#0CAFB8]
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
        </div>
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
