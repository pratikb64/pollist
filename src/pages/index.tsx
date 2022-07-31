import { Img, Layout } from '@components';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status == 'authenticated') router.push('/dashboard');
  }, [status]);

  return (
    <Layout>
      <div className="m-auto flex min-h-[450px] max-w-xl flex-col items-center">
        <h1 className="mt-6 text-center text-2xl font-medium sm:text-4xl">
          Create <b>UNLIMITED</b> polls for <b>FREE</b>
        </h1>
        <div className="mt-4 flex flex-wrap justify-center">
          <div className="mr-4 mb-4 flex items-center sm:mb-0">
            <Img
              className="mr-1 h-5 w-5"
              alt="check-mark"
              src="/images/check.png"
            />
            <span>Hosted link</span>
          </div>
          <div className="flex items-center">
            <Img
              className="mr-1 h-5 w-5"
              alt="check-mark"
              src="/images/check.png"
            />
            <span>Embed in your website</span>
          </div>
        </div>
        <div className="mt-8 sm:mt-16">
          <div className="mx-2 rounded-xl border-2 border-gray-200 p-2 sm:p-4">
            <div>
              <span className="text-xl font-bold">
                Want to create your first poll?
              </span>
            </div>
            <div className="mt-4 font-medium">
              <div className="my-2">
                <Link href={'/login'}>
                  <a className="text-gray-900 no-underline">
                    <div className="flex cursor-pointer items-center rounded-md border-2 border-gray-200/75 p-3 shadow-indigo-900 transition-all duration-[250ms] ease-in-out hover:scale-[1.015] hover:shadow-depth">
                      Yes! Let me login and create one.
                    </div>
                  </a>
                </Link>
              </div>
              <div className="my-2">
                <Link href={'/register'}>
                  <a className="text-gray-900 no-underline">
                    <div className="flex cursor-pointer items-center rounded-md border-2 border-gray-200/75 p-3 shadow-indigo-900 transition-all duration-[250ms] ease-in-out hover:scale-[1.015] hover:shadow-depth">
                      Yes! Let me register and create one.
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
