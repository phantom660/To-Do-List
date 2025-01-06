document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#grid-container');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;

        const errorDisplay = document.getElementById('errEle');
        errorDisplay.style.color = 'red';

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                window.location.href = '/mytasks.html'; // Redirect to tasks page on success
            } else {
                const errorText = await response.text();
                errorDisplay.textContent = errorText; // Display error message
            }
        } catch (err) {
            location.reload();
            errorDisplay.textContent = 'An error occurred. Please try again.';
            console.error('Error:', err);
        }
    });
});
