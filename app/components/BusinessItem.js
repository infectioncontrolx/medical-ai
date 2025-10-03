import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserLocationContext } from '../context/UserLocationContext';

function BusinessItem({ business, showDir = false }) {
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const photo_ref = business?.photos
    ? business?.photos[0]?.photo_reference
    : '';
  const { userLocation, setUserLocation } = useContext(UserLocationContext);
  const [distance, setDistance] = useState();
  useEffect(() => {
    calculateDistance(
      business.geometry.location.lat,
      business.geometry.location.lng,
      userLocation.lat,
      userLocation.lng
    );
  }, []);
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

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

    setDistance(distance.toFixed(1));
    return distance.toFixed(2); // Return the distance with 2 decimal places
  };

  const onDirectionClick = () => {
    window.open(
      'https://www.google.com/maps/dir/?api=1&origin=' +
        userLocation.lat +
        ',' +
        userLocation.lng +
        '&destination=' +
        business.geometry.location.lat +
        ',' +
        business.geometry.location.lng +
        '&travelmode=driving'
    );
  };

  return (
    <div
      className="min-w-[195px]  flex flex-col justify-between min-h-[110px]   flex-shrink-0 pb-2  px-2
     rounded-lg shadow-md mb-1
     hover:scale-110 transition-all   mt-[20px] cursor-pointer z-20"
      onClick={onDirectionClick}
    >
      {/* <Image src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_ref}&key=${GOOGLE_API_KEY}`}
            alt={business.name}
            width={180}
            height={80}
            className='rounded-lg object-cover h-[90px] '
        /> */}

      <Link
        href=""
        onClick={onDirectionClick}
        className="text-[14px] font-bold flex  justify-between items-center gap-3` relative  "
      >
        {business.name[currentLanguage]}{' '}
      </Link>
      <h2
        className="text-[10px] text-gray-400
                line-clamp-2"
      >
        {business.formatted_address[currentLanguage]}
      </h2>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-yellow-500"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-[14px] mt-1 font-bold">{business.rating}</h2>
        </div>
        <span className=" w-[28px] max-h-[28px] rounded-lg     ">
          <Image
            src={`${
              business.type === 'hospital' ? '/Hospital.jpeg' : '/Clinic.png'
            }`}
            width={24}
            height={24}
            alt=""
            className=" "
          />
        </span>
      </div>
      {showDir ? (
        <div className="border-t-[1px] p-1 mt-1">
          <h2
            className="text-[#0075ff]
              flex justify-between items-center"
          >
            Dist: {distance} Mile
            <span
              className="border-[1px] p-1 rounded-full
              border-blue-500
              hover:text-white
              hover:bg-blue-500"
              onClick={() => onDirectionClick()}
            >
              Get Direction
            </span>
          </h2>
        </div>
      ) : null}
    </div>
  );
}

export default BusinessItem;
