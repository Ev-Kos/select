import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

function createdOptions(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    name: `${i + 1}`,
    value: `${i + 1}`
  }));
}

app.get('/options/for/select', (_req, res: Response) => {
  const options = createdOptions(1000);
  res.json(options);
});

app.post('/selected/option', (req: Request, res: Response) => {
  try {
    const { value } = req.body;
    
    if (!value) {
      res.status(400).json({ error: 'Value is required' });
      return
    }
    
    const valueNumber = Number(value);
    if (isNaN(valueNumber) || valueNumber < 1 || valueNumber > 1000) {
      res.status(400).json({ 
        error: 'Value must be a number between 1 and 1000' 
      });
      return
    }
    
    res.json({
      message: `Выбранная опция ${value} успешно принята.`
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
