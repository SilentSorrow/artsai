require('dotenv').config();
import 'reflect-metadata';
import { Application } from './app';

(async () => {
  const app = new Application();
  try {
    await app.start();
    app.listen();
  } catch (e) {
    console.log('crashed', e);
  }
})();
