import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import express from 'express';

import shopRoutes from './routes/shop.js';

import adminRoutes from './routes/admin.js';
import { fileURLToPath } from 'url';
import { notFoundError } from './controllers/error.js';
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use('/', notFoundError);
app.listen(3000);
