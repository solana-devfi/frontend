export interface Organisation {
  name: string;
  displayName: string;
  totalAmount: number;
  address: string;
  repos: Repo[];
}

export interface Repo {
  name: string;
  displayName: string;
  totalAmount: number;
  latestItems: Item[];
}

export interface PullRequest {
  id: number;
  name: string;
  amount: number;
  contributors?: string[];
}

export interface Issue {
  id: number;
  name: string;
  amount: number;
  pullRequests?: PullRequest[];
}

export type Item = PullRequest | Issue;

const organisations: Organisation[] = [
  {
    name: 'solana-xdevfi',
    displayName: 'DevFi',
    totalAmount: 3.1002,
    address: 'FQ6tQRVERHA29n88WQeut1G3QfJ66bSMM733vFoqUXpr',
    repos: [
      {
        name: 'frontend',
        displayName: 'DevFi Frontend',
        totalAmount: 2.1,
        latestItems: [
          {
            id: 1,
            name: 'Implement wallet authentication',
            amount: 1.0,
          },
          {
            id: 3,
            name: 'Add roadmap page',
            amount: 1.1,
          },
        ],
      },
      {
        name: 'contracts',
        displayName: 'DevFi Smart Contracts',
        totalAmount: 1.0002,
        latestItems: [
          {
            id: 1,
            name: 'Add tests for NFT contracts',
            amount: 1.0,
          },
          {
            id: 2,
            name: 'Fix issue with Bounty PDAs',
            amount: 1.1,
          },
        ],
      },
    ],
  },
  {
    name: 'devfi-2',
    displayName: 'DevFi #2',
    totalAmount: 3.1002,
    address: 'AGYboJMBit5PxpwBVTJ68L6itbsNXd3Yy3fzc6SkbeN1',
    repos: [
      {
        name: 'frontend',
        displayName: 'DevFi Frontend',
        totalAmount: 2.1,
        latestItems: [
          {
            id: 1,
            name: 'Implement wallet authentication',
            amount: 1.0,
          },
          {
            id: 3,
            name: 'Add roadmap page',
            amount: 1.1,
          },
        ],
      },
      {
        name: 'contracts',
        displayName: 'DevFi Smart Contracts',
        totalAmount: 1.0002,
        latestItems: [
          {
            id: 1,
            name: 'Add tests for NFT contracts',
            amount: 1.0,
          },
          {
            id: 2,
            name: 'Fix issue with Bounty PDAs',
            amount: 1.1,
          },
        ],
      },
    ],
  },
];

export default organisations;
