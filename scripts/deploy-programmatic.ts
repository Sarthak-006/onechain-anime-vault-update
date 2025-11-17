import { SuiClient } from '@onelabs/sui/client';
import { Ed25519Keypair } from '@onelabs/sui/keypairs/ed25519';
import { Transaction } from '@onelabs/sui/transactions';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Configuration
const TESTNET_URL = 'https://rpc-testnet.onelabs.cc:443';
const KEYSTORE_PATH = path.join(process.env.HOME || '~', '.sui', 'sui_config', 'sui.keystore');

async function main() {
    console.log('🚀 Deploying Anime NFT Marketplace to OneChain...');
    
    // Initialize Sui client
    const client = new SuiClient({ url: TESTNET_URL });
    console.log(`✅ Connected to OneChain testnet: ${TESTNET_URL}`);
    
    // Load keypair
    let keypair: Ed25519Keypair;
    try {
        const keystore = JSON.parse(fs.readFileSync(KEYSTORE_PATH, 'utf8'));
        if (keystore.length === 0) {
            throw new Error('No keypairs in keystore');
        }
        
        // Keystore format: Array of base64-encoded private keys
        // First byte is the scheme flag (0x00 for ed25519)
        const keyData = keystore[0];
        const decoded = Buffer.from(keyData, 'base64');
        
        // Skip first byte (scheme flag) and use remaining 32 bytes as secret key
        const secretKey = decoded.slice(1);
        keypair = Ed25519Keypair.fromSecretKey(secretKey);
        
        console.log('✅ Loaded keypair from keystore');
    } catch (error) {
        console.error('❌ Failed to load keypair:', error);
        throw error;
    }
    
    const address = keypair.getPublicKey().toSuiAddress();
    console.log(`📍 Deployer address: ${address}`);
    
    // Check for gas coins
    console.log('\n💰 Checking for gas coins...');
    const objects = await client.getOwnedObjects({
        owner: address,
        options: { showType: true, showContent: true }
    });
    
    const gasCoins = objects.data.filter(obj => 
        obj.data?.type?.includes('::oct::OCT') || 
        obj.data?.type?.includes('::sui::SUI')
    );
    
    if (gasCoins.length === 0) {
        console.error('❌ No gas coins found!');
        console.log('💡 Request OCT from: https://faucet-testnet.onelabs.cc:443');
        console.log(`💡 Your address: ${address}`);
        process.exit(1);
    }
    
    console.log(`✅ Found ${gasCoins.length} gas coin(s)`);
    
    // Build the contract
    console.log('\n🔨 Building Move contract...');
    execSync('sui move build', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit' 
    });
    
    // Read all compiled bytecode modules
    const bytecodeDir = path.join(__dirname, '../build/anime_merchandise/bytecode_modules');
    const moduleFiles = fs.readdirSync(bytecodeDir).filter(f => f.endsWith('.mv'));
    const modules = moduleFiles.map(f => 
        fs.readFileSync(path.join(bytecodeDir, f)).toString('base64')
    );
    
    console.log(`\n📦 Deploying ${modules.length} module(s)...`);
    
    // Create transaction
    const tx = new Transaction();
    
    // Set gas budget
    tx.setGasBudget(100000000); // 0.1 OCT
    
    // Publish the package with Sui framework dependency
    const [upgradeCap] = tx.publish({
        modules: modules,
        dependencies: [
            '0x0000000000000000000000000000000000000000000000000000000000000002'
        ]
    });
    
    // Transfer upgrade capability to deployer
    tx.transferObjects([upgradeCap], tx.pure.address(address));
    
    try {
        // Sign and execute
        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
            options: {
                showEffects: true,
                showObjectChanges: true,
                showEvents: true
            }
        });
        
        console.log('✅ Deployment successful!');
        console.log(`📦 Transaction digest: ${result.digest}`);
        
        // Try to get package ID from immediate result first
        let packageId = (result as any).objectChanges?.find(
            (change: any) => change.type === 'published'
        )?.packageId;
        
        // Wait for transaction to be finalized and get full details
        console.log('⏳ Waiting for transaction to be finalized...');
        const finalResult = await client.waitForTransaction({
            digest: result.digest,
            options: {
                showEffects: true,
                showObjectChanges: true,
                showEvents: true,
            }
        });
        
        // Try to get package ID from final result if not found in immediate result
        if (!packageId) {
            packageId = finalResult.objectChanges?.find(
                (change: any) => change.type === 'published'
            )?.packageId;
        }
        
        // Alternative: Check if packageId is directly in the result
        if (!packageId && (result as any).packageId) {
            packageId = (result as any).packageId;
        }
        if (!packageId && (finalResult as any).packageId) {
            packageId = (finalResult as any).packageId;
        }
        
        // Last resort: try to query the transaction block directly
        if (!packageId) {
            try {
                const txDetails = await client.getTransactionBlock({
                    digest: result.digest,
                    options: {
                        showEffects: true,
                        showObjectChanges: true,
                    }
                });
                
                packageId = txDetails.objectChanges?.find(
                    (change: any) => change.type === 'published'
                )?.packageId;
                
                // Also check if it's in the transaction data itself
                if (!packageId && (txDetails as any).packageId) {
                    packageId = (txDetails as any).packageId;
                }
            } catch (e) {
                console.warn('Could not query transaction details:', e);
            }
        }
        
        if (!packageId) {
            console.error('\n❌ Could not find Package ID. Debugging info:');
            console.error('Transaction digest:', result.digest);
            console.error('Immediate result objectChanges:', (result as any).objectChanges?.length || 0);
            console.error('Final result objectChanges:', finalResult.objectChanges?.length || 0);
            if (finalResult.objectChanges && finalResult.objectChanges.length > 0) {
                console.error('Final result objectChanges:', JSON.stringify(finalResult.objectChanges, null, 2));
            }
            if ((result as any).objectChanges && (result as any).objectChanges.length > 0) {
                console.error('Immediate result objectChanges:', JSON.stringify((result as any).objectChanges, null, 2));
            }
            console.error('\n💡 You can manually extract the Package ID from the transaction:');
            console.error(`   https://explorer.testnet.onelabs.cc/txblock/${result.digest}`);
            throw new Error('Package ID not found in deployment result. Check the transaction on the explorer or try again.');
        }
        
        console.log(`🏗️  Package ID: ${packageId}`);
        
        // Find marketplace objects created by init function
        // Try both immediate and final results
        let marketplaceObj = (result as any).objectChanges?.find((obj: any) => 
            obj.type === 'created' && obj.objectType?.includes('Marketplace') && !obj.objectType?.includes('Cap')
        );
        let capObj = (result as any).objectChanges?.find((obj: any) => 
            obj.type === 'created' && obj.objectType?.includes('MarketplaceCap')
        );
        
        if (!marketplaceObj) {
            marketplaceObj = finalResult.objectChanges?.find((obj: any) => 
                obj.type === 'created' && obj.objectType?.includes('Marketplace') && !obj.objectType?.includes('Cap')
            );
        }
        if (!capObj) {
            capObj = finalResult.objectChanges?.find((obj: any) => 
                obj.type === 'created' && obj.objectType?.includes('MarketplaceCap')
            );
        }
        
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
        
        console.log('\n🎉 Deployment completed successfully!');
        console.log('🌟 Your Anime NFT Marketplace is now live on OneChain testnet!');
        console.log('\n📋 Next steps:');
        console.log('   1. Run: pnpm run test:lifecycle');
        console.log('   2. Check proof-pack.json for verification details');
        
    } catch (error: any) {
        console.error('\n❌ Deployment failed:', error.message || error);
        if (error.cause) {
            console.error('\nError details:', JSON.stringify(error.cause, null, 2));
        }
        throw error;
    }
}

main().catch((error) => {
    console.error('\n💥 Fatal error');
    process.exit(1);
});

