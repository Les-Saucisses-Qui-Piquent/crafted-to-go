import * as argon2 from "argon2";

export const useHash = () => {
  /**
   * Hash a string using argon2
   * @param password - The string to hash
   * @returns The hashed string
   */
  const hashPassword = async (password: string) => {
    if (!process.env.ARGON2_SECRET) {
      throw new Error("ARGON2_SECRET is not defined");
    }

    return await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 3,
      parallelism: 1,
      secret: Buffer.from(process.env.ARGON2_SECRET),
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
