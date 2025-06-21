import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email", placeholder: "correo@ejemplo.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Aquí tu lógica real: valida en DB por ejemplo
        if (credentials.email === "admin@ejemplo.com" && credentials.password === "123456") {
          return { id: "1", name: "Admin", email: credentials.email };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
