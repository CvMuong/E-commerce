import app from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.log(`API ready at http://localhost:${env.PORT}`);
});
