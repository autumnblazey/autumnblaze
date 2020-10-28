import { Client, ClientOptions, Collection } from "discord.js";
import { Logger } from "winston";
import { Mango } from "./mango";
import { BroadcastManager } from "./music/utils";
import { chopprefix, getlogger, getnextarg, ProcessEvents } from "./rando";
import { Command } from "./text/commands/_command";

// TODO CONNECT THE DB
export class AutumnBlaze {
   public readonly bot: Client;
   private token: string;
   private started: boolean = false;
   private stopped: boolean = false;
   private readonly logger: Logger;
   private readonly commands: Collection<string, Command>;
   public readonly voicebroadcastmanager?: BroadcastManager;
   public readonly mango: Mango;
   public readonly botoptions: ClientOptions & { enablevoice?: boolean, prefix: string, mangolink: string, ponymangolink?: string };

   // public constructor(token: string, botoptions?: ClientOptions & ({ enablevoice?: boolean } | { enablevoice: true, broadcasts?: number })) {
   public constructor(token: string, botoptions: ClientOptions & { enablevoice?: boolean, prefix: string, mangolink: string, ponymangolink?: string }) {
      this.token = token;
      this.botoptions = botoptions;

      this.bot = new Client(this.botoptions);
      this.mango = new Mango(this, {
         mainlink: this.botoptions.mangolink,
         ponylink: this.botoptions.ponymangolink,
         maindbname: "botbot"
      });

      this.logger = getlogger("_mainbot");
      this.commands = new Collection<string, Command>();

      this.bot.on("ready", () => {
         this.bot.user?.setPresence({
            status: "online",
            afk: false,
            activity: {
               name: "PING ME LOL"
            }
         }).catch(e => this.logger.warn(e));
      });
      this.registermessagelistener();
      this.registervoicestatelistener();
      if (botoptions.enablevoice === false) this.logger.debug("voice not enabled");
      this.voicebroadcastmanager = new BroadcastManager(this);
      this.logger.debug("okie constructed main bot");
   }

   public settoken(token: string): void {
      this.token = token;
   }

   public async start(): Promise<void> {
      if (this.started) return;

      await this.mango.start();
      await this.bot.login(this.token);
      this.logger.info("connected to discord!!");
      this.bot.on("warn", warn => this.logger.warn(warn));
      this.bot.on("error", error => this.logger.error(error));

      this.started = true;
   }

   public stop(): void {
      if (this.stopped) return;

      this.bot.destroy();
      this.mango.stop();
      this.logger.info("disconnected");
      this.stopped = true;
   }

   public registerstoplistener(name: ProcessEvents): void {
      process.on(name, () => {
         this.stop();
      });
   }

   public registercommand(cmd: Command): void {
      if (this.commands.get(cmd.name)) throw new Error(`duplicate command "${cmd.name}"!`);
      this.commands.set(cmd.name, cmd);
      this.logger.debug(`added command ${cmd.name}`);
   }

   private registermessagelistener(): void {
      this.bot.on("message", msg => {
         if (msg.author === this.bot.user) return;
         const commandnoprefix: string | false = chopprefix(this.botoptions.prefix, msg.content);
         if (commandnoprefix === false) return;

         const commandandargs: [string, string] = getnextarg(commandnoprefix);

         const command: Command | undefined = this.commands.get(commandandargs[0]);
         if (command === undefined) return;

         // dont execute in news channels
         if (msg.channel.type === "news") return;
         // if its a dm and you allow dms
         // OR its a guild text channel and you allow guild text channels
         // execute!!
         // command should figure out which type of channel its handling if it cares

         if (msg.channel.type === "dm" && command.allowdm || msg.channel.type === "text" && command.allowguild) void command.exec(msg);
      });
   }

   public getcommands(): Collection<string, Command> {
      // clone to prevent modification
      return this.commands.clone();
   }

   private registervoicestatelistener(): void {
      // h
      // this.bot.on("voiceStateUpdate", (_oldstate, newstate) => {
      //
      // });
   }
}
