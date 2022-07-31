import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/utils/prisma';
import getUser from 'src/utils/getUser';
import { PollDataStateInterface } from '@types';

interface ReqBody extends PollDataStateInterface {
  active: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { options, endAt, question, active }: ReqBody = req.body;
    const { poll_id } = req.query;
    const session = await getUser({ req, res });
    let userWithPoll;

    switch (req.method) {
      case 'GET':
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

        if (!poll) return res.status(404).json({ message: 'Poll not found!' });

        return res.status(200).json({ poll });

      case 'PUT':
        if (!session) return res.status(403).json({ message: `Unauthorized!` });

        userWithPoll = await prisma.poll.findFirst({
          where: { id: poll_id as string, user_id: session?.user_id },
          include: {
            poll_options: {
              where: {
                poll_id: poll_id as string,
              },
            },
          },
        });

        if (!userWithPoll)
          return res.status(404).json({ message: `Poll not found!` });

        prisma.$transaction([
          prisma.poll.update({
            where: { id: poll_id as string },
            data: {
              active,
              endAt,
              question,
            },
          }),
          ...options.map((option) => {
            return prisma.pollOption.upsert({
              where: { id: option.id },
              update: {
                text: option.text,
              },
              create: {
                ...option,
                poll_id: poll_id as string,
              },
            });
          }),
        ]);

        return res.status(200).json({ ok: 'ok' });

      case 'DELETE':
        if (!session) return res.status(403).json({ message: `Unauthorized!` });
        userWithPoll = await prisma.poll.findFirst({
          where: { id: poll_id as string, user_id: session?.user_id },
        });

        if (!userWithPoll)
          return res.status(404).json({ message: `Poll not found!` });

        await prisma.poll.delete({
          where: { id: poll_id as string },
        });
        return res.status(200).json({ message: `Poll deleted successfully!` });

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
