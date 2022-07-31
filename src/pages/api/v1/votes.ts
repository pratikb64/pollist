import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/utils/prisma';
import { createHmac } from 'crypto';

const secret = process.env.IP_HASH_KEY ?? '';

if (secret === '') throw new Error('IP hash secret not found..');

interface ReqBody {
  poll_id: string;
  option_id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { poll_id, option_id }: ReqBody = req.body;

    switch (req.method) {
      case 'POST':
        const ip = (req.headers['x-forwarded-for'] || '127.0.0.1') as string;
        const hashedIp = createHmac('sha256', secret).update(ip).digest('hex');

        const alreadyVoted = await prisma.pollVote.findFirst({
          where: { voter: hashedIp, poll_id },
        });

        if (alreadyVoted) {
          const all_votes = await prisma.pollOption.findMany({
            where: { poll_id },
          });
          return res
            .status(202)
            .json({ message: 'Cannot vote twice to same poll!', all_votes });
        }

        await prisma.pollOption.update({
          where: { id: option_id },
          data: {
            votes: { increment: 1 },
            poll_votes: {
              create: {
                voter: hashedIp,
                poll_id,
              },
            },
          },
        });

        const all_votes = await prisma.pollOption.findMany({
          where: { poll_id },
        });
        return res
          .status(200)
          .json({ message: 'Vote registered successfully!', all_votes });

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
