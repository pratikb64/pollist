import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Img, Layout } from '@components';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { CONSTANTS } from '@utils';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Register = () => {
  const [eyeState, setEyeState] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') router.push('/profile');
  }, [status]);

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    const loader = toast.loading('Setting up your account!');
    axios({
      url: CONSTANTS.BASE_URL + '/v1/users',
      data: formData,
      method: 'POST',
    })
      .then((d) => {
        toast.success('Account created!', { id: loader });
        location.replace('/login');
      })
      .catch((er) => toast.error('Failed to create account!', { id: loader }));
  };

  const handleChange = (e: HTMLInputElement) => {
    setFormData({
      ...formData,
      [e.name]: e.value,
    });
  };

  const togglePasswordVisibility = () => {
    setEyeState(!eyeState);
    if (!eyeState) passwordInput.current?.setAttribute('type', 'text');
    else passwordInput.current?.setAttribute('type', 'password');
  };

  return (
    <div className="m-auto">
      <Layout>
        <div className="mb-8 flex items-center justify-center p-2 md:p-3">
          <div className="w-full max-w-sm ">
            <form onSubmit={(event) => submitHandler(event)}>
              <div className="m-auto">
                <div>
                  <Img
                    className="mx-auto hidden h-12 w-auto md:block"
                    src="/logo.svg"
                    alt="Workflow"
                  />
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register your account
                  </h2>
                </div>
                <hr className="my-4 border-gray-400" />
                <div>
                  <div className="mx-1 my-6 flex flex-col">
                    <label htmlFor="name" className="mb-2 text-sm font-bold">
                      Name
                    </label>
                    <input
                      pattern="^[a-zA-Z\s]+$"
                      onChange={(event) => handleChange(event.target)}
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      type="text"
                      name="name"
                      id="name"
                      required
                    />
                  </div>
                  <div className="mx-1 my-6 flex flex-col">
                    <label htmlFor="email" className="mb-2 text-sm font-bold">
                      Email address
                    </label>
                    <input
                      onChange={(event) => handleChange(event.target)}
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      type="email"
                      name="email"
                      id="email"
                      required
                    />
                  </div>
                  <div className="relative mx-1 mb-6 flex flex-col">
                    <label
                      htmlFor="password"
                      className="mb-2 text-sm font-bold"
                    >
                      Password
                    </label>
                    <input
                      minLength={8}
                      onChange={(event) => handleChange(event.target)}
                      ref={passwordInput}
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      type="password"
                      name="password"
                      id="password"
                      required
                    />
                    <div
                      onClick={() => togglePasswordVisibility()}
                      className="absolute top-9 right-3 cursor-pointer"
                    >
                      {eyeState ? (
                        <EyeIcon className="w-5" />
                      ) : (
                        <EyeOffIcon className="w-5" />
                      )}
                    </div>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="submit"
                      className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Create account
                    </button>
                  </div>
                  <div className="mt-6 text-center">
                    <hr className="mb-4 border-gray-400" />
                    <span>Already have account? </span>
                    <Link href="/login" className="cursor-pointer ">
                      <a>Sign in</a>
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Register;
