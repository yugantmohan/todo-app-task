// test-server.ts
import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/auth/signup', (req, res) => {
  console.log('✅ Signup route hit!');
  res.status(200).json({ message: 'Signup worked!' });
});

app.listen(5000, () => console.log('✅ Test server running on port 5000'));
