// タイピングアニメーションを実行する関数
async function typeLetterByLetter(element, parentElement, text, index = 0) {
  if (index < text.length) {
    element.textContent += text[index];
    parentElement.scrollTop = parentElement.scrollHeight - parentElement.clientHeight;
    await new Promise((resolve) => setTimeout(resolve, 50));
    await typeLetterByLetter(element, parentElement, text, index + 1);
  }
}

async function initialize() {
  try {
    // サーバー上の /initialize エンドポイントにアクセスして、必要であればクッキーを設定
    await fetch("/initialize");
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

initialize().then(() => {
  console.log('DOM fully loaded and parsed'); // 追加

  const socket = io();
  const resultContainer = document.getElementById('result');
  const parentElement = document.getElementById('result-container');

  socket.on('message', async (message) => {
    console.log('Received message:', message); // 追加
    resultContainer.textContent = ''; // Clear previous content
    await typeLetterByLetter(resultContainer, parentElement, message.content);
  });

  document.getElementById('query-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const prompt = document.getElementById('prompt').value;
    const queryData = { prompt };

    try {
      socket.emit('query', queryData);
    } catch (error) {
      console.error(error);
      resultContainer.textContent = 'リクエストの処理中にエラーが発生しました。';
    }
  });
});
