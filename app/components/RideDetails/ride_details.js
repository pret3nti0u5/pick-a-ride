import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Poppins } from 'next/font/google';
import styles from './ride_details.module.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export default function RideDetails({ updateRides }) {
  const j = (...classes) => classes.join(' ');
  const [loading, setLoading] = useState(true);
  const [ongoingRide, setOngoingRide] = useState(null);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const startRide = async (id) => {
    setLoading(true);
    try {
      const res = await fetch('/api/update_ride', {
        method: 'POST',
        body: JSON.stringify({
          rideId: id,
          setOngoing: true,
          setCompleted: false,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        const updatedRides = upcomingRides.filter((ride) => ride.id !== id);
        setOngoingRide([upcomingRides.find((ride) => ride.id === id)]);
        setUpcomingRides(updatedRides);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const endRide = async (id) => {
    setLoading(true);
    try {
      const res = await fetch('/api/update_ride', {
        method: 'POST',
        body: JSON.stringify({
          rideId: id,
          setOngoing: false,
          setCompleted: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        const updatedRides = ongoingRide.filter((ride) => ride.id !== id);
        setOngoingRide(updatedRides);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!session) return;
    const fetchRides = async () => {
      try {
        const res = await fetch('/api/get_rides');
        const data = await res.json();
        const ongoingRide = [];
        const upcomingRides = [];
        data.rides.forEach((ride) => {
          if (ride.ongoing) {
            ongoingRide.push(ride);
          }
          if (!ride.ongoing && !ride.completed) {
            upcomingRides.push(ride);
          }
        });
        setOngoingRide(ongoingRide);
        setUpcomingRides(upcomingRides);
        setLoading(false);
        console.log(data.rides);
      } catch (err) {
        setError(err);
      }
    };
    fetchRides();
  }, [session, updateRides]);

  useEffect(() => {
    if (!session) return;
    const fetchUserId = async () => {
      try {
        const res = await fetch('/api/get_user_id');
        const data = await res.json();
        setUserId(data);
      } catch (err) {
        setError(err);
      }
    };
    fetchUserId();
  }, [session]);

  if (loading) return <div>loading...</div>;

  return (
    <div className={j(styles.ride_types_container, poppins.className)}>
      {ongoingRide.length > 0 && (
        <div className={j(styles.ongoing_container, poppins.className)}>
          <div className={styles.ride_type_title}>
            <h2>On Going Ride</h2>
          </div>
          {ongoingRide.map((ride) => (
            <div key={ride.id} className={styles.ride_all_details_container}>
              <div className={styles.ride_details_container}>
                <div className={styles.ride_origin_destination}>
                  <h2 className={styles.ride_origin}>
                    {JSON.parse(ride.origin).city}
                  </h2>
                  <h2 className={styles.ride_arrow}>→</h2>
                  <h2 className={styles.ride_destination}>
                    {JSON.parse(ride.destination).city}
                  </h2>
                </div>
                <div className={styles.ride_date_time}>
                  <h2 className={styles.ride_date}>
                    📅
                    {new Date(ride.date).toLocaleDateString()}
                  </h2>
                </div>
              </div>
              <div className={styles.ride_rest_details}>
                <div className={styles.ride_driver_details}>
                  <h3 className={styles.ride_driver_title}>Driver</h3>
                  <h2 className={styles.ride_driver_name}>{ride.driverName}</h2>
                </div>
                <div className={styles.ride_car_details}>
                  <h3 className={styles.ride_car_title}>Car No.</h3>
                  <h2 className={styles.ride_car_no}>{ride.carno}</h2>
                </div>
                <div className={styles.ride_contact_details}>
                  <h3 className={styles.ride_contact_title}>Contact</h3>
                  <h2 className={styles.ride_contact_no}>{ride.contact}</h2>
                </div>
              </div>
              <div className={styles.pulsing_dot}></div>
              {ride.userId === userId && (
                <button
                  onClick={() => endRide(ride.id)}
                  className={styles.ride_details_button}>
                  {loading ? 'Loading...' : 'End Ride'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {upcomingRides.length > 0 && (
        <div className={j(styles.ongoing_container, poppins.className)}>
          <div className={styles.ride_type_title}>
            <h2>Upcoming Rides</h2>
          </div>
          {upcomingRides.map((ride) => (
            <div key={ride.id} className={styles.ride_all_details_container}>
              <div className={styles.ride_details_container}>
                <div className={styles.ride_origin_destination}>
                  <h2 className={styles.ride_origin}>
                    {JSON.parse(ride.origin).city}
                  </h2>
                  <h2 className={styles.ride_arrow}>→</h2>
                  <h2 className={styles.ride_destination}>
                    {JSON.parse(ride.destination).city}
                  </h2>
                </div>
                <div className={styles.ride_date_time}>
                  <h2 className={styles.ride_date}>
                    📅 {new Date(ride.date).toLocaleDateString()}
                  </h2>
                </div>
              </div>
              <div className={styles.ride_rest_details}>
                <div className={styles.ride_driver_details}>
                  <h3 className={styles.ride_driver_title}>Driver</h3>
                  <h2 className={styles.ride_driver_name}>{ride.driverName}</h2>
                </div>
                <div className={styles.ride_car_details}>
                  <h3 className={styles.ride_car_title}>Car No.</h3>
                  <h2 className={styles.ride_car_no}>{ride.carno}</h2>
                </div>
                <div className={styles.ride_contact_details}>
                  <h3 className={styles.ride_contact_title}>Contact</h3>
                  <h2 className={styles.ride_contact_no}>{ride.contact}</h2>
                </div>
              </div>
              {ongoingRide.length == 0 && ride.userId === userId && (
                <button
                  onClick={() => startRide(ride.id)}
                  className={styles.ride_start_button}>
                  {loading ? 'Loading...' : 'Start Ride'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
