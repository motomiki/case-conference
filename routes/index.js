const router = require("express").Router();

// ChatGPT
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function main() {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hello world" }],
  });
  
  console.log(completion.data.choices[0].message);
}
var mes = completion.data.choices[0].message;

main();



// レンダリングして、変数を EJS テンプレートに渡す
router.get("/", (req, res) => {
	// 変数を定義
	// const data = {
	// 	title: "Hello, EJS!",
	// 	message: "This is a sample message.",
	// };
  res.render("./index.ejs", mes);
});

module.exports = router;