const button = document.getElementById('check-api');
const output = document.getElementById('output');

button.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/status');

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    output.textContent = error.toString();
  }
});