const PORT = process.env.PORT;
const express = require("express");
const axios = require('axios');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");
const http = require('http');
const socketIO = require("socket.io");
const app = express();

// Express settings
app.disable("x-powered-by");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(express.static('public'));

const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("User connected");

    // クエリを処理するためのイベントリスナー
    socket.on('query', async (queryData) => {
      const prompt = queryData.prompt;

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `
# 命令書：
あなたは有能なファシリテーターです。「${prompt}」に対処するための最善策を、以下の専門家たちと協力して、創発的な結論を導き出してください。なお、レポートを書く時は制約を忠実に守ってください。

# 専門家：
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
1. ファシリテーターが「専門家」の中から合計８人を選出し、「議論の参加者」とする。
- ゴール達成に適切なメンバー：５人
- 議論に幅を持たせるためのメンバー：２人
- ランダム性を持たせるための無作為なメンバー：１人
2. ファシリテーターが、ゴールを達成するためのアクションを３つにブレークダウンし、最初のアクションを提示する。
3. 参加者はファシリテーターから提示されたアクションについて議論し、結論を導き出す。
4. すべての議論が完了した時点で、「エグゼクティブサマリー形式」で要点を整理する。

# 制約：
・ 出力は「エグゼクティブサマリー形式」とする
・ 最初に「参加者」を箇条書き、続いて「概要」を記載する
・ 「結論」を100文字以内の文章でまとめる
・ 「要点」を箇条書きで書き出す
・ 「議論のポイントとまとめ」を500文字以内で書き出す
・ 「その他の参考情報」を300字以内の文章でまとめ、ユニークな議論を盛り込むこと
        `}],
      });
      io.emit('message', completion.data.choices[0].message);
    } catch (error) {
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Application listening at ${port}`);
});
