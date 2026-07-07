import cors from 'cors';
import express from 'express';
import { hazardsRouter } from './routes/hazards.js';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'roadsense-ai-backend' });
});

app.use('/api/hazards', hazardsRouter);

app.listen(port, () => {
  console.log(`RoadSense API running on http://localhost:${port}`);
});
