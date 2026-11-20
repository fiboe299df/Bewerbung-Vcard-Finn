import { describe, expect, it } from "vitest";

import { ageOn, contactText, CONTACT, OTHER_PROOFS, vcardText } from "@/lib/card-data";

describe("business card data", () => {
  it("shows Finn as 24 in November 2026 (born 19.07.2002)", () => {
    expect(ageOn(CONTACT.birth, new Date(2026, 10, 20))).toBe(24);
  });

  it("does not count the birthday before it happens", () => {
    expect(ageOn(CONTACT.birth, new Date(2027, 6, 18))).toBe(24);
    expect(ageOn(CONTACT.birth, new Date(2027, 6, 19))).toBe(25);
  });

  it("copies name, phone, email and address in one go", () => {
    expect(contactText()).toBe(
      "Finn Böttcher\n01522 5231232\nfiboe02@web.de\nItzehoer Chaussee 32, 24808 Jevenstedt",
    );
  });

  it("saves the mobile number in the vCard", () => {
    expect(vcardText()).toContain("TEL;TYPE=CELL:+4915225231232");
  });

  it("includes disability ID and certificate of conduct as user requested", () => {
    expect(OTHER_PROOFS.map((d) => d.id)).toEqual(["fuehrungszeugnis", "schwerbehindertenausweis"]);
  });
});
