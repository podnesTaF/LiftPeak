CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`introImageUrl` text
);
--> statement-breakpoint
CREATE TABLE `exerciseTargets` (
	`id` integer PRIMARY KEY NOT NULL,
	`exerciseId` integer NOT NULL,
	`targetId` integer NOT NULL,
	`priority` integer NOT NULL,
	FOREIGN KEY (`exerciseId`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`targetId`) REFERENCES `targets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `targets` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`parentId` integer,
	FOREIGN KEY (`parentId`) REFERENCES `targets`(`id`) ON UPDATE no action ON DELETE no action
);
