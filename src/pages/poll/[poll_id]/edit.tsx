import { Layout, Button } from '@components';
import { PlusIcon, TrashIcon, XCircleIcon } from '@heroicons/react/outline';
import { PollDataStateInterface } from '@types';
import { CONSTANTS } from '@utils';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, {
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { generate as uid } from 'short-uuid';

interface PollEditState extends PollDataStateInterface {
  active: boolean;
}

const Edit = () => {
  const router = useRouter();
  const { poll_id } = router.query;
  const [pollData, setPollData] = useState<PollEditState>({
    question: '',
    options: [],
    endAt: null,
    active: false,
  });
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [newOption, setNewOption] = useState({
    id: uid(),
    text: '',
  });
  const newOptionRef = useRef<HTMLInputElement>(null);
  const endDateElementRef = useRef<HTMLInputElement>(null);

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

    const loader = toast.loading('Adding option...');

    axios({
      url: CONSTANTS.BASE_URL + '/v1/polls/' + poll_id + '/options',
      data: newOption,
      method: 'POST',
    })
      .then((d) => {
        newOptionRef.current!.value = '';
        setPollData({
          ...pollData,
          options: pollData.options.concat(newOption),
        });
        toast.success('Added successfully!', { id: loader });
      })
      .catch((er) => toast.error('Something went wrong!', { id: loader }));
  };

  const removeOption = (id: string, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (pollData.options.length == 2) {
      toast.error('Need at least 2 options!');
      return;
    }
    const loader = toast.loading('Deleting option...');

    axios({
      url: CONSTANTS.BASE_URL + '/v1/polls/' + poll_id + '/options/' + id,
      method: 'DELETE',
    })
      .then((d) => {
        setPollData({
          ...pollData,
          options: pollData.options.filter((opt) => opt.id !== id),
        });
        toast.success('Option deleted successfully!', { id: loader });
      })
      .catch((err) => toast.error('Something went wrong!', { id: loader }));
  };

  const setPollEndDateTime = (date: Date) => {
    setPollData({
      ...pollData,
      endAt: date.toISOString(),
    });
  };

  const optionChangeHandler = (id: string, element: HTMLInputElement) => {
    setPollData({
      ...pollData,
      options: pollData.options.map((el) =>
        el.id === id ? { ...el, text: element.value } : el
      ),
    });
  };

  const formatDateForDefault = (date: string) => {
    let dateArray = date.split(':');
    dateArray.pop();
    return dateArray.join(':');
  };

  const deletePoll = () => {
    const loader = toast.loading('Deleting poll...');

    axios({
      url: CONSTANTS.BASE_URL + '/v1/polls/' + poll_id,
      data: pollData,
      method: 'DELETE',
    })
      .then((d) => {
        router.push('/dashboard');
        toast.success('Poll deleted successfully!', { id: loader });
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error('Something went wrong!', { id: loader });
      });
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    const loader = toast.loading('Updating poll...');
    setIsLoading(true);
    axios({
      url: CONSTANTS.BASE_URL + '/v1/polls/' + poll_id,
      data: pollData,
      method: 'PUT',
    })
      .then((d) => {
        setIsLoading(false);
        toast.success('Poll updated successfully!', { id: loader });
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error('Something went wrong!', { id: loader });
      });
  };

  const resetEndDate = () => {
    const endDateElement = endDateElementRef.current!;
    endDateElement.value = '';
    setPollData({
      ...pollData,
      endAt: null,
    });
  };

  useEffect(() => {
    if (!router.isReady) return;
    axios({
      url: CONSTANTS.BASE_URL + '/v1/polls/' + poll_id,
      method: 'GET',
    })
      .then((d) => {
        let data = d.data.poll;
        setPollData({
          active: data.active,
          endAt: data.endAt,
          options: data.poll_options,
          question: data.question,
        });
        setIsFetching(false);
      })
      .catch((er) => toast.error('Failed to get poll details!'));
  }, [router]);

  return (
    <Layout>
      <div className="m-auto min-h-[70vh] max-w-xl px-2">
        <h1 className="text-center text-2xl font-semibold">Edit poll</h1>
        <hr className="my-4 border-gray-300" />
        {isFetching && (
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
        )}
        {!isFetching && (
          <>
            <div className="my-3 flex justify-between">
              <div>
                <label
                  htmlFor="active"
                  className="relative inline-flex cursor-pointer items-center"
                >
                  <input
                    type="checkbox"
                    id="active"
                    className="peer sr-only"
                    defaultChecked={pollData.active}
                    onClick={() =>
                      setPollData({ ...pollData, active: !pollData.active })
                    }
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                  <span className="ml-3  font-medium text-gray-700 ">
                    Active
                  </span>
                </label>
              </div>
              <div className="flex items-center">
                <div className="flex">
                  <label
                    className="text-sm font-bold text-gray-600"
                    htmlFor="endAt"
                  >
                    End at
                  </label>
                </div>
                <input
                  className="rounded-md border-2 border-indigo-100 p-1 px-3 text-sm font-bold text-gray-700 sm:ml-2"
                  type="datetime-local"
                  name="endAt"
                  id="endAt"
                  ref={endDateElementRef}
                  onChange={(event) =>
                    setPollEndDateTime(new Date(event.target.value))
                  }
                  defaultValue={
                    pollData.endAt
                      ? formatDateForDefault(pollData.endAt)
                      : undefined
                  }
                />
                <label title="Clear End timing">
                  <XCircleIcon
                    onClick={resetEndDate}
                    className="ml-2 w-5 cursor-pointer text-gray-500"
                  />
                </label>
              </div>
            </div>
            <form onSubmit={submitHandler}>
              <div className="mt-6">
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
                  defaultValue={pollData.question}
                />
              </div>
              <div className="my-6">
                <span className="text-sm font-bold text-gray-700">
                  Options{' '}
                  <span className="text-[12px] text-gray-400 ">
                    (min 2, max 6)
                  </span>{' '}
                </span>
                {pollData?.options?.map((option, optionIndex) => {
                  return (
                    <div key={option.id} className="mt-2 flex">
                      <input
                        className="w-[90%] rounded-md border-2 border-indigo-100 p-1 px-2 md:w-[95%]"
                        type="text"
                        placeholder={'Option ' + (optionIndex + 1)}
                        required
                        onChange={(e) =>
                          optionChangeHandler(option.id, e.target)
                        }
                        defaultValue={option.text}
                      />
                      <div className="flex w-[10%] items-center justify-end md:w-[5%]">
                        <button
                          onClick={(event) => removeOption(option.id, event)}
                        >
                          <TrashIcon className="w-6 cursor-pointer text-gray-600 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="mt-2 flex">
                  <input
                    className="w-[90%] rounded-md border-2 border-indigo-100 p-1 px-2 md:w-[95%]"
                    type="text"
                    placeholder={'Type here to add another option'}
                    ref={newOptionRef}
                    onChange={(e) =>
                      setNewOption({ ...newOption, text: e.target.value })
                    }
                  />
                </div>
                <div className="mt-4">
                  <button
                    onClick={addOption}
                    disabled={newOption.text.trim() === ''}
                    className={`flex items-center rounded-md bg-indigo-100 p-1 px-3 text-sm font-bold text-indigo-700 opacity-0 transition-all duration-[250ms] ease-in-out hover:bg-indigo-200 active:bg-indigo-300 ${
                      newOption.text.trim() !== '' && 'opacity-100'
                    }`}
                  >
                    <PlusIcon className="mr-1 w-3" strokeWidth={3} /> Save
                    option
                  </button>
                </div>
              </div>
              <hr className="my-4 border border-indigo-100" />
              <div className="flex justify-between">
                <div className="mr-4 flex">
                  <Button
                    onClick={deletePoll}
                    button_type="danger"
                    type="button"
                    className="p-1 px-4 "
                  >
                    Delete
                  </Button>
                </div>
                <div className="flex">
                  <Button
                    disabled={isLoading}
                    button_type="primary"
                    type="submit"
                    className="p-1 px-4  "
                  >
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Edit;
