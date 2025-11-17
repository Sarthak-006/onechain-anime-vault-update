# 🎌 OneChain Anime Vault - NFT Marketplace

**Complete NFT Lifecycle: Mint → List → Trade → Collect**

A decentralized marketplace for tokenizing and trading anime merchandise as NFTs on **OneChain OCT** (Sui fork blockchain).

**Network**: OneChain OCT Testnet  
**Native Token**: OCT  
**Explorer**: [onescan.cc/testnet](https://onescan.cc/testnet)  
**Documentation**: [docs.onelabs.cc](https://docs.onelabs.cc)

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20App-blue?style=for-the-badge)](https://onechain-anime-valult.vercel.app/)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Rust toolchain (for Move contracts)
- OneWallet browser extension

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Sarthak-006/onechain-anime-vault.git
cd onechain-anime-vault

# 2. Install dependencies
pnpm install

# 3. Build Move contract
sui move build

# 4. Deploy contract to testnet (optional - contract already deployed)
npx tsx scripts/deploy.ts

# 5. Start frontend
pnpm run dev
```

Visit `http://localhost:3000` to see the app.

---

## ✨ Features

### ✅ Complete NFT Lifecycle

#### 1. **Mint NFTs** 🎨
- Upload images to Supabase storage
- Create anime merchandise NFTs on blockchain
- Automatic image upload before minting
- Real-time transaction tracking

#### 2. **List for Sale** 💰
- Set price in OCT tokens
- List owned NFTs on marketplace
- Shared object listing system
- Easy listing dialog interface

#### 3. **Trade NFTs** 🔄
- Browse marketplace listings
- Purchase listed NFTs
- Automatic ownership transfer
- Transaction history tracking

#### 4. **Collect & Manage** 📦
- View your NFT collection
- Dashboard with portfolio stats
- List/unlist functionality
- Transaction history

### 🎯 Additional Features
- ✅ **Supabase Integration**: Automatic image upload to Supabase storage
- ✅ **OneWallet Integration**: Seamless wallet connection
- ✅ **Real-time Balance**: OCT token balance display
- ✅ **Explorer Links**: Direct links to OneChain testnet explorer
- ✅ **Modern UI**: Built with shadcn/ui components
- ✅ **Responsive Design**: Works on all devices

---

## 📦 Contract Information

### Deployed Contract
- **Package ID**: `0x02c23edcb0cc861f892d22776d83e21e5b6a953c17e6b2011b5721b608c6fc64`
- **Module**: `animetranferprotocolnew`
- **Network**: OneChain OCT Testnet

### Contract Objects
- **NFT Count ID**: `0x801f449ccb8d78ff3b8cdd20824806aff8d866087bc0faafdca365309d602d52`
- **Land Registry ID**: `0x9c125a32b0f1645361d112b62baab2ae25cecce732bb0b539dbbb7fb1bf7d5ae`
- **Land Registry Address ID**: `0xe738a6a7bd81fbe533b363bb5efcd726b3afea1a2107d3667319062c520a173b`

### Contract Functions
```move
// Mint a new NFT
public fun mint_nft(
    url: String,
    nftCount: &NftCount,
    registory: &mut LandRegistry,
    landRegistryAddress: &mut LandRegistryAddress,
    ctx: &mut TxContext
)

// List NFT for sale
public fun list_for_sale(
    landData: LandData,
    price: u256,
    ctx: &mut TxContext
)

// Purchase listed NFT
public fun purchase_listed_nft(
    listing: Listing,
    ctx: &mut TxContext
)
```

---

## 🏗️ Architecture

### Smart Contract (`contracts/animetranferprotocolnew.move`)

**Core Structs:**
```move
struct LandData        // NFT token with URL and owner
struct NftCount        // Shared counter for unique IDs
struct LandRegistry    // Registry mapping coordinates to NFTs
struct LandRegistryAddress  // Registry mapping addresses to NFTs
struct Listing         // Marketplace listing with price
```

### Frontend Stack
- **Framework**: Next.js 15 + React 19
- **Styling**: TailwindCSS + shadcn/ui
- **State**: React Query + React Hooks
- **Wallet**: @onelabs/dapp-kit
- **Storage**: Supabase (image uploads)
- **Blockchain**: @onelabs/sui SDK

### OneChain OCT Integration
- **RPC**: `https://rpc-testnet.onelabs.cc:443`
- **Faucet**: `https://faucet-testnet.onelabs.cc:443`
- **Explorer**: `https://onescan.cc/testnet`
- **SDK**: `@onelabs/sui` for blockchain interaction
- **Native Token**: OCT (gas token)

---

## 📁 Project Structure

```
onechain-anime-vault/
├── contracts/
│   └── animetranferprotocolnew.move    # Smart contract
├── app/
│   ├── create/                         # Mint NFT UI
│   ├── marketplace/                    # Browse & buy
│   │   └── [id]/                       # NFT detail page
│   ├── dashboard/                      # User collection
│   └── page.tsx                        # Landing page
├── components/
│   ├── tokenization/                   # NFT creation forms
│   │   ├── tokenization-form.tsx
│   │   ├── tokenization-preview.tsx
│   │   └── tokenization-success.tsx
│   ├── wallet/                         # Wallet components
│   │   └── wallet-info.tsx
│   ├── nft/                            # NFT components
│   │   └── list-nft-dialog.tsx
│   ├── layout/                         # Layout components
│   │   └── header.tsx
│   └── ui/                             # shadcn/ui components
├── lib/
│   ├── onelabs.ts                      # Blockchain SDK & config
│   ├── supabase.ts                     # Supabase image upload
│   ├── nft-operations.ts               # NFT transaction builders
│   ├── wallet.ts                       # Wallet utilities
│   └── types.ts                        # TypeScript types
├── scripts/
│   ├── deploy.ts                       # Deploy contract
│   ├── test-lifecycle.ts               # Full lifecycle test
│   └── faucet.ts                       # Request testnet tokens
└── README.md
```

---

## 🔄 Complete NFT Lifecycle Flow

### 1. Mint NFT
```
User fills form → Uploads image → Image uploaded to Supabase 
→ Transaction created → NFT minted on blockchain → Success page
```

**Steps:**
1. Navigate to `/create`
2. Fill out NFT details (name, description, category, rarity)
3. Upload image (automatically uploaded to Supabase)
4. Add verification photos (optional)
5. Review preview
6. Click "Mint NFT"
7. Confirm transaction in wallet
8. View success page with transaction hash

### 2. List for Sale
```
User views collection → Clicks "List for Sale" → Enters price 
→ Transaction created → NFT wrapped in Listing object → Listed on marketplace
```

**Steps:**
1. Navigate to `/dashboard`
2. Find unlisted NFT in collection
3. Click "List for Sale"
4. Enter price in OCT
5. Confirm transaction
6. NFT now listed on marketplace

### 3. Purchase NFT
```
User browses marketplace → Clicks on NFT → Views details 
→ Clicks "Buy Now" → Transaction created → Ownership transferred → NFT collected
```

**Steps:**
1. Navigate to `/marketplace`
2. Browse listed NFTs
3. Click on NFT to view details
4. Click "Buy Now"
5. Confirm transaction in wallet
6. NFT ownership transferred to you

### 4. Collect & Manage
```
User views dashboard → Sees collection → Can list/unlist 
→ View transaction history → Track portfolio value
```

---

## 🖼️ Supabase Image Storage

### Configuration
- **Supabase URL**: `https://soqzchswjemewyskkdmk.supabase.co`
- **Bucket**: `images`
- **Folder**: `merchandise/`
- **Access**: Public read access

### Image Upload Flow
1. User selects image file in form
2. Image automatically uploaded to Supabase before minting
3. Public URL generated
4. URL stored in NFT metadata on blockchain
5. Image accessible via public URL

### Manual Upload (Optional)
If you need to upload images manually, you can use the Python script:
```python
# See lib/supabase.ts for the upload function
# Or use the Supabase dashboard directly
```

---

## 🔗 Explorer Links

All explorer links use the OneChain testnet format:

- **Account**: `https://onescan.cc/testnet/account?address=0x...`
- **Transaction**: `https://onescan.cc/testnet/transactionBlocksDetail?digest=0x...`
- **Object**: `https://onescan.cc/testnet/object/0x...`

---

## 🧪 Testing

### Run Full Lifecycle Test
```bash
npx tsx scripts/test-lifecycle.ts
```

### Request Testnet Tokens
```bash
npx tsx scripts/faucet.ts <YOUR_ADDRESS>
```

### Check Balance
```bash
npx tsx scripts/check-balance.ts <YOUR_ADDRESS>
```

### Deploy New Contract
```bash
npx tsx scripts/deploy.ts
```

---

## 🔧 Configuration

### Environment Variables
Create `.env.local` in the root directory (optional - defaults are set):
```bash
# Supabase Configuration (for image uploads)
NEXT_PUBLIC_SUPABASE_URL=https://soqzchswjemewyskkdmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# OneChain Configuration (optional - defaults are set in lib/onelabs.ts)
NEXT_PUBLIC_RPC_URL=https://rpc-testnet.onelabs.cc:443
NEXT_PUBLIC_NETWORK=testnet
```

**Note**: 
- The `.env.local` file is already in `.gitignore` and won't be committed
- If environment variables are not set, the code will use default values for backward compatibility
- For production deployment, set these environment variables in your hosting platform (Vercel, etc.)

### Contract Configuration
Contract addresses are stored in `lib/onelabs.ts` and loaded from `deployment-info.json` if available.

**Current Deployment:**
- Package ID: `0x02c23edcb0cc861f892d22776d83e21e5b6a953c17e6b2011b5721b608c6fc64`
- Module: `animetranferprotocolnew`
- Network: OneChain OCT Testnet

---

## 📚 Documentation

### OneLabs Resources
- **RPC API**: [https://docs.onelabs.cc/RPC](https://docs.onelabs.cc/RPC)
- **SDK Guide**: [https://docs.onelabs.cc/API](https://docs.onelabs.cc/API)
- **Testnet Faucet**: [https://faucet-testnet.onelabs.cc](https://faucet-testnet.onelabs.cc)
- **Explorer**: [https://onescan.cc/testnet](https://onescan.cc/testnet)

### Move Contract Guide
- Sui Move documentation: [https://docs.sui.io/](https://docs.sui.io/)
- Smart contract in `contracts/animetranferprotocolnew.move`
- Shared objects for marketplace functionality

### Supabase
- Supabase Storage: [https://supabase.com/docs/guides/storage](https://supabase.com/docs/guides/storage)
- Image upload implementation in `lib/supabase.ts`

---

## 🛠️ Development

### Run Development Server
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
pnpm start
```

### Lint Code
```bash
pnpm lint
```

### Build Move Contract
```bash
pnpm move:build
```

---

## 🎨 UI Components

Built with **shadcn/ui** components:
- Modern, accessible components
- Dark mode support
- Responsive design
- Customizable theme

Key components:
- Navigation header with wallet integration
- NFT creation forms
- Marketplace browsing
- Dashboard with collection view
- Transaction dialogs

---

## 🔮 Roadmap

### Phase 1 (Completed) ✅
- [x] Smart contract with marketplace
- [x] Mint → List → Trade → Collect flow
- [x] Supabase image upload integration
- [x] Frontend UI with shadcn/ui
- [x] Wallet connection
- [x] Explorer link integration
- [x] Complete NFT lifecycle

### Phase 2 (Next)
- [ ] Query blockchain for actual NFT data
- [ ] Fetch marketplace listings from blockchain
- [ ] User profiles and avatars
- [ ] Enhanced search/filtering
- [ ] Activity feed
- [ ] Notification system

### Phase 3 (Future)
- [ ] Royalty distribution system
- [ ] Auction mechanism
- [ ] Offer/bidding system
- [ ] Multi-currency support
- [ ] IPFS metadata storage
- [ ] Mobile app
- [ ] Cross-chain bridge

---

## ⚠️ Current Limitations

### Testnet Only
- Deployed on OneChain testnet only
- Not production-ready
- Test tokens have no real value

### Mock Data
- Some marketplace views use mock data
- NFT collection queries need blockchain integration
- Listing IDs need to be fetched from blockchain

### Basic Features
- Fixed-price listings only
- No auction mechanism
- No offer/bidding system
- Single currency (OCT) only

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- **OneChain** for blockchain infrastructure
- **Sui Foundation** for Move language
- **Supabase** for image storage
- **shadcn/ui** for UI components
- **Anime Community** for inspiration
- **Open Source Contributors**

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Sarthak-006/onechain-anime-vault/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Sarthak-006/onechain-anime-vault/discussions)

---

## 🎯 Summary

**OneChain Anime Vault** is a complete NFT marketplace demonstrating:

1. **Mint**: Create anime merchandise NFTs with automatic image upload
2. **List**: Set price and list NFTs for sale on marketplace
3. **Trade**: Buy/sell NFTs with seamless transactions
4. **Collect**: View and manage your NFT collection

**Status**: ✅ Fully functional on testnet  
**Contract**: ✅ Deployed and verified  
**Features**: ✅ Complete NFT lifecycle implemented  
**UI**: ✅ Modern, responsive interface  

---

**Made with ❤️ for the anime community**

*Bringing anime merchandise on-chain, one NFT at a time*
