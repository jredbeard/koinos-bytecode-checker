const crypto = require("crypto");
const { Provider, utils } = require("koilib");
const process = require("process");

const contractId = process.argv[2];

if (!contractId) {
  console.error("Please provide a contract ID as a command-line argument.");
  process.exit(1);
}

const defaultNodeApi = "https://api.koinosblocks.com";
//const defaultNodeApi = "https://api.koinos.io"; // koinos group official api
//const defaultNodeApi = "https://harbinger-api.koinos.io" // harbinger testnet
const nodeApi = process.env.NODE_API || defaultNodeApi;

(async () => {
  const provider = new Provider([nodeApi]);
  let contractUploads = 0;
  let seqNum = 0;

  while (true) {
    const result = await provider.call("account_history.get_account_history", {
      address: contractId,
      ascending: true,
      limit: 500,
      seq_num: seqNum,
    });

    for (let i = 0; i < result.values.length; i += 1) {
      const historyEntry = result.values[i];
      if (!historyEntry.trx) continue;
      const { trx: trxRecord } = historyEntry;
      if (!trxRecord.transaction || !trxRecord.transaction.operations) continue;
      for (let j = 0; j < trxRecord.transaction.operations.length; j += 1) {
        const op = trxRecord.transaction.operations[j];
        if (!op.upload_contract) continue;
        const {
            authorizes_call_contract,
            authorizes_transaction_application,
            authorizes_upload_contract,
        } = op.upload_contract;
        let immutable = true;
        if (
            !authorizes_call_contract ||
            !authorizes_transaction_application ||
            !authorizes_upload_contract
        ) {
            immutable = false;
        }
        const bytecode = utils.decodeBase64url(op.upload_contract.bytecode);
        const hash = crypto.createHash("sha256").update(bytecode).digest("hex");
        const size = bytecode.length;

        console.log({
          seq_num: historyEntry.seq_num || 0,
          trxId: trxRecord.transaction.id,
          opType: "upload_contract",
          hash,
          size,
          immutable,
        });
        contractUploads += 1;
      }
    }

    const lastSeqNum = Number(result.values[result.values.length - 1].seq_num);
    seqNum += 500;

    if (lastSeqNum < seqNum - 1) {
      console.log(`Search ended in seq_num ${lastSeqNum}`);
      break;
    }
  }
  console.log(`Number of contract uploads: ${contractUploads}`);
})();