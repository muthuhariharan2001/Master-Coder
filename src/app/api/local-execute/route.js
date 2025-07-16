const { generateFile } = require('../helpers/generateFile');
const { runCode } = require('../helpers/runCode');
const fs = require('fs');

const executeCode = async (req, res) => {
  const { language, code, input = '' } = req.body;

  if (!language || !code) {
    return res.status(400).json({ success: false, error: 'Language and code are required' });
  }

  try {
    const filepath = await generateFile(language, code);
    const output = await runCode(language, filepath, input);

    fs.unlinkSync(filepath);

    res.json({ success: true, output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { executeCode };