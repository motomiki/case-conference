// タイピングアニメーションを実行する関数
async function typeLetterByLetter(element, parentElement, text, index = 0) {
  if (index < text.length) {
    element.textContent += text[index];
    parentElement.scrollTop = parentElement.scrollHeight - parentElement.clientHeight;
    await new Promise((resolve) => setTimeout(resolve, 50));
    await typeLetterByLetter(element, parentElement, text, index + 1);
  }
}

document.getElementById('query-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const prompt = document.getElementById('prompt').value;
  const resultContainer = document.getElementById('result');
  const parentElement = document.getElementById('result-container');

  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorDetails = await response.json(); // Get error details from the server
      console.error('Error details:', errorDetails); // Log the error details
      throw new Error('リクエストの処理中にエラーが発生しました。'); // Throw the error to be caught in the catch block
    }

    const result = await response.json();
    resultContainer.textContent = ''; // Clear previous content
    await typeLetterByLetter(resultContainer, parentElement, result.content);
  } catch (error) {
    console.error(error);
    resultContainer.textContent = 'Error occurred while processing the request.';
  }
});
