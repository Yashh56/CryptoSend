const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;
const ABI = require("./abi.json");

app.use(cors());
app.use(express.json());

function convertArrayToObject(arr) {
  const dataArray = arr.map((transaction, index) => ({
    key: (arr.length + 1 - index).toString(),
    type: transaction[0],
    amount: transaction[1],
    message: transaction[2],
    address: `${transaction[3].slice(0, 4)}...${transaction[3].slice(38)}`,
    subject: transaction[4],
  }));

  return dataArray.reverse();
}

app.get("/getNameAndBalance", async (req, res) => {
  const { userAddress } = req.query;
  const response = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: "0x0ca2C50047e3b1b4b93F991060f925dC6A44bDED",
    functionName: "getName",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseName = response.raw;

  const secResponse = await Moralis.EvmApi.balance.getNativeBalance({
    chain: "0x13881",
    address: userAddress,
  });

  const jsonResponseBal = (secResponse.raw.balance / 1e18).toFixed(2);

  // const thirResponse = await Moralis.EvmApi.token.getTokenPrice({
  //   address: "0x753253585702A775A695f60A9567D379e0c05bd3",
  // });

  // const thirResponse = await Moralis.EvmApi.token.getTokenPrice({
  //   chain: "0x13881",
  //   address: "0x0ca2C50047e3b1b4b93F991060f925dC6A44bDED",
  // });

  // const jsonResponseDollars = (
  //   thirResponse.raw.usdPrice * jsonResponseBal
  // ).toFixed(2);

  const fourResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: "0x0ca2C50047e3b1b4b93F991060f925dC6A44bDED",
    functionName: "getMyHistory",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseHistory = convertArrayToObject(fourResponse.raw);

  const fiveResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: "0x0ca2C50047e3b1b4b93F991060f925dC6A44bDED",
    functionName: "getMyRequests",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseRequests = fiveResponse.raw;

  const jsonResponse = {
    name: jsonResponseName,
    balance: jsonResponseBal,
    // dollars: jsonResponseDollars,
    history: jsonResponseHistory,
    requests: jsonResponseRequests,
  };

  return res.status(200).json(jsonResponse);
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
