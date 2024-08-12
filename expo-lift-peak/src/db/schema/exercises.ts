import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Define the `exercises` table
export const exercise = sqliteTable('exercises', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    previewUrl: text('introImageUrl'),
    type: text('type').notNull(),
    equipment: text('equipment').notNull(),
    metric: text('metric').notNull(),
});

// Define the `targets` table with a self-referencing relationship
export const target: any = sqliteTable('targets', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    parentId: integer('parentId').references(() => target.id) // Self-referencing for hierarchical targets
});

// Define the `exerciseTargets` table for the many-to-many relationship
export const exerciseTarget = sqliteTable('exerciseTargets', {
    id: integer('id').primaryKey(),
    exerciseId: integer('exerciseId').references(() => exercise.id).notNull(),
    targetId: integer('targetId').references(() => target.id).notNull(),
    priority: integer('priority').notNull(),
});

// Define relationships for exercises
export const exerciseRelations = relations(exercise, ({ many }) => ({
    exerciseTargets: many(exerciseTarget),
}));

// Define relationships for targets
export const targetRelations = relations(target, ({ many, one }) => ({
    exerciseTargets: many(exerciseTarget),
    muscles: many(target),
    parent: one(target),
}));

// Define relationships for exerciseTargets
export const exerciseTargetRelations = relations(exerciseTarget, ({ one }) => ({
    exercise: one(exercise),
    target: one(target),
}));
