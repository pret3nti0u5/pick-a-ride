import databaseMiddleware from '@/utils/mongo';
import nextConnect from 'next-connect';

export function createHandler(...middleware) {
  return nextConnect().use(databaseMiddleware, ...middleware);
}
