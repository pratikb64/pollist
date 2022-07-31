import { Layout, PollItem, Button } from '@components';
import { PlusIcon } from '@heroicons/react/outline';
import { Poll } from '@prisma/client';
import { CONSTANTS } from '@utils';
import axios from 'axios';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { status } = useSession();
  const router = useRouter();
  const [polls, setPolls] = useState<Array<Poll>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login');
      toast.error('Login to view your dashboard!');
    }
  }, [status]);

  useEffect(() => {
    axios({
      url: CONSTANTS.BASE_URL + '/v1/polls',
      method: 'GET',
    })
      .then((d) => {
        setPolls(d.data.polls);
        setIsLoading(false);
      })
      .catch((er) => toast.error('Failed to get poll details!'));
  }, []);

  return (
    <Layout>
      <div className="m-auto mt-4 min-h-[70vh] max-w-7xl md:mt-6">
        <div className="flex justify-center">
          <Link href="/poll/new">
            <a className="no-underline">
              <Button button_type="primary">
                <PlusIcon className="mr-1 w-5 text-white" /> Create New Poll
              </Button>
            </a>
          </Link>
        </div>
        <hr className="my-5 text-gray-300" />
        {isLoading && (
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
        )}
        {!isLoading && polls.length == 0 && (
          <div className="mt-8 text-center text-gray-500">
            Your polls will appear here!
          </div>
        )}
        {!isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {polls.map((poll, pollIndex) => {
              return (
                <div key={pollIndex} className="m-auto">
                  <Link href={'/poll/' + poll.id + '/edit'}>
                    <a className="text-black no-underline transition-all duration-300">
                      <PollItem
                        question={poll.question}
                        createdAt={poll.createdAt}
                        active={poll.active}
                        id={poll.id}
                      />
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
