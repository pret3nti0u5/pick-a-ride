'use client';

import data from '@/public/locations.json';
import { useState, useEffect } from 'react';
import { Poppins } from 'next/font/google';
import styles from './detail_form.module.css';
import { useSession, signIn } from 'next-auth/react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export default function DetailForm({
  updateRides,
  setUpdateRides,
  setShowSearchDetail,
  setSearchData,
}) {
  const j = (...classes) => classes.join(' ');
  const [origin, setOrigin] = useState('');
  const [originCoordinates, setOriginCoordinates] = useState({});
  const [destination, setDestination] = useState('');
  const [destinationCoordinates, setDestinationCoordinates] = useState({});
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('');
  const [originOptions, setOriginOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [offerRideSelected, setOfferRideSelected] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [driverName, setDriverName] = useState('');
  const [carNo, setCarNo] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const getAutocomplete = (input, type) => {
    const options = data.filter((location) => {
      const regex = new RegExp(`^${input}`, 'gi');
      return location.city.match(regex);
    });
    if (type === 'origin') {
      setOrigin(input);
      setOriginOptions(options);
    } else if (type === 'destination') {
      setDestination(input);
      setDestinationOptions(options);
    }
  };

  const publishRide = async () => {
    if (!session) {
      signIn('google');
      return;
    }

    setLoading(true);
    const formattedDate = new Date(date).toISOString();
    const originObj = {
      city: origin,
      lat: originCoordinates.lat,
      lng: originCoordinates.lng,
    };

    const destinationObj = {
      city: destination,
      lat: destinationCoordinates.lat,
      lng: destinationCoordinates.lng,
    };

    const originString = JSON.stringify(originObj);
    const destinationString = JSON.stringify(destinationObj);

    try {
      const res = await fetch('/api/publish_ride', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: originString,
          destination: destinationString,
          date: formattedDate,
          passengersno: parseInt(passengers),
          driverName,
          carno: carNo,
          contact: contactNo,
        }),
      });
      const data = await res.json();
      setUpdateRides(!updateRides);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const searchRide = async () => {
    setLoading(true);
    const formattedDate = new Date(date).toISOString();
    const originObj = {
      city: origin,
      lat: originCoordinates.lat,
      lng: originCoordinates.lng,
    };

    const destinationObj = {
      city: destination,
      lat: destinationCoordinates.lat,
      lng: destinationCoordinates.lng,
    };

    const originString = JSON.stringify(originObj);
    const destinationString = JSON.stringify(destinationObj);

    try {
      const res = await fetch('/api/search_rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: originString,
          destination: destinationString,
          date: formattedDate,
          passengersno: parseInt(passengers),
          driverName,
          carno: carNo,
          contact: contactNo,
        }),
      });
      const data = await res.json();
      setSearchData(data);
      setShowSearchDetail(true);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    if (origin === '') {
      setErrorText('Please enter origin');
    } else if (!data.find((location) => location.city === origin)) {
      setErrorText('Please enter valid origin');
    } else if (destination === '') {
      setErrorText('Please enter destination');
    } else if (!data.find((location) => location.city === destination)) {
      setErrorText('Please enter valid destination');
    } else if (date === '') {
      setErrorText('Please enter date');
    } else if (passengers === '') {
      setErrorText('Please enter number of passengers');
    } else if (passengers === '0') {
      setErrorText('You cannot travel alone');
    } else if (passengers.length > 2) {
      setErrorText('You cannot travel with more than 99 passengers');
    } else if (offerRideSelected && driverName === '') {
      setErrorText('Please enter driver name');
    } else if (offerRideSelected && carNo === '') {
      setErrorText('Please enter car number');
    } else if (offerRideSelected && contactNo === '') {
      setErrorText('Please enter contact number');
    } else if (offerRideSelected && contactNo.length > 10) {
      setErrorText('Please enter valid contact number');
    } else if (offerRideSelected && contactNo.length < 10) {
      setErrorText('Please enter valid contact number');
    } else {
      setErrorText('');
      if (offerRideSelected) {
        publishRide();
      } else {
        searchRide();
      }
    }
  };

  const handleNoChange = (value, type) => {
    //  Regex to check if value is a number
    const regex = new RegExp('^[0-9]+$');
    if (!regex.test(value) && value !== '') {
      setErrorText('Please enter valid number');
      return;
    }
    if (type === 'passengers') {
      if (value.length > 2) {
        setErrorText('You cannot travel with more than 99 passengers');
        return;
      }
      setPassengers(value);
    } else {
      if (value.length > 10) {
        setErrorText('Please enter valid contact number');
        return;
      }
      setContactNo(value);
    }
  };

  return (
    <div className={j(styles.ride_container, poppins.className)}>
      <div className={styles.ride_type}>
        <h2
          onClick={() => setOfferRideSelected(true)}
          className={
            offerRideSelected
              ? j(styles.ride_type_title, styles.ride_selected)
              : styles.ride_type_title
          }>
          Offer Ride
        </h2>
        <h2
          onClick={() => setOfferRideSelected(false)}
          className={
            offerRideSelected
              ? styles.ride_type_title
              : j(styles.ride_type_title, styles.ride_selected)
          }>
          Find Ride
        </h2>
      </div>
      <div className={styles.ride_form}>
        <div className={styles.ride_location_container}>
          <input
            className={styles.ride_location_from}
            type='text'
            placeholder='From?'
            value={origin}
            onChange={(e) => getAutocomplete(e.target.value, 'origin')}
          />
          {origin !== '' && originOptions.length > 0 && (
            <ul className={styles.ride_location_options}>
              {originOptions.map((option, i) => (
                <li
                  onClick={() => {
                    setOrigin(option.city);
                    setOriginCoordinates({
                      lat: option.lat,
                      lng: option.lng,
                    });
                    setOriginOptions([]);
                  }}
                  key={i}
                  className={styles.ride_location_option}>
                  {option.city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.ride_location_container}>
          <input
            className={styles.ride_location_to}
            type='text'
            placeholder='To?'
            value={destination}
            onChange={(e) => getAutocomplete(e.target.value, 'destination')}
          />
          {destination !== '' && destinationOptions.length > 0 && (
            <ul className={styles.ride_location_options}>
              {destinationOptions.map((option, i) => (
                <li
                  onClick={() => {
                    setDestination(option.city);
                    setDestinationCoordinates({
                      lat: option.lat,
                      lng: option.lng,
                    });
                    setDestinationOptions([]);
                  }}
                  key={i}
                  className={styles.ride_location_option}>
                  {option.city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={j(styles.ride_location_container, styles.ride_half)}>
          <input
            className={styles.ride_location_date}
            type='date'
            placeholder={new Date().toISOString().split('T')[0]}
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className={j(styles.ride_location_container, styles.ride_half)}>
          <input
            className={styles.ride_location_passengers}
            type='text'
            placeholder='🙍‍♂️'
            value={passengers}
            onChange={(e) => handleNoChange(e.target.value, 'passengers')}
          />
        </div>
      </div>
      {offerRideSelected && (
        <div className={styles.ride_add_form}>
          <div className={styles.ride_location_container}>
            <input
              className={styles.ride_location_from}
              type='text'
              placeholder='Driver Name'
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
            />
          </div>
          <div className={styles.ride_location_container}>
            <input
              className={styles.ride_location_to}
              type='text'
              placeholder='Car Number'
              value={carNo}
              onChange={(e) => setCarNo(e.target.value)}
            />
          </div>
          <div className={styles.ride_location_container}>
            <input
              className={styles.ride_location_contact}
              type='text'
              placeholder='Contact No.'
              value={contactNo}
              onChange={(e) => handleNoChange(e.target.value, 'contactNo')}
            />
          </div>
        </div>
      )}
      <div className={styles.ride_error}>
        <p className={styles.ride_error_text}>{errorText}</p>
      </div>
      <div className={styles.search_button}>
        <button
          onClick={() => handleSubmit()}
          className={styles.search_button_text}>
          {loading ? 'Loading...' : offerRideSelected ? 'Publish' : 'Search'}
        </button>
      </div>
    </div>
  );
}
