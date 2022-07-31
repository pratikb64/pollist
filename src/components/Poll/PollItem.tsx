import {
  ExternalLinkIcon,
  LinkIcon,
  TrendingUpIcon,
} from '@heroicons/react/outline';
import { getEmbedSnippet } from '@utils';
import Link from 'next/link';
import React, { MouseEvent } from 'react';
import toast from 'react-hot-toast';

interface PollItem {
  question: string;
  createdAt: Date;
  active: boolean;
  id: string;
}

const PollItem: React.FC<PollItem> = ({ question, active, createdAt, id }) => {
  const onEmbedClick = (event: MouseEvent<SVGElement>) => {
    event.preventDefault();
    navigator.clipboard.writeText(getEmbedSnippet(id));
    toast.success('Code copied to clipboard!');
  };
  return (
    <div className="relative min-w-[245px] max-w-[300px] rounded-md border border-gray-200 p-3 transition-shadow duration-[280ms] hover:shadow-depth ">
      <label title="Poll status">
        <div
          className={`absolute top-2 right-2 h-3 w-3 rounded-full ${
            active ? 'bg-green-600' : 'bg-red-600'
          } `}
        ></div>
      </label>
      <span className="text-xl font-semibold">{question}</span>
      <hr className="-mx-3 mt-2 border-indigo-100" />
      <div className="-mx-3 -mb-3 flex items-center justify-between bg-indigo-50 p-2">
        <div className="flex items-center text-sm font-semibold text-gray-600">
          <span className="mr-2 block">
            {new Date(createdAt).toLocaleDateString()}
          </span>
          |
          <label title="Open poll">
            <Link href={'/poll/' + id}>
              <a>
                <ExternalLinkIcon className="mx-2 w-5 cursor-pointer text-gray-700 hover:text-indigo-600" />
              </a>
            </Link>
          </label>
          |
          <label title="Poll analysis">
            <Link href={'/poll/' + id + '/analysis'}>
              <a>
                <TrendingUpIcon className="mx-2 w-5 cursor-pointer text-gray-700 hover:text-indigo-600" />
              </a>
            </Link>
          </label>
          |
          <label title="Poll analysis">
            <LinkIcon
              onClick={onEmbedClick}
              className="mx-2 w-5 cursor-pointer text-gray-700 hover:text-indigo-600"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default PollItem;
