import { Idl } from '@project-serum/anchor';

const GIT_TO_EARN_IDL: Idl = {
  version: '0.1.0',
  name: 'git_to_earn',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        {
          name: 'state',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'signingOracle',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'initializeUserOwner',
      accounts: [
        {
          name: 'walletProxy',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'state',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signingOracle',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'userId',
          type: 'string',
        },
        {
          name: 'isOrg',
          type: 'bool',
        },
      ],
    },
    {
      name: 'transfer',
      accounts: [
        {
          name: 'senderWallet',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'receiverWallet',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'state',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'signingOracle',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'senderId',
          type: 'string',
        },
        {
          name: 'receiverId',
          type: 'string',
        },
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'withdraw',
      accounts: [
        {
          name: 'userProxy',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'userWallet',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'userId',
          type: 'string',
        },
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'State',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'signingOracle',
            type: 'publicKey',
          },
          {
            name: 'orgList',
            type: {
              vec: 'string',
            },
          },
        ],
      },
    },
    {
      name: 'WalletProxy',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
        ],
      },
      // metadata: {
      //   address: '8KFc1kae5g8LqAwmZHskgaSYjaHXpt9PCRwKNtuajgAa',
      // },
    },
  ],
};

export default GIT_TO_EARN_IDL;
