import {openDatabaseSync} from "expo-sqlite";
import {drizzle} from "drizzle-orm/expo-sqlite";

const expoDb = openDatabaseSync("liftpeak.db");

export const db = drizzle(expoDb);