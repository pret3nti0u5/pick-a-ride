'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import styles from './navbar.module.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export default function Navbar() {
  const j = (...classes) => classes.join(' ');
  const { data: session } = useSession();
  return (
    <nav className={j(styles.navbar, poppins.className)}>
      <ul>
        {!session ? (
          <button
            onClick={() => signIn('google')}
            className={styles.link}
            href='/login'>
            <li>Log in</li>
          </button>
        ) : (
          <div className={styles.link_container}>
            <Link className={styles.prev} href='/'>
              <li>{session.user.name}</li>
            </Link>
            <button className={styles.link} onClick={() => signOut()}>
              <li>Log out</li>
            </button>
          </div>
        )}
      </ul>
    </nav>
  );
}
