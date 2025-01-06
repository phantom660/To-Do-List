function displayPage(tasks) {
  const tableBody = document.querySelector('#tasksTable tbody');
      tableBody.innerHTML = ''; // Clear existing rows

      tasks.forEach((task) => {
        const row = document.createElement('tr');

        var status;
        if (task.done) {
          status = "Done"
        } else {
          status = "Not Done"
        }

        const dueDate = new Date(task.due_date).toISOString().split('T')[0];

        row.innerHTML = `
          <td>${task.task}</td>
          <td>${dueDate}</td>
          <td>${status}</td>
          <td><button class="deleteButton" onclick="deleteTask(${task.id})">Delete</button></td>
          <td><button class="editButton" onclick="editTask(${task.id})">Edit</button></td>
          <td><button class="markCompleteButton" onclick="markTaskComplete(${task.id})">Mark Complete</button></td>
          <td><button class="markIncompleteButton" onclick="markTaskIncomplete(${task.id})">Mark Incomplete</button></td>
        `;
        tableBody.appendChild(row);
      });
}


// Fetch and display tasks
document.addEventListener('DOMContentLoaded', () => {
  fetch('/get-tasks')
    .then((response) => response.json())
    .then((tasks) => {
      displayPage(tasks);
    })
    .catch((err) => console.error('Error fetching tasks:', err));
});
  
// Delete task
function deleteTask(id) {
  fetch(`/delete-task?id=${id}`, { method: 'DELETE' })
    .then((response) => {
      if (response.ok) {
        location.reload();
      } else {
        response.text().then((text) => {
          alert(`Failed to delete task: ${text}`);
        });
      }
    })
    .catch((err) => console.error('Error deleting task:', err));
}

function editTask(id) {
  fetch(`/edit-task/${id}`, { method: 'GET' })
    .then((response) => {
      if (response.ok) {
        window.location.pathname = `/edit-task/${id}`;
      } else {
        response.text.then((text) => {
          alert(`Failed to edit task: ${text}`);
        });
      }
    })
    .catch((err) => console.error('Error editing task:', err))
}

function markTaskComplete(id) {
  fetch(`/complete-task/${id}`, { method: 'GET' })
    .then((response) => {
      if (response.ok) {
        // window.location.pathname = `/complete-task/${id}`;
        location.reload();
      } else {
        response.text.then((text) => {
          alert(`Failed to edit task: ${text}`);
        });
      }
    })
    .catch((err) => console.error('Error editing task:', err))
}

function markTaskIncomplete(id) {
  fetch(`/incomplete-task/${id}`, { method: 'GET' })
    .then((response) => {
      if (response.ok) {
        // window.location.pathname = `/incomplete-task/${id}`;
        location.reload();
      } else {
        response.text.then((text) => {
          alert(`Failed to edit task: ${text}`);
        });
      }
    })
    .catch((err) => console.error('Error editing task:', err))
}

function sortTasks() {
  fetch('/sorted-tasks')
    .then((response) => response.json())
    .then((tasks) => {
      displayPage(tasks);
    })
    .catch((err) => console.error('Error sorting tasks:', err));
}

function showAllTasks() {
  fetch('/get-tasks')
    .then((response) => response.json())
    .then((tasks) => {
      displayPage(tasks);
    })
    .catch((err) => console.error('Error fetching tasks:', err));
}

function showCompleteTasks() {
  fetch('/show-complete-tasks')
    .then((response) => response.json())
    .then((tasks) => {
      displayPage(tasks);
    })
    .catch((err) => console.error('Error fetching tasks:', err));
}

function showIncompleteTasks() {
  fetch('/show-incomplete-tasks')
    .then((response) => response.json())
    .then((tasks) => {
      displayPage(tasks);
    })
    .catch((err) => console.error('Error fetching tasks:', err));
}

function showOverdueTasks() {
  fetch('/show-overdue-tasks')
    .then((response) => response.json())
    .then((tasks) => {
      displayPage(tasks);
    })
    .catch((err) => console.error('Error fetching tasks:', err));
}