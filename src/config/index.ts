import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  nftContractAddress: process.env.NFT_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  blockchainNetwork: process.env.BLOCKCHAIN_NETWORK || 'ethereum',
  federationApiUrl: process.env.FEDERATION_API_URL || 'https://api.galacticfederation.example.com',
  federationApiKey: process.env.FEDERATION_API_KEY || ''
};
