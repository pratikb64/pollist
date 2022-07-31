import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { Session } from 'next-auth';
import { authOptions } from 'src/pages/api/v1/auth/[...nextauth]';

interface getUser {
  req: NextApiRequest;
  res: NextApiResponse;
}

interface CustomSession extends Session {
  user_id?: string;
}

const getUser = ({ req, res }: getUser) => {
  return new Promise<CustomSession | null>(async (resolve, reject) => {
    // "unstable_getServerSession" will be changed as "next-auth" package adds a better way to get user session on server
    const user = await unstable_getServerSession(req, res, authOptions);
    if (user) resolve(user);
    else reject(null);
  });
};

export default getUser;
