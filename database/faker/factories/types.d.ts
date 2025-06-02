export interface FakerImplementation {
  createOne: (...args: T[]) => Promise<T>;
  createMany: (...args: T[]) => Promise<T>;
}
