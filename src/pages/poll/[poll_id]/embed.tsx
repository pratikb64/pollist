import { PollOption } from '@prisma/client';
import { IndividualPollInterface } from '@types';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import React, { useEffect, useRef, useState } from 'react';

const Embed = ({ poll, total_votes }: IndividualPollInterface) => {
  const countdownRef = useRef<HTMLSpanElement>(null);
  const [isPollEnded, setIsPollEnded] = useState(
    total_votes != 0 ? true : false
  );
  const [isVoteRegistered, setIsVoteRegistered] = useState(false);
  const [pollData, setPollData] = useState(poll);
  const [totalVotes, setTotalVotes] = useState<number | undefined>(
    total_votes == 0 ? undefined : total_votes
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!poll.endAt || isPollEnded) return;
    let countDownDate = new Date(poll.endAt).getTime();
    const countdownElement = countdownRef.current!;

    let x = setInterval(function () {
      let now = new Date().getTime();

      let distance = countDownDate - now;

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownElement.innerHTML = `Ending in <span class="font-bold">${days}d ${hours}h ${minutes}m ${seconds}s</span>`;

      if (distance < 0) {
        clearInterval(x);
        setIsPollEnded(true);
      }
    }, 1000);

    return () => {
      clearInterval(x);
    };
  }, []);

  const onVoteRegistered = (id: string) => {
    if (isVoteRegistered || isPollEnded) return;

    setIsLoading(true);
    axios({
      url: '/api/v1/votes',
      method: 'POST',
      data: {
        poll_id: poll.id,
        option_id: id,
      },
    })
      .then((d) => {
        if (d.status == 202) {
          setIsVoteRegistered(true);
          setIsLoading(false);
        }
        const data = d.data.all_votes as Array<PollOption>;
        let totalVotes = 0;
        data.forEach((option) => {
          totalVotes += option.votes!;
        });
        setTotalVotes(totalVotes);
        setPollData({
          ...pollData,
          poll_options: data,
        });
        setIsVoteRegistered(true);
        setIsLoading(false);
      })
      .catch(() => console.log('first'));
  };
  return (
    <div className=" bg-white ">
      {isLoading && (
        <div className="fixed top-0 left-0 z-20 h-full w-full backdrop-blur-[1px]">
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex justify-center">
              <div className="loader"></div>
            </div>
          </div>
        </div>
      )}
      <div className="m-auto mt-6 min-h-[70vh] max-w-xl p-3">
        <h1 className=" text-2xl font-bold sm:text-3xl">{pollData.question}</h1>
        <div className="mt-2 flex flex-col text-[12px] text-gray-600 sm:mt-4 sm:flex-row sm:justify-between sm:text-sm">
          <span>
            Created at :{' '}
            <span className="font-bold ">{poll.createdAt.toDateString()}</span>{' '}
          </span>
          {pollData.endAt &&
            (isPollEnded ? (
              <span className="font-bold">Poll Ended</span>
            ) : (
              <span ref={countdownRef}></span>
            ))}
        </div>
        <hr className="my-4 border-gray-300 sm:mb-6 sm:mt-2" />
        <div>
          {pollData.poll_options.map((option) => {
            let percentage = (option.votes! / totalVotes!) * 100;
            return (
              <div
                key={option.id}
                className="relative mb-3 flex cursor-pointer items-center justify-between rounded-md border-2 border-gray-200/75 p-3 font-bold shadow-indigo-900 transition-all duration-[250ms] ease-in-out  hover:scale-[1.015] hover:text-indigo-500 hover:shadow-depth"
                onClick={() => onVoteRegistered(option.id)}
              >
                <div
                  style={{ width: totalVotes ? percentage + '%' : '0%' }}
                  className="absolute top-0 left-0  h-full w-full rounded-md bg-indigo-200 transition-all duration-1000"
                ></div>
                <span className="z-10">{option.text}</span>
                {totalVotes && (
                  <span className="z-10 text-sm text-gray-700">
                    {option.votes} / {totalVotes} votes
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { poll_id } = query;
  const prisma = (await import('src/utils/prisma')).default;
  let totalVotes = 0;

  const poll = await prisma.poll.findFirst({
    where: {
      id: poll_id as string,
    },
    include: {
      poll_options: {
        where: {
          poll_id: poll_id as string,
        },
      },
    },
  });

  if (poll?.endAt) {
    const dateNow = Date.now();
    const pollEndDate = new Date(poll?.endAt);
    const pollEndDateInMs = pollEndDate.getTime();

    const isPollEnded = dateNow > pollEndDateInMs;

    if (isPollEnded) {
      const all_votes = await prisma.pollOption.findMany({
        where: { poll_id: poll_id as string },
      });
      all_votes.forEach((option) => {
        totalVotes += option.votes!;
      });
    }
  }

  if (!poll || !poll?.active)
    return {
      notFound: true,
    };

  return {
    props: { poll, total_votes: totalVotes },
  };
};

export default Embed;
