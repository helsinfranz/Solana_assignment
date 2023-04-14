import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint , getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

(async () => {
    // Step 1: Connect to cluster and generate a new Keypair
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const symbol = "INR";
    const fromWallet = Keypair.generate();
    console.log(fromWallet.publicKey.toBase58());
    console.log(fromWallet.secretKey);
    //GENARATE THE TO WALLET USING THE SOLANA WALLET GENERATOR USING PublicKey

    const toWallet = Keypair.generate();
    console.log(toWallet.publicKey.toBase58());
    console.log(toWallet.secretKey);
    // const from_secret_key = new Uint8Array(
    //     [
    //         168,  97, 203, 242,   8, 104, 161,  59, 153, 205,  74,
    //          13,  69,  45,  40, 108, 248,  42, 136, 116, 197, 213,
    //         241,  62,   0, 157,  49,  99, 222, 150, 252, 101, 177,
    //          92,  55,  98, 235, 204, 195,  71, 109, 121, 176,  80,
    //         192, 204,  21, 252, 132, 199,  88, 173, 133, 116, 201,
    //          56, 141, 138, 166,   5, 146, 245,  56, 181
    //       ]         
    // );
    // const to_secret_key = new Uint8Array(
    //     [
    //         251, 112,  12,  87,  40, 118, 184, 209,  22, 100, 209,
    //         246,  77, 189,  74,  11,  60, 128, 248,  30,  99, 147,
    //         236, 159, 147,  38,  83, 129,  87,  59,  73, 181, 129,
    //         131,  79, 107, 127,  82,  58, 154,  44,   0,  51, 135,
    //         201,  85, 235, 133, 232, 153, 231, 189,  17, 159,  86,
    //          17,   3,  77,  70, 240,  93,  76, 230, 172
    //     ]      
    // );
    // var fromWallet = Keypair.fromSecretKey(from_secret_key);  
    // var toWallet = Keypair.fromSecretKey(to_secret_key);

    console.log("Step 1 complete");
    // Step 2: Airdrop SOL into your from wallet
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
    console.log(fromAirdropSignature);
    await connection.confirmTransaction(fromAirdropSignature, { commitment: "confirmed" });

    console.log("Step 2 complete");

    // Step 3: Create new token mint and get the token account of the fromWallet address
    // If the token account does not exist, create it
    const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    )
    
    console.log("Step 3 complete");

    //Step 4: Mint a new token to the from account
    let signature = await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        100000000000,
        []
    );
    console.log('mint tx:', signature);

    console.log("Step 4 complete");

    //Step 5: Get the token account of the to-wallet address and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        toWallet.publicKey
    )

    console.log("Step 5 complete");

    //Step 6: Transfer the new token to the to-wallet's token account that was just created
    // Transfer the new token to the "toTokenAccount" we just created
    signature = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        10000000000,
        []
    );
    console.log('transfer tx:', signature);
    console.log("Step 6 complete");
})();