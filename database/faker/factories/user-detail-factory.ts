import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type UserDetail = Prisma.user_detailCreateInput;

export class UserDetailFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (userId: string): UserDetail => {
    return {
      user_fk: {
        connect: {
          id: userId,
        },
      },
      image: faker.image.url(),
      beer_level: faker.number.int({ max: 100 }),
    };
  };

  private randomId = (ids: string[]) => {
    return ids[Math.floor(Math.random() * ids.length)];
  };

  createOne = async (userId: string) => {
    const userDetail = this.generate(userId);
    const createdUserDetail = await this.dbClient.user_detail.create({ data: userDetail });

    return createdUserDetail;
  };

  createMany = async (userIds: string[]) => {
    const userDetails = await Promise.all(userIds.map((userId) => this.createOne(userId)));

    return userDetails;
  };
}
