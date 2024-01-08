import Navbar from './components/Navbar/navbar';
import './globals.css';
import Provider from './provider';

export const metadata = {
  title: 'Pick A Ride',
  description: 'Cause we all need a ride sometimes',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
