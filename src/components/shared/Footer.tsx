import React from 'react';
import { Img } from '@components';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="py-3  md:p-6 ">
      <div className="m-auto flex max-w-7xl flex-col items-center justify-center ">
        <Link href="/">
          <a>
            <Img
              className="h-8 w-8 sm:h-10 sm:w-10"
              src="/logo.svg"
              alt="logo"
            />
          </a>
        </Link>
        <div className="font-space-grotesk mt-5 text-center text-sm font-bold transition-all">
          Created by{' '}
          <a
            target={'_blank'}
            rel="noreferrer"
            href="https://twitter.com/pratikbadhe"
          >
            Pratik Badhe
          </a>{' '}
          for{' '}
          <a
            target={'_blank'}
            rel="noreferrer"
            href="https://planetscale.com/?utm_source=hashnode&utm_medium=hackathon&utm_campaign=announcement_article"
          >
            PlanetScale
          </a>{' '}
          x{' '}
          <a
            target={'_blank'}
            rel="noreferrer"
            href="https://hashnode.com/?source=planetscale_hackathon_announcement"
          >
            Hashnode
          </a>{' '}
          Hackathon. <br />
          Check{' '}
          <a
            target={'_blank'}
            rel="noreferrer"
            href="https://github.com/pratikb64/pollist"
          >
            source code
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
