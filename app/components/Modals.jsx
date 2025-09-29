import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from './../../lib/languageSlice'; // Import your setLanguage action

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -140%)',
    borderRadius: '30px',
    ShadowRoot: '10px',
    boxShadow: '0 15px 15px -12px rgba(0, 0, 0, 0.25)',
  },
};
export default function Modals({ setLang }) {
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  function openModal() {
    setIsOpen(true);
  }
  // const buttonClosed = () => {

  //   setIsOpen(false);
  // }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = 'black';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const languges = [
    {
      name: 'English',
      code: 'en',
    },

    // {
    //   name: 'اردو',
    //   code: 'ud',
    // },
    // {
    //   name: 'Français',
    //   code: 'fr',
    // },
    {
      name: 'العربية',
      code: 'ar',
    },
    // {
    //   name: 'Malay',
    //   code: 'bm',
    // },
    // {
    //   name: 'Indonesian',
    //   code: 'in',
    // },
    // {
    //   name: 'Türkçe',
    //   code: 'tr',
    // },
    // {
    //   name: 'हिंदी',
    //   code: 'hn',
    // },
    // {
    //   name: 'Kiswahili',
    //   code: 'ks',
    // },
    // {
    //   name: 'বাংলা',
    //   code: 'bn',
    // },

    // {
    //   name: 'فارسی',
    //   code: 'fa',
    // },

    // "English","Français","اردو","Deutsch","العربية","Española", "Türkçe","dell'Italia"
  ];
  const handleLanguageChange = (langs) => {
    localStorage.setItem('currentLanguage', langs.code);
    localStorage.setItem('currentLanguageFullName', langs.name);
    dispatch(
      setLanguage({
        currentLanguage: langs.code,
        currentLanguageFullName: langs.name,
      })
    ); // Dispatch action to update language
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentLanguage =
        window.localStorage.getItem('currentLanguage') || 'en';
      const currentLanguageFullName =
        window.localStorage.getItem('currentLanguageFullName') || 'English';
      localStorage.setItem('currentLanguage', currentLanguage);
      localStorage.setItem('currentLanguageFullName', currentLanguageFullName);
      dispatch(
        setLanguage({
          currentLanguage: currentLanguage,
          currentLanguageFullName: currentLanguageFullName,
        })
      );
    }
  }, [dispatch]);

  return (
    <>
  

        <div className="flex flex-warp gap-2">
          {languges
            .filter((item) => item?.code !== currentLanguage)
            .slice(5, 10)
            .map((language, index) => (
              <div key={index} className=" flex justify-center">
                <button
                  className="bg-[#dbeefd] m-[2px]  text-[#02B1BF] text-sm font-normal my-2 p-1 px-2 rounded-md  "
                  onClick={() => {
                    // setLang(language.name);
                    handleLanguageChange(language);
                    setIsOpen(false);
                  }}
                >
                  {language.name}
                </button>
              </div>
            ))}
        </div>
        <div className="flex flex-warp gap-2">
          {languges
            .filter((item) => item?.code !== currentLanguage)
            .slice(0, 5)
            .map((language, index) => (
              <div key={index} className=" flex justify-center">
                <button
                  className="bg-[#dbeefd] m-[2px]  text-[#02B1BF] text-sm font-normal my-2 p-1 px-2 rounded-md  "
                  onClick={() => {
                    // setLang(language.name);
                    handleLanguageChange(language);
                    setIsOpen(false);
                  }}
                >
                  {language.name}
                </button>
              </div>
            ))}
        </div>

        {/* needed */}
      {/* <button onClick={openModal}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.2}
          stroke="currentColor"
          className="w-6 h-6" 
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex m-auto  items-center justify-between mb-4 ">
          <h2
            ref={(_subtitle) => (subtitle = _subtitle)}
            className="font-semibold    text-lg  text-center
       "
          >
            Select Your Language
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="font-bold text-lg text-[#02B1BF] ml-4"
          >
            X
          </button>
        </div>

        <div className="flex flex-warp gap-2">
          {languges
            .filter((item) => item?.code !== currentLanguage)
            .slice(5, 10)
            .map((language, index) => (
              <div key={index} className=" flex justify-center">
                <button
                  className="bg-[#dbeefd] m-[2px]  text-[#02B1BF] text-sm font-normal my-2 p-1 px-2 rounded-md  "
                  onClick={() => {
                    // setLang(language.name);
                    handleLanguageChange(language);
                    setIsOpen(false);
                  }}
                >
                  {language.name}
                </button>
              </div>
            ))}
        </div>
        <div className="flex flex-warp gap-2">
          {languges
            .filter((item) => item?.code !== currentLanguage)
            .slice(0, 5)
            .map((language, index) => (
              <div key={index} className=" flex justify-center">
                <button
                  className="bg-[#dbeefd] m-[2px]  text-[#02B1BF] text-sm font-normal my-2 p-1 px-2 rounded-md  "
                  onClick={() => {
                    // setLang(language.name);
                    handleLanguageChange(language);
                    setIsOpen(false);
                  }}
                >
                  {language.name}
                </button>
              </div>
            ))}
        </div>
      </Modal> */}
    </>
  );
}
