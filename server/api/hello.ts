import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  return { message: 'Hello World from Nuxt Backend' };
}); 