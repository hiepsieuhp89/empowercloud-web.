import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import LineProvider from 'next-auth/providers/line'

import { auth } from '@/lib/firebase'
import { getUserInfo } from '@/server/auth'
import { verify } from '@/server/verify'
import { parseJwt } from '@/utils/jwtDecoder'
import type { AccessRole, SessionUser } from '@/utils/type'
import { signInWithEmailAndPassword } from 'firebase/auth'

const authOptions: NextAuthOptions = {
  // adapter: FirestoreAdapter({credential: cert(serviceAccount)}) as Adapter,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text', placeholder: 'email' },
        password: { label: 'password', type: 'password' },
        role: { label: 'role', type: 'text' },
      },
      async authorize(credentials) {
        const user = await signInWithEmailAndPassword(
          auth,
          credentials?.email || '',
          credentials?.password || '',
        )
        // If no error and we have user data, return it
        if (!user) {
          return null
        }

        const serverCheck = await verify({
          email: credentials?.email || '',
          role: (credentials?.role || 'admin') as AccessRole,
          token: await user.user.getIdToken(),
        })

        if (serverCheck?.result === 'success' && serverCheck.jwt) {
          const tokenDetail = parseJwt(serverCheck.jwt)
          return {
            id: tokenDetail.user_id, //user?.user.uid,
            jwt: serverCheck.jwt,
            email: user?.user.email,
            role: credentials?.role,
            clinic_id: tokenDetail.clinic_id,
          }
          //return user?.user as unknown as User
        } else {
          return null
        }
      },
    }),
    LineProvider({
      clientId: process.env.LINE_CHANNEL_ID || '',
      clientSecret: process.env.LINE_CHANNEL_SECRET || '',
      authorization: { params: { scope: 'openid profile' } },
      async profile(profile, tokens) {
        try {
          const serverCheck = await verify({
            email: profile.sub,
            role: 'patient' as AccessRole,
            token: tokens.id_token ?? '',
            type: 'LINE',
          })
          if (serverCheck.jwt) {
            const tokenDetail = parseJwt(serverCheck.jwt)
            return {
              id: tokenDetail.user_id,
              jwt: serverCheck.jwt,
              email: tokenDetail.email,
              role: 'patient', //only for user
              clinic_id: tokenDetail.clinic_id,
            }
          } else {
            throw 'error'
          }
        } catch (e) {
          throw e
        }
      },
    }),
  ],
  session: {
    maxAge: 1 * 24 * 60 * 60,
    updateAge: 2 * 60 * 60,
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      if (user) {
        return true
      }
      throw new Error('UNAUTHORIZE')
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/home`
    },
    async session({ session, token }) {
      let user = token.user as SessionUser
      const jwt = user.jwt
      const updatedUserInfo = await getUserInfo(jwt)
      if (
        updatedUserInfo &&
        user.clinic_id != updatedUserInfo.clinic_id &&
        user.role != updatedUserInfo.role
      ) {
        user = {
          ...user,
          clinic_id: Number(updatedUserInfo?.clinic_id),
          role: updatedUserInfo.role,
          jwt: updatedUserInfo.jwt,
        }
      }
      session.user = user
      return session
    },
    async jwt({ token, user }) {
      if (user) token.user = user
      return token
    },
  },
  pages: {
    signIn: '/top',
  },
  debug: false,
  secret: process.env.JWT_SECRET,
}

export default authOptions
