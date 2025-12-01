export const ORBIT_A_ADDRESS = process.env.NEXT_PUBLIC_ORBIT_A_ADDRESS as `0x${string}`;
export const ORBIT_B_ADDRESS = process.env.NEXT_PUBLIC_ORBIT_B_ADDRESS as `0x${string}`;
export const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS as `0x${string}`;

// ABI for admin functions
export const ORBIT_A_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_level",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_newPriceUSD",
        "type": "uint256"
      }
    ],
    "name": "setLevelPriceUSD",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newPoolWallet",
        "type": "address"
      }
    ],
    "name": "updatePoolWallet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "poolWallet",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "levelPriceUSD",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const ORBIT_B_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_level",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_newPriceUSD",
        "type": "uint256"
      }
    ],
    "name": "setLevelPriceUSD",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newPoolWallet",
        "type": "address"
      }
    ],
    "name": "updatePoolWallet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "poolWallet",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "levelPriceUSD",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;



