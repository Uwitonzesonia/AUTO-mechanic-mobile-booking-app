const fs = require('fs');
const path = require('path');

const procPath = path.join(__dirname, '..', 'node_modules', 'native-sim', 'src', 'lib', 'proc.js');
const ghPath = path.join(__dirname, '..', 'node_modules', 'native-sim', 'src', 'lib', 'gh.js');

if (fs.existsSync(procPath)) {
  let content = fs.readFileSync(procPath, 'utf8');
  if (content.includes("sh('which', [cmd]).ok")) {
    content = content.replace(
      "sh('which', [cmd]).ok",
      "(process.platform === 'win32' ? sh('where', [cmd]).ok : sh('which', [cmd]).ok)"
    );
  }
  if (!content.includes("process.platform === 'win32' ? 'start' : 'open'")) {
    content = content.replace(
      "spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();",
      "if (process.platform === 'win32') { spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref(); } else { spawn('open', [url], { detached: true, stdio: 'ignore' }).unref(); }"
    );
  }
  fs.writeFileSync(procPath, content, 'utf8');
}

if (fs.existsSync(ghPath)) {
  let content = fs.readFileSync(ghPath, 'utf8');
  if (!content.includes("import { sh, shx, has }")) {
    content = content.replace("import { sh, shx }", "import { sh, shx, has }");
  }
  if (content.includes("!sh('which', ['gh']).ok")) {
    content = content.replace("!sh('which', ['gh']).ok", "!has('gh')");
  }
  fs.writeFileSync(ghPath, content, 'utf8');
}
