import { describe, expect, it } from "vitest";
import { quoteSchema } from "./quote-schema";

const valid = {
  name: "Alex Taylor",
  phone: "0412 345 678",
  email: "alex@example.com",
  suburb: "Chermside",
  service: "Roof Restoration",
  message: "Tiles are faded and the ridge pointing is cracking.",
};

describe("quote form validation", () => {
  it("accepts a complete enquiry", () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts +61 mobile numbers", () => {
    expect(quoteSchema.safeParse({ ...valid, phone: "+61 412 345 678" }).success).toBe(true);
  });

  it("rejects non-Australian phone numbers", () => {
    expect(quoteSchema.safeParse({ ...valid, phone: "555-1234" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(quoteSchema.safeParse({ ...valid, email: "alex@" }).success).toBe(false);
  });

  it("requires a service to be chosen", () => {
    expect(quoteSchema.safeParse({ ...valid, service: "" }).success).toBe(false);
  });

  it("requires a project description of at least 10 characters", () => {
    expect(quoteSchema.safeParse({ ...valid, message: "Leak" }).success).toBe(false);
  });
});
