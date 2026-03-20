const { log } = require('console')
const http = require('http')
const os = require('os')
const process = require('process')
const url = require('url')

function formatBytes(bytes, decimal=2){
    if(bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimal < 0 ? 0 : decimal
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function formatTime(seconds){
    const days = Math.floor(seconds/(3600*24))
    const hours = Math.floor((seconds % (3600*24)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${days}d ${hours}h ${minutes}m ${secs}s`
}

//console.log(os.cpus()[0]);
// get cpu info
const getCpuInfo=()=>{
    const model = os.cpus()[0].model
    const cores = os.cpus().length
    const architecture = os.arch();
    const loadAvg = os.loadavg();
    //console.log(model);
   return {
        model,
        cores,
        architecture,
        loadAvg
    }
}
 //console.log(getCpuInfo());

 const getMemoryInfo=()=>{
    const total = formatBytes(os.totalmem())
    const free = formatBytes(os.freemem())
    const usage = formatBytes(os.totalmem() - os.freemem())

    return {
        total,
        free,
        usage
    }
}
const getOsInfo=()=>{
    const platform = os.platform();
    console.log(platform);
    const type = os.type();
    const release = os.release();
    const hostname = os.hostname();
    const uptime = formatTime(os.uptime());
    return{
        platform,
        type,
        release,
        hostname,
        uptime
    }
};


const getUserInfo=()=>{
    const user =os.userInfo();
    return user;
};

const getNetworkInfo=()=>{
    const network = os.networkInterfaces();
    return network;
};

const getProcessInfo=()=>{
    const pid = process.pid;
    const title = process.title;
    const nodeVersion =process.version;
    const uptime = formatTime(process.uptime());
    return {
        pid,
        title,
        nodeVersion,
        uptime,
    

    memoryUsage : {
        rss: formatBytes(process.memoryUsage().rss),
        heapTotal: formatBytes(process.memoryUsage().heapTotal),
        heapUsed: formatBytes(process.memoryUsage().heapUsed),
        external: formatBytes(process.memoryUsage().external),
    },
    env:{
        NODE_ENV: process.env.NODE_ENV || 'Not set',
    }
}
};

const server = http.createServer((req, res)=>{
    const parsedUrl = url.parse(req.url, true);
    res.setHeader("Content-Type", "application/json");
    if(parsedUrl.pathname==='/'){
        res.statusCode = 200;
        res.end(JSON.stringify({
            name: "System View API",
            description: "API to get system information",
            routes: ['/cpu','/memory','/os','/user','/network','/process']
        }));
    }else if (parsedUrl.pathname === '/cpu'){
        res.end(JSON.stringify(getCpuInfo(),null,2));
    }else if (parsedUrl.pathname === '/memory'){
        res.end(JSON.stringify(getMemoryInfo(),null,2));
    }else if (parsedUrl.pathname === '/os'){
        res.end(JSON.stringify(getOsInfo(),null,2));
    }else if (parsedUrl.pathname === '/user'){
        res.end(JSON.stringify(getUserInfo(),null,2));
    }else if (parsedUrl.pathname === '/network'){
        res.end(JSON.stringify(getNetworkInfo(),null,2));
    }else if (parsedUrl.pathname === '/process'){
        res.end(JSON.stringify(getProcessInfo(),null,2));
    }else{
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Route not found" }));
    }
});
const PORT =3000;
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});