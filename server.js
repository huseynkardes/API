const express = require('express');
const mssql = require('mssql');

const app = express();
const port = 3030;

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


// MSSQL bağlantı bilgileri
const config = {
  user: 'patasana_test',
  password: 'test2019',
  server: '212.115.42.38',
  port: 1433,
  database: 'sql_patasana_db',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// MSSQL'e bağlanma fonksiyonu
async function connectToDatabase() {
  try {
    await mssql.connect(config);
    console.log('SQL Server veritabanına başarıyla bağlanıldı.');
  } catch (err) {
    console.error('SQL Server veritabanına bağlanırken hata oluştu:', err);
  }
}

// Verileri getiren API endpoint'i
app.get('/api/data', async (req, res) => {
  try {
    const result = await mssql.query`SELECT * FROM Alesta_Yacht_Datas order by ID`;
    res.json(result.recordset);
  
  } catch (err) {
    console.error('Verileri getirirken bir hata oluştu:', err);
    res.status(500).json({ error: 'Verileri alırken bir hata oluştu',details: err.message });
  }
});

//ID ye göre verileri listeler
  app.get('/api/data/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const result = await mssql.query`SELECT * FROM Alesta_Yacht_Datas where ID=${id} order by ID`;
      res.json(result.recordset);
    
    } catch (err) {
      console.error('Verileri getirirken bir hata oluştu:', err);
      res.status(500).json({ error: 'Verileri alırken bir hata oluştu',details: err.message });
    }
  });


// Server'ı başlatma
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
  connectToDatabase();
});
