import { type Listing, type User } from "@prisma/client";
import { type Decimal } from "@prisma/client/runtime/library";

interface UserListing {
  productId: string;
  price: number | Decimal;
  name: string;
}

export type SearchResult = {
  listing?: Listing;
  user: User;
  userListings?: UserListing[];
};
