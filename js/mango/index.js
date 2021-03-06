"use strict";
// mongodb connection and things thewjo

// i know i could use the same method to autofill everything as i did with commands,
// but these aren't gonna grow so fast and its easier to just do it this way
// when it gets big enough i will
const fs = require("fs");
const path = require("path");
const mongodb = require("mongodb");

module.exports = async (connectionstr, usecache) => {
   return new Promise((resolve, reject) => {
      const rv = [];
      mongodb.MongoClient.connect(connectionstr, { useUnifiedTopology: true }, (err, res) => {
         if (err) {
            reject(err);
            console.log("mongoerror in connectingg, stop the bot NOW\nor i will myself in 5s");
            setTimeout(() => process.exit(1), 5000);
            return;
         }
         if (!res) {
            reject("something stupidly strange happened");
            console.warn("mmmMMM????");
            process.exit(1);
         }
         rv[0] = res;

         const realmango = {};
         realmango.promise = {};
         let reqprefix = "./";
         if (usecache === "old") {
            console.warn("using old, unsupported, buggy, and never completed cache");
            reqprefix = "./_cache_";
         } else if (usecache === true) {
            reqprefix = "./_cache_new_";
         }

         const files = fs.readdirSync(path.resolve(__dirname, ".")).filter(file => file !== "index.js" && !file.startsWith("_"));
         files.forEach(file => {
            if (file.endsWith(".js")) file = file.slice(0, file.length - 3);
            realmango[file] = require(reqprefix + file);
            realmango.promise[file] = require(reqprefix + "_" + file + "_promise");
         });
         if (usecache) realmango["dump"] = require("./_cache").dump;
         rv[1] = realmango;
         resolve(rv);
      });
   });
};
