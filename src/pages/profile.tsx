import { Layout } from '@components';
import { LogoutIcon } from '@heroicons/react/outline';
import { CONSTANTS } from '@utils';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Profile = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login');
      toast.error('Login to view your profile!');
    }
  }, [status]);

  useEffect(() => {
    axios({
      url: CONSTANTS.BASE_URL + '/v1/users',
      method: 'GET',
    })
      .then((d) =>
        setFormData({
          email: d.data?.user?.email || '',
          name: d.data?.user?.name || '',
        })
      )
      .catch((er) => toast.error('Failed to get user details!'));
  }, []);

  const handleChange = (e: HTMLInputElement) => {
    setFormData({
      ...formData,
      [e.name]: e.value,
    });
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    const loader = toast.loading('Updating your account!');
    axios({
      url: CONSTANTS.BASE_URL + '/v1/users',
      data: { name: formData.name },
      method: 'PUT',
    })
      .then((d) => {
        toast.success('Updated successfully!', { id: loader });
        setFormData({
          email: d.data?.user?.email || '',
          name: d.data?.user?.name || '',
        });
      })
      .catch((er) => toast.error('Failed to update account!', { id: loader }));
  };

  return (
    <Layout>
      <div className="m-auto mb-16 max-w-sm">
        <div>
          <h1 className="mb-4 text-center text-4xl font-bold">Profile</h1>
        </div>
        <form onSubmit={submitHandler} className="space-y-6">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="mx-1 my-6 flex flex-col">
            <label htmlFor="name" className="mb-2 text-sm font-bold">
              Name
            </label>
            <input
              onChange={(event) => handleChange(event.target)}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
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
              readOnly
              value={formData.email}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={(e) => {
                e.preventDefault();
                signOut({ callbackUrl: '/login' });
              }}
            >
              <LogoutIcon className="mr-1 w-5" /> Log out
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
