import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supported languages & file extensions
const languageToExtension = {
  python: "py",
  javascript: "js",
  java: "java",
  cpp: "cpp",
  c: "c",
};

const languageToFolder = {
  python: "python",
  javascript: "javascript",
  java: "java",
  cpp: "cpp",
  c: "c",
};

export const runCode = (language, code, input = "") => {
  return new Promise((resolve, reject) => {
    try {
      const lang = language.toLowerCase();
      const folder = languageToFolder[lang];
      const ext = languageToExtension[lang];

      if (!folder || !ext) return reject("❌ Unsupported language");

      const tempDir = path.join(__dirname, "..", "temp", folder);
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const filePath = path.join(tempDir, `temp.${ext}`);
      fs.writeFileSync(filePath, code, "utf-8");

      // ---------------- Compile (if needed) ----------------
      let compileCommand = "";
      let compileArgs = [];

      switch (lang) {
        case "python":
        case "javascript":
          // No compilation needed
          break;
        case "java":
          compileCommand = "javac";
          compileArgs = [filePath];
          break;
        case "cpp":
          compileCommand = "g++";
          compileArgs = [filePath, "-o", path.join(tempDir, "temp.exe")];
          break;
        case "c":
          compileCommand = "gcc";
          compileArgs = [filePath, "-o", path.join(tempDir, "temp.exe")];
          break;
      }

      const compileAndRun = () => {
        // ------------- Execution Step -------------
        let runCommand = "";
        let runArgs = [];

        switch (lang) {
          case "python":
            runCommand = "python";
            runArgs = [filePath];
            break;
          case "javascript":
            runCommand = "node";
            runArgs = [filePath];
            break;
          case "java":
            runCommand = "java";
            runArgs = ["-cp", tempDir, "temp"];
            break;
          case "cpp":
            runCommand = path.join(tempDir, "temp.exe");
            runArgs = [];
            break;
          case "c":
            runCommand = path.join(tempDir, "temp.exe");
            runArgs = [];
            break;
        }

        const runProcess = spawn(runCommand, runArgs, { timeout: 5000 });

        if (input) {
          runProcess.stdin.write(input + "\n");
          runProcess.stdin.end();
        }

        let output = "";
        let errorOutput = "";

        runProcess.stdout.on("data", (data) => (output += data.toString()));
        runProcess.stderr.on("data", (data) => (errorOutput += data.toString()));

        runProcess.on("close", (code) => {
          if (code !== 0) return reject(errorOutput || " Runtime error");
          resolve(output.trim());
        });

        runProcess.on("error", (err) => {
          return reject("Process error: " + err.message);
        });
      };

      if (compileCommand) {
        const compile = spawn(compileCommand, compileArgs, { timeout: 5000 });

        compile.on("close", (compileCode) => {
          if (compileCode !== 0) return reject(" Compilation failed");
          compileAndRun();
        });

        compile.on("error", (err) => {
          return reject(" Compilation error: " + err.message);
        });
      } else {
        compileAndRun();
      }
    } catch (err) {
      return reject(" Unexpected error: " + err.message);
    }
  });
};
