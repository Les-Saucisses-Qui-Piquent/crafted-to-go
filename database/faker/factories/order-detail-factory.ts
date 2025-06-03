import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type OrderDetail = Prisma.order_detailCreateInput;

export class OrderDetailFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (orderId: string, beerId: string): OrderDetail => {
    return {
      order_fk: {
        connect: {
          id: orderId,
        },
      },
      beer_fk: {
        connect: {
          id: beerId,
        },
      },
      quantity: faker.number.int({ max: 100 }),
      price: faker.number.float({ min: 0.0, max: 10.0, fractionDigits: 2 }),
    };
  };

  private randomId = (ids: string[]) => {
    return ids[Math.floor(Math.random() * ids.length)];
  };

  createOne = async (orderId: string, beerIds: string[]) => {
    const orderDetail = this.generate(orderId, this.randomId(beerIds));
    const createdOrderDetail = await this.dbClient.order_detail.create({ data: orderDetail });

    return createdOrderDetail;
  };

  createMany = async (orderIds: string[], beerIds: string[]) => {
    const ordersdetail = await Promise.all(
      orderIds.map((orderId) => this.createOne(orderId, beerIds)),
    );

    return ordersdetail;
  };
}
