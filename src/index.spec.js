const Web3 = require('./connections/web3');
const W3 = require('web3');
const CHAIN = require("./constants/chain");
const {ethers} = require("ethers");
const walletService = require("./services/walletsService");
const subscriptionService = require("./services/subscriptionsService");
const axios = require("axios");
const SUBSCRIPTION_TYPE = require("./constants/subscriptionType");
const {bigIntReplacer} = require("./utils");

const w3 = new Web3(CHAIN.CORE_TESTNET);

const tetherContractAddress = '0x81bCEa03678D1CEF4830942227720D542Aa15817';

describe('Web3', () => {
  test('erc 20', async () => {
    const address = '0x9762cFC7613BA22d49A187EBF6E18c6D4a2E4cC5';
    // const contractAddress = '0x3786495F5d8a83B7bacD78E2A0c61ca20722Cce3a';
    const contractAddress = '0x3786495F5d8a83B7bacD78E2A0c61ca20722Cce3';
    const chain = CHAIN.CORE_TESTNET.name;
    // const w3 = new Web3(CHAIN.BSC);
    // expect(w3.isAddress(contractAddress)).toBe(true);
    const actual = await walletService.getAddressTokenBalance(address, chain, contractAddress, true);
    expect(actual).toEqual(true);
  })

  test('gas amoynt' , async () => {

    const txHash = '0x6cb5c96b8e7e95ed5dd54d03729079d3133556659a82fbb0af8ab81bb4de0ed1'
    const tx =await  w3.getTransaction(txHash);
    // const ret = w3.isERC20TokenTransfer(tx);
    expect(tx).toEqual(true);
    // expect(ret.gasPrice).toBeDefined();
    // expect(ret.feeInWei).toBeDefined();
  } );

  test('aaaaaaaa', async () => {
    const web3 = new Web3(CHAIN.CORE);
    const tx = (await web3.getBlockTransactions(
      13149748));
    // const isERC20TokenTransfer = web3.isERC20TokenTransfer(tx);
    // const toAddress = isERC20TokenTransfer ? web3.decodeInput(tx.input).recipient : tx.to;
    // const address = '0xa601d0818eBf2c5558D8aD66F02e4A5853C395D9';
    // const fromMatches = tx.from?.toUpperCase() === address.toUpperCase();
    // const toMatches = tx.to?.toUpperCase() === address.toUpperCase();
    //
    // const matches = (fromMatches || toMatches);

    // const input = web3.decodeInput(tx.input);
    expect(tx).toEqual(true);
  })

  test('should return address balance', async () => {
    try {
      const wallet = await axios.post('http://localhost:3000/wallets')
      expect(wallet).toBeDefined();
      expect(wallet.uuid).toBeDefined();
    } catch (e) {
      console.log(e.response)
      expect(e).toBeInstanceOf(Error)
    }
  });
  test('test major to minor unit conversion', () => {
    const major = 1;
    const minor = ethers.formatUnits(major, 2);
    expect(minor).toEqual("0.01");

    const major2 = 15;
    const minor2 = ethers.formatUnits(major2, 5);
    expect(minor2).toEqual("0.00015");

    try {
      ethers.parseUnits("0.00015", 2);
    } catch (e) {
      expect(e).toBeInstanceOf(RangeError)
    }
  });
  test('exception thrown', async () => {

    const tx = {
      from: '0xcF50ba8257f892eA076450083be8710DFf81C012',
      to: '0x80Cb3566ad7831277fBca2F73eDB5ae36FDaCcec',
      value: 100000000000,
    }
    try {
      const ret = await w3.estimateTransactionFee(tx);
    } catch (e) {
      expect(e.message).toEqual("Returned error: err: insufficient funds for gas * price + value: address 0xcF50ba8257f892eA076450083be8710DFf81C012 have 0 want 100000000000 (supplied gas 20010499)");
    }

  });
  test('asdf', async () => {

    const no = 13090876;
    const web3 = new Web3(CHAIN.CORE);
    const txHash = '0x692c24b009149a7395450ecf78d1cf0b068feb3a4e0424230c3f6330e8f7cf90';
    // const tx = await web3.getTransaction(txHash);
    const t = await web3.getTokenInfo('0x191e94fa59739e188dce837f7f6978d84727ad01');
    expect(t).toBe('');
    // const receipt = await web3.getTransactionReceipt(txHash);
    // expect(receipt).toBe('');
    // expect(tx).toBe('');
  });

  it('should return token info', async () => {
    const tokenInfo = await w3.getTokenInfo(tetherContractAddress);
    expect(tokenInfo).toBeDefined();
    expect(tokenInfo.name).toEqual('Tether USD');
    expect(tokenInfo.symbol).toEqual('USDT');
  });

  it('should return contract', async () => {
    const contract = await w3.getContract(tetherContractAddress);
    expect(contract).toBeDefined();
  });

  it('should return USDT balance', async () => {
    // const balance = await w3.getAddressTokenBalance('0x297c4c9379ba3d8cbd21137d65d755ac78d16af0', tetherContractAddress);
    // console.log(balance)
    // expect(balance).toBeDefined();
    // expect(+balance).toBeLessThan(1);
  });

  it('should return Ether balance', async () => {
    const balance = await w3.getAddressBalance('0x297c4c9379ba3d8cbd21137d65d755ac78d16af0');
    expect(balance).toBeDefined();
    expect(+ethers.formatUnits(balance, 18)).toBeGreaterThan(1);
  });

  it('should return address token balance', async () => {
    const address = '0x80Cb3566ad7831277fBca2F73eDB5ae36FDaCcec';
    const balance = await walletService.getAddressTokenBalance(address, CHAIN.CORE.name, tetherContractAddress, true);
    expect(balance.balance).toEqual('0.01379808990795');
  });

  it('should decode tx input', async () => {
    const w3 = new Web3(CHAIN.CORE);
    const contractAddress = '0xF9DC330E494670c4aA7f220dD55964d1E03E37BB';
    // const contractAddress = '0x3786495F5d8a83B7bacD78E2A0c61ca20722Cce3';
    const input = '0xa9059cbb0000000000000000000000004283a75bff078e8f97eb7a966ac9a36ba276ba9c0000000000000000000000000000000000000000000000056bc75e2d63100000';
    const decoded = w3.decodeInput(input);
    expect(decoded.recipient).toEqual('0x4283a75bff078e8f97eb7a966ac9a36ba276ba9c');
  });

  it('should match transaction by receiver address', async () => {
    const tx = {
      from_address: '0x297c4c9379ba3d8cbd21137d65d755ac78d16af0',
      to_address: '0x80Cb3566ad7831277fBca2F73eDB5ae36FDaCcec',
      input: '0xa9059cbb0000000000000000000000004283a75bff078e8f97eb7a966ac9a36ba276ba9c',
    };
    const subscription = {
      address: '0x80Cb3566ad7831277fBca2F73eDB5ae36FDaCcec',
      type: 'INCOMING_TRANSACTIONS',
    };

    const isMatch = subscriptionService.matchTransaction(tx, subscription);
    expect(isMatch).toBe(true);
  });

  it('test multicall', async () => {
    const txId = '0x63a6aec666f891547f9365c66e19721a18092091dcdd5dd61cadf15f26a073d4';
    const web3 = new Web3(CHAIN.BSC);
    const tx = await web3.getTransaction(txId);
    const receipt = await web3.getTransactionReceipt(txId);
    expect({receipt, tx}).toEqual('aaaaaaaaaaaaaa');
    // expect(tx.hash).toEqual(txId);
  });

  it('get erc20 tx', async () => {
    const w3 = new Web3(CHAIN.BSC);
    const txId = '0x1d5924842d02fb1eed5b9d2fd9d1ea70263555a2e293818f838c8795543442b7';
    const tx = await w3.getTransaction(txId);
    expect(tx).toBe('');
  });

  it('decodes erc20 token transfer input', () => {
    const w3 = new Web3(CHAIN.BSC);
    const tx = {
      "blockHash": "0x692b4d1c25f496e0c696acfcdaea6f7f20a1977a9fc8d222e8ed23995427bae6",
      "blockNumber": 37173768n,
      "chainId": 56n,
      "data": "0xa9059cbb0000000000000000000000002a8ba48106bc018ce56e568e46e285429a65b4bf000000000000000000000000000000000000000000000007f5dadba936f35000",
      "from": "0xcdd37ada79f589c15bd4f8fd2083dc88e34a2af2",
      "gas": 51627n,
      "gasPrice": 3000000000n,
      "hash": "0x1d5924842d02fb1eed5b9d2fd9d1ea70263555a2e293818f838c8795543442b7",
      "input": "0xa9059cbb0000000000000000000000002a8ba48106bc018ce56e568e46e285429a65b4bf000000000000000000000000000000000000000000000007f5dadba936f35000",
      "nonce": 110339n,
      "r": "0xaf4e50ce8a0d898d8a9c33e3e97a9c6116524a83ad5cb78ff534b493f680296d",
      "s": "0x09d858bc244457de9abfc58ff0e6764565cf5d9e52284669eac4a36f2f0f02d4",
      "to": "0x55d398326f99059ff775485246999027b3197955",
      "transactionIndex": 95n,
      "type": 0n,
      "v": 147n,
      "value": 0n
    };
    const decoded = w3.decodeInput(tx.input);
    expect(decoded.recipient).toEqual('0x2A8ba48106bC018cE56E568E46e285429a65B4Bf'.toLowerCase());
    const minorAmount = decoded.amount;
    const majorAmount = ethers.formatUnits(BigInt(minorAmount), 18);
    expect(majorAmount).toEqual('146.84292212');
  })
});
