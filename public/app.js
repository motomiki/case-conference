// タイピングアニメーションを実行する関数
async function typeWriter(text, container) {
  const typingSpeed = 50;
  for (let i = 0; i < text.length; i++) {
    container.textContent += text.charAt(i);
    await new Promise((resolve) => setTimeout(resolve, typingSpeed));
  }
}

document.getElementById('query-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const prompt = document.getElementById('prompt').value;
  const resultContainer = document.getElementById('result');
  resultContainer.textContent = '';

  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Error details:', errorDetails);
      throw new Error('Error occurred while processing the request.');
    }

    const result = await response.json();
    await typeWriter(result.content, resultContainer); // タイピングアニメーションを実行
    // const preElement = document.createElement('pre');
    // preElement.classList.add('text-wrap'); // カスタムクラスを追加
    // resultContainer.appendChild(preElement);
  } catch (error) {
    console.error(error);
    resultContainer.textContent = 'Error occurred while processing the request.';
  }
});