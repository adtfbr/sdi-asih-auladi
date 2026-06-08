const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace catch(err: any) with catch(err: any) and disable eslint rule
    // Or better, replace catch(err: any) { return ... err.message } with catch(err: any) // eslint-disable-line ...
    // Let's just do:
    content = content.replace(/catch\s*\(\s*([a-zA-Z0-9_]+)\s*:\s*any\s*\)\s*\{/g, 'catch ($1: unknown) {');
    
    // Then we replace error.message and err.message to (error as Error).message
    content = content.replace(/error\.message/g, '(error as Error).message');
    content = content.replace(/err\.message/g, '(err as Error).message');
    content = content.replace(/e\.message/g, '(e as Error).message');

    // Also remove unused vars like sql and count in api routes
    if (filePath.includes('api')) {
      content = content.replace(/import\s*\{\s*sql\s*\}\s*from\s*['"]@vercel\/postgres['"];?/g, '');
      content = content.replace(/,\s*count/g, '');
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${filePath}`);
    }
  }
});
