#!/usr/bin/env tsx
/**
 * Check OCT Balance on OneChain Testnet
 * Usage: npx tsx scripts/check-balance.ts [ADDRESS]
 */

const RPC_URL = 'https://rpc-testnet.onelabs.cc:443';

async function checkBalance(address: string) {
    console.log('🔍 Checking balance on OneChain OCT Testnet...\n');
    console.log(`📍 Address: ${address}\n`);

    try {
        // Try multiple RPC methods since OneChain might use different methods
        let response = await fetch(RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'suix_getBalance',
                params: [address]
            })
        });
        
        // If that fails, try the old method
        if (!response.ok) {
            response = await fetch(RPC_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'sui_getBalance',
                    params: [address, '0x2::sui::SUI']
                })
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error('❌ Error:', data.error.message);
            return;
        }

        const balance = data.result?.totalBalance || '0';
        const balanceInOCT = (parseInt(balance) / 1_000_000_000).toFixed(4);

        console.log('💰 Balance Details:');
        console.log(`   - Total: ${balance} MIST`);
        console.log(`   - Total: ${balanceInOCT} OCT\n`);

        if (parseInt(balance) === 0) {
            console.log('⚠️  Zero balance! You need OCT tokens for deployment.\n');
            console.log('🚰 Request tokens from faucet:');
            console.log('   https://faucet-testnet.onelabs.cc:443\n');
            console.log('   Or use curl:');
            console.log(`   curl -X POST https://faucet-testnet.onelabs.cc:443/gas \\`);
            console.log(`     -H "Content-Type: application/json" \\`);
            console.log(`     -d '{"FixedAmountRequest":{"recipient":"${address}"}}'`);
        } else if (parseInt(balance) < 100_000_000) {
            console.log('⚠️  Low balance! Consider requesting more OCT.');
        } else {
            console.log('✅ Sufficient balance for deployment!');
        }

    } catch (error) {
        console.error('❌ Failed to check balance:', error);
        console.log('\n💡 Make sure you have network access and the RPC is available.');
    }
}

// Get address from command line or use saved keypair address
const address = process.argv[2] || '0xeb753989603c2bf0e2cf481b07de3e79fbd1e6c4c33f4d6f00d8ad5037ab5ccb';

checkBalance(address);

