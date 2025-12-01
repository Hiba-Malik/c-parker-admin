# C-Parker Admin Portal

Administrative dashboard for managing the C-Parker Matrix Platform smart contracts (Orbit A & Orbit B).

## Features

- Wallet-based admin authentication
- Announcement management with PostgreSQL persistence
- Smart contract administration (level pricing, pool wallet configuration)
- Real-time blockchain data synchronization

## Prerequisites

- Node.js 18+
- Running instance of c-parker-backend (port 4000)
- Admin wallet with contract owner privileges
- WalletConnect Cloud project ID

## Installation

```bash
npm install
```

## Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_ORBIT_A_ADDRESS=0x7D3972413444142911e09A2b6B24191582dC855B
NEXT_PUBLIC_ORBIT_B_ADDRESS=0xFCA12252a77fc85dEA5F6D5d137869EB8d6AA0FE
NEXT_PUBLIC_ADMIN_ADDRESS=0x30cfa2dd6b79Bc800B0b8cbF89534Aa4D02D548A
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

Get WalletConnect Project ID: https://cloud.walletconnect.com/

## Usage

Start backend:
```bash
cd ../c-parker-backend
npm run start:dev
```

Start admin portal:
```bash
npm run dev
```

Access at: http://localhost:3001

## Architecture

```
Admin Portal (3001) ──┬──> Backend API (4000) ──> PostgreSQL
                      └──> Smart Contracts (Polygon Amoy)
```

## API Endpoints

**Backend (Announcements)**
- `GET /api/v1/announcements`
- `POST /api/v1/announcements`
- `PATCH /api/v1/announcements/:id`
- `DELETE /api/v1/announcements/:id`

**Smart Contracts (Direct)**
- `setLevelPriceUSD(level, price)` - Update level pricing
- `updatePoolWallet(address)` - Update pool wallet
- `poolWallet()` - Read pool wallet
- `levelPriceUSD(level)` - Read level price

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Wagmi v2 / Viem v2
- WalletConnect v3
- TanStack Query
- Tailwind CSS

## Security

- Admin wallet verification on all routes
- Transaction confirmation required for contract interactions
- Environment variable scoping
- CORS configuration on backend

## Deployment

Production build:
```bash
npm run build
npm start
```

Vercel deployment:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

Note: Ensure backend API is deployed and accessible.

## Troubleshooting

**Admin access denied**
- Verify `NEXT_PUBLIC_ADMIN_ADDRESS` matches connected wallet

**Announcements not loading**
- Confirm c-parker-backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` configuration
- Verify PostgreSQL database connection

**Transaction failures**
- Ensure sufficient MATIC for gas
- Verify Polygon Amoy Testnet connection
- Confirm wallet has contract owner permissions

**Port conflicts**
```bash
lsof -ti:3001 | xargs kill -9
```

## Network

Polygon Amoy Testnet (Chain ID: 80002)

Faucet: https://faucet.polygon.technology/

## License

MIT
