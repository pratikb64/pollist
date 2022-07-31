import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/utils/prisma';
import getUser from 'src/utils/getUser';
import { isEmpty } from '@utils';
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
    let session;

    switch (req.method) {
      case 'GET':
        session = await getUser({ req, res });
        const allPolls = await prisma.poll.findMany({
          where: {
            user_id: session?.user_id,
          },
          select: {
            id: true,
            question: true,
            active: true,
            createdAt: true,
            endAt: true,
          },
        });
        return res.status(200).json({ polls: allPolls });

      case 'PUT':
        return res.status(200).json({});

      case 'POST':
        session = await getUser({ req, res });
        if (!session) return res.status(403).json({ message: `Unauthorized!` });

        if (isEmpty(question))
          return res
            .status(400)
            .json({ message: `Provide all required fields!` });

        let validOptions = true;

        options.forEach((option) => {
          if (validOptions) if (isEmpty(option.text)) validOptions = false;
        });

        if (!validOptions)
          return res
            .status(400)
            .json({ message: `Provide all required fields!` });

        let pollResult = await prisma.poll.create({
          data: {
            active: true,
            question,
            user_id: session.user_id as string,
            endAt,
            poll_options: {
              createMany: {
                data: options,
                skipDuplicates: true,
              },
            },
          },
        });

        if (!pollResult) throw new Error('Could not create poll!');

        return res
          .status(200)
          .json({
            message: `Poll created successfully!`,
            poll_id: pollResult.id,
          });

      case 'DELETE':
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
