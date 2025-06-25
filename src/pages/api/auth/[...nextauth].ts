import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_BASE_PUBLIC } from "@/utils/config";
import { LoginUsuarioResponse } from "@/models/Usuario";
import { ApiWrapper } from "@/models/ApiWrapper";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email", placeholder: "ronalddiazy@gmail.com" },
        password: { label: "Contraseña", type: "password" },
      },

      async authorize(credentials) {
        try {
          const res = await fetch(`${API_BASE_PUBLIC}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              login: credentials?.email,
              password: credentials?.password
            })
          });

          const json: ApiWrapper<LoginUsuarioResponse> = await res.json();
          
          if (res.ok && json.success && json.data) {
            const { id, name, email, rol, token } = json.data;
            return { id, name, email, rol, token };
          } else {
            throw new Error(json.message || "Credenciales inválidas");
          }
        } catch (error) {
          console.error('Error during authentication', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.rol = user.rol;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.rol = token.rol;
        session.user.token = token.accessToken;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
