# Changelog
Will add changelog for older version when i have the chance
[int] internal changes, doesnt directly affect user experience
[ext] external changes, users see a difference

## 0.17.1
Changes:
- [int] lebottieinitthig.js => index.js (no more strange names!)
- [int] wait for database to connect before connecting bot
- [ext] help command only shows commands available in the channel where the help command is sent
- [int] store top level help command embed (like about), no reason to rebuild it everytime
- [int] move presence (game activity) to events/ready module
- [int] remove extra file (env.js), just run index.js
- [int] start transition to prototype based system, added Command prototype
- [int] command now standard object, run cmd.exec() instead


## 0.17.0
New:
- [ext] not really new, but `enable` and `diable` commands now actually enabled

Changes:
- [int] misc management improvements

Bugs fixed:
- [ext] when disconnecting temporarily, bot doesnt restore status on reconnect

## 0.16.2
Changes:
- [int] rewrote member welcome a bit, likely handles promise rejection a bit better

## 0.16.1
Changes:
- [int] rewrote patchconsole
- [int] send promise rejections to the error channel

## 0.16.0
New:
- [ext] introduce users to how the bot responds to dms (on first dm sent)
- [int] store all pony image metadata into a collection in the db
- [ext] welcome message module (but without the command to enable it yet)

Changes:
- [int] rewrote command processing thing to be more concise, less messy, and probably faster
- [int] remove "in" from the about command, if you want "in" inside the hosting location in the about command, put that into opts.location
- [int] dont require derpibooru api key, since doesnt use the derpibooru api (for now at least)