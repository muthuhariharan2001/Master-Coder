import { exec } from 'child_process';
import path from 'path';

export const runCode = (language, filepath, input) => {
  const timeoutMs = 5000;

  const commandMap = {
    cpp: `g++ ${filepath} -o ${filepath}.out && ${filepath}.out`,
    c: `gcc ${filepath} -o ${filepath}.out && ${filepath}.out`,
    python: `python ${filepath}`,
    javascript: `node ${filepath}`,
    java: `javac ${filepath} && java ${path.basename(filepath, '.java')}`,
  };

  const command = commandMap[language];

  return new Promise((resolve, reject) => {
    const process = exec(command, { timeout: timeoutMs }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });

    // Handle input if provided
    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }
  });
};
