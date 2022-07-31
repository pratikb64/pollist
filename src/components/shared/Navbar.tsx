import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Img } from '@components';
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const { asPath } = useRouter();
  const { status } = useSession();

  const navLinks = [
    {
      name: `My polls`,
      href: '/dashboard',
      visibleWhen: ['authenticated'],
    },
    {
      name: `Profile`,
      href: '/profile',
      visibleWhen: ['authenticated'],
    },
    {
      name: `Login`,
      href: '/login',
      visibleWhen: ['loading', 'unauthenticated'],
    },
    {
      name: `Register`,
      href: '/register',
      visibleWhen: ['loading', 'unauthenticated'],
    },
  ];

  return (
    <div className="m-auto max-w-7xl p-2  md:pt-6">
      <nav>
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center text-gray-900 no-underline">
              <Img
                className="mr-2 h-8 w-8 sm:h-10 sm:w-10"
                src="/logo.svg"
                alt="logo"
              />
              <span className="hidden text-2xl font-bold sm:block">
                Pollist
              </span>
            </a>
          </Link>
          <div className="flex font-bold">
            {navLinks.map((link, index) => {
              if (!link.visibleWhen.includes(status)) return;
              return (
                <Link href={link.href} key={index}>
                  <a
                    className={`px-4 no-underline transition-colors duration-300 hover:text-gray-400 ${
                      asPath == link.href
                        ? 'text-gray-500 hover:text-gray-400'
                        : 'text-gray-900'
                    } `}
                  >
                    {link.name}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
