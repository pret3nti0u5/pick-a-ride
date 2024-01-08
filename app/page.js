'use client';

import { Roboto } from 'next/font/google';
import { useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import styles from './page.module.css';
import GMap from './components/GoogleMap/google_map';
import DetailForm from './components/DetailForm/detail_form';
import RideDetails from './components/RideDetails/ride_details';
import SearchDetail from './components/SearchDetail/search_detail';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

const center = { lat: 12.9716, lng: 77.5946 };

export default function Home() {
  const j = (...classes) => classes.join(' ');
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });
  const [updateRides, setUpdateRides] = useState(false);
  const [showSearchDetail, setShowSearchDetail] = useState(false);
  const [searchData, setSearchData] = useState(null);
  if (!isLoaded) return null;

  return (
    <main className={j(styles.main, roboto.className)}>
      <DetailForm
        isLoaded={isLoaded}
        updateRides={updateRides}
        setUpdateRides={setUpdateRides}
        setShowSearchDetail={setShowSearchDetail}
        setSearchData={setSearchData}
      />
      {showSearchDetail && (
        <SearchDetail
          searchData={searchData}
          setShowSearchDetail={setShowSearchDetail}
          updateRides={updateRides}
          setUpdateRides={setUpdateRides}
        />
      )}
      {!showSearchDetail && <RideDetails updateRides={updateRides} />}
      <GMap center={center} />
    </main>
  );
}
