const http = require('http');

const server = http.createServer((req, res)=> {
    if(req.method === 'GET' && req.url === '/ping') {
        res.writeHead(200, {'Content-Type':'application/json'} );
        res.end(JSON.stringify({message: 'pong'}));
    } else if(req.method === 'GET' && req.url === '/users') {
        const users = [
            {id: 1, name: 'Alice'},
            {id: 2, name: 'Bob'},
            {id: 3, name: 'Charlie'}
        ];

        res.writeHead(200, {'Content-Type':'application/json'} );
        res.end(JSON.stringify(users));
    } else if (req.method === 'POST' && req.url === '/users') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        })

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                res.writeHead(201, {'Content-Type':'application/json'} );
                res.end(JSON.stringify({message: 'User created successfully', user: data}));
            } catch (error) {
                res.writeHead(400, {'Content-Type':'application/json'} );
                res.end(JSON.stringify({message: 'Invalid JSON'}));
            }
        })

    } else {
        res.writeHead(404, {'Content-Type':'application/json'} );
        res.end(JSON.stringify({message: 'Not Found'}));
    }
})

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
})