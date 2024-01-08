'use client';

import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';
import styles from './google_map.module.css';

export default function GMap({ center, isLoaded }) {
  const j = (...classes) => classes.join(' ');

  return (
    <div className={styles.map_container}>
      <GoogleMap
        center={center}
        zoom={10}
        mapContainerClassName={styles.map}
        options={{
          zoomControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}></GoogleMap>
    </div>
  );
}
