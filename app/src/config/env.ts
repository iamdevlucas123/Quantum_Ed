declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
};

export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
} as const;
