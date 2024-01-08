import { Poppins } from 'next/font/google';
import styles from './search_detail.module.css';
import Image from 'next/image';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export default function SearchDetail({
  searchData,
  setShowSearchDetail,
  updateRides,
  setUpdateRides,
}) {
  const j = (...classes) => classes.join(' ');
  if (searchData === undefined) return null;

  const joinRide = async (rideId) => {
    try {
      const res = await fetch('/api/join_ride', {
        method: 'POST',
        body: JSON.stringify({ rideId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      if (res.status === 200) {
        setShowSearchDetail(false);
        setUpdateRides(!updateRides);
      }
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={j(styles.search_container, poppins.className)}>
      {searchData.rides.length >= 0 && (
        <div className={j(styles.ongoing_container, poppins.className)}>
          <div className={styles.ride_type_title_container}>
            <div className={styles.ride_type_title}>
              <h2>Search Results</h2>
            </div>
            <button
              onClick={() => setShowSearchDetail(false)}
              className={styles.close_button}>
              <h2>×</h2>
            </button>
          </div>
          {searchData.rides.length === 0 && (
            <div className={styles.no_rides_container}>
              <h2 className={styles.no_rides_title}>No Rides Found</h2>
              <h2 className={styles.no_rides_subtitle}>
                Try changing the search criteria
              </h2>
            </div>
          )}
          {searchData.rides.map((ride) => (
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
              <div className={styles.poster_info}>
                <h2 className={styles.poster_title}>Posted By:</h2>
                <div className={styles.poster_image}>
                  <Image
                    alt='user image'
                    src={ride.user.image}
                    width={25}
                    height={25}
                  />
                </div>
                <h2 className={styles.poster_name}>{ride.user.name}</h2>
              </div>
              <button
                onClick={() => joinRide(ride.id)}
                className={styles.ride_details_button}>
                Join Ride
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
