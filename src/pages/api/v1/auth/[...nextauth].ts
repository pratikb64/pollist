import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { isEmailValid, isPasswordValid } from '@utils';
import prisma from 'src/utils/prisma';
import { createHmac } from 'crypto';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET ?? '';

if (secret === '') throw new Error('Password secret not found..');

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: {
          label: 'Email',
          type: 'email',
          placeholder: 'john@doe.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const body = req.body ?? {};

        if (!isEmailValid(body['email']) || !isPasswordValid(body['password']))
          return null;

        let user = await prisma.user.findFirst({
          where: { email: body.email },
        });

        if (!user) return null;

        const password_hash = createHmac('sha256', secret)
          .update(body['password'])
          .digest('hex');

        if (user.password === password_hash) {
          return user;
        } else return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '',
  },
  secret: secret,
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: secret,
    encode: async ({ secret, token, maxAge }) => {
      const jwtClaims = {
        name: token?.name,
        email: token?.email,
        user_id: token?.user_id,
        iat: Date.now() / 1000,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      };
      const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: 'HS256' });
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      //@ts-ignore
      const decodedToken = jwt.verify(token, secret, { algorithms: ['HS256'] });
      return decodedToken;
    },
  },
  callbacks: {
    async jwt({ token, account, isNewUser, profile, user }) {
      if (user) {
        token['user_id'] = user?.id;
        token['name'] = user?.name;
      }
      return Promise.resolve(token);
    },
    async session({ session, token, user }) {
      session.user_id = token?.user_id;
      session.name = token?.name;
      session.email = token?.email;

      return Promise.resolve(session);
    },
  },
};

export default NextAuth(authOptions);
