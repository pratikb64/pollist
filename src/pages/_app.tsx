import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../styles/globals.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session} basePath="/api/v1/auth">
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: 'shadow-2xl',
          style: {
            background: '#4f46e5',
            color: '#fff',
            minWidth: '150px',
          },
        }}
      />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
