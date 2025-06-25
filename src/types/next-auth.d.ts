// agregar aqui los tipos de datos customizados para next auth
// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      rol: string;
      token: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    rol: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    rol: string;
    accessToken: string;
  }
}
