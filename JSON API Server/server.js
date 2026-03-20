const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const usersDataPath = path.join(__dirname, 'data', 'users.json');
const postsDataPath = path.join(__dirname, 'data', 'posts.json');

// READ FILE
function readJSONFile(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
        console.error(error);
        return null;
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // -------- STATUS --------
    if (pathname === '/status' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Server running ' }));
    }

    // -------- USERS --------
    if (pathname.startsWith('/users') && method === 'GET') {
        const usersData = readJSONFile(usersDataPath);

        // GET ALL USERS
        if (pathname === '/users') {
            return res.end(JSON.stringify(usersData));
        }

        // GET USER BY ID → /users/1
        if (pathname.split('/').length === 3) {
            const id = parseInt(pathname.split('/')[2]);
            const user = usersData.users.find(u => u.id === id);

            if (user) return res.end(JSON.stringify(user));
            return res.end(JSON.stringify({ error: 'User not found' }));
        }
    }

    // -------- POSTS --------
    if (pathname.startsWith('/posts') && method === 'GET') {
        const postsData = readJSONFile(postsDataPath);

        // GET POSTS BY USER → /posts?userId=1
        if (pathname === '/posts' && parsedUrl.query.userId) {
            const userId = parseInt(parsedUrl.query.userId);
            const userPosts = postsData.posts.filter(p => p.userId === userId);

            return res.end(JSON.stringify(userPosts));
        }

        // GET ALL POSTS
        if (pathname === '/posts') {
            return res.end(JSON.stringify(postsData));
        }

        // GET POST BY ID → /posts/1
        if (pathname.split('/').length === 3) {
            const id = parseInt(pathname.split('/')[2]);
            const post = postsData.posts.find(p => p.id === id);

            if (post) return res.end(JSON.stringify(post));
            return res.end(JSON.stringify({ error: 'Post not found' }));
        }
    }

    // -------- NOT FOUND --------
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});