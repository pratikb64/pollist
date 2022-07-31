import { Layout, PollEmbedPopup, Button } from '@components';
import { ClockIcon, PlusIcon } from '@heroicons/react/outline';
import { TrashIcon } from '@heroicons/react/solid';
import axios from 'axios';
import React, { FormEvent, MouseEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { generate as uid } from 'short-uuid';
import { CONSTANTS, fireConfetti } from '@utils';
import { PollDataStateInterface } from '@types';
import { useRouter } from 'next/router';

const NewPoll = () => {
  const [pollData, setPollData] = useState<PollDataStateInterface>({
    question: '',
    options: [
      {
        id: uid(),
        text: '',
      },
      {
        id: uid(),
        text: '',
      },
    ],
    endAt: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [newPollId, setNewPollId] = useState('');
  const router = useRouter();

  const queChangeHandler = (inputElement: HTMLInputElement) => {
    setPollData({
      ...pollData,
      question: inputElement.value,
    });
  };

  const addOption = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (pollData.options.length == 6) {
      toast.error('There can be max 6 options!');
      return;
    }
    setPollData({
      ...pollData,
      options: pollData.options.concat({ id: uid(), text: '' }),
    });
  };

  const removeOption = (id: string, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (pollData.options.length == 2) {
      toast.error('Need at least 2 options!');
      return;
    }

    setPollData({
      ...pollData,
      options: pollData.options.filter((opt) => opt.id !== id),
    });
  };

  const setPollEndDateTime = (date: Date) => {
    setPollData({
      ...pollData,
      endAt: date.toISOString(),
    });
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    const loader = toast.loading('Creating new poll...');
    setIsLoading(true);
    axios({
      url: CONSTANTS.BASE_URL + '/v1/polls',
      data: pollData,
      method: 'POST',
    })
      .then((d) => {
        setNewPollId(d.data.poll_id);
        toast.success('Poll created successfully!', { id: loader });
        fireConfetti();
        setShowPopup(true);
      })
      .catch((err) => toast.error('Something went wrong!', { id: loader }));
  };

  const optionChangeHandler = (id: string, element: HTMLInputElement) => {
    setPollData({
      ...pollData,
      options: pollData.options.map((el) =>
        el.id === id ? { ...el, text: element.value } : el
      ),
    });
  };

  const onPopupClose = () => {
    setShowPopup(false);
    router.push('/');
  };

  return (
    <Layout>
      {showPopup && (
        <PollEmbedPopup onClose={onPopupClose} pollId={newPollId} />
      )}
      <div className="m-auto min-h-[70vh] max-w-xl px-2 transition-all">
        <h1 className="text-center text-2xl font-semibold">Create new poll</h1>
        <hr className="my-6 border-gray-300" />
        <form onSubmit={submitHandler}>
          <div>
            <label
              className="text-sm font-semibold text-gray-700"
              htmlFor="question"
            >
              Question
            </label>
            <input
              id="question"
              className="mt-1 w-full rounded-md border-2 border-indigo-100"
              type="text"
              onChange={(event) => queChangeHandler(event.target)}
              placeholder={'Give this poll a reason to exist...'}
              required
            />
          </div>
          <div className="my-6">
            <span className="text-sm font-bold text-gray-700">
              Options{' '}
              <span className="text-[12px] text-gray-400 ">(min 2, max 6)</span>{' '}
            </span>
            {pollData.options.map((option, optionIndex) => {
              return (
                <div key={option.id} className="mt-2 flex">
                  <input
                    className="w-[90%] rounded-md border-2 border-indigo-100 p-1 px-2 md:w-[95%]"
                    type="text"
                    placeholder={'Option ' + (optionIndex + 1)}
                    required
                    onChange={(e) => optionChangeHandler(option.id, e.target)}
                  />
                  <div className="flex w-[10%] items-center justify-end md:w-[5%]">
                    <button onClick={(event) => removeOption(option.id, event)}>
                      <TrashIcon className="w-6 cursor-pointer text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="mt-4">
              <button
                onClick={addOption}
                className="flex items-center rounded-md bg-indigo-100 p-1 px-3 text-sm font-bold text-indigo-700 hover:bg-indigo-200 active:bg-indigo-300"
              >
                <PlusIcon className="mr-1 w-3" strokeWidth={3} /> Add option
              </button>
            </div>
          </div>
          <hr className="my-4 mt-10 border border-indigo-100" />
          <div className="flex justify-between">
            <div className="mr-4 flex flex-col items-start sm:flex-row sm:items-center">
              <div className="flex">
                <ClockIcon className="mr-1 w-5 text-gray-600" />
                <label className="font-bold text-gray-600" htmlFor="endAt">
                  End at
                </label>
              </div>
              <input
                className="rounded-md border-2 border-indigo-100 p-1 px-3 text-sm font-bold text-gray-700 sm:ml-2"
                type="datetime-local"
                name="endAt"
                id="endAt"
                onChange={(event) =>
                  setPollEndDateTime(new Date(event.target.value))
                }
              />
            </div>
            <div className="flex">
              <Button
                button_type="primary"
                disabled={isLoading}
                type="submit"
                className="p-1 px-4 disabled:bg-gray-500 "
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewPoll;
