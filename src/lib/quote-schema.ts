import { z } from "zod";

/** Australian mobile (04xx xxx xxx) or landline (0X xxxx xxxx), with optional +61. */
export const AU_PHONE = /^(?:\+?61|0)[2-478](?:[ -]?\d){8}$/;

export const quoteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name must be under 80 characters."),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[()\s-]/g, ""))
    .pipe(z.string().regex(AU_PHONE, "Enter a valid Australian phone number, e.g. 0412 345 678.")),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(120, "Email must be under 120 characters.")
    .email("Enter a valid email address."),
  suburb: z
    .string()
    .trim()
    .min(2, "Which suburb is the property in?")
    .max(60, "Suburb must be under 60 characters."),
  service: z.string().min(1, "Choose the service you need."),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little about the roof (at least 10 characters).")
    .max(1500, "Please keep it under 1500 characters."),
});

export type QuoteInput = z.input<typeof quoteSchema>;
