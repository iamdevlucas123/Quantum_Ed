import { OAuthProvider, User, UserRole } from '@prisma/client';
import { randomUUID } from 'crypto';
import { env } from '../config/env';
import { prisma } from '../config/prisma';

type OAuthProviderName = 'google' | 'github';

type ProviderConfig = {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
};

type OAuthProfile = {
  provider: OAuthProvider;
  providerAccountId: string;
  email: string;
  name: string | null;
};

const OAUTH_SCOPES: Record<OAuthProviderName, string> = {
  google: 'openid email profile',
  github: 'read:user user:email',
};

const PROVIDER_MAP: Record<OAuthProviderName, OAuthProvider> = {
  google: OAuthProvider.GOOGLE,
  github: OAuthProvider.GITHUB,
};

const getProviderConfig = (provider: OAuthProviderName): ProviderConfig => {
  if (provider === 'google') {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_CALLBACK_URL) {
      throw new Error('Google OAuth is not configured');
    }

    return {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackUrl: env.GOOGLE_CALLBACK_URL,
    };
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET || !env.GITHUB_CALLBACK_URL) {
    throw new Error('GitHub OAuth is not configured');
  }

  return {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackUrl: env.GITHUB_CALLBACK_URL,
  };
};

const readJsonResponse = async <T>(response: Response): Promise<T> => {
  return response.json() as Promise<T>;
};

const fetchGoogleProfile = async (code: string): Promise<OAuthProfile> => {
  const config = getProviderConfig('google');
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.callbackUrl,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error('Google OAuth token exchange failed');
  }

  const tokenData = await readJsonResponse<{ access_token?: string }>(tokenResponse);

  if (!tokenData.access_token) {
    throw new Error('Google OAuth token exchange failed');
  }

  const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!profileResponse.ok) {
    throw new Error('Google OAuth profile fetch failed');
  }

  const profileData = await readJsonResponse<{
    sub?: string;
    email?: string;
    name?: string;
    email_verified?: boolean;
  }>(profileResponse);

  if (!profileData.sub || !profileData.email || profileData.email_verified !== true) {
    throw new Error('Google account did not provide a verified email');
  }

  return {
    provider: OAuthProvider.GOOGLE,
    providerAccountId: profileData.sub,
    email: profileData.email,
    name: profileData.name ?? null,
  };
};

const fetchGithubPrimaryEmail = async (accessToken: string): Promise<string> => {
  const emailsResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'QuantumEd',
    },
  });

  if (!emailsResponse.ok) {
    throw new Error('GitHub OAuth email fetch failed');
  }

  const emails = await readJsonResponse<Array<{ email: string; primary: boolean; verified: boolean }>>(emailsResponse);
  const verifiedPrimaryEmail = emails.find((entry) => entry.primary && entry.verified);

  if (verifiedPrimaryEmail) {
    return verifiedPrimaryEmail.email;
  }

  const verifiedEmail = emails.find((entry) => entry.verified);

  if (!verifiedEmail) {
    throw new Error('GitHub account did not provide a verified email');
  }

  return verifiedEmail.email;
};

const fetchGithubProfile = async (code: string): Promise<OAuthProfile> => {
  const config = getProviderConfig('github');
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.callbackUrl,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error('GitHub OAuth token exchange failed');
  }

  const tokenData = await readJsonResponse<{ access_token?: string }>(tokenResponse);

  if (!tokenData.access_token) {
    throw new Error('GitHub OAuth token exchange failed');
  }

  const profileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${tokenData.access_token}`,
      'User-Agent': 'QuantumEd',
    },
  });

  if (!profileResponse.ok) {
    throw new Error('GitHub OAuth profile fetch failed');
  }

  const profileData = await readJsonResponse<{
    id?: number;
    email?: string | null;
    name?: string | null;
    login?: string | null;
  }>(profileResponse);

  if (!profileData.id) {
    throw new Error('GitHub OAuth profile fetch failed');
  }

  const email = profileData.email ?? (await fetchGithubPrimaryEmail(tokenData.access_token));

  return {
    provider: OAuthProvider.GITHUB,
    providerAccountId: String(profileData.id),
    email,
    name: profileData.name ?? profileData.login ?? null,
  };
};

export const oauthService = {
  createState(): string {
    return randomUUID();
  },

  getAuthorizationUrl(provider: OAuthProviderName, state: string): string {
    const config = getProviderConfig(provider);

    if (provider === 'google') {
      const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      url.searchParams.set('client_id', config.clientId);
      url.searchParams.set('redirect_uri', config.callbackUrl);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', OAUTH_SCOPES.google);
      url.searchParams.set('state', state);
      url.searchParams.set('access_type', 'offline');
      url.searchParams.set('prompt', 'consent');
      return url.toString();
    }

    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.set('client_id', config.clientId);
    url.searchParams.set('redirect_uri', config.callbackUrl);
    url.searchParams.set('scope', OAUTH_SCOPES.github);
    url.searchParams.set('state', state);
    return url.toString();
  },

  async authenticate(provider: OAuthProviderName, code: string): Promise<User> {
    const profile = provider === 'google' ? await fetchGoogleProfile(code) : await fetchGithubProfile(code);

    const existingOauthAccount = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });

    if (existingOauthAccount) {
      return existingOauthAccount.user;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (existingUser) {
      await prisma.oAuthAccount.create({
        data: {
          userId: existingUser.id,
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
          email: profile.email,
        },
      });

      return existingUser;
    }

    return prisma.user.create({
      data: {
        name: profile.name,
        email: profile.email,
        passwordHash: null,
        role: UserRole.STUDENT,
        oauthAccounts: {
          create: {
            provider: profile.provider,
            providerAccountId: profile.providerAccountId,
            email: profile.email,
          },
        },
      },
    });
  },

  providerFromName(provider: OAuthProviderName): OAuthProvider {
    return PROVIDER_MAP[provider];
  },
};
