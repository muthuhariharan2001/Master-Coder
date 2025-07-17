
import { runCode } from '@/services/codeRunner';

export async function POST(req) {
  try {
    const { language, code, input = "" } = await req.json();

    if (!language || !code) {
      return new Response(
        JSON.stringify({ success: false, message: "Language and code are required." }),
        { status: 400 }
      );
    }

    const finalOutput = await runCode(language, code, input);

    return new Response(JSON.stringify({ success: true, finalOutput }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
