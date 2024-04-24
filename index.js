import 'dotenv/config';
import express from 'express';
import initApp from './src/modules/app.router.js';
import { createPdf } from './src/services/pdf.js';
const app = express();
const PORT = process.env.PORT || 3000;
initApp(app, express);

createPdf();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
