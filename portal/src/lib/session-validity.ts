/**
 * A session belongs to the password it was started with. When the password changes (the person chose a new
 * one, or an admin set a temporary one), every older session stops working. Sessions from before this
 * existed carry no value, and match an account that has never changed its password.
 */
export const sessionIsCurrent = (account: { passwordChangedAt: Date | null }, tokenValue: number | undefined) =>
  (account.passwordChangedAt?.getTime() ?? 0) === (tokenValue ?? 0);
