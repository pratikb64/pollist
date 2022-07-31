import { isEmpty } from '@utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/utils/prisma';
import { createHmac } from 'crypto';
import getUser from 'src/utils/getUser';

const secret = process.env.SECRET ?? '';

if (secret === '') throw new Error('Password secret not found..');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password, name } = req.body;
    let session;
    let user;

    switch (req.method) {
      case 'GET':
        session = await getUser({
          req,
          res,
        });
        if (!session) {
          return res.status(200).json({ user: {} });
        }
        user = await prisma.user.findFirst({
          where: {
            id: session.user_id,
          },
          select: {
            email: true,
            name: true,
            id: true,
          },
        });
        return res.status(200).json({ user });

      case 'PUT':
        session = await getUser({
          req,
          res,
        });
        if (isEmpty(name))
          return res.status(401).json({ message: `Provide all fields!` });

        user = await prisma.user.update({
          where: {
            id: session?.user_id,
          },
          data: {
            name,
          },
          select: {
            email: true,
            name: true,
            id: true,
          },
        });
        return res.status(200).json({ user });

      case 'POST':
        if (isEmpty(email) || isEmpty(password) || isEmpty(name))
          return res.status(401).json({ message: `Provide all fields!` });

        const password_hash = createHmac('sha256', secret)
          .update(password)
          .digest('hex');
        user = await prisma.user.create({
          data: {
            email,
            password: password_hash,
            name,
          },
        });

        return res
          .status(200)
          .json({ message: `User created successfully!`, user });

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
