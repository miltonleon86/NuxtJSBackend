import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {  
  return { 
    message: 'Hello World from Nuxt Backend'
  };
}); 