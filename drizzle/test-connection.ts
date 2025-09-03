import 'dotenv/config';
import { db } from "../drizzle/db";
import { products } from "../drizzle/schema";

async function testDbConnection() {
  try {
    const result = await db.select().from(products).limit(1);
    console.log("DB connection successful. Sample product:", result);
  } catch (error) {
    console.error("DB connection failed:", error);
  }
}

testDbConnection();
