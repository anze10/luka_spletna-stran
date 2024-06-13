"use server"
import { Decimal } from "@prisma/client/runtime/library"
import { env } from "~/env"
import { db } from "~/server/db"
export async function test(it: string, price: number) {
    await db.narocila.create({
        data: {
            id_natakarja: 0,
            items: it,
            totalPrice: price

        }
    })

}
//     };