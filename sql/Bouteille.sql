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
  "signature" text NOT NULL default 'An illustrious stranger',
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
    "date" timestamp default current_timestamp
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

INSERT INTO "Couleur" VALUES ('pink'),
                             ('ashy'),
                             ('salmon'),
                             ('coral'),
                             ('violet'),
                             ('brown'),
                             ('fire'),
                             ('magenta'),
                             ('carmin'),
                             ('garnet'),
                             ('scarlet'),
                             ('cobalt'),
                             ('azure'),
                             ('lapis'),
                             ('ruby'),
                             ('green'),
                             ('sapphire'),
                             ('purple'),
                             ('orange'),
                             ('grey'),
                             ('black'),
                             ('beige'),
                             ('white'),
                             ('mauve'),
                             ('red'),
                             ('blue');

INSERT INTO "Etat" VALUES ('broken'),
                             ('wrecked'),
                             ('frothy'),
                             ('golden'),
                             ('dirty'),
                             ('sparkling'),
                             ('polished'),
                             ('lost'),
                             ('scratched'),
                             ('sharp'),
                             ('scaled'),
                             ('hot'),
                             ('cold'),
                             ('imaginary'),
                             ('sweet'),
                             ('damaged'),
                             ('plastic'),
                             ('starry'),
                             ('muddy'),
                             ('silver');

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
INSERT INTO "Sticker" ("name", "url") VALUES ('My bottle', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162271353188434/plage.png'),
                                                                                            ('Stranded bottle', 'https://cdn.discordapp.com/attachments/1004073840093184000/1036280255666733087/bouteille_echouee.png'),
                                                                                            ('Empty treasure', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037487507425742868/tresorvide.png'),
                                                                                            ('Filled treasure', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037428766785421432/tresor.png'),
                                                                                            ('Overflowing treasure', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037487507325063320/tresordebordant.png'),
                                                                                            ('Closed crate', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037485184716652544/pirate.png'),
                                                                                            ('Brittany', 'https://cdn.discordapp.com/attachments/1004073840093184000/1036973819283378257/bretagne.png'),
                                                                                            ('Rising star', 'https://cdn.discordapp.com/attachments/1004073840093184000/1036967149899624518/vip.png'),
                                                                                            ('3 stars', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037430577323835442/3etoiles.png'),
                                                                                            ('Parchment', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037695619571134475/parchemin.png'),
                                                                                            ('Golden parchment', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037695620279963668/parcheminor.png'),
                                                                                            ('Crystal heart', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037477249076699137/avis.png'),
                                                                                            ('Lightbulb', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037471320021160057/suggestion.png'),
                                                                                            ('Suitcase', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037766312526618715/valise.png'),
                                                                                            ('Boot', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037770415197659267/botte.png'),
                                                                                            ('Rising tide', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037772293675434004/mes_bouteilles.png'),
                                                                                            ('Stranded bottles', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037774771854790748/mes_bouteille_echouees.png'),
                                                                                            ('Crown', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037809961020964884/Couronne.png'),
                                                                                            ('Broke', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037819169137250314/Pochevide.png'),
                                                                                            ('Broken piggybank', 'https://cdn.discordapp.com/attachments/1004073840093184000/1037824800149753957/cochonvide.png');

-- Insert stickers
INSERT INTO "Sticker" ("name", "url", "sharable", "winnable", "sharable_percentage") VALUES ('Beach', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162271353188434/plage.png', true, false, 0.01),
                                             ('Doe', 'https://cdn.discordapp.com/attachments/1004073840093184000/1036971155011153980/biche.png', true, true, 0.2),
                                             ('Panda', 'https://cdn.discordapp.com/attachments/1004073840093184000/1031653282252328961/panda.png', true, false, 0.1),
                                             ('Bear', 'https://cdn.discordapp.com/attachments/1004073840093184000/1031653281539305542/ours.png', true, true, 0.1),
                                             ('Bubbles', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162265934135346/bulle.png', true, true, 0.2),
                                             ('Lanterns', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162007221075998/lanterne.png', true, true, 0.2),
                                             ('Desert', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162005354614845/desert.png', true, true, 0.1),
                                             ('Wave', 'https://cdn.discordapp.com/attachments/1004073840093184000/1030162005266538516/vague.png', true, true, 0.02);

INSERT INTO "Achievement" ("name", "description", "rarity", "type", "value", "id_sticker") VALUES ('Ocean messenger', 'You have sent your first bottle!', 'commun', 'bottleSend', 1, 1),
                                                                                    ('Sea courier', 'You have received your first bottle!', 'commun', 'bottleReceive', 1, 2),
                                                                                    ('Pirate without map', 'You have found and opened a treasure!', 'rare', 'userNbTreasures', 1, 15),

                                                                                    ('Relationship builder', 'You have sent 100 bottles!', 'rare', 'bottleSend', 100, 16),
                                                                                    ('Read a lot', 'You have received 100 bottles!', 'rare', 'bottleReceive', 100, 17),
                                                                                    ('Exactly', 'You have sent a bottle of 2000 characters!', 'rare', 'messageLength', 2000, 11),
                                                                                    ('Accomplished writer', 'You have sent a bottle of 1500 characters!', 'rare', 'messageLength', 1500, 10),
                                                                                    ('A red cross', 'You have found and opened 100 treasures!', 'rare', 'userNbTreasures', 50, 14),
                                                                                    ('A suggestive suggestion', 'You avec submitted a suggestion!', 'rare', 'suggestionSent', 1, 13),
                                                                                    ('Thoughtful opinion', 'You have sent an feedback!', 'rare', 'opinionSent', 1, 12),
                                                                                    ('Spender', 'You have spent 10 000 gold coins!', 'rare', 'userMoneySpent', 10000, 19),

                                                                                    ('Addicted to the projectors', 'You have become a VIP!', 'epic', 'userInvited', 5, 8),
                                                                                    ('The more the merrier...', 'You have invented 10 people to the server!', 'epic', 'userInvited', 10, 9),
                                                                                    ('Rolling in money', 'You have 10 000 gold coins on your balance!', 'epic', 'userMoneyEarned', 10000, 3),

                                                                                    ('Wallet pierced', 'You have spent 100 000 gold coins!', 'legendaire', 'userMoneySpent', 100000, 20),
                                                                                    ('Super-rich', 'You have 100 000 gols coins on your balance!', 'legendaire', 'userMoneyEarned', 100000, 4),
                                                                                    ('Pirate''s treasure', 'You have found and opened 500 treasures!', 'legendaire', 'userNbTreasures', 500, 6),

                                                                                    ('E brezhoneg, mar plij', 'You have written a word in Breton!', 'mythique', 'messageContains', 'Breizh', 7),
                                                                                    ('Creator of stars', '5 members that you invited have become VIPs', 'mythique', 'vipUserInvited', 5, 18),
                                                                                    ('Croesus', 'You have 500 000 gold coins on your balance!', 'mythique', 'userMoneyEarned', 500000, 5);

INSERT INTO "Profile_ile" ("image_url", "signature") VALUES ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612725594591272/america.png', 'Captain America'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612725984673833/baleine.png', 'Whale'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612726576058448/bat.png', 'Bat'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612727012278272/batman.png', 'BatMan'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612727444279356/bouc.png', 'Billy-Goat'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612727914053703/calamar.png', 'Squid'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612747958628523/canard.png', 'Duck'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612748285788250/cheval.png', 'Horse'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612748608737330/chevre.png', 'Goat'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612748906541147/chien.png', 'Dog'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612749204340746/cochon.png', 'Pig'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612749527289856/colombe.png', 'Dove'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612775678775377/crevette.png', 'Shrimp'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612776039497778/crocodile.png', 'Crocodile'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612776572162179/diplo.png', 'Diplodocus'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612776848998470/dragon.png', 'Dragon'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612777155166329/dromadaire.png', 'Camel'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612777473937549/ecureil.png', 'Squarel'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612799502430238/elephant.png', 'Elephant'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612800018321418/fantome.png', 'Ghost'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612800454533130/gollum.png', 'Gollum'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612801322758254/herisson.png', 'Herisson'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612802308411453/ironman.png', 'IronMan'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612802857869362/lapin.png', 'Rabbit'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612825465176144/licorne.png', 'Unicorn'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612825792319580/mario.png', 'Mario'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612826417283152/poussin.png', 'Chick'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612826798952499/r2d2.png', 'R2D2'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612827159666820/requin.png', 'Shark'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612848995225620/serpent.png', 'Snake'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612849364312114/thor.png', 'Thor'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612849729220719/tigre.png', 'Tiger'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612850144452618/tortue.png', 'Turtle'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612850505167008/trex.png', 'T-Rex'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038612850891038821/zorro.png', 'Zorro'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038622363450875924/Capybara.png', 'Capybara'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038622363773841458/Giraffe.png', 'Giraffe'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038622364075819070/Hippocampe.png', 'Seahorse'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038622364344262666/Lion.png', 'Lion'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038622364612702249/Loup.png', 'Wolf'),
                                                            ('https://cdn.discordapp.com/attachments/1038612651036639353/1038622364931457044/Plume.png', 'Feather');


INSERT INTO "Footer" ("name", "url") VALUES ('End', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844978667343966/Illustration_sans_titre_2.png'),
                                            ('Sheet music', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844979191631942/Partition.png'),
                                            ('Fishes', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844979573293106/Illustration_sans_titre_3.png'),
                                            ('Elegant', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844979246157916/arabesque-par-defaut.png'),
                                            ('Leaves', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844980688977980/Illustration_sans_titre_1.png'),
                                            ('Spring', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844981825650698/bas-de-page.png'),
                                            ('Aurora Polar', 'https://cdn.discordapp.com/attachments/1004073840093184000/1042844981695627384/Illustration_sans_titre.png');