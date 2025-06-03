import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type Order = Prisma.orderCreateInput;

export class OrderFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (userId: string, breweryId: string): Order => {
    return {
      user_fk: {
        connect: {
          id: userId,
        },
      },
      brewery_fk: {
        connect: {
          id: breweryId,
        },
      },
      final_price: faker.number.float({ min: 0.0, max: 100.0, fractionDigits: 2 }),
      status: faker.lorem.word(),
      pickup_day: faker.date.anytime(),
      pickup_time: faker.lorem.word(),
    };
  };

  private randomId = (ids: string[]) => {
    return ids[Math.floor(Math.random() * ids.length)];
  };

  createOne = async (userId: string, breweryIds: string[]) => {
    const order = this.generate(userId, this.randomId(breweryIds));
    const createdOrder = await this.dbClient.order.create({ data: order });

    return createdOrder;
  };

  createMany = async (userIds: string[], breweryIds: string[]) => {
    const orders = await Promise.all(userIds.map((userId) => this.createOne(userId, breweryIds)));

    return orders;
  };
}
