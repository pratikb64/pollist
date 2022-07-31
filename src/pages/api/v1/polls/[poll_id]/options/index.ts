import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/utils/prisma';
import getUser from 'src/utils/getUser';
import { isEmpty } from '@utils';

interface ReqBody {
  id: string;
  text: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id, text }: ReqBody = req.body;
    const { poll_id } = req.query;
    const session = await getUser({ req, res });
    let userWithPoll;

    switch (req.method) {
      case 'POST':
        if (!session) return res.status(403).json({ message: `Unauthorized!` });

        userWithPoll = await prisma.poll.findFirst({
          where: { id: poll_id as string, user_id: session?.user_id },
        });

        if (!userWithPoll)
          return res.status(404).json({ message: `Poll not found!` });

        if (isEmpty(text) || isEmpty(id))
          return res.status(400).json({ message: `Provide required fields!` });

        const isOptionCreated = await prisma.pollOption.create({
          data: {
            id,
            text,
            poll_id: poll_id as string,
          },
        });

        if (!isOptionCreated) throw new Error('Failed to create Poll Option!');

        return res.status(200).json({ poll_option: isOptionCreated });

      default:
        return res
          .status(404)
          .json({ message: `Method '${req.method}' not allowed!` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error try again later!' });
  }
}
