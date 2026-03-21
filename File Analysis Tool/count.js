const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

function showHelp() {
    console.log("Text File Analyzer");
    console.log("Usage: node count.js <file.txt> [options]");
    console.log("\nOptions:");
    console.log(" -h, --help     Show help message");
    console.log(" -s, --summary  Show only summary");
    console.log(" -d, --details  Show detailed counts");
    process.exit(0);
}

if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    showHelp();
}

const filePath = args[0];
const showDetail = args.includes('-d') || args.includes('--details');
const showSummary = args.includes('-s') || args.includes('--summary');

// validate file
if (!filePath.endsWith(".txt")) {
    console.log("Error: Please provide a .txt file");
    process.exit(1);
}

// check file exists
if (!fs.existsSync(filePath)) {
    console.log("Error: File does not exist");
    process.exit(1);
}

// read file
const content = fs.readFileSync(filePath, 'utf-8');

// calculations
const lines = content.split('\n').length;
const words = content.trim().split(/\s+/).length;
const characters = content.length;
const fileSize = fs.statSync(filePath).size;

// format size
function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

// output
console.log("\nFile Analysis\n");

if (showSummary) {
    console.log("File:", path.basename(filePath));
    console.log("Size:", formatBytes(fileSize));
} else {
    console.log("File:", path.basename(filePath));
    console.log("Size:", formatBytes(fileSize));
    console.log("Lines:", lines);
    console.log("Words:", words);
    console.log("Characters:", characters);
}

console.log("\nDone");