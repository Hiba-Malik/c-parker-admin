# C-Parker Admin Portal

Admin dashboard for managing the C-Parker Matrix Platform (Orbit A & Orbit B smart contracts).

## 🎯 Features

- 🔐 **Wallet Authentication**: Secure admin-only access via WalletConnect
- 📢 **Announcement Management**: Create, edit, hide, and delete announcements (stored in PostgreSQL)
- ⚙️ **Contract Management**: 
  - Set level prices (USD) for both Orbit A and Orbit B
  - Update pool wallet addresses
  - Real-time blockchain data refresh
- 🎨 **Custom Themed UI**: Purple gradient theme with modern design

## 📋 Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Admin wallet address with owner privileges on contracts
- **c-parker-backend** running (for announcements API)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd admin-portal
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
# Contract Addresses (Polygon Amoy Testnet)
NEXT_PUBLIC_ORBIT_A_ADDRESS=0x7D3972413444142911e09A2b6B24191582dC855B
NEXT_PUBLIC_ORBIT_B_ADDRESS=0xFCA12252a77fc85dEA5F6D5d137869EB8d6AA0FE

# Admin wallet address
NEXT_PUBLIC_ADMIN_ADDRESS=0x30cfa2dd6b79Bc800B0b8cbF89534Aa4D02D548A

# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Network
NEXT_PUBLIC_CHAIN_ID=80002

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 3. Get WalletConnect Project ID

1. Go to https://cloud.walletconnect.com/
2. Create a free account
3. Create a new project
4. Copy the Project ID and paste it in `.env.local`

### 4. Start the Backend (Required for Announcements)

```bash
cd ../c-parker-backend
npm run start:dev
```

Backend runs on: `http://localhost:4000`

### 5. Start the Admin Portal

```bash
cd admin-portal
npm run dev
```

Admin portal runs on: `http://localhost:3001`

## 📚 Usage

### Login
1. Open `http://localhost:3001` in your browser
2. Click "Connect Wallet"
3. Choose your wallet (MetaMask, Coinbase, Trust Wallet, etc.)
4. Connect with your admin wallet (must match `NEXT_PUBLIC_ADMIN_ADDRESS`)
5. You'll be automatically redirected to the dashboard

### Announcements Tab
- **Create**: Click "New Announcement" button
- **Edit**: Click the edit icon on any announcement
- **Hide/Show**: Click the eye icon to toggle visibility
- **Delete**: Click the trash icon to permanently delete
- **Data stored in PostgreSQL** via c-parker-backend

### Contract Functions Tab
- Switch between **Orbit A** and **Orbit B** contracts
- **Set Level Price**: 
  - Select level (1-10)
  - Enter new USD price
  - Confirm transaction
  - Price automatically refreshes after update
- **Update Pool Wallet**: 
  - Enter new wallet address
  - Confirm transaction
  - Address automatically refreshes after update

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│   Admin Portal (Port 3001)      │
│   Next.js + React + Wagmi       │
└──────────┬─────────────┬────────┘
           │             │
           │             │
    ┌──────▼──────┐ ┌───▼──────────────┐
    │  Backend    │ │   Smart          │
    │  API        │ │   Contracts      │
    │  (Port      │ │   (Polygon       │
    │   4000)     │ │    Amoy)         │
    └──────┬──────┘ └──────────────────┘
           │
    ┌──────▼──────┐
    │ PostgreSQL  │
    │  Database   │
    └─────────────┘
```

### Data Flow

**Announcements:**
- Frontend → Backend API → PostgreSQL Database

**Contract Functions:**
- Frontend → Direct blockchain calls via Wagmi/Viem

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Gradients
- **Web3**: Wagmi v2, Viem v2
- **Wallet**: WalletConnect v3 (Web3Modal)
- **State Management**: React Hooks + TanStack Query
- **Backend**: NestJS REST API (c-parker-backend)
- **Database**: PostgreSQL
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📡 API Endpoints

### Announcements (Backend)
- `GET /api/v1/announcements` - Fetch all announcements
- `POST /api/v1/announcements` - Create announcement
- `PATCH /api/v1/announcements/:id` - Update announcement
- `DELETE /api/v1/announcements/:id` - Delete announcement

### Smart Contracts (Direct)
- `setLevelPriceUSD(level, newPriceUSD)` - Update level price
- `updatePoolWallet(address)` - Update pool wallet
- `poolWallet()` - Read current pool wallet
- `levelPriceUSD(level)` - Read current level price

## 🔐 Security

- ✅ Admin-only access (wallet address verification)
- ✅ All contract interactions require transaction confirmation
- ✅ CORS properly configured on backend
- ✅ Environment variables properly scoped
- ✅ Input validation on all forms

## 🌐 Network

**Polygon Amoy Testnet** (Chain ID: 80002)

Get test MATIC: https://faucet.polygon.technology/

## 📦 Deployment

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_ORBIT_A_ADDRESS`
   - `NEXT_PUBLIC_ORBIT_B_ADDRESS`
   - `NEXT_PUBLIC_ADMIN_ADDRESS`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_CHAIN_ID`
   - `NEXT_PUBLIC_API_URL`
4. Deploy

**Note:** Make sure backend API is also deployed and accessible

## 🐛 Troubleshooting

### "Please connect with the admin wallet"
- Ensure connected wallet matches `NEXT_PUBLIC_ADMIN_ADDRESS` exactly
- Check address is checksummed correctly

### "Failed to fetch announcements"
- Ensure c-parker-backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify PostgreSQL database is running
- Check browser console for CORS errors

### "Transaction failed"
- Ensure sufficient MATIC for gas fees
- Verify connected to Polygon Amoy Testnet
- Check wallet is the contract owner
- Try increasing gas limit

### WalletConnect issues
- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is correct
- Clear browser cache and reconnect
- Try different wallet provider

### Port 3001 already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
npm run dev -- -p 3002
```

## 📁 Project Structure

```
admin-portal/
├── app/
│   ├── api/                    # (Deprecated - now using backend)
│   ├── dashboard/              # Dashboard page
│   ├── page.tsx               # Login page
│   └── layout.tsx             # Root layout
├── components/
│   ├── dashboard/
│   │   ├── Header.tsx         # Nav bar
│   │   ├── AnnouncementManager.tsx  # CRUD UI
│   │   └── ContractFunctions.tsx    # Contract interaction
│   └── Providers.tsx          # Wagmi + Query providers
├── config/
│   ├── wagmi.ts              # Web3 config
│   ├── contracts.ts          # Contract ABIs
│   └── api.ts                # Backend API config
├── types/
│   └── announcement.ts       # TypeScript types
└── .env.local               # Environment variables
```

## 🔗 Related Repositories

- **Backend API**: [c-parker-backend](https://github.com/yourusername/c-parker-backend)
- **Smart Contracts**: [c-parker-contracts](https://github.com/yourusername/c-parker-contracts)

## 📄 License

MIT

## 🤝 Support

For issues or questions:
- [Wagmi Documentation](https://wagmi.sh/)
- [Next.js Documentation](https://nextjs.org/docs)
- [WalletConnect Documentation](https://docs.walletconnect.com/)

---

Built with ❤️ for C-Parker Matrix Platform
