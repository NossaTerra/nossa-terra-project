import {
  addressSchema,
  BusinessSector,
  buyerSocialSchema,
  sellerSocialSchema,
  type User,
} from "../../types/user.type";
import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { auth } from "../auth/lucia";
import { protectedProcedure, publicProcedure } from "../trpc/procedures";
import axios from "axios";
import { addressDetailsApiSchema } from "~/server/api/addressApi";
import cloudinaryV2 from "~/utils/configs";
import { cnpjPattern, cpfPattern } from "~/components/ui/input/masks/cpf-cnpj";

export const authCredentialsSchema = z.discriminatedUnion("providerId", [
  z.object({
    providerId: z.literal("email"),
    email: z.string(),
    password: z.string().min(8).max(60),
  }),
  z.object({
    providerId: z.literal("google"),
  }),
]);

export const authRouter = createTRPCRouter({
  getUser: publicProcedure.query(({ ctx: { user } }) => user),

  checkUserKeys: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx: { db }, input: { email } }) => {
      const user = await db.user.findUnique({ where: { email } });
      if (!user) {
        return [];
      }
      const keys = (await auth.getAllUserKeys(user.id)).map(
        (k) => k.providerId,
      );
      return keys;
    }),

  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx: { db }, input: { email } }) => {
      try {
        const user = await db.user.findUnique({ where: { email } });
        return user;
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),

  registerAndLogin: publicProcedure
    .input(
      z.object({
        authCredentials: authCredentialsSchema,
        attributes: z.discriminatedUnion("role", [
          z
            .object({
              role: z.literal("buyer"),
              email: z.string().email().min(2).max(60),
              name: z.string().min(2).max(120),
              avatarImage: z.string().optional(),
              cpf: z.string().length(cnpjPattern.length),
              businessMainSector: z.nativeEnum(BusinessSector),
            })
            .merge(addressSchema)
            .merge(buyerSocialSchema),
          z
            .object({
              role: z.literal("seller"),
              email: z.string().email().min(2).max(60),
              name: z.string().min(2).max(120),
              cpf: z.string().min(cpfPattern.length).max(cnpjPattern.length),
              rg: z.string().min(6).max(15),
            })
            .merge(addressSchema)
            .merge(sellerSocialSchema),
        ]),
      }),
    )
    .mutation(
      async ({
        input: { attributes, authCredentials },
        ctx: { cookies, authRequest },
      }) => {
        let newUser: User | null = null;

        if (authCredentials.providerId === "email") {
          newUser = await auth.createUser({
            attributes: {
              activeState: "inactive",
              ...attributes,
            },
            key: {
              providerId: "email",
              providerUserId: authCredentials.email,
              password: authCredentials.password,
            },
          });
        }

        if (authCredentials.providerId === "google") {
          const { google_access_token } = cookies;
          if (!google_access_token) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid OAuth cookies",
            });
          }

          const googleUser = await getGoogleUser(google_access_token);
          newUser = await auth.createUser({
            attributes: {
              activeState: "inactive",
              ...attributes,
            },
            key: {
              providerId: "google",
              providerUserId: googleUser.email,
              password: null,
            },
          });
        }

        if (!newUser) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "authCredentials couldn't be processed",
          });
        }

        const session = await auth.createSession({
          userId: newUser.id,
          attributes: {},
        });
        authRequest.setSession(session);
        return newUser;
      },
    ),

  login: publicProcedure
    .input(z.object({ authCredentials: authCredentialsSchema }))
    .mutation(
      async ({ ctx: { authRequest, cookies }, input: { authCredentials } }) => {
        try {
          let authedKey: Awaited<ReturnType<typeof auth.useKey>> | null = null;

          if (authCredentials.providerId === "email") {
            const { email, password } = authCredentials;
            authedKey = await auth.useKey("email", email, password);
          }

          if (authCredentials.providerId === "google") {
            const { google_access_token } = cookies;
            if (!google_access_token) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid OAuth cookies",
              });
            }
            const googleUser = await getGoogleUser(google_access_token);
            authedKey = await auth.useKey("google", googleUser.email, null);
          }

          if (authedKey) {
            const session = await auth.createSession({
              userId: authedKey.userId,
              attributes: {},
            });
            authRequest.setSession(session);
            return session;
          }
        } catch (error) {
          console.log(error);
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "authCredentials couldn't be processed",
        });
      },
    ),

  logout: protectedProcedure.mutation(
    async ({ ctx: { authRequest, session } }) => {
      await auth.invalidateSession(session.sessionId);
      authRequest.setSession(null);
    },
  ),

  getAddressDetails: publicProcedure
    .input(z.object({ zipCode: z.string().min(1).max(9) }))
    .query(async ({ input: { zipCode } }) => {
      const parsedZipCode = zipCode.replace("-", "");
      try {
        const response = await axios.get(
          `${env.ADDRESS_ZIP_CODE_API_URL}${parsedZipCode}`,
          {
            headers: {
              Authorization: `Bearer ${env.ADDRESS_ZIP_CODE_API_KEY}`,
            },
          },
        );
        return await addressDetailsApiSchema.parseAsync(
          (response.data as { result: unknown })?.result,
        );
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),

  uploadAvatar: publicProcedure
    .input(z.object({ dataUrl: z.string() }))
    .mutation(async ({ input: { dataUrl } }) => {
      try {
        const result = await cloudinaryV2.uploader.upload(dataUrl, {
          folder: "nossa-terra-avatars",
          crop: "fill",
          width: 160,
          height: 160,
        });
        return result.secure_url;
      } catch (error) {
        console.log("cloudnary error", error);
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
});

async function getGoogleUser(google_access_token: string) {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    {
      headers: {
        Authorization: `Bearer ${google_access_token}`,
      },
    },
  );
  const googleUser = await z
    .object({
      email: z.string(),
    })
    .parseAsync(await response.json());

  return googleUser;
}
