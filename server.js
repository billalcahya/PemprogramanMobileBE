require('dotenv').config({ path: './config/.env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const routes = require('./routes/index'); 

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1', routes);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Terjadi kesalahan internal server"
  });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;