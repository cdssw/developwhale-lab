CREATE TABLE `metrics_daily` (
	`day` text NOT NULL,
	`audience` text NOT NULL,
	`source` text NOT NULL,
	`event` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`day`, `audience`, `source`, `event`)
);
