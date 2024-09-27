import { sign } from "jsonwebtoken";

import { GenerateTokenInput } from "../types";

export const maxAge = 3 * 24 * 60 * 60 * 1000;

export default ({ email, userId }: GenerateTokenInput) => {
  return sign(
    {
      email,
      userId,
    },
    String(process.env.JWT_SECRET),
    { expiresIn: maxAge }
  );
};
