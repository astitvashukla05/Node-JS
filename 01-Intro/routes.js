import fs from 'fs';
export const reqHandler = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  let url = req.url;
  if (url === '/') {
    res.write(
      '<form action="/message" method="POST"><input name="message" type="text"/><button type="submit">Send</button></form>'
    );
    return res.end();
  }
  if (url === '/message' && req.method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1].split('+').join(',');
      fs.writeFile('message.txt', message, (err) => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }
};
