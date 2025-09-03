import { betterAuth } from "better-auth";

// Better Auth configuration
export const auth = betterAuth({
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL!,
  },
  secret: process.env.AUTH_SECRET || "your-secret-key-here",
  // Add providers as needed
  socialProviders: {
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // },
  },
});

export type Session = typeof auth.$Infer.Session;
