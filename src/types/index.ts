import { Poll, PollOption } from '@prisma/client';
import { Session } from 'next-auth';

export interface CustomSession extends Session {
  user_id?: string;
}

export interface PollOptionInterface {
  id: string;
  text: string;
}

export interface PollDataStateInterface {
  question: string;
  options: Array<PollOptionInterface>;
  endAt: string | null;
}

export interface IndividualPollInterface {
  poll: Poll & {
    poll_options: PollOption[];
  };
  total_votes: number | undefined;
}
