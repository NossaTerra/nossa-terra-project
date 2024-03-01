import { z } from "zod";

export const addressDetailsApiSchema = z
  .object({
    zipcode: z.string().nullable(),
    stateShortname: z.ostring().nullable(),
    city: z.ostring().nullable(),
    district: z.ostring().nullable(),
    street: z.ostring().nullable(),
    service: z.ostring().nullable(),
    coordinates: z
      .object({
        longitude: z.onumber().nullable(),
        latitude: z.onumber().nullable(),
      })
      .optional(),
  })
  .transform(({ stateShortname, ...rest }) => ({
    province: stateShortname,
    ...rest,
  }));

export type AddressDetails = z.infer<typeof addressDetailsApiSchema>;
