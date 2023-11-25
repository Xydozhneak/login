import NextAuth from "next-auth/next";
import prisma from '../../../libs/prismadb'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from 'bcrypt'

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
                username: { label: "Username", type: "text", placeholder: "John Smith" },
            },
            async authorize(credentials) {
              
                if(!credentials.email || !credentials.password) {
                    throw new Error('Please enter an email and password')
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user?.hashedPassword) {
                    throw new Error('No user found')
                }


                const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword)

                if (!passwordMatch) {
                    throw new Error('Incorrect password')
                }

                return user;
            },
        }),  
    ],
    callbacks:{
        async jwt({ token, user, session, trigger }) {
            console.log("jwt callback", { token, user, session });
            if (trigger === "update" && session?.name ) {
                token.name = session.name;
                const userWithPosts = await prisma.user.findUnique({
                    where: {
                        id: token.id,
                    },
                    include: {
                        posts: true,
                    },
                });
        
                if (userWithPosts) {
                    token.posts = userWithPosts.posts;
                }
            }
        
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    address: user.address,
                    posts:user.posts
                };
            }
        
            const newUser = await prisma.user.update({
                where: {
                    id: token.id,
                },
                data: {
                    name: token.name,
                },
            });
        
            console.log(newUser);
            return token;
        },
     async session ({session, token, user}){
     console.log("session callback", {session,token,user});
     return{
        ...session,
        user:{
            ...session.user,
            id:token.id,
            address:token.address,
            name:token.name,
            posts:token.posts
        }
     }

     },
    },
    secret: process.env.SECRET,
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}