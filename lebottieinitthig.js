"use strict";

if (require.main === module) {
   console.warn("are you trying to invoke this directly? go see how to use it on the github repo! (https://github.com/pcelestia/autumnblaze#very-basic-use)");
   process.exit(1);
}

const discord = require("discord.js");

// default options
// required options (token, mongodb connection string) obviously not here, can't default that
const defaultopts = {
   mongodatabase: "autumnblazebot",
   radiostreamurl: "http://fancynoise.xyz:8000/radio",
   prefix: "autumn ",
   debug: false,
   embedcolors: ["#FBFBDE", "#C7C497", "#C86120", "#E5C00D", "#FFEC6F", "#C7C497", "#4DFFFF"]
};

// default guild/user settings in mango/defaultconfigs.js

const warnmissingreq = (one, two) => {
   console.warn("you need to supply a " + one + ".\nfor example:\nconst bot = require(\"autumnblaze\")({\n   " + two + ": \"put-your-" + two + "-here\",\n   otheropts: \"other things\"\n});\n\nthe readme at \"https://github.com/pcelestia/autumnblaze/\" might be helpful");
   process.exit(1);
};
const autumnblaze = (opts = {}) => {
   // check for missing token and mongodbconnectionstring
   if ((opts.token === undefined)) {
      warnmissingreq("bot token", "token");
   }
   if (opts.mongodbconnectionstring === undefined) {
      warnmissingreq("mongodb connection string", "mongodbconnectionstring");
   }


   // stamp le console
   require("console-stamp")(console, {
      pattern: "dd-mm-yyyy HH:MM:ss.l",
      colors: {
         stamp: "white",
         label: "orange"
      }
   });

   // take opts and patch it into the default opts (faster)
   const randutils = require("./randutils");
   autumnblaze.randutils = randutils;

   var patchedopts = randutils.copyobj(defaultopts);
   for (const key in opts) patchedopts[key] = opts[key];


   const bot = new discord.Client();
   bot.on("warn", console.warn);


   autumnblaze.bot = bot;
   autumnblaze.opts = patchedopts;


   // process a message
   autumnblaze.bot.on("message", message => {
      autumnblaze.text.processmessage(message, autumnblaze);
   });


   return autumnblaze;
};
autumnblaze.packagejson = require("./package.json");
autumnblaze.version = autumnblaze.packagejson.version;
autumnblaze.defaultopts = defaultopts;

autumnblaze.text = require("./text");
autumnblaze.commands = autumnblaze.text.commands;

autumnblaze.connectbot = () => {
   autumnblaze.bot.login(autumnblaze.opts.token).then(token => {
      token = "erased";
      if (token !== "erased") {
         console.warn("token not erased or smth idk lol, ignore this lol");
         console.warn("if this pops up then something is def wrong");
      }
      console.log("connection success!!");
      autumnblaze.hcooldown = (1000 * 30);
      autumnblaze.h = Date.now() - autumnblaze.hcooldown;
   }).catch(err => {
      console.log("connection failed lol");
      console.log(err);
   });
   return autumnblaze;
};
let dbserv;
autumnblaze.connectdb = () => {
   autumnblaze.mango = require("./mango");
   autumnblaze.mango(autumnblaze.opts.mongodbconnectionstring, autumnblaze.opts.mongodatabase, (db, serv) => {
      autumnblaze.db = db;
      dbserv = serv;
   });
   autumnblaze.defaultguildsettings = autumnblaze.mango.defaultconfigs.defaultguildsettings;
   autumnblaze.defaultusersettings = autumnblaze.mango.defaultconfigs.defaultusersettings;
   return autumnblaze;
};
autumnblaze.connect = () => {
   console.log("running autumnblaze v" + autumnblaze.version);
   return autumnblaze.connectbot().connectdb();
};
autumnblaze.stop = () => {
   process.emit("SIGINT");
};
const fullstop = () => {
   // dont run if already rubbish'd
   if (autumnblaze.isrubbish) return;
   // cleanup things here

   // close connection with discord
   autumnblaze.bot.destroy();

   // close connection with mongo
   dbserv.close();

   // declare rubbish
   autumnblaze.isrubbish = true;

   console.log("closey");
};
process.once("SIGINT", fullstop);
process.once("SIGTERM", fullstop);

module.exports = autumnblaze;
