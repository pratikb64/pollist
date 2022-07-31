import { XIcon } from '@heroicons/react/outline';
import React, { FC, useEffect, useRef } from 'react';
import { Button } from '@components';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { getEmbedSnippet } from '@utils';

interface PollEmbedPopupInterface {
  onClose: () => void;
  pollId: string;
}

const PollEmbedPopup: FC<PollEmbedPopupInterface> = ({ onClose, pollId }) => {
  const snippetRef = useRef<HTMLPreElement>(null);
  const router = useRouter();

  useEffect(() => {
    snippetRef.current!.textContent = getEmbedSnippet(pollId);
  }, []);

  const onCopy = () => {
    const loader = toast.loading('Copying snippet...');
    navigator.clipboard
      .writeText(getEmbedSnippet(pollId))
      .then((d) => {
        toast.success('Snippet copied to clipboard!', { id: loader });
        router.push('/dashboard');
      })
      .catch((e) =>
        toast.success('Snippet copied to clipboard!', { id: loader })
      );
  };

  return (
    <div className="-translate-y-[1/2] absolute top-[30%] left-1/2 w-full max-w-sm -translate-x-1/2 rounded-md bg-white p-2 shadow-depth ">
      <span className="my-3 block text-center text-xl font-bold">
        It&apos;s Live!
      </span>
      <XIcon
        onClick={() => onClose()}
        className="absolute top-1 right-1 w-6 cursor-pointer text-gray-400"
      />
      <hr className="-mx-2 my-2 border-gray-300" />
      <div className="my-3">
        Copy below snippet to embed this poll on your website!
      </div>
      <div className="overflow-auto rounded-md bg-gray-800 p-4 text-white">
        <pre ref={snippetRef}>ss</pre>
      </div>
      <Button
        onClick={onCopy}
        className="m-auto my-4 mb-2 w-max"
        button_type="primary"
      >
        Copy Snippet
      </Button>
    </div>
  );
};

export default PollEmbedPopup;
