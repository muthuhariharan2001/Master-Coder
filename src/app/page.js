'use client';
import React from "react";
import CodeEditor from "@/components/CodeEditor";

const EditorPage = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <CodeEditor />
    </main>
  );
};

export default EditorPage;
