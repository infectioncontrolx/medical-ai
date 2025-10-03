import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SelectedBusinessContext } from '../context/SelectedBusinessContext';
import { UserLocationContext } from '../context/UserLocationContext';

function GoogleMapView({ businessList }) {
  const { userLocation, setUserLocation } = useContext(UserLocationContext);
  const { selectedBusiness, setSelectedBusiness } = useContext(
    SelectedBusinessContext
  );
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const [map, setMap] = useState();

  const containerStyle = {
    width: '100%',
    height: '76vh',
  };

  useEffect(() => {
    if (map && selectedBusiness) {
      map.panTo(selectedBusiness.geometry.location);
    }
  }, [selectedBusiness]);

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        mapIds={['my-map-id']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={
            !selectedBusiness?.name
              ? userLocation
              : selectedBusiness.geometry.location
          }
          options={{ mapId: 'my-map-id' }}
          zoom={14}
          onLoad={(map) => setMap(map)}
        >
          <MarkerF
            position={userLocation}
            icon={{
              url: '/user-location.png',
              scaledSize: {
                width: 50,
                height: 50,
              },
            }}
          />
          {/* {businessList.map((item,index)=>index<=5&&(
                <Markers business={item} key={index}/>
              ))} */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default GoogleMapView;
