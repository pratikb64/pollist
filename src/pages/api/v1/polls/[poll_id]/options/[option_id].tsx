import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/utils/prisma';
import getUser from 'src/utils/getUser';

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
    const { poll_id, option_id } = req.query;
    const session = await getUser({ req, res });
    let userWithPoll;

    switch (req.method) {
      case 'GET':
        return res.status(200).json({});

      case 'PUT':
        if (!session) return res.status(403).json({ message: `Unauthorized!` });

        userWithPoll = await prisma.poll.findFirst({
          where: { id: poll_id as string, user_id: session?.user_id },
        });

        if (!userWithPoll)
          return res.status(404).json({ message: `Poll not found!` });

        await prisma.pollOption.update({
          where: { id: poll_id as string },
          data: {
            text,
          },
        });

        return res.status(200).json({ ok: 'ok' });

      case 'DELETE':
        if (!session) return res.status(403).json({ message: `Unauthorized!` });

        userWithPoll = await prisma.poll.findFirst({
          where: { id: poll_id as string, user_id: session?.user_id },
        });

        if (!userWithPoll)
          return res.status(404).json({ message: `Poll not found!` });

        const isOptionDeleted = await prisma.pollOption.delete({
          where: {
            id: option_id as string,
          },
        });

        if (!isOptionDeleted) throw new Error('Failed to delete Poll Option!');

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
