import { db } from "~/server/db";
import { isWithinExpiration } from "lucia/utils";

export enum TokenStatus {
  NotFound = "NotFound",
  Expired = "Expired",
  Good = "Good",
}

export async function checkResetPasswordToken(
  token: string,
): Promise<TokenStatus> {
  const storedToken = await db.passwordResetToken.findFirst({
    where: {
      id: token,
    },
  });
  if (!storedToken) {
    return TokenStatus.NotFound;
  }

  const tokenExpires = Number(storedToken.expires); // bigint => number conversion
  if (!isWithinExpiration(tokenExpires)) {
    return TokenStatus.Expired;
  }

  return TokenStatus.Good;
}
