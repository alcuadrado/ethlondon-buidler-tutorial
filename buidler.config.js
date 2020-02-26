usePlugin("@nomiclabs/buidler-waffle");

const INFURA_PROJECT_ID = "2c499aed715a47f5bb77ef88afc5f27d";
const INFURA_DEPLOYMENT_ACCOUNT_PRIVATE_KEY =
  "0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122";

module.exports = {
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [INFURA_DEPLOYMENT_ACCOUNT_PRIVATE_KEY]
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [INFURA_DEPLOYMENT_ACCOUNT_PRIVATE_KEY]
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [INFURA_DEPLOYMENT_ACCOUNT_PRIVATE_KEY]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [INFURA_DEPLOYMENT_ACCOUNT_PRIVATE_KEY]
    },
    gorli: {
      url: `https://gorli.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [INFURA_DEPLOYMENT_ACCOUNT_PRIVATE_KEY]
    }
  }
};
