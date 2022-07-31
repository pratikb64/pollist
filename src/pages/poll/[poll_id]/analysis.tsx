import { Layout } from '@components';
import { Poll, PollOption, PollVote } from '@prisma/client';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ScriptableContext,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatNumberWithComma } from '@utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalysisInterface {
  poll: Poll & {
    poll_options: (PollOption & {
      poll_votes: PollVote[];
    })[];
  };
}

const Analysis = ({ poll }: AnalysisInterface) => {
  let labels = new Set();
  poll.poll_options.forEach((opt) => {
    opt.poll_votes.forEach((pv) => labels.add(pv.createdAt.toDateString()));
  });

  let voteCountByDay: Array<number> = [];

  let totalVotes = 0;

  poll.poll_options.forEach((option) => {
    totalVotes += option.votes!;
  });

  labels.forEach((label) => {
    let temp = 0;
    poll.poll_options.forEach((opt) => {
      opt.poll_votes.forEach((pv) => {
        if (pv.createdAt.toDateString() == label) temp++;
      });
    });
    voteCountByDay.push(temp);
  });

  let lineData: ChartData<'line', number[], unknown> = {
    labels: Array.from(labels).reverse(),
    datasets: [
      {
        label: `Voting count`,
        data: voteCountByDay.reverse(),
        backgroundColor(context: ScriptableContext<'line'>) {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, '#4f46e5');
          gradient.addColorStop(1, '#a5b4fc');
          return gradient;
        },
        borderColor: '#4f46e5',
        borderWidth: 3.5,
        pointRadius: 4,
        pointHoverBackgroundColor: '#818cf8',
        pointHoverBorderColor: '#4f46e5',
        tension: 0.15,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      filler: {
        propagate: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },

      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  };
  return (
    <Layout>
      <div className="m-auto max-w-3xl">
        <h1 className="text-center text-2xl font-semibold">
          {poll.question}&apos;s analysis
        </h1>
        <div className="m-auto mt-4 flex max-w-xl justify-between">
          <div className="flex w-[250px] flex-col rounded-md border-2 border-gray-200 p-4">
            <span className="font-semibold text-gray-700">
              Total Views <br />
              <span className="text-xs">(During voting period)</span>
            </span>
            <span className="mt-2 block text-4xl font-bold">{poll.views}</span>
          </div>
          <div className="flex w-[250px] flex-col rounded-md border-2 border-gray-200 p-4">
            <span className="font-semibold text-gray-700">Total Votes</span>
            <span className="mt-2 block text-4xl font-bold">
              {formatNumberWithComma(totalVotes)}
            </span>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="my-3 text-xl font-semibold">
            History of voting count per day
          </h2>
          <hr className="my-4 border-gray-300 sm:mb-6 sm:mt-2" />
          <Line options={options} data={lineData} />
        </div>
        <hr className="my-4 border-gray-300 sm:mb-6 sm:mt-2" />
        <div className="m-auto mt-12 max-w-lg p-2">
          <h2 className="text-xl font-semibold">Votes per option</h2>
          <hr className="my-4 border-gray-300 sm:mb-6 sm:mt-2" />
          <div className="">
            <div className="flex justify-between">
              <div>Options</div>
              <div className="flex flex-col text-center">
                Total Votes
                <span className="font-bold">
                  {formatNumberWithComma(totalVotes)}
                </span>
              </div>
            </div>
            <hr className="my-4 border-gray-300 sm:mb-6 sm:mt-2" />
            <div>
              {poll.poll_options.map((option) => {
                return (
                  <div
                    className="mb-2 flex items-center justify-between rounded-md border border-gray-200 p-2"
                    key={option.id}
                  >
                    {option.text}
                    <span className="whitespace-nowrap text-sm font-bold">
                      {option.votes} votes
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { poll_id } = query;
  const prisma = (await import('src/utils/prisma')).default;
  const getUser = (await import('src/utils/getUser')).default;
  //@ts-ignore
  const session = await getUser({ req, res });

  const poll = await prisma.poll.findFirst({
    where: {
      id: poll_id as string,
      AND: {
        user_id: session?.user_id,
      },
    },
    include: {
      poll_options: {
        include: {
          poll_votes: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!poll)
    return {
      notFound: true,
    };

  return {
    props: { poll },
  };
};

export default Analysis;
