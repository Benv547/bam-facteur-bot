DROP TABLE "Record";
DROP TABLE "Sticky";
DROP TABLE "Hourly";
DROP TABLE "Sanctions";
DROP TABLE "Message";
DROP TABLE "User_Sticker";
DROP TABLE "Vote";
DROP TABLE "Suggestion";
DROP TABLE "Help";
DROP TABLE "Signalement";
DROP TABLE "Opinion";
DROP TABLE "Ticket";
DROP TABLE "Bottle";
DROP TABLE "User";
DROP TABLE "Couleur";
DROP TABLE "Etat";
DROP TABLE "Emoji";
DROP TABLE "Role";
DROP TABLE "Sticker";

CREATE TABLE "Record" (
  "score" bigint NOT NULL,
  "date" timestamp NOT NULL DEFAULT current_timestamp,
  "type" varchar(255) NOT NULL
);

CREATE TABLE "User" (
  "id_user" bigint PRIMARY KEY,
  "money" int,
  "xp" int,
  "nb_warn" int default 0,
  "nb_invite" int default 0,
  "diceBearSeed" text NOT NULL default md5(random()::text),
  "signature" text NOT NULL default 'Un•e illustre inconnu•e',
  "color" varchar(6) NOT NULL default substring(md5(random()::text), 1, 6),
  "id_sticker" int,
  "anniversaireJour" int,
  "anniversaireMois" int
);

CREATE TABLE "Sticky" (
    "id_guild" bigint NOT NULL,
    "id_channel" bigint NOT NULL,
    "id_message" bigint NOT NULL,
    "id_lastReply" bigint
);

CREATE TABLE "Sticker" (
    "id_sticker" serial PRIMARY KEY,
    "name" text NOT NULL,
    "url" text NOT NULL,
    "sharable" boolean NOT NULL default false,
    "winnable" boolean NOT NULL default false,
    "sharable_percentage" float NOT NULL default 0.0
);

CREATE TABLE "User_Sticker" (
    "id_user" bigint NOT NULL,
    "id_sticker" int NOT NULL,
    "id_guild" bigint NOT NULL,
    PRIMARY KEY ("id_user", "id_sticker", "id_guild")
);

CREATE TABLE "Message" (
  "id_message" bigint PRIMARY KEY,
  "id_bottle" bigint,
  "id_user" bigint,
  "date" timestamp default current_timestamp,
  "content" text
);

CREATE TABLE "Couleur" (
  "couleur" text PRIMARY KEY
);

CREATE TABLE "Emoji" (
  "emoji" text PRIMARY KEY
);

CREATE TABLE "Etat" (
  "etat" text PRIMARY KEY
);

CREATE TABLE "Bottle" (
  "id_bottle" bigint PRIMARY KEY,
  "id_guild" bigint,
  "id_user_sender" bigint,
  "id_user_receiver" bigint,
  "id_channel" bigint,
  "name" varchar(50),
  "nb_sea" int default 0,
  "archived" boolean default false,
  "terminated" boolean default false,
  "date" timestamp default current_timestamp
);

CREATE TABLE "Sanctions" (
  "id_user" bigint,
  "id_mod" bigint,
  "gravity" varchar(15),
  "content" text,
  "date" timestamp default current_timestamp
);

CREATE TABLE "Ticket" (
  "id_user" bigint PRIMARY KEY,
  "id_channel" bigint,
  "id_guild" bigint
);

CREATE TABLE "Signalement" (
    "id_message" bigint PRIMARY KEY,
    "id_sender" bigint,
    "id_receiver" bigint,
    "content" text,
    "id_bottle" bigint,
    "id_warn" bigint,
    "status" boolean default false
);

CREATE TABLE "Opinion" (
    "id_message" bigint PRIMARY KEY,
    "id_user" bigint,
    "content" text,
    "date" timestamp default current_timestamp
);

CREATE TABLE "Suggestion" (
    "id_message" bigint PRIMARY KEY,
    "id_thread" bigint,
    "id_user" bigint,
    "content" text,
    "isReply" boolean default false,
    "date" timestamp default current_timestamp,
    "id" serial
);

CREATE TABLE "Vote" (
    "id_message" bigint,
    "id_user" bigint,
    "vote" boolean
);

CREATE TABLE "Help" (
    "id_message" bigint,
    "id_thread" bigint,
    "id_user" bigint,
    "content" text,
    "isReply" boolean default false,
    "date" timestamp default current_timestamp
);

CREATE TABLE "Role" (
    "id_role" bigint PRIMARY KEY,
    "id_message" bigint
);

CREATE TABLE "Hourly" (
    "id_user" bigint PRIMARY KEY,
    "lastHourly" timestamp default current_timestamp
);

ALTER TABLE "Message" ADD FOREIGN KEY ("id_bottle") REFERENCES "Bottle" ("id_bottle") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Bottle" ADD FOREIGN KEY ("id_user_sender") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Bottle" ADD FOREIGN KEY ("id_user_receiver") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Sanctions" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Sanctions" ADD FOREIGN KEY ("id_mod") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Signalement" ADD FOREIGN KEY ("id_sender") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Signalement" ADD FOREIGN KEY ("id_receiver") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Signalement" ADD FOREIGN KEY ("id_bottle") REFERENCES "Bottle" ("id_bottle") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Opinion" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Suggestion" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Vote" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Vote" ADD FOREIGN KEY ("id_message") REFERENCES "Suggestion" ("id_message") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Help" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Ticket" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "User" ADD FOREIGN KEY ("id_sticker") REFERENCES "Sticker" ("id_sticker") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "User_Sticker" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User_Sticker" ADD FOREIGN KEY ("id_sticker") REFERENCES "Sticker" ("id_sticker") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Hourly" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "Couleur" VALUES ('rose'),
                             ('cendrée'),
                             ('saumon'),
                             ('taupe'),
                             ('corail'),
                             ('violette'),
                             ('marron'),
                             ('feu-vif'),
                             ('magenta'),
                             ('carmin'),
                             ('grenat'),
                             ('écarlate'),
                             ('cobalt'),
                             ('azur'),
                             ('lapis'),
                             ('rubis'),
                             ('verte'),
                             ('saphir'),
                             ('pourpre'),
                             ('orange'),
                             ('grise'),
                             ('noire'),
                             ('beige'),
                             ('blanche'),
                             ('mauve'),
                             ('rouge'),
                             ('bleue');

INSERT INTO "Etat" VALUES ('cassée'),
                             ('naufragée'),
                             ('mousseuse'),
                             ('dorée'),
                             ('sale'),
                             ('étincelante'),
                             ('polie'),
                             ('perdue'),
                             ('rayée'),
                             ('coupante'),
                             ('écaillée'),
                             ('brûlante'),
                             ('froide'),
                             ('imaginaire'),
                             ('douce'),
                             ('abîmée'),
                             ('plastique'),
                             ('étoilée'),
                             ('boueuse'),
                             ('argentée');

-- Get all emoji from https://emojipedia.org/ who correpond to autumn season
INSERT INTO "Emoji" VALUES ('🍂'),
                           ('🥮'),
                           ('🍁'),
                           ('🍃'),
                           ('🍄'),
                           ('🧣'),
                           ('🧤'),
                           ('🧥'),
                           ('🧦'),
                           ('🎃'),
                           ('🍎'),
                           ('🌶'),
                           ('🌽'),
                           ('🥕'),
                           ('🥔'),
                           ('🎑'),
                           ('🌇');