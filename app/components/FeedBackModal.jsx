'use client';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Loader from '../../components/Shared/Loader';
import { isValidArray } from '../../lib/func';
import API from '../../lib/instance/instance';
export default function FeedBackModal({ setIsOpen, isOpen }) {
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
              {selectedLangData?.lang && (
                <DialogPanel
                  as={motion.div}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full lg:max-w-[600px] space-y-4 bg-white p-8 rounded-md"
                  dir={selectedLangData.lang === 'ar' && 'ud' ? 'rtl' : 'ltr'}
                >
                  <DialogTitle className="flex gap-4 justify-between items-center">
                    <h2 className="text-xl text-[#4a4a4a] font-inter font-bold text-center md:text-left">
                      {selectedLangData?.title}
                    </h2>
                    <button onClick={() => setIsOpen(false)}>
                      <IoIosCloseCircleOutline size={25} />
                    </button>
                  </DialogTitle>
                  <div className="">
                    <div className="">
                      <p className="mb-4 text-[#4a4a4a] text-base font-inter font-medium">
                        {selectedLangData.description}
                      </p>
                      {/* <div className="flex flex-wrap lg:justify-between gap-2 mb-4">
                        {isValidArray(selectedLangData?.rating) &&
                          selectedLangData?.rating.map((num) => (
                            <button
                              key={num}
                              className={`w-9 h-9 p-1 rounded-lg font-medium font-inter text-[#525657] ${
                                rating === num
                                  ? 'bg-[#02B1BF] text-white'
                                  : 'bg-[#DEF2F9]'
                              }`}
                              onClick={() => setRating(num)}
                            >
                              {num}
                            </button>
                          ))}
                      </div> */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {isValidArray(selectedLangData?.rating) && (
                          <>
                            <div className="flex gap-3.5 w-full flex-wrap justify-center">
                              {/* .slice(0, 10) */}
                              {/* .slice(0, 10) */}
                              {selectedLangData?.rating.map((num) => (
                                <button
                                  key={num}
                                  // className={`w-9 h-9 p-1 rounded-lg font-medium font-inter text-[#525657] ${feedBackData?.rating === num
                                  //   ? 'bg-[#02B1BF] text-white'
                                  //   : 'bg-[#DEF2F9]'
                                  //   }`}
                                  // className={`w-9 h-9 p-1 rounded-lg font-medium font-inter text-[#525657] ${feedBackData?.rating === num
                                  //   ? 'bg-[#02B1BF] text-white'
                                  //   : 'bg-[#DEF2F9]'
                                  //   }`}
                                  className={`w-9 h-9 p-1 rounded-lg font-medium font-inter text-white
  ${
    [0, 1, 2, 3, 4, 5, 6].includes(num)
      ? 'bg-orange-600'
      : [7, 8].includes(num)
      ? 'bg-yellow-400'
      : [9, 10].includes(num)
      ? 'bg-green-500'
      : 'bg-[#DEF2F9]'
  }
  ${feedBackData?.rating === num ? 'outline outline-2 outline-black' : ''}`}
                                  onClick={() => onChanges('rating', num)}
                                >
                                  {num}
                                </button>
                              ))}
                              {/* {selectedLangData?.rating
                                .slice(0, 5)
                                .map((num) => (
                                  <button
                                    key={num}
                                    className={`w-9 h-9 p-1 rounded-lg font-medium font-inter text-[#525657] ${
                                      feedBackData?.rating === num
                                        ? 'bg-[#02B1BF] text-white'
                                        : 'bg-[#DEF2F9]'
                                    }`}
                                    onClick={() => onChanges('rating', num)}
                                  >
                                    {num}
                                  </button>
                                ))} */}
                            </div>
                            {/* <div className="flex gap-4 w-full">
                              {selectedLangData?.rating
                                .slice(5, 10)
                                .map((num) => (
                                  <button
                                    key={num}
                                    className={`w-9 h-9 p-1 rounded-lg font-medium font-inter text-[#525657] ${
                                      feedBackData?.rating === num
                                        ? 'bg-[#02B1BF] text-white'
                                        : 'bg-[#DEF2F9]'
                                    }`}
                                    onClick={() => onChanges('rating', num)}
                                  >
                                    {num}
                                  </button>
                                ))}
                            </div> */}
                          </>
                        )}
                      </div>
                      <div className="flex justify-between py-3">
                        <p className="text-xs text-[#4a4a4a] font-inter font-medium leading-4">
                          1 - Very unlikely
                        </p>
                        <p className="text-xs text-[#4a4a4a] font-inter font-medium leading-4">
                          10 - Very likely
                        </p>
                      </div>

                      {/* <div>
                        <FeedbackOption
                          feedBackData={feedBackData}
                          setFeedBackData={setFeedBackData}
                          onChanges={onChanges}
                        />
                      </div> */}
                      <textarea
                        className="w-full p-2 border rounded-lg mb-4 bg-white border-[#02B1BF] focus:outline-none focus:ring-0"
                        rows="4"
                        placeholder={selectedLangData.inputPlaceHolder}
                        value={feedBackData?.message || ''}
                        onChange={(e) => {
                          onChanges('message', e.target?.value);
                        }}
                      />
                      {isCreateReq ? (
                        <button className="bg-[#02B1BF] text-white py-2 px-4 rounded-lg cursor-not-allowed">
                          <Loader className="w-4 h-4" />{' '}
                          {selectedLangData.submitButtonText}
                        </button>
                      ) : (
                        <button
                          className="bg-[#02B1BF] text-white py-2 px-4 rounded-lg"
                          onClick={handleSave}
                        >
                          {selectedLangData.submitButtonText}
                        </button>
                      )}
                    </div>
                  </div>
                </DialogPanel>
              )}
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
