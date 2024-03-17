import { type Listing , type User } from "@prisma/client";

interface UserListing {
  productId: string;
  price: number;
  name: string;
}

export type SearchResult = {
  listing: Listing; // Importing from Prisma schema
  user: User; // Importing from Prisma schema
  userListings: UserListing[];
}
