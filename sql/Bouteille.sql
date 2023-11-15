DROP TABLE IF EXISTS "Record" CASCADE;
DROP TABLE IF EXISTS "Sticky" CASCADE;
DROP TABLE IF EXISTS "Hourly" CASCADE;
DROP TABLE IF EXISTS "Sanctions" CASCADE;
DROP TABLE IF EXISTS "Invite" CASCADE;
DROP TABLE IF EXISTS "User_Achievement" CASCADE;
DROP TABLE IF EXISTS "Achievement" CASCADE;
DROP TABLE IF EXISTS "Message" CASCADE;
DROP TABLE IF EXISTS "Message_ile" CASCADE;
DROP TABLE IF EXISTS "User_Sticker" CASCADE;
DROP TABLE IF EXISTS "Vote" CASCADE;
DROP TABLE IF EXISTS "Suggestion" CASCADE;
DROP TABLE IF EXISTS "Help" CASCADE;
DROP TABLE IF EXISTS "Signalement" CASCADE;
DROP TABLE IF EXISTS "Opinion" CASCADE;
DROP TABLE IF EXISTS "Ticket" CASCADE;
DROP TABLE IF EXISTS "Bottle" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Couleur" CASCADE;
DROP TABLE IF EXISTS "Etat" CASCADE;
DROP TABLE IF EXISTS "Emoji" CASCADE;
DROP TABLE IF EXISTS "Sticker" CASCADE;
DROP TABLE IF EXISTS "User_ile" CASCADE;
DROP TABLE IF EXISTS "Profile_ile" CASCADE;
DROP TABLE IF EXISTS "Bird" CASCADE;
DROP TABLE IF EXISTS "SignalementBird" CASCADE;
DROP TABLE IF EXISTS "SignalementHelp" CASCADE;
DROP TABLE IF EXISTS "SignalementIleMessage" CASCADE;
DROP TABLE IF EXISTS "SignalementSuggestion" CASCADE;
DROP TABLE IF EXISTS "SignalementTicket" CASCADE;
DROP TABLE IF EXISTS "SignalementWanted" CASCADE;
DROP TABLE IF EXISTS "Wanted" CASCADE;
DROP TABLE IF EXISTS "WantedResponse" CASCADE;
DROP TABLE IF EXISTS "BirdReaction" CASCADE;
DROP TABLE IF EXISTS "SignalementBottle" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Footer" CASCADE;
DROP TABLE IF EXISTS "User_Footer" CASCADE;


