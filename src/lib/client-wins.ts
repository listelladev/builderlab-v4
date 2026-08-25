import "server-only";
import { sanityReadClient } from "@/lib/sanity/client";
import type { SanityImage } from "@/lib/sanity/image";

export type ClientWin = {
  _id: string;
  image: SanityImage;
  /** Free text, written however the admin enters it, e.g. "April 2026". */
  date: string;
  name: string;
};

const CLIENT_WIN_PROJECTION = `{
  _id,
  image,
  date,
  name
}`;

export async function getClientWins(): Promise<ClientWin[]> {
  return sanityReadClient.fetch(
    `*[_type == "clientWin"] | order(_createdAt desc) ${CLIENT_WIN_PROJECTION}`
  );
}
