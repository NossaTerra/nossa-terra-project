import { z } from "zod";

const convertCoordinate = (coordinate?: string | undefined | null) => {
  if (!coordinate) return undefined;
  return parseFloat(coordinate);
};

export const addressDetailsApiSchema = z
  .object({
    cep: z.string(),
    state: z.ostring().nullable(),
    city: z.ostring().nullable(),
    neighborhood: z.ostring().nullable(),
    street: z.ostring().nullable(),
    service: z.ostring().nullable(),
    location: z
      .object({
        type: z.string(),
        coordinates: z.object({
          longitude: z.ostring().nullable().transform(convertCoordinate),
          latitude: z.ostring().nullable().transform(convertCoordinate),
        }),
      })
      .optional(),
  })
  .transform(({ state, ...rest }) => ({
    province: state,
    ...rest,
  }));

export type AddressDetails = z.infer<typeof addressDetailsApiSchema>;
