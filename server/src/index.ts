import 'dotenv/config';
import app from './app';
import { ensureDemoData } from './utils/demoUser';

const port = Number(process.env.PORT || 4000);

void ensureDemoData()
  .catch((error) => {
    console.error('Unable to bootstrap demo data:', error);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  });
