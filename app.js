const PORT = process.env.PORT;
const express = require("express");
const axios = require('axios');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");

const app = express();

// app.set("view engine", "ejs");
// app.use("/", require("./routes/index.js"));

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
      あなたは有能なファシリテーターです。以下の待機者と手順とテーマを基に、step-by-stepで最高の結論を導き出してください。なお、文章を書く時は制約を忠実に守ってください。

      # 待機者：
      ・ 児童発達支援士
      ・ 児童相談員
      ・ 児童福祉司
      ・ 精神保健福祉士
      ・ 臨床心理士
      ・ 公認心理師
      ・ 教育心理士
      ・ 言語聴覚士
      ・ 作業療法士
      ・ 理学療法士
      ・ 医師（小児科、精神科など）
      ・ 看護師（小児科、精神科など）
      ・ 保育士
      ・ 児童福祉関係団体の職員（NPOや民間企業）
      ・ 児童発達支援管理責任者
      ・ 児童指導員
      ・ 特別支援学校の教員
      ・ 社会福祉士
      ・ 児童福祉専門員
      ・ 児童心理士
      ・ カウンセラー
      ・ 栄養士
      ・ 保護者
      ・ 民生委員
      ・ 当該児童生徒

      # 手順：
      1. ファシリテーターが「待機者」の中から合計８人を選出し、「議論の参加者」とする。
      - ゴール達成に適切なメンバー：５人
      - 議論に幅を持たせるためのメンバー：２人
      - ランダム性を持たせるための無作為なメンバー：１人
      2. ファシリテーターが、ゴールを達成するためのアクションを３つにブレークダウンし、最初のアクションを提示する。
      3. 参加者はファシリテーターから提示されたアクションについて議論し、結論を導き出す。
      4. 自分の特徴・役割に応じた独自の観点で議題の背景を考慮しながら、具体的な内容を順番に発言する。
      5. 発言者以外の参加者は、発言者の意見を生産的に批評する。
      6. 受けた批評は、次の自分の発言に生かしてブラッシュアップ。
      7. それぞれが批評とは別に10回発言する。そして10回ブラッシュアップを繰り返す。
      8. ファシリテーターが、一旦、議論の重要ポイントを整理して結論を導き出す。
      9. ファシリテーターは次のアクションがなくなるまで次のアクションを提示し、２に戻り議論を繰り返す。
      10. すべての議論が完了した時点で、「エグゼクティブサマリー形式」で要点を整理する。

      # 制約：
      ・ 出力は「エグゼクティブサマリー形式」とする
      ・ 最初に「参加者」を箇条書き、続いて「概要」を記載する
      ・ 「結論」を100文字以内の文章でまとめる
      ・ 「要点」を箇条書きで書き出す
      ・ 「ブレークダウンの内容と結論」を500文字以内で書き出す
      ・ 「その他参考情報」を300字以内の文章でまとめ、ユニークな議論を盛り込むこと

      # テーマ：
      ${prompt}
      `}],
    });
    res.json(completion.data.choices[0].message);
  } catch (error) {
    console.error(error.response.data);
    res.status(500).json({ error: 'Error calling OpenAI API.', details: error.response.data });
  } 
});

app.listen(PORT, () => {
  console.log(`Application listening at ${PORT}`);
});
