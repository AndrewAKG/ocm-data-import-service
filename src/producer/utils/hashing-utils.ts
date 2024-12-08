import crypto from 'crypto';

export const generateDataHash = (data: object, hashingAlgorithm: string): string => {
  return crypto.createHash(hashingAlgorithm).update(JSON.stringify(data)).digest('hex');
};
