import { NextRequest } from "next/server";
import { betterAuth } from "better-auth";

const authClient = betterAuth({
  secret: process.env.AUTH_SECRET!,
  providers: [
    // Example: Add providers here, e.g. Google, GitHub
    // { id: 'google', clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! },
  ],
});

class Auth {
  async getSession(req: NextRequest) {
    // Use Better Auth to get session from request
    return await authClient.api.getSession({ headers: req.headers });
  }
}

export default new Auth();
