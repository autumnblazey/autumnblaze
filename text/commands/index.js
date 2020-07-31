"use strict";
// and help

// this file contains the function that processes the commands.
// prefix and top level command has been removed already (only args/subcommands remain):
// if user typed "autumn help", the command that is processed is ""
// "autumn togglerole mc-announcements" becomes "mc-announcements"

// cmds.help = command handler
// cmds.description = command description
// cmds.usage = usage of the command

// return value: string
// rv.dm = boolean (whether or not the response should be sent in dm)

// ------OR--------
// return value: object
// rv.dm = string (message to send in dm)
// rv.guildchannel = string (message to send to channel in guild)

// example: person does "autumn help"
// bot responds with "check your dms"
// bot dms user with the help message

const fs = require("fs");
const path = require("path");

const cmds = {};
const catdesc = require("./_categorydesc");

// automatically read all files from this directory
const files = fs.readdirSync(path.resolve(__dirname, ".")).filter(file => file !== "index.js" && !file.startsWith("_"));
files.forEach(file => {
   if (file.endsWith(".js")) file = file.slice(0, file.length - 3);
   cmds[file] = require("./" + file);
});
cmds._process = require("./_process");

const determinecategories = () => {
   const categories = [];
   for (const cmdhandler in cmds) {
      // if _process or "" or smth skip it
      if ((cmdhandler.startsWith("_")) || (cmdhandler === "")) continue;

      const category = cmds[cmdhandler].category;
      // if cmd.category is undefined skip it
      if (category === undefined) continue;
      // if category already exists
      if (categories.includes(category)) {
         categories[category].push(cmdhandler);
         continue;
      }
      // category doesnt exist, create it
      categories.push(category);
      categories[category] = [];
      if (catdesc[category]) categories[category].description = catdesc[category].description;
      else categories[category].description = "no description available";
      categories[category].push(cmdhandler);
   }
   return categories;
};

// ping (useful ping thou lol)
// query
// list
// togglerole

const help = async (arg, msg, autumnblaze, dm, config) => {
   if (!cmds._categories) cmds._categories = determinecategories();

   const discord = require("discord.js");
   const randfromarray = autumnblaze.randutils.randfromarray;
   const colors = autumnblaze.opts.embedcolors;
   const categories = cmds._categories;
   const embed = new discord.MessageEmbed();

   embed.setColor(randfromarray(colors));
   const app = await autumnblaze.bot.fetchApplication();
   embed.setFooter(autumnblaze.opts.reponame + " v" + autumnblaze.version, app.iconURL(64));

   if (arg === "") {
      embed.setTitle("Command Help");
      embed.setDescription("to get help on commands in a category, run the command shown for that category");
      categories.forEach((category) => {
         let middlepart = "`";
         if (!dm) {
            if (config.prefix) middlepart = middlepart + config.prefix;
            else middlepart = middlepart + autumnblaze.opts.prefix;
         }
         middlepart = middlepart + "help " + category + "`";
         embed.addField(category, middlepart, true);
      });

      return embed;
   }
   // cmd has an arg
   if (!categories[cmd]) return embed.setTitle("category not found");
   embed.setTitle("category " + cmd);
   embed.setDescription(categories[cmd].description);
   categories[cmd].forEach(cmd => {
      embed.addField(cmd, cmds[cmd].description, true);
   });
   return embed;
   // return categories[cmd];
};
help.allowdm = true;
help.allowguild = true;
cmds.help = help;

module.exports = cmds;
