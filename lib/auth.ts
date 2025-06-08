import NextAuth, { DefaultSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// NextAuth 모듈 확장 (Module Augmentation)
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      createdAt?: string;
      updatedAt?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    createdAt?: string;
    updatedAt?: string;
  }
}

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"},
                name:{label:"Name",type:"text"},
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password || !credentials?.name){
                    throw new Error("Please provide email and password and name");
                }

                try{
                    await connectToDatabase();
                    const user=await User.findOne({email:credentials.email});

                    if(!user){
                        throw new Error("User not found");
                    }
                    const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password);
                    if(!isPasswordCorrect){
                        throw new Error("Invalid Password");
                    }

                    return {
                        id:user._id.toString(),
                        email:user.email,
                        name:user.name,
                        createdAt:user.createdAt?.toString(),
                        updatedAt:user.updatedAt?.toString(),
                    }
                }catch(err){
                    throw err;
                }
            }
        })
    ],
    callbacks:{
        async jwt({token, user}) {
            if(user){
                token.id = user.id;
                token.createdAt = user.createdAt;
                token.updatedAt = user.updatedAt;
            }
            return token; 
        },
        async session({session, token}) {
            if(session.user){
                session.user.id = token.id;
                session.user.createdAt = token.createdAt;
                session.user.updatedAt = token.updatedAt;
            }
            return session;
        }
    },
    pages:{
        signIn:"/login",
        error:"/login"
    },
    session:{
        strategy:"jwt",
        maxAge: 30 * 24 * 60 * 60, 
    },
    secret: process.env.NEXT_AUTH_SECRET,
}

export default NextAuth(authOptions);
