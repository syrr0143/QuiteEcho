import { z } from "zod";

export const verifySchema = z.object({
    verificationCode: z.string().length(8, { message: " verification code must be 8 digit " })
})
