const http =require('http');
function pingWebsite (url){
    const hostname = url.replace(/^https?:\/\//, '');
    console.log(`Testing ${hostname}...`);
    const startTime = Date.now();
    const req = http.get(`http://${hostname}`, (res)=>{
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`connected to ${hostname}`);
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Response time: ${responseTime} ms`);
        res.resume();
    });
    req.on('error', (err) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`Failed to connect to ${hostname}: ${err.message}`);
        console.log(`Response time: ${responseTime} ms`);
    });
    req.setTimeout(5000, () => {
        req.abort();
        const responseTime = endTime-startTime;
        console.log(`connection to ${hostname} timed out`);
        console.log(`Response time: ${responseTime} ms`);
    });
}
if(process.argv.length < 3){
    console.log('Usage: node speedTest.js  website1 website2...');
    console.log('Example: node speedTest.js google.com github.com');

} else {
   const websites = process.argv.slice(2);
   websites.forEach((site)=>{
    pingWebsite(site);
   });
}
