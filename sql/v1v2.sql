-- Adjust existing User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "corail" int DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "corail_spent" int DEFAULT 0;

-- Create new tables for decorations and letters
CREATE TABLE IF NOT EXISTS "BottleStartExample" (
                                  "text" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "User_ile_ticket" (
                                   "id_user" bigint NOT NULL,
                                   "date" timestamp NOT NULL default current_timestamp + interval '7 days'
);

CREATE TABLE IF NOT EXISTS "Background" (
                                            "id_background" serial PRIMARY KEY,
                                            "name" text NOT NULL,
                                            "url" text NOT NULL,
                                            "sharable" boolean NOT NULL DEFAULT false,
                                            "winnable" boolean NOT NULL DEFAULT false,
                                            "sharable_percentage" float NOT NULL DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS "User_Background" (
                                                 "id_user" bigint NOT NULL,
                                                 "id_background" int NOT NULL,
                                                 "id_guild" bigint NOT NULL,
                                                 "applied" boolean NOT NULL DEFAULT false,
                                                 "occurrence" int NOT NULL DEFAULT 1,
                                                 PRIMARY KEY ("id_user", "id_background", "id_guild")
    );

CREATE TABLE IF NOT EXISTS "Letter" (
                                        "id_letter" serial PRIMARY KEY,
                                        "name" text NOT NULL,
                                        "url" text NOT NULL,
                                        "sharable" boolean NOT NULL DEFAULT false,
                                        "winnable" boolean NOT NULL DEFAULT false,
                                        "sharable_percentage" float NOT NULL DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS "User_Letter" (
                                             "id_user" bigint NOT NULL,
                                             "id_letter" int NOT NULL,
                                             "id_guild" bigint NOT NULL,
                                             "applied" boolean NOT NULL DEFAULT false,
                                             "occurrence" int NOT NULL DEFAULT 1,
                                             PRIMARY KEY ("id_user", "id_letter", "id_guild")
    );

CREATE TABLE IF NOT EXISTS "Decoration" (
                                            "id_decoration" serial PRIMARY KEY,
                                            "name" text NOT NULL,
                                            "url" text NOT NULL,
                                            "sharable" boolean NOT NULL DEFAULT false,
                                            "winnable" boolean NOT NULL DEFAULT false,
                                            "sharable_percentage" float NOT NULL DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS "User_Decoration" (
                                                 "id_user" bigint NOT NULL,
                                                 "id_decoration" int NOT NULL,
                                                 "id_guild" bigint NOT NULL,
                                                 "applied" boolean NOT NULL DEFAULT false,
                                                 "occurrence" int NOT NULL DEFAULT 1,
                                                 PRIMARY KEY ("id_user", "id_decoration", "id_guild")
    );

-- Add foreign keys for new tables
ALTER TABLE "User_ile" ADD FOREIGN KEY ("id_profile") REFERENCES "Profile_ile" ("id_profile") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User_ile_ticket" ADD FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "User_Background" ADD CONSTRAINT fk_user_background FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User_Background" ADD CONSTRAINT fk_background FOREIGN KEY ("id_background") REFERENCES "Background" ("id_background") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "User_Letter" ADD CONSTRAINT fk_user_letter FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User_Letter" ADD CONSTRAINT fk_letter FOREIGN KEY ("id_letter") REFERENCES "Letter" ("id_letter") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "User_Decoration" ADD CONSTRAINT fk_user_decoration FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User_Decoration" ADD CONSTRAINT fk_decoration FOREIGN KEY ("id_decoration") REFERENCES "Decoration" ("id_decoration") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert data
INSERT INTO "BottleStartExample" ("text") VALUES ('Raconte-moi deux anecdotes vraies et une anecdote fausse sur toi, à moi de deviner laquelle est la fausse.'),
                                                 ('Décris-moi ta journée sans finir ta phrase, je vais essayer de trouver la suite.'),
                                                 ('Si tu pouvais échanger ta vie avec quelqu''un pendant une semaine, qui choisirais-tu et pourquoi ?'),
                                                 ('Si tu pouvais parler couramment une nouvelle langue instantanément, laquelle choisirais-tu et pourquoi ?'),
                                                 ('Quelle est la chose la plus courageuse que tu aies jamais faite ?'),
                                                 ('Quelle est la chose la plus étrange que tu aies mangée et comment était-ce ?'),
                                                 ('Si tu pouvais avoir un dîner avec trois personnes, vivantes ou mortes, qui choisirais-tu et pourquoi ?'),
                                                 ('Quel est le rêve le plus mémorable que tu aies jamais fait ?'),
                                                 ('Quel est le livre ou le film qui a le plus changé ta vision du monde ?'),
                                                 ('Si tu pouvais créer une nouvelle fête nationale, quelle serait-elle et comment la célébrerais-tu ?'),
                                                 ('Imagine que tu peux voyager dans le temps, mais seulement pour une journée. Quelle époque choisirais-tu et pourquoi ?'),
                                                 ('Quelle est la chose la plus inattendue que tu aies apprise récemment ?'),
                                                 ('Quel est le meilleur cadeau que tu aies jamais reçu et pourquoi était-il si spécial ?'),
                                                 ('Si tu pouvais changer une chose dans le monde, quelle serait-elle ?'),
                                                 ('Quelle est la chanson qui te rappelle le plus de souvenirs et pourquoi ?'),
                                                 ('Quel est le plus grand défi que tu aies relevé et comment l''as-tu surmonté ?'),
                                                 ('Si tu pouvais créer une nouvelle planète, à quoi ressemblerait-elle et quelles seraient ses caractéristiques ?'),
                                                 ('Quel est le plus grand mystère non résolu selon toi, et pourquoi t''intrigue-t-il ?'),
                                                 ('Si tu pouvais parler à un animal, lequel choisirais-tu et quelle serait la première question que tu lui poserais ?'),
                                                 ('Si tu pouvais assister à un événement historique, lequel choisirais-tu et pourquoi ?'),
                                                 ('Quelle est la technologie du futur que tu es le plus impatient de voir se développer ?'),
                                                 ('Quel est le projet le plus ambitieux que tu aimerais réaliser un jour ?'),
                                                 ('Quel est le plus beau paysage que tu aies jamais vu, en vrai ou en photo ?'),
                                                 ('Imagine que tu es dans un musée rempli d''objets de ton enfance. Quel objet choisirais-tu de revisiter et pourquoi ?'),
                                                 ('Quel est le meilleur conseil que tu aies jamais reçu et comment l''as-tu appliqué dans ta vie ?'),
                                                 ('Si tu devais écrire un livre sur ta vie, quel serait le titre et quel genre littéraire choisirais-tu ?'),
                                                 ('Si tu pouvais poser une question à ton toi du futur, quelle serait-elle ?'),
                                                 ('Si tu pouvais donner un titre à cette année de ta vie, quel serait-il ?'),
                                                 ('Quelle est la chose la plus folle que tu aies faite pour surmonter une peur ?'),
                                                 ('Si tu pouvais créer une nouvelle couleur, à quoi ressemblerait-elle et comment l''appellerais-tu ?'),
                                                 ('Imagine que tu trouves une lampe magique avec un génie qui t''accorde trois souhaits. Quels seraient-ils ?'),
                                                 ('Quelle est la tradition ou coutume la plus intéressante que tu connaisses ?'),
                                                 ('Si tu pouvais créer un nouveau sport, à quoi ressemblerait-il et quelles en seraient les règles ?'),
                                                 ('Supposons que tu découvres une île déserte où tu peux construire une nouvelle société à partir de zéro. Quelles seraient les trois premières règles ou principes que tu établirais pour garantir l''harmonie et le bonheur de ses habitants ?'),
                                                 ('Si tu pouvais donner un conseil à ton toi de 10 ans, quel serait-il ?');

-- Insert stickers
INSERT INTO "Background" ("name", "url") VALUES ('Défaut', 'https://i.postimg.cc/DyRGdWRb/Untitled-Artwork2.png');

INSERT INTO "Letter" ("name", "url") VALUES ('Défaut', 'https://i.postimg.cc/8P7W6dXS/Untitled-Artwork1.png');

-- Update existing users with default values
UPDATE "User" SET "color" = '000000' WHERE 1=1;