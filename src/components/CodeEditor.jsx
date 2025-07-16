"use client";
import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import executeCode from "@/app/api/frontend/CodeExecution";
import "./CodeEditor.css";

const CodeEditor = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("");
  const [version, setVersion] = useState("18.15.0");
  const [userInput, setUserInput] = useState(""); // User input state
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);

  const languageVersions = {
    javascript: "18.15.0",
    python: "3.10.0",
    cpp: "10.2.0",
    java: "15.0.2",
    c: "10.2.0",
  };

  const languages = Object.keys(languageVersions);

  useEffect(() => {
    const savedCode = localStorage.getItem(language);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [language]);

  const handleLanguageChange = (selectedLang) => {
    localStorage.setItem(language, code);

    setLanguage(selectedLang);
    setVersion(languageVersions[selectedLang]);
    setCode("");
  };

  const handleExecute = async () => {
    setOutput("");
    setIsRunning(true);
    setExecutionTime(null);
    if (!version) {
      setOutput("Error: Version is not set");
      setIsRunning(false);
      return;
    }

    const response = await executeCode(language, version, code, userInput);

    if (response.success) {
      setOutput(response.finalOutput);
      if(response.executionTime) {
        setExecutionTime(response.executionTime);
      }
    } else {
      setOutput(response.error);
      setExecutionTime(null);
    }

    localStorage.setItem(language, code);
    setIsRunning(false);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    localStorage.setItem(language, newCode);
  };

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  //   Event Code for Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        if (isRunning) return;
        setIsRunning(true);
        handleExecute(); // Call your run code function
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleExecute, language, code, userInput, version]);

  return (
    <div className="container p-6 max-w-screen-xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Hariharan's Editor
      </h2>

      {/* Top Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Language Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Version */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Version
          </label>
          <input
            type="text"
            readOnly
            value={version}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border shadow-sm dark:text-white"
          />
        </div>

        {/* Run Button */}
        <div className="flex items-end">
          <button
            onClick={handleExecute}
            disabled={isRunning}
            className={`w-full py-2 rounded-lg font-semibold shadow-md text-white transition 
        ${
          isRunning
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
          >
            {isRunning ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></span>
            ) : (
              "▶ Run Code"
            )}
          </button>
        </div>
      </div>

      {/* Code + Input Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="rounded-xl overflow-hidden shadow-md border dark:border-gray-700">
          <MonacoEditor
            height="400px"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* Input */}
        <div className="rounded-xl shadow-md border dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input to your program
          </label>
          <textarea
            value={userInput}
            onChange={handleUserInputChange}
            rows="12"
            className="w-full resize-none px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter custom input"
          ></textarea>
        </div>
      </div>

      {/* Output Section */}
      <div className="rounded-xl shadow-md border dark:border-gray-700 p-4 bg-gray-100 dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Output:
        </h3>
        <pre className="text-sm whitespace-pre-wrap break-words text-gray-800 dark:text-white">
          {output} 
        </pre>

        {executionTime !== null && (
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
             ⏱ Execution Time:{" "}
             {/* How to Convert those millseconds into seconds */}
                
                
            <span className="font-semibold">{(executionTime / 1000).toFixed(2)} seconds</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
