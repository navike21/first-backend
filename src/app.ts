import { PORT } from './constants/environments';
import { app } from './config/app';
import { corsConfig } from './config/cors';

corsConfig();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
