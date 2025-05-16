import * as argon2 from "argon2";

export const useHash = () => {
  /**
   * Hash a string using argon2
   * @param password - The string to hash
   * @returns The hashed string
   */
  const hashPassword = async (password: string) => {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 3,
      parallelism: 1,
    });
  };

  /**
   * Verify a string against a hash
   * @param password - The string to verify
   * @param hash - The hash to verify against
   * @returns True if the string is correct, false otherwise
   */
  const verifyPassword = async (password: string, hash: string) => {
    return await argon2.verify(hash, password);
  };

  return {
    hashPassword,
    verifyPassword,
  };
};
