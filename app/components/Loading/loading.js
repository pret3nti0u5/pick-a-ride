import localFont from 'next/font/local';
import styles from './loading.module.css';
import { Space_Grotesk } from 'next/font/google';

const SpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
});

export default function Loading() {
  return (
    <div className={styles.loadingContainer + ' ' + SpaceGrotesk.className}>
      <video className={styles.video_website} autoPlay loop muted>
        <source src='/renders/loading-website.mp4' type='video/mp4' />
      </video>
      <video className={styles.video_mobile} autoPlay loop muted>
        <source src='/renders/loading-mobile.mp4' type='video/mp4' />
      </video>
    </div>
  );
}
