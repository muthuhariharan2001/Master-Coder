import axios from "axios";
import connectMongoDB from "@/lib/mongodb";
import Code from "@/models/Code";

import dns from "dns/promises";

export async function POST(req) {
  try {
    try {
      await dns.lookup("emkc.org");
    } catch (err) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Check internet/DNS., Unable to connect to the code execution service.",
        }),
        { status: 503 }
      );
    }
    const { language, version, code, input = "" } = await req.json();

    console.log("Request received:", { language, version, code, input });

    if (!language || !version || !code || typeof code !== "string") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing or invalid language, version, or code",
        }),
        { status: 400 }
      );
    }

    const fileExtension =
      {
        javascript: "js",
        python: "py",
        cpp: "cpp",
        java: "java",
        go: "go",
        c: "c",
        sqlite3: "sql",
      }[language] || "txt";

    const startTime = Date.now();

    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language,
        version,
        stdin: input,
        files: [
          {
            name: `main.${fileExtension}`,
            content: code,
          },
        ],
      }
    );
    const { output, stdout, stderr } = response.data.run;
    const finalOutput = output || stdout || stderr || "No output received.";
    const executionTime = Date.now() - startTime;

    await connectMongoDB(); // Ensure DB connection before saving

    const savedCode = new Code({
      language,
      version,
      code,
      input,
      finalOutput,
      executionTime,
      createdAt: new Date(),
    });

    await savedCode.save();

    return new Response(
      JSON.stringify({
        success: true,
        finalOutput,
        executionTime,
        
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Execution Error:", error.response?.data || error.message);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.response?.data?.message || "Code execution failed",
      }),
      { status: 500 }
    );
  }
}
