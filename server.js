const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const courses = [
  {
    id: 1,
    title: 'Web Development for Beginners',
    description: 'Learn HTML, CSS, and JavaScript to build modern websites.',
    duration: '4 Weeks',
    price: '৳ 2,500'
  },
  {
    id: 2,
    title: 'Data Structures & Algorithms',
    description: 'Strengthen your logical thinking and problem-solving skills.',
    duration: '6 Weeks',
    price: '৳ 3,000'
  },
  {
    id: 3,
    title: 'Backend with Node.js',
    description: 'Build APIs and connect your frontend to real server logic.',
    duration: '5 Weeks',
    price: '৳ 3,500'
  },
  {
    id: 4,
    title: 'Computer Fundamentals',
    description: 'Understand computer basics, hardware, software, and digital systems.',
    duration: '3 Weeks',
    price: '৳ 2,000'
  },
  {
    id: 5,
    title: 'Introduction to Programming with C',
    description: 'Learn the basics of coding, logic, and problem solving using C.',
    duration: '5 Weeks',
    price: '৳ 2,800'
  }
];

const enrollments = [];
const students = [];

const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;

  if (req.method === 'GET' && url === '/api/courses') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(courses));
    return;
  }

  if (req.method === 'POST' && url === '/api/enroll') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        enrollments.push(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: `Enrollment received for ${data.name}` }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid enrollment data' }));
      }
    });
    return;
  }

  if (req.method === 'POST' && url === '/api/signup') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        students.push(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: `Welcome ${data.fullName}! Your account is ready.` }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid signup data' }));
      }
    });
    return;
  }

  if (req.method === 'POST' && url === '/api/login') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const student = students.find(s => s.email === data.email && s.password === data.password);
        if (student) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: `Login successful for ${student.fullName}` }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid email or password' }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid login data' }));
      }
    });
    return;
  }

  const ext = path.extname(url);
  let contentType = 'text/html';

  switch (ext) {
    case '.css': contentType = 'text/css'; break;
    case '.js': contentType = 'application/javascript'; break;
    case '.json': contentType = 'application/json'; break;
    case '.png': contentType = 'image/png'; break;
    case '.jpg': case '.jpeg': contentType = 'image/jpeg'; break;
    case '.svg': contentType = 'image/svg+xml'; break;
  }

  const filePath = path.join(__dirname, url);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - Page Not Found</h1>');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