CREATE TABLE "Product" (
    "id_product" SERIAL NOT NULL,
    "id_item" INT NOT NULL,
    "price" INT NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "boutique" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "Record" (
  "score" bigint NOT NULL,
  "date" timestamp NOT NULL DEFAULT current_timestamp,
  "type" varchar(255) NOT NULL
);

CREATE TABLE "User" (
  "id_user" bigint PRIMARY KEY,
  "money" int default 0,
  "money_spent" int default 0,
  "xp" int default 0,
  "diceBearSeed" text NOT NULL default md5(random()::text),
  "signature" text NOT NULL default 'Un•e illustre inconnu•e',
  "color" varchar(6) NOT NULL default substring(md5(random()::text), 1, 6),
  "id_sticker" int NOT NULL default 1,
  "id_footer" int,
  "anniversaireJour" int,
  "anniversaireMois" int,
  "isVIP" boolean NOT NULL default false,
  "nb_treasures" int NOT NULL default 0,
  "date_bottle" timestamp,
  "date_bird" timestamp,
  "date_wanted" timestamp,
  "date_treasure" timestamp,
  "afk_number" int NOT NULL default 0
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

CREATE TABLE "Footer" (
    "id_footer" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "url" text NOT NULL,
    "sharable" boolean NOT NULL default false,
    "winnable" boolean NOT NULL default false,
    "sharable_percentage" float NOT NULL default 0.0
);

CREATE TABLE "User_Footer" (
    "id_user" bigint NOT NULL,
    "id_footer" int NOT NULL,
    "id_guild" bigint NOT NULL,
    PRIMARY KEY ("id_user", "id_footer")
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

CREATE TABLE "Wanted" (
    "id_channel" bigint PRIMARY KEY,
    "id_guild" bigint NOT NULL,
    "id_user" bigint NOT NULL,
    "id_message" bigint NOT NULL,
    "name" varchar(50) NOT NULL,
    "content" text NOT NULL,
    "archived" boolean NOT NULL default false,
    "date" timestamp default current_timestamp,
    "nb_replies" int NOT NULL default 0
);

CREATE TABLE "WantedResponse" (
    "id_channel" bigint NOT NULL,
    "id_guild" bigint NOT NULL,
    "id_user" bigint NOT NULL,
    "id_message" bigint NOT NULL,
    "content" text NOT NULL,
    "date" timestamp default current_timestamp
);

CREATE TABLE "Bird" (
    "id_bird" serial PRIMARY KEY,
    "id_channel" bigint NOT NULL,
    "id_guild" bigint NOT NULL,
    "id_user" bigint NOT NULL,
    "name" varchar(50) NOT NULL,
    "content" text NOT NULL,
    "sea" int NOT NULL default 0,
    "archived" boolean NOT NULL default false,
    "date" timestamp default current_timestamp
);

CREATE TABLE "BirdReaction" (
    "id_bird" int NOT NULL,
    "id_user" bigint NOT NULL,
    "id_emoji" varchar(10) NOT NULL,
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
    "type" varchar(255) NOT NULL
);
CREATE TABLE "SignalementBottle" (
    "id_message" bigint PRIMARY KEY,
    "id_bottle" bigint
);
CREATE TABLE "SignalementWanted" (
    "id_message" bigint PRIMARY KEY,
    "id_message_wanted" bigint,
    "id_channel" bigint
);
CREATE TABLE "SignalementTicket" (
    "id_message" bigint PRIMARY KEY,
    "id_message_ticket" bigint,
    "id_channel" bigint
);
CREATE TABLE "SignalementSuggestion" (
    "id_message" bigint PRIMARY KEY,
    "id_message_suggestion" bigint,
    "id_channel" bigint
);
CREATE TABLE "SignalementHelp" (
    "id_message" bigint PRIMARY KEY,
    "id_message_help" bigint,
    "id_channel" bigint
);
CREATE TABLE "SignalementBird" (
    "id_message" bigint PRIMARY KEY,
    "id_channel" bigint
);
CREATE TABLE "SignalementIleMessage" (
    "id_message" bigint PRIMARY KEY,
    "id_message_ile" bigint,
    "id_channel" bigint
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

CREATE TABLE "Hourly" (
    "id_user" bigint PRIMARY KEY,
    "lastHourly" timestamp default current_timestamp
);

CREATE TABLE "Message_ile" (
    "id_message" bigint PRIMARY KEY,
    "id_user" bigint,
    "id_channel" bigint,
    "id_guild" bigint,
    "content" text,
    "date" timestamp default current_timestamp
);

CREATE TABLE "Profile_ile" (
    "id_profile" serial PRIMARY KEY,
    "signature" text NOT NULL default 'Un•e illustre inconnu•e',
    "image_url" text NOT NULL
);

CREATE TABLE "User_ile" (
    "id_user" bigint PRIMARY KEY,
    "id_channel" bigint NOT NULL,
    "id_profile" int NOT NULL,
    "randNumber" int NOT NULL default trunc(random() * 8999 + 1000)
);

ALTER TABLE "User_ile" ADD FOREIGN KEY ("id_profile") REFERENCES "Profile_ile" ("id_profile") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "SignalementBottle" ADD FOREIGN KEY ("id_message") REFERENCES "Signalement" ("id_message") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SignalementWanted" ADD FOREIGN KEY ("id_message") REFERENCES "Signalement" ("id_message") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SignalementSuggestion" ADD FOREIGN KEY ("id_message") REFERENCES "Signalement" ("id_message") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SignalementTicket" ADD FOREIGN KEY ("id_message") REFERENCES "Signalement" ("id_message") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SignalementHelp" ADD FOREIGN KEY ("id_message") REFERENCES "Signalement" ("id_message") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SignalementBird" ADD FOREIGN KEY ("id_message") REFERENCES "Signalement" ("id_message") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SignalementIleMessage" ADD FOREIGN KEY ("id_message") REFERENCES "Signalement" ("id_message") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Opinion" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Suggestion" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Vote" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Vote" ADD FOREIGN KEY ("id_message") REFERENCES "Suggestion" ("id_message") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Help" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Ticket" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "User" ADD FOREIGN KEY ("id_sticker") REFERENCES "Sticker" ("id_sticker") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "User" ADD FOREIGN KEY ("id_footer") REFERENCES "Footer" ("id_footer") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "User_Sticker" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User_Sticker" ADD FOREIGN KEY ("id_sticker") REFERENCES "Sticker" ("id_sticker") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "User_Footer" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User_Footer" ADD FOREIGN KEY ("id_footer") REFERENCES "Footer" ("id_footer") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "User_Achievement" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User_Achievement" ADD FOREIGN KEY ("id_achievement") REFERENCES "Achievement" ("id_achievement") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Achievement" ADD FOREIGN KEY ("id_sticker") REFERENCES "Sticker" ("id_sticker") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Invite" ADD FOREIGN KEY ("id_user_inviter") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invite" ADD FOREIGN KEY ("id_user_invited") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Hourly" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message_ile" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Wanted" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WantedResponse" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WantedResponse" ADD FOREIGN KEY ("id_channel") REFERENCES "Wanted" ("id_channel") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Bird" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BirdReaction" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BirdReaction" ADD FOREIGN KEY ("id_bird") REFERENCES "Bird" ("id_bird") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- Insert stickers for achievements
INSERT INTO "Sticker" ("name", "url") VALUES ('Ma bouteille', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162271353188434/plage.png'),
                                                                                            ('Bouteille échouée', 'https://cdn.discordapp.com/attachments/1004073840093184000/1036280255666733087/bouteille_echouee.png'),
                                                                                            ('Trésor vide', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037487507425742868/tresorvide.png'),
                                                                                            ('Trésor remplis', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037428766785421432/tresor.png'),
                                                                                            ('Trésor débordant', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037487507325063320/tresordebordant.png'),
                                                                                            ('Coffre fermé', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037485184716652544/pirate.png'),
                                                                                            ('Bretagne', 'https://cdn.discordapp.com/attachments/1004073840093184000/1036973819283378257/bretagne.png'),
                                                                                            ('Etoile montante', 'https://cdn.discordapp.com/attachments/1004073840093184000/1036967149899624518/vip.png'),
                                                                                            ('3 étoiles', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037430577323835442/3etoiles.png'),
                                                                                            ('Parchemin', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037695619571134475/parchemin.png'),
                                                                                            ('Parchemin doré', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037695620279963668/parcheminor.png'),
                                                                                            ('Coeur de crystal', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037477249076699137/avis.png'),
                                                                                            ('Ampoule', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037471320021160057/suggestion.png'),
                                                                                            ('Valise', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037766312526618715/valise.png'),
                                                                                            ('Botte', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037770415197659267/botte.png'),
                                                                                            ('Raz-de-marée', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037772293675434004/mes_bouteilles.png'),
                                                                                            ('Bouteilles échouées', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037774771854790748/mes_bouteille_echouees.png'),
                                                                                            ('Couronne', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037809961020964884/Couronne.png'),
                                                                                            ('Fauché•e', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037819169137250314/Pochevide.png'),
                                                                                            ('Tirelire cassée', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037824800149753957/cochonvide.png');

-- Insert stickers
INSERT INTO "Sticker" ("name", "url", "sharable", "winnable", "sharable_percentage") VALUES ('Plage', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162271353188434/plage.png', true, false, 0.01),
                                             ('Biche', 'https://cdn.discordapp.com/attachments/1004073840093184000/1036971155011153980/biche.png', true, true, 0.2),
                                             ('Panda', 'https://cdn.discordapp.com/attachments/1004073840093184000/1031653282252328961/panda.png', true, false, 0.1),
                                             ('Ours', 'https://cdn.discordapp.com/attachments/1004073840093184000/1031653281539305542/ours.png', true, true, 0.1),
                                             ('Bulles', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162265934135346/bulle.png', true, true, 0.2),
                                             ('Lanternes', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162007221075998/lanterne.png', true, true, 0.2),
                                             ('Désert', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162005354614845/desert.png', true, true, 0.1),
                                             ('Vague', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162005266538516/vague.png', true, true, 0.02);

INSERT INTO "Achievement" ("name", "description", "rarity", "type", "value", "id_sticker") VALUES ('Océan messager', 'Vous avez envoyé votre première bouteille !', 'commun', 'bottleSend', 1, 1),
                                                                                    ('Courrier marin', 'Vous avez reçu votre première bouteille !', 'commun', 'bottleReceive', 1, 2),
                                                                                    ('Pirate sans carte', 'Vous avez trouvé et ouvert un trésor !', 'rare', 'userNbTreasures', 1, 15),

                                                                                    ('Créateur de lien', 'Vous avez envoyé 100 bouteilles !', 'rare', 'bottleSend', 100, 16),
                                                                                    ('Lecture abondante', 'Vous avez reçu 100 bouteilles !', 'rare', 'bottleReceive', 100, 17),
                                                                                    ('Pile poil !', 'Vous avez envoyé une bouteille de 2000 caractères !', 'rare', 'messageLength', 2000, 11),
                                                                                    ('Ecrivain accompli', 'Vous avez envoyé une bouteille de 1500 caractères !', 'rare', 'messageLength', 1500, 10),
                                                                                    ('Une croix rouge', 'Vous avez trouvé et ouvert 100 trésors !', 'rare', 'userNbTreasures', 50, 14),
                                                                                    ('Une suggestion suggestive', 'Vous avez envoyé une suggestion !', 'rare', 'suggestionSent', 1, 13),
                                                                                    ('Un avis bien tranché', 'Vous avez envoyé un avis !', 'rare', 'opinionSent', 1, 12),
                                                                                    ('Dépensier', 'Vous avez dépensé 10 000 pièces d''or !', 'rare', 'userMoneySpent', 10000, 19),

                                                                                    ('Accro aux projecteurs', 'Vous êtes passé VIP !', 'epic', 'userInvited', 5, 8),
                                                                                    ('Plus on est de fou...', 'Vous avez invité 10 personnes sur le serveur !', 'epic', 'userInvited', 10, 9),
                                                                                    ('Plein aux as', 'Vous avez 10 000 pièces d''or sur votre compte !', 'epic', 'userMoneyEarned', 10000, 3),

                                                                                    ('Panier percé', 'Vous avez dépensé 100 000 pièces d''or !', 'legendaire', 'userMoneySpent', 100000, 20),
                                                                                    ('Richissime', 'Vous avez 100 000 pièces d''or sur votre compte !', 'legendaire', 'userMoneyEarned', 100000, 4),
                                                                                    ('Trésor pirate', 'Vous avez trouvé et ouvert 500 trésors !', 'legendaire', 'userNbTreasures', 500, 6),

                                                                                    ('E brezhoneg, mar plij', 'Vous avez écrit un mot en Breton !', 'mythique', 'messageContains', 'Breizh', 7),
                                                                                    ('Créateur de stars', '5 membres que vous avez invités sont devenus VIP', 'mythique', 'vipUserInvited', 5, 18),
                                                                                    ('Crésus', 'Vous avez 500 000 pièces d''or sur votre compte !', 'mythique', 'userMoneyEarned', 500000, 5);

INSERT INTO "Profile_ile" ("image_url", "signature") VALUES ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612725594591272/america.png', 'Captain America'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612725984673833/baleine.png', 'Baleine'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612726576058448/bat.png', 'Chauve-souris'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612727012278272/batman.png', 'BatMan'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612727444279356/bouc.png', 'Bouc'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612727914053703/calamar.png', 'Calamar'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612747958628523/canard.png', 'Canard'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612748285788250/cheval.png', 'Cheval'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612748608737330/chevre.png', 'Chèvre'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612748906541147/chien.png', 'Chien'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612749204340746/cochon.png', 'Cochon'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612749527289856/colombe.png', 'Colombe'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612775678775377/crevette.png', 'Crevette'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612776039497778/crocodile.png', 'Crocodile'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612776572162179/diplo.png', 'Diplodocus'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612776848998470/dragon.png', 'Dragon'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612777155166329/dromadaire.png', 'Dromadaire'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612777473937549/ecureil.png', 'Ecureil'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612799502430238/elephant.png', 'Elephant'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612800018321418/fantome.png', 'Fantôme'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612800454533130/gollum.png', 'Gollum'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612801322758254/herisson.png', 'Herisson'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612802308411453/ironman.png', 'IronMan'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612802857869362/lapin.png', 'Lapin'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612825465176144/licorne.png', 'Licorne'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612825792319580/mario.png', 'Mario'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612826417283152/poussin.png', 'Poussin'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612826798952499/r2d2.png', 'R2D2'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612827159666820/requin.png', 'Requin'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612848995225620/serpent.png', 'Serpent'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612849364312114/thor.png', 'Thor'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612849729220719/tigre.png', 'Tigre'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612850144452618/tortue.png', 'Tortue'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612850505167008/trex.png', 'T-Rex'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612850891038821/zorro.png', 'Zorro'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038622363450875924/Capybara.png', 'Capybara'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038622363773841458/Giraffe.png', 'Giraffe'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038622364075819070/Hippocampe.png', 'Hippocampe'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038622364344262666/Lion.png', 'Lion'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038622364612702249/Loup.png', 'Loup'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038622364931457044/Plume.png', 'Plume');


INSERT INTO "Footer" ("name", "url") VALUES ('Fin', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844978667343966/Illustration_sans_titre_2.png'),
                                            ('Partition', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844979191631942/Partition.png'),
                                            ('Poissons', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844979573293106/Illustration_sans_titre_3.png'),
                                            ('Élégant', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844979246157916/arabesque-par-defaut.png'),
                                            ('Feuilles', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844980688977980/Illustration_sans_titre_1.png'),
                                            ('Printemps', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844981825650698/bas-de-page.png'),
                                            ('Aurore polaire', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844981695627384/Illustration_sans_titre.png');