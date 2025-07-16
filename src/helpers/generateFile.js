import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateFile = (language, code) => {
  const dirPath = path.join(__dirname, '..', 'temp');

  // Create temp directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const extensionMap = {
    cpp: 'cpp',
    c: 'c',
    python: 'py',
    javascript: 'js',
    java: 'java',
  };

  const fileExtension = extensionMap[language] || 'txt';
  const filename = `${uuid()}.${fileExtension}`;
  const filepath = path.join(dirPath, filename);

  fs.writeFileSync(filepath, code);

  return filepath;
};
