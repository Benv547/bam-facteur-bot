DROP TABLE "Record";
DROP TABLE "Sticky";
DROP TABLE "Hourly";
DROP TABLE "Sanctions";
DROP TABLE "Invite";
DROP TABLE "User_Achievement";
DROP TABLE "Achievement";
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
  "money_spent" int,
  "xp" int,
  "diceBearSeed" text NOT NULL default md5(random()::text),
  "signature" text NOT NULL default 'Un•e illustre inconnu•e',
  "color" varchar(6) NOT NULL default substring(md5(random()::text), 1, 6),
  "id_sticker" int NOT NULL default 1,
  "anniversaireJour" int,
  "anniversaireMois" int,
  "isVIP" boolean NOT NULL default false,
  "nb_treasures" int NOT NULL default 0
);

CREATE TABLE "Sticky" (
    "id_guild" bigint NOT NULL,
    "id_channel" bigint NOT NULL,
    "id_message" bigint NOT NULL,
    "id_lastReply" bigint
);

CREATE TABLE "Achievement" (
    "id_achievement" serial PRIMARY KEY,
    "name" varchar(255) NOT NULL,
    "rarity" varchar(255) NOT NULL,
    "description" text NOT NULL,
    "type" varchar(255) NOT NULL,
    "value" text NOT NULL,
    "id_sticker" int
);

CREATE TABLE "User_Achievement" (
    "id_user" bigint NOT NULL,
    "id_achievement" int NOT NULL,
    "date" timestamp NOT NULL DEFAULT current_timestamp
);

CREATE TABLE "Invite" (
    "id_user_inviter" bigint NOT NULL,
    "id_user_invited" bigint NOT NULL
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
  "id_user_author" bigint,
  "id_user_recipient" bigint,
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
ALTER TABLE "Bottle" ADD FOREIGN KEY ("id_user_author") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Bottle" ADD FOREIGN KEY ("id_user_recipient") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

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

ALTER TABLE "User_Achievement" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User_Achievement" ADD FOREIGN KEY ("id_achievement") REFERENCES "Achievement" ("id_achievement") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Achievement" ADD FOREIGN KEY ("id_sticker") REFERENCES "Sticker" ("id_sticker") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Invite" ADD FOREIGN KEY ("id_user_inviter") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invite" ADD FOREIGN KEY ("id_user_invited") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

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

INSERT INTO "Sticker" ("name", "url", "sharable", "winnable", "sharable_percentage") VALUES ('Plage', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162271353188434/plage.png', true, false, 0.01);

INSERT INTO "Achievement" ("name", "description", "rarity", "type", "value", "id_sticker") VALUES ('Océan messager', 'Vous avez envoyé votre première bouteille !', 'commun', 'bottleSend', 1, null),
                                                                                    ('Courrier marin', 'Vous avez reçu votre première bouteille !', 'commun', 'bottleReceive', 1, null),
                                                                                    ('Créateur de lien', 'Vous avez envoyé 100 bouteilles !', 'rare', 'bottleSend', 100, null),
                                                                                    ('Lecture abondante', 'Vous avez reçu 100 bouteilles !', 'rare', 'bottleReceive', 100, null),
                                                                                    ('Pile poil !', 'Vous avez envoyé une bouteille de 2000 caractères !', 'rare', 'messageLength', 2000, null),
                                                                                    ('Ecrivain accompli', 'Vous avez envoyé une bouteille de 1500 caractères !', 'rare', 'messageLength', 1500, null),
                                                                                    ('Pirate sans carte', 'Vous avez trouvé et ouvert un trésor !', 'rare', 'userNbTreasures', 1, null),
                                                                                    ('Une suggestion suggestive', 'Vous avez envoyé une suggestion !', 'rare', 'suggestionSent', 1, null),
                                                                                    ('Un avis bien tranché', 'Vous avez envoyé un avis !', 'rare', 'opinionSent', 1, null),
                                                                                    ('Dépensier', 'Vous avez dépensé 10 000 pièces d''or !', 'rare', 'userMoneySpent', 10000, null),
                                                                                    ('Accro aux projecteurs', 'Vous êtes passé VIP !', 'epic', 'userInvited', 5, null),
                                                                                    ('Plus on est de fou...', 'Vous avez invité 10 personnes sur le serveur !', 'epic', 'userInvited', 10, null),
                                                                                    -- Acheteur compulsif ?
                                                                                    ('Panier percé', 'Vous avez dépensé 100 000 pièces d''or !', 'legendaire', 'userMoneySpent', 10000, null),
                                                                                    ('E brezhoneg, mar plij', 'Vous avez écrit un mot en Breton !', 'mythique', 'messageContains', 'Breizh', null),
                                                                                    ('Créateur de stars', '5 membres que vous avez invités sont devenus VIP', 'mythique', 'vipUserInvited', 5, null);
