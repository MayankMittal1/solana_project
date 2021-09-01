const args = process.argv
import { createAccount, fetch } from "./index";

const usage = function () {
  const usageText = `
      Create and fetch your Intellectual property
  
      create: create <metadata(hex code of SHA256 of your property)> <seed> <PrivateKeyByteArray> 
      fetch: fetch existing
      `;
  console.log(usageText);
};
const commands = ["create", "fetch"];
if (commands.indexOf(args[2]) == -1) {
  console.log("invalid command passed");
  usage();
}
else if (commands.indexOf(args[2]) == 0) {
    if(args.length==6){
        var PrivteKeyByteArray = args[5];
        var metadata = args[3];
        var seed = args[4];
        createAccount(PrivteKeyByteArray,seed,metadata);
    }
  }
else if (commands.indexOf(args[2]) == 1) {
      if(args.length==4){
        var account = args[3];
        fetchAccount(account)
      }
    }
    else{
        console.log("Invalid Arguments")
        usage()
    }

async function fetchAccount(account:string) {
  const data = await fetch(account)
  console.log(data.property_metadata,data.token_address)
}