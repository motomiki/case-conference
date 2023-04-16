const PORT = process.env.PORT;
const express = require("express");
const axios = require('axios');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");
const app = express();

// Express settings
app.disable("x-powered-by");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/query', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `
      # 命令書：
      あなたは有能なファシリテーターです。相談された「${prompt}」に対処するための最善策を、以下の専門家たちと協力して提案してください。

      # 待機者：
      ・ 児童相談員
      ・ 公認心理師
      ・ 社会福祉士

      # 手順：
      1. それぞれの専門家が、自分の視点から相談を分析し、提案を出します。
      2. 提案を議論し、統合されたアプローチを形成します。
      3. 最善策をエグゼクティブサマリー形式でまとめます。

      # 制約：
      ・ 出力は「エグゼクティブサマリー形式」とする
      ・ 最初に「参加者」を箇条書き、続いて「概要」を記載する
      ・ 「結論」を50文字以内の文章でまとめる
      ・ 「要点」を箇条書きで書き出す
      ・ 「ブレークダウンの内容と結論」を80文字以内で書き出す
      ・ 「その他参考情報」を60字以内の文章でまとめ、ユニークな議論を盛り込むこと
      `}],
    });
    res.json(completion.data.choices[0].message);
  } catch (error) {
    console.error(error.response.data);
    res.status(500).json({ error: 'Error calling OpenAI API.', details: error.response.data });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Application listening at ${port}`);
});
