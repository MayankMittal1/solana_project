const args = process.argv
import { createAccount } from "./index";

const usage = function () {
  const usageText = `
      Create and fetch your Intellectual property
  
      create: create <description(string/uri)> <seed> <PrivateKeyByteArray> 
      fetch: fetch existing
      `;
  console.log(usageText);
};
const commands = ["create", "fetch"];

if (commands.indexOf(args[2]) == -1) {
  console.log("invalid command passed");
  usage();
} else if (commands.indexOf(args[2]) == 0) {
    if(args.length==6){
        var PrivteKeyByteArray = args[5];
        var description = args[3];
        var seed = args[4];
        createAccount(PrivteKeyByteArray,seed,description);
    }
    else{
        console.log("Invalid Arguments")
        usage()
    }
}
