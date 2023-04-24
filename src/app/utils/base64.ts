import { Buffer } from 'buffer';

export const encode = (str: string): string => Buffer.from(str, 'binary').toString('base64');

export const decode = (str: string, encoding?: BufferEncoding) => Buffer.from(str, 'base64').toString(encoding);
