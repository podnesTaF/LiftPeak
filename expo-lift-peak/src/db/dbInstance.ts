import {openDatabaseSync} from "expo-sqlite";
import {drizzle} from "drizzle-orm/expo-sqlite";

const expo = openDatabaseSync('liftpeak.db', { enableChangeListener: true });

export const db = drizzle(expo);