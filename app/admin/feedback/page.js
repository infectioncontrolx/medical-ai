'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import { Parser } from '@json2csv/plainjs';
import { Loader } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Paginate from '../../../components/Paginate/Paginate';
import { isValidArray } from '../../../lib/func';
import API from '../../../lib/instance/instance';

const FeedBack = () => {
  const [isReq, setIsReq] = useState(false);
  const [feedBacks, setFeedBacks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const fetchFeedBack = async (page) => {
    try {
      setIsReq(true);
      const res = await API.get(
        `/api/feedback?lang=${currentLanguage}&page=${page || 1}&limit=${limit}`
      );

      if (res.data?.success) {
        setFeedBacks(res?.data);
      }
      setIsReq(false);
    } catch (error) {
      setIsReq(false);
    }
  };

  useEffect(() => {
    fetchFeedBack(1);
  }, [currentLanguage]);

  const onPageChange = async (page) => {
    setCurrentPage(page);
    await fetchFeedBack(page);
  };

  const downloadCSV = () => {
    if (isValidArray(feedBacks?.data)) {
      //   const fields = ['gender', 'age', 'nationality','lang', 'rating', 'message', 'createdAt'];
      const fields = ['rating', 'message', 'createdAt'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(
        feedBacks.data.map((feedback) => ({
          ...feedback,
          createdAt: moment(feedback.createdAt).format(
            'MMMM Do YYYY, h:mm:ss a'
          ),
        }))
      );

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'feedbacks.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="p-4 text-2xl font-bold font-inter">All Feedbacks</h2>
        <button
          onClick={downloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-6"
        >
          Download CSV
        </button>
      </div>
      <ul className="w-full lg:w-[600px] mx-auto" id="feedback-paginate">
        {!isReq &&
          isValidArray(feedBacks?.data) &&
          feedBacks.data.map((feedback, index) => (
            <li key={index} className="border p-4 mt-3 rounded-md">
              {/* <div>
                <p>
                  <span className="font-bold">Gender:</span> {feedback.gender}{' '}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Age:</span> {feedback.age}{' '}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Nationality:</span> {feedback?.nationality}{' '}
                </p>
              </div> */}
              {/* <div>
                <p>
                  <span className="font-bold">Lang:</span> {feedback?.lang}{' '}
                </p>
              </div> */}
              <div>
                <p>
                  <span className="font-bold">Rating:</span> {feedback.rating}{' '}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold"> Message:</span>{' '}
                  {feedback.message}{' '}
                </p>
              </div>
              <p>
                <strong>Date:</strong>{' '}
                <span className="text-gray-400">
                  {' '}
                  {moment(feedback.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                </span>
              </p>
            </li>
          ))}

        {isReq && (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        )}
      </ul>
      <div className="py-3">
        <Paginate
          setCurrentPage={setCurrentPage}
          totalPages={feedBacks?.paginate?.totalPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default FeedBack;
