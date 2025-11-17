import { SuiClient } from '@onelabs/sui/client';
import { Ed25519Keypair } from '@onelabs/sui/keypairs/ed25519';
import { fromB64, toB64 } from '@onelabs/sui/utils';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Configuration
const TESTNET_URL = 'https://rpc-testnet.onelabs.cc:443';
const KEYSTORE_PATH = path.join(process.env.HOME || '~', '.sui', 'sui_config', 'sui.keystore');
const CLIENT_YAML_PATH = path.join(process.env.HOME || '~', '.sui', 'sui_config', 'client.yaml');

async function main() {
    console.log('🚀 Starting deployment of Anime Merchandise Tokenization Platform...');
    
    // Initialize Sui client
    const client = new SuiClient({ url: TESTNET_URL });
    console.log(`✅ Connected to OneChain testnet: ${TESTNET_URL}`);
    
    // Setup Sui CLI config
    setupSuiConfig();
    
    // Get active address from Sui CLI
    let address: string;
    try {
        address = execSync('sui client active-address', { encoding: 'utf8' }).trim();
        console.log(`📍 Deployer address: ${address}`);
    } catch (error) {
        console.error('❌ Failed to get active address from Sui CLI');
        console.log('💡 Make sure you have run: sui client new-address ed25519');
        throw error;
    }
    
    // Check balance
    try {
        const balance = await client.getBalance({
            owner: address,
            coinType: '0x2::sui::SUI'
        });
        console.log(`💰 Balance: ${balance.totalBalance} MIST (OCT)`);
        
        // If balance is 0 but we're deploying, check if coins actually exist
        if (parseInt(balance.totalBalance) === 0) {
            console.log('⚠️  Balance shows 0, checking for gas coins...');
            try {
                const objects = await client.getOwnedObjects({
                    owner: address,
                    options: { showType: true }
                });
                const gasCoins = objects.data.filter(obj => 
                    obj.data?.type?.includes('::coin::Coin')
                );
                if (gasCoins.length > 0) {
                    console.log(`✅ Found ${gasCoins.length} gas coin(s), proceeding with deployment`);
                } else {
                    console.log('❌ No gas coins found. You need OCT for deployment.');
                    console.log('💡 Request OCT from faucet: https://faucet-testnet.onelabs.cc:443');
                    console.log(`💡 Your address: ${address}`);
                    process.exit(1);
                }
            } catch (objError) {
                console.log('⚠️  Could not verify gas coins, attempting deployment anyway...');
            }
        }
    } catch (error) {
        console.log('⚠️  Could not fetch balance, proceeding with deployment...');
    }
    
    // Build the Move package
    console.log('\n🔨 Building Move contract...');
    try {
        execSync('sui move build', { 
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit' 
        });
        console.log('✅ Contract built successfully!');
    } catch (buildError) {
        console.error('❌ Build failed');
        throw buildError;
    }
    
    // Deploy using Sui CLI
    console.log('\n📦 Deploying smart contract using Sui CLI...');
    try {
        const output = execSync('sui client publish --gas-budget 100000000 --json', {
            cwd: path.join(__dirname, '..'),
            encoding: 'utf8'
        });
        
        const result = JSON.parse(output);
        console.log('✅ Deployment successful!');
        console.log(`📦 Transaction digest: ${result.digest}`);
        
        // Extract package ID from object changes
        const packageId = result.objectChanges?.find((change: any) => 
            change.type === 'published'
        )?.packageId;
        
        if (!packageId) {
            throw new Error('Package ID not found in deployment result');
        }
        
        console.log(`🏗️  Package ID: ${packageId}`);
        
        // The marketplace should be automatically created by the init function
        // Find the created marketplace objects
        const marketplaceObj = result.objectChanges?.find((obj: any) => 
            obj.type === 'created' && obj.objectType?.includes('Marketplace') && !obj.objectType?.includes('Cap')
        );
        const capObj = result.objectChanges?.find((obj: any) => 
            obj.type === 'created' && obj.objectType?.includes('MarketplaceCap')
        );
        
        // Save deployment info
        const deploymentInfo = {
            packageId,
            marketplaceId: marketplaceObj?.objectId || '',
            marketplaceCapId: capObj?.objectId || '',
            deploymentTx: result.digest,
            deployerAddress: address,
            network: 'testnet',
            rpcUrl: TESTNET_URL,
            deployedAt: new Date().toISOString()
        };
        
        fs.writeFileSync(
            path.join(__dirname, '../deployment-info.json'),
            JSON.stringify(deploymentInfo, null, 2)
        );
        
        console.log('\n📄 Deployment info saved to deployment-info.json');
        console.log(`🏪 Marketplace ID: ${deploymentInfo.marketplaceId}`);
        console.log(`🔑 Marketplace Cap ID: ${deploymentInfo.marketplaceCapId}`);
        
    } catch (error: any) {
        if (error.message?.includes('Insufficient funds')) {
            console.error('❌ Insufficient funds for deployment');
            console.log('💡 Request more OCT from faucet: https://faucet-testnet.onelabs.cc:443');
        } else {
            console.error('❌ Deployment failed:', error.message || error);
        }
        throw error;
    }
}

function setupSuiConfig() {
    console.log('\n⚙️  Setting up Sui CLI configuration...');
    
    // Ensure config directory exists
    const configDir = path.dirname(KEYSTORE_PATH);
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    
    // Create client.yaml if it doesn't exist
    if (!fs.existsSync(CLIENT_YAML_PATH)) {
        console.log('📝 Creating Sui client configuration...');
        const clientConfig = `---
keystore:
  File: ${KEYSTORE_PATH}
envs:
  - alias: onechain-testnet
    rpc: "${TESTNET_URL}"
    ws: ~
active_env: onechain-testnet
active_address: ~
`;
        fs.writeFileSync(CLIENT_YAML_PATH, clientConfig);
        console.log('✅ Created client.yaml');
    }
    
    // Create empty keystore if it doesn't exist
    if (!fs.existsSync(KEYSTORE_PATH)) {
        console.log('📝 Creating keystore...');
        fs.writeFileSync(KEYSTORE_PATH, '[]');
    }
    
    // Create new address
    try {
        const existingKeystore = JSON.parse(fs.readFileSync(KEYSTORE_PATH, 'utf8'));
        if (existingKeystore.length === 0) {
            console.log('📝 Generating new keypair...');
            // Use echo to provide automatic "y" answer
            execSync('echo "y" | sui client new-address ed25519', { 
                stdio: ['pipe', 'inherit', 'inherit'],
                shell: '/bin/bash'
            });
            console.log('✅ New address created');
        } else {
            console.log('✅ Using existing keystore');
        }
    } catch (error) {
        console.log('⚠️  Continuing with setup...');
    }
}

// Run deployment
main()
    .then(() => {
        console.log('\n🎉 Deployment completed successfully!');
        console.log('🌟 Your Anime Merchandise Tokenization Platform is now live on OneChain testnet!');
        console.log('\n📋 Next steps:');
        console.log('   1. Run: pnpm run test:lifecycle');
        console.log('   2. Check proof-pack.json for verification details');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Deployment failed');
        process.exit(1);
    });
