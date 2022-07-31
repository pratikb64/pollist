import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { Img, Layout } from '@components';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [eyeState, setEyeState] = useState(false);
  const { status } = useSession();
  const passwordInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') router.push('/profile');
  }, [status]);

  const handleChange = (e: HTMLInputElement) => {
    setFormData({
      ...formData,
      [e.name]: e.value,
    });
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    const loader = toast.loading('Logging you in...');
    signIn('credentials', { ...formData, redirect: false })
      .then((d) => {
        if (d?.status === 401) {
          return toast.error('Wrong email or password!', { id: loader });
        }
        toast.success('Signed in successfully!', { id: loader });
      })
      .catch((e) => {
        console.log(e);
        toast.error('Errored!', { id: loader });
      });
  };

  const togglePasswordVisibility = () => {
    setEyeState(!eyeState);
    if (!eyeState) passwordInput.current?.setAttribute('type', 'text');
    else passwordInput.current?.setAttribute('type', 'password');
  };

  return (
    <Layout>
      <div className="mb-24 flex items-center justify-center p-2 md:p-3">
        <div className="w-full max-w-sm space-y-3">
          <div>
            <Img
              className="mx-auto hidden h-12  md:block"
              src="/logo.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <hr className="my-2 border-gray-400" />
          <form onSubmit={submitHandler} className="space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    onChange={(event) => handleChange(event.target)}
                  />
                </div>
              </div>
              <div className="relative mb-6 flex flex-col">
                <label htmlFor="password" className="mb-2 text-sm font-bold">
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
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </div>
            <div className="mt-6 text-center sm:mx-6">
              <hr className="mb-4 border-gray-400" />
              <span>Don&apos;t have account? </span>
              <Link href="/register" className="cursor-pointer ">
                <a>Register now!</a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
