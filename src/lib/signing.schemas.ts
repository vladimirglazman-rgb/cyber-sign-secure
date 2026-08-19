import { z } from "zod";

export const tokenSchema = z.object({ token: z.string().min(20).max(200) });
export const dualSchema = tokenSchema.extend({
  idNumber: z.string().min(4).max(40),
  phone: z.string().min(4).max(40),
});
export const signSchema = dualSchema.extend({
  signature: z.string().min(50).max(200000),
});
export const nextSignerSchema = z.object({
  token: z.string().min(20).max(200),
  phone: z.string().min(4).max(40),
});

export const normalizePhone = (s: string) => s.replace(/\D+/g, "");
export const MISMATCH_MSG =
  "פרטי הזיהוי (ת.ז. או טלפון) אינם תואמים את רישומי המערכת.";
