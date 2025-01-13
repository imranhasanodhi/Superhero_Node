const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const dataFilePath = path.join(__dirname, 'Hasan_Imran_superheroes.json');
const publicDir = path.join(__dirname); 

// Helper to serve static files
const serveStaticFile = (filePath, contentType, res) => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>Error: Page Not Found</h1>');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
};

// Create the server
http
  .createServer((req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(publicDir, url);

    // Handle serving static files
    if (req.method === 'GET' && url.endsWith('.html')) {
      serveStaticFile(filePath, 'text/html', res);
    } else if (req.method === 'GET' && url.endsWith('.css')) {
      serveStaticFile(filePath, 'text/css', res);
    } else if (req.method === 'GET' && url.endsWith('.js')) {
      serveStaticFile(filePath, 'application/javascript', res);
    } else if (req.method === 'GET' && url === '/superheroes') {
      const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } else if (req.method === 'GET' && url.startsWith('/superheroes/')) {
      // Get superhero by heroID
      const heroID = parseInt(url.split('/')[2]);
      const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      const hero = data.find(h => h.heroID === heroID);

      if (hero) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(hero));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Superhero not found' }));
      }
    } else if (req.method === 'DELETE' && url.startsWith('/superheroes/')) {
      // Delete superhero by heroID
      const heroID = parseInt(url.split('/')[2]);
      const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      const index = data.findIndex(h => h.heroID === heroID);

      if (index !== -1) {
        data.splice(index, 1);  // Remove the superhero from the array
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));  // Save the updated array

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Superhero with ID ${heroID} deleted successfully!` }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Superhero not found' }));
      }
    } else if (req.method === 'POST' && url === '/superheroes') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        const hero = JSON.parse(body);
        const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
        data.push(hero);
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(hero));
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>Error: Page Not Found</h1>');
    }
  })
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
