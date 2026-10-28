/**
 * Contact and Support email helper.
 * Reads dynamically from environment variables so contacts can be modified
 * during deployment without code changes.
 */
export function getContactEmails() {
  const ownerEmail =
    (
      process.env.NEXT_PUBLIC_OWNER_EMAIL ||
      process.env.OWNER_EMAIL ||
      ""
    ).trim() || "owner@cleanergybattery.com";

  const supportEmail =
    (
      process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
      process.env.SUPPORT_EMAIL ||
      ""
    ).trim() || "support@cleanergybattery.com";

  const privacyEmail =
    (
      process.env.NEXT_PUBLIC_PRIVACY_EMAIL ||
      process.env.PRIVACY_EMAIL ||
      ""
    ).trim() || "privacy@cleanergybattery.com";

  return {
    ownerEmail,
    supportEmail,
    privacyEmail,
  };
}
