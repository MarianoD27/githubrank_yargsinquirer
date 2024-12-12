#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import * as colors from 'colors'

import { searchByDate, fakeGHFetch } from "./utils.js";


const usage = ("\nUsage: tran <lang_name> sentence to be translated".blue);
const argv = yargs(hideBin(process.argv))
  .scriptName("ghrank")
  .help()
  .showHelpOnFail(true)
  .demandCommand().recommendCommands().strict()
  .alias("h", "help")
  .usage(usage)
  .command({
    command: "date",
    describe: "Search github repositories between dates",
    handler: function () {
      searchByDate();
    }
  })
  .command({
    command: "dbg",
    describe: "Debug something",
    handler: function () {
      fakeGHFetch();
    }
  })
  .argv
