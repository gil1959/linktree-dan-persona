'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\x1b[32m
 ██████╗ ███████╗████████╗██████╗  ██████╗ 
 ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗
 ██████╔╝█████╗     ██║   ██████╔╝██║   ██║
 ██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║
 ██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝
 ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ 
\x1b[0m
 \x1b[36m► INSERT COIN TO CONTINUE\x1b[0m
 \x1b[33m► Server running at \x1b[1mhttp://localhost:${PORT}\x1b[0m
 \x1b[90m► Press Ctrl+C to quit\x1b[0m
`);
});
