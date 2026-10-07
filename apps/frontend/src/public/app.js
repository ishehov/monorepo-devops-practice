const API_URL = 'http://localhost:3000';

const button = document.getElementById('check-api');
const output = document.getElementById('output');

button.addEventListener('click', async () => {
  try {
    const response = await fetch(`${API_URL}/api/status`);
    const data = await response.json();

    output.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    output.textContent = error.toString();
  }
});