/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
// Import Swiper React components
import { RxArrowLeft } from 'react-icons/rx';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-creative';

import './styles.css';

// import required modules
import { dataCards } from '@/app/data/dataCards';
import Loader from '@/components/Shared/Loader';
import { useSearchParams } from 'next/navigation';
import { EffectCreative } from 'swiper/modules';
import { isValidArray } from '../../../lib/func';
import FeedBackModal from '../../components/FeedBackModal';

export default function TopicInfo({ params }) {
  const [loading, setLoading] = useState(true);

  const getQuery = useSearchParams();
  const selectIndex = parseInt(getQuery.get('select'));
  const currentLanguage = getQuery.get('lang')
    ? getQuery.get('lang').trim()
    : '';

  const currentTitle = decodeURIComponent(params.id.replace(/-/g, ' ')).trim();

  const [modelOpened, setModelOpened] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentCards = isValidArray(dataCards)
    ? dataCards[selectIndex].sources.find((item) => {
        return decodeURIComponent(item.title[currentLanguage]) == currentTitle;
      })?.cards || []
    : [];

  useEffect(() => {
    setLoading(false);
    const hasRendered = localStorage.getItem('feedBackForInit');
    if (!hasRendered) {
      setTimeout(() => {
        setModelOpened(true);
        localStorage.setItem('feedBackForInit', true); //Set flag
      }, 50000);
    }
  }, []);

  return (
    <div className="flex flex-col  h-screen items-center w-full  border-b-2 border-white pt-4">
      {!loading && (
        <>
          <div className="flex flex-col items-center relative w-full mb-6">
            <div className="flex w-full px-3 gap-4 items-center justify-between">
              <button
                className="text-[#02B1BF] cursor-pointer text-center"
                onClick={() => {
                  location.replace('/healthcare');
                }}
              >
                <RxArrowLeft size={48} />
              </button>
              <div className="flex-grow"></div>{' '}
              {/* This ensures that the button is centered */}
              <h1 className="text-xl text-[#02B1BF] font-bold rounded-lg">
                {currentTitle || ''}
              </h1>
              <div className="flex-grow"></div>{' '}
              {/* This ensures that the heading is centered */}
            </div>
          </div>

          <Swiper
            grabCursor={true}
            effect={'creative'}
            creativeEffect={{
              prev: {
                shadow: true,
                translate: [0, 0, -400],
              },
              next: {
                translate: ['100%', 0, 0],
              },
            }}
            modules={[EffectCreative]}
            className="min-h-[78%] min-w-[95%]"
            onSlideChange={(e) => {
              const activeIndex = e.activeIndex;
              setCurrentIndex(activeIndex);
            }}
          >
            {isValidArray(currentCards) &&
              currentCards.map((image, index) => (
                <SwiperSlide key={index} className=" ">
                  <img
                    src={image[currentLanguage]}
                    alt="diaf"
                    className="object-fit w-full h-full"
                    priority
                  />
                </SwiperSlide>
              ))}
          </Swiper>

          <p className="font-semibold   border-gray-400  rounded-[15px] text-[#02B1BF] p-4 py-2 mt-6">
            {' '}
            {`${currentIndex + 1} of ${
              isValidArray(currentCards) ? currentCards?.length : 0
            } `}
          </p>
        </>
      )}

      {loading && (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      )}

      <FeedBackModal setIsOpen={setModelOpened} isOpen={modelOpened} />
    </div>
  );
}
