const PORT = process.env.PORT;
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const http = require("http");
const socketIO = require("socket.io");
const uuid = require("uuid");
const cookieParser = require("cookie-parser");
const app = express();

// Express settings
app.disable("x-powered-by");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));

const server = http.createServer(app);
const io = socketIO(server);

// Add this line
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

// Replace the io.use((socket, next) => { ... }) with the following
io.use(wrap(cookieParser()));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("query", async (queryData) => {
    const prompt = queryData.prompt;
    const userId = socket.request.cookies.user_id;

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: `
          # 命令書：
          あなたは有能なファシリテーターです。「${prompt}」に対処するための最善策を、以下の専門家たちと協力して提案してください。

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
          ` }],
      });
      io.to(socket.id).emit("message", completion.data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Application listening at ${port}`);
});
