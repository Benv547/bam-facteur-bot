# Bot of Bouteille à la Mer

## How to run the bot

1. Install node.js and npm
2. Install the dependencies with `npm install`
3. Create a postgres database and run the SQL script in `sql` folder
4. Create a `db.json` file in the root folder with the following content:
```json
{
  "host": "localhost",
  "port": 5432,
  "database": "bouteille",
  "user": "postgres
}
```
5. Create a `xp.json` file in the root folder with the following content:
```json
{
  "levels": [
    {
      "xp": 1,
      "role": "<id>"
    },
    ...
  ]
}
```
6. Create a `config.json` file in the root folder with the following content:
```json
{
  "guildId": "<id_guild>",

  "adminRole": "<id_role>",
  "modRole": "<id_role>",
  "vipRole": "<id_role>",
  "boostRole": "<id_role>",
  "anniversaireRole": "<id_role>",
  "memberRole": "<id_role>",
  "afkRole": "<id_role>",
  "apprentiRole":"<id_role>",
  "treasureRole":"<id_role>",

  "newBottleCategory": "<id_channel_category>",
  "wantedChannel": "<id_channel>",
  "newWantedCategory": "<id_channel_category>",

  "newBirdCategory": "<id_channel_category>",
  "newBirdChannel": "<id_channel>",
  "conversations": [
    "<id_channel_category>",
    "<id_channel_category>",
    "<id_channel_category>",
    "<id_channel_category>",
    "<id_channel_category>"
  ],
  "signalement": "<id_channel>",
  "sanction": "<id_channel>",
  "ticket": "<id_channel>",
  "join": "<id_channel>",
  "treasure": "<id_channel>",
  "suggestion": "<id_channel>",
  "booster": "<id_channel>",
  "boutique": "<id_channel>",

  "ile": "<id_channel>",
  "ileVoice": "<id_channel>"
}
```
7. Create a `token.json` file in the root folder with the following content:
```json
{
    "clientId": "<id_client(bot)>",
    "token": "<token>"
}
```
8. Run the bot with `npm run start`