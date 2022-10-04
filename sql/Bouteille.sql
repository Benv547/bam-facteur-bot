DROP TABLE "Sanctions";
DROP TABLE "Message";
DROP TABLE "Bottle";
DROP TABLE "User";

CREATE TABLE "User" (
  "id_user" bigint PRIMARY KEY,
  "money" int,
  "xp" int
);

CREATE TABLE "Message" (
  "id_message" bigint PRIMARY KEY,
  "id_bottle" bigint,
  "id_channel" bigint,
  "id_user" bigint,
  "date" timestamp default current_timestamp,
  "content" text
);

CREATE TABLE "Bottle" (
  "id_bottle" bigint PRIMARY KEY,
  "id_user_sender" bigint,
  "id_user_receiver" bigint,
  "id_channel" bigint,
  "name" varchar(30)
);

CREATE TABLE "Sanctions" (
  "id_user" bigint,
  "id_mod" bigint,
  "gravity" varchar(15),
  "content" text,
  "date" timestamp default current_timestamp
);

ALTER TABLE "Message" ADD FOREIGN KEY ("id_bottle") REFERENCES "Bottle" ("id_bottle");

ALTER TABLE "Message" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user");

ALTER TABLE "Bottle" ADD FOREIGN KEY ("id_user_sender") REFERENCES "User" ("id_user");

ALTER TABLE "Bottle" ADD FOREIGN KEY ("id_user_reveiver") REFERENCES "User" ("id_user");

ALTER TABLE "Sanctions" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user");

ALTER TABLE "Sanctions" ADD FOREIGN KEY ("id_mod") REFERENCES "User" ("id_user");
