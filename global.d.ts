// global.d.ts
import { NextPage } from 'next';

declare module 'next' {
  export type PageProps = {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  };
}