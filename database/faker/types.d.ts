export interface FakerImplementation {
  createOne: () => Promise<T>;
  createMany: (count: number) => Promise<T>;
}
