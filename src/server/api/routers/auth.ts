import {
  addressSchema,
  businessSectorSchema,
  buyerSocialSchema,
  sellerSocialSchema,
} from "./../auth/types";
import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter } from "~/server/api/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { auth } from "../auth/lucia";
import { protectedProcedure, publicProcedure } from "../trpc/procedures";
import axios from "axios";
import { addressDetailsApiSchema } from "~/server/api/addressApi";
import { lengthFormattedCNPJ, lengthFormattedCPF } from "~/utils/formatters";
import cloudinaryV2 from "~/utils/configs";

export const authRouter = createTRPCRouter({
  getUser: publicProcedure.query(({ ctx: { user } }) => user),

  checkUserExists: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx: { db }, input: { email } }) => {
      const user = await db.user.findUnique({ where: { email } });
      return !!user;
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

  registerSeller: publicProcedure
    .input(
      z.object({
        email: z.string().email().min(2).max(60),
        name: z.string().min(2).max(120),
        password: z.string().min(8).max(30),
        cpf: z.string().min(lengthFormattedCPF).max(lengthFormattedCNPJ),
        rg: z.string().min(6).max(15),
        address: addressSchema,
        social: sellerSocialSchema,
      }),
    )
    .mutation(({ input: { email, password, social, address, ...rest } }) => {
      try {
        const user = auth.createUser({
          attributes: {
            activeState: "inactive",
            email,
            role: "seller",
            ...address,
            ...social,
            ...rest,
          },
          key: {
            password,
            providerId: "email",
            providerUserId: email,
          },
        });
        return user;
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),

  registerBuyer: publicProcedure
    .input(
      z.object({
        email: z.string().email().min(2).max(60),
        name: z.string().min(2).max(120),
        password: z.string().min(8).max(60),
        avatarImage: z.string().optional(),
        cpf: z.string().min(lengthFormattedCNPJ).max(lengthFormattedCNPJ),
        businessMainSector: businessSectorSchema,
        address: addressSchema,
        social: buyerSocialSchema,
      }),
    )
    .mutation(({ input: { email, password, address, social, ...rest } }) => {
      try {
        const user = auth.createUser({
          attributes: {
            activeState: "inactive",
            role: "buyer",
            email,
            ...address,
            ...social,
            ...rest,
          },
          key: {
            password,
            providerId: "email",
            providerUserId: email,
          },
        });
        return user;
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx: { authRequest }, input: { email, password } }) => {
      try {
        const key = await auth.useKey("email", email, password);
        const session = await auth.createSession({
          userId: key.userId,
          attributes: {},
        });
        authRequest.setSession(session);
        return session;
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),

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
          `${env.ADDRESS_VIA_ZIP_CODE_API_URL}${parsedZipCode}`,
        );
        console.log(
          JSON.stringify(addressDetailsApiSchema.safeParse(response.data)),
        );
        return await addressDetailsApiSchema.parseAsync(response.data);
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
