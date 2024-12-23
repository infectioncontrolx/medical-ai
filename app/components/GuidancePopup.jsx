'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { LuArrowUpRight } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import API from '../../lib/instance/instance.js';

export default function GuidancePopup({ setIsOpen, isOpen, data }) {
  const currentLanguage = useSelector(
    (state) => state?.language?.currentLanguage
  );

  const [feedBackData, setFeedBackData] = useState({
    rating: 0,
    message: '',
    // age: '',
    // gender: '',
    // nationality: '',
  });

  const onChanges = (keys, value) => {
    setFeedBackData((prev) => {
      return {
        ...prev,
        [keys]: value,
      };
    });
  };
  const [isCreateReq, setIsCreateReq] = useState(false);

  const supportedLanguage = [
    {
      lang: 'en',
      title: 'Tell us what you think',
      description: 'How satisfied are you with this app?',
      rating: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      inputPlaceHolder: 'how can we improve this app?',
      submitButtonText: 'Submit',
    },
    {
      lang: 'ar',
      title: 'أخبرنا برأيك',
      description: 'كم انت راض بتطبيق هذا؟',
      rating: ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠'],
      inputPlaceHolder: 'كيف يمكننا تحسين هذا التطبيق؟',
      submitButtonText: 'إرسال',
    },
    {
      lang: 'ud',
      title: 'ہمیں بتائیں کہ آپ کیا سوچتے ہیں',
      description: 'کیا آپ اس ایپ سے مکمل طور پر خوش ہیں؟',
      rating: ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۱۰'],
      inputPlaceHolder: 'اس ایپ کو کیسے بہتر بنایا جا سکتا ہے؟',
      submitButtonText: 'جمع کرائیں',
    },

    {
      lang: 'bn',
      title: 'আপনি কি মনে করেন তা আমাদের বলুন',
      description: 'আপনি এই অ্যাপের সাথে কত সন্তুষ্ট?',
      rating: ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '১০'],
      inputPlaceHolder: 'আমরা এই অ্যাপটি কিভাবে উন্নত করতে পারি?',
      submitButtonText: 'জমা দিন',
    },
    {
      lang: 'bm',
      title: 'Beritahu kami pendapat anda',
      description: 'Berapa berpuas hati anda dengan aplikasi ini?',
      rating: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      inputPlaceHolder: 'Bagaimana kita boleh meningkatkan aplikasi ini?',
      submitButtonText: 'Hantar',
    },
  ];

  const handleSave = async () => {
    try {
      setIsCreateReq(true);
      const res = await API.post('/api/feedback', {
        ...feedBackData,
        // lang: currentLanguage,
      });
      setIsCreateReq(false);
      if (res?.data?.success) {
        window.gtag('event', 'feedback_submitted', {
          event_category: 'Feedback',
          lang: currentLanguage,
          rating: feedBackData.rating,
          message: feedBackData.message,
          //   age: feedBackData.age,
          //   gender: feedBackData.gender,
          //   nationality: feedBackData.nationality,
        });

        Swal.fire({
          title: res?.data?.data?.langMessage?.title,
          text: res?.data?.data?.langMessage?.description,
          icon: 'success',
          closeOnConfirm: false,
          closeOnCancel: false,
          showConfirmButton: false,
          timer: 2000,
          customClass: currentLanguage === 'ar' && 'ud' ? 'swal-rtl' : '',
        });
        setIsOpen(false);
      } else {
        Swal.fire({
          title: 'Error!',
          text: res?.data?.message,
          icon: 'error',
        });
      }
    } catch (error) {
      console.log(error);
      setIsCreateReq(false);
      Swal.fire({
        title: 'Error!',
        text: error?.response?.data?.message,
        icon: 'error',
      });
    }
  };

  const selectedLangData =
    supportedLanguage.find((item) => item?.lang === currentLanguage) ||
    supportedLanguage[0];

  const handleRedirect = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Dialog
            static
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-[100]"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30"
            />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              <DialogPanel
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full lg:max-w-[600px] space-y-4 bg-white p-8 rounded-md"
              >
                <DialogTitle className="flex gap-4 justify-between items-center">
                  <h2 className="text-xl text-[#4a4a4a] font-inter font-bold text-center md:text-left">
                    Resources
                  </h2>
                  <button onClick={() => setIsOpen(false)}>
                    <IoIosCloseCircleOutline size={25} />
                  </button>
                </DialogTitle>
                <div className="max-h-[400px] overflow-hidden overflow-y-auto flex pr-4 flex-col gap-4">
                  {data?.length > 0
                    ? data?.map((item, i) => (
                        <div
                          key={i}
                          className={`
                                            rounded-lg border p-6
                                            transition-all duration-200
                                            hover:shadow-lg border-[#02B1BF]
                                            flex
                                            items-left
                                        `}
                        >
                          <div className="space-y-1">
                            <p className="text-md text-[#221E1F] cursor-pointer font-bold">
                              {item?.title}
                            </p>

                            <button
                              className="bg-[#02B1BF] text-white py-1 pt-2 px-3 rounded-lg flex items-center gap-1 justify-between"
                              onClick={() => handleRedirect(item?.link)}
                            >
                              Link <LuArrowUpRight className="-mt-1" />
                            </button>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
