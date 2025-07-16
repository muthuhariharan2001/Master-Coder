import axios from "axios";

const executeCode = async (language, version, code, input = "") => {
  try {
    const response = await axios.post("/api/execute",
      {
        language,
        version,
        code,
        input,
      });

    return response.data;
  } catch (error) {
    console.error("Code Execution Error:", error);
    return {
      success: false,
      error:
        error.response?.data?.error || "Execution failed. Please try again.",
    };
  }
};

export default executeCode;
