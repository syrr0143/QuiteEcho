import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, { message: ' message length of content should be at least' })
        .max(300, { message: 'content should be no graeter than 300 words ' })
})