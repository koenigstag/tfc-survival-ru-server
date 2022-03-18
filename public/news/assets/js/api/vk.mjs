import { client } from './index.mjs';

export async function getNews() {
  return await client.get('/vknews');
}
