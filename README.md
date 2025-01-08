# To-Do List Application

## Written by Tamojit Bera

---

## How To Run:

1. Open the terminal and run the following commands:
   ```bash
   npm init
   npm install express mysql12 express-session bcrypt pug
   ```


2. Run the command:
   ```bash
   node server.js
   ```
3. Go to 
   markdown 
   [http://localhost:4131/login.html](http://localhost:4131/login.html)
   on your browser for the login page.

---

## Notes:

1. The login username ***bera*** with the password ***RandomPass*** was used testing (Feel free to use this).
2. **Create Account** tab can be used to create new credentials.

![Login Page](/img/LoginPage.png)

---

## Features:

1. Once logged in, users are redirected to the *Tasks* page, listing all existing tasks.
2. New Tasks can be *created* using the **Add Task** tab.
3. Added tasks are marked as *Incomplete* by default.
4. Existing tasks can be marked as *complete* or *incomplete* and can be *deleted* using dedicated buttons next to the specific task.

![Tasks Page](/img/TasksPage.png)

5. 

![Edit Tasks Page](/img/EditTasksPage.png)

---

## Advanced Features:

1. The Advanced feature implemented for now is ***Deadlines***.
2. All tasks in the to-do list have deadlines, that they can be sorted by using the **Sort Tasks** button.
3. Overdue tasks can be filtered using the **Show Overdue Tasks** button.
4. Tasks can be also sorted based on *complete* or *incomplete*.

