import { Message, PermissionFlags, PermissionString } from "discord.js";
import { Logger } from "winston";
import { getlogger } from "../../rando";

export abstract class Command {
   public readonly name: string;
   protected readonly logger: Logger;

   public constructor(name: string) {
      this.name = name;
      this.logger = getlogger(this.name);

      this.logger.debug(`${this.name} constructed!`);
   }

   public async abstract exec(message: Message): Promise<void>;
   public readonly abstract perms: ReadonlyArray<PermissionFlags | PermissionString>;

   public readonly abstract allowguild: boolean;
   public readonly abstract allowdm: boolean;

   public readonly abstract showinhelp: boolean;
   public readonly abstract category: CategoryAndDataStuff<CategoryNames>;
   public readonly abstract description: string | undefined;
}

// what
// the
// hecc
// i big brained lol
export type CategoryNames = "other" | "test" | "utility" | "pony" | "fun" | "voice";

export interface CategoryAndDataStuff<N extends CategoryNames> {
   name: N;
   description: string;
}

export const categories: Readonly<{ [N in CategoryNames]: CategoryAndDataStuff<N> }> = {
   // i want to remove the duplicated name and key and stuff
   // ehh it doesnt matter too much rn, name is checked to be the same as the key so whatever
   other: {
      name: "other",
      description: "some miscellaneous commands that don't really fit in any other category"
   },
   test: {
      name: "test",
      description: "used to test various functions/things of the bot, usually there is nothing in here"
   },
   utility: {
      name: "utility",
      description: "utility commands"
   },
   pony: {
      name: "pony",
      description: "commands related to ponies"
   },
   fun: {
      name: "fun",
      description: "non-serious things happen here"
   },
   voice: {
      name: "voice",
      description: "voice-channel and music related commands"
   }
};
