document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#grid-container');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;

        const errorDisplay = document.getElementById('errEle');
        errorDisplay.style.color = 'red';

        try {
            var response = await fetch('/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                window.location.href = '/mytasks.html';
            } else {
                const errorText = await response.text();
                errorDisplay.textContent = errorText;
            }

        } catch (err) {
            location.reload();
            errorDisplay.textContent = 'An error occurred. Please try again.';
            console.error('Error:', err);
        }
    });
});
