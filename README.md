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
2. Existing Tasks can be marked as *Complete* or *Incomplete* and can be *Deleted* using dedicated buttons next to the specific task.
3. Existing Tasks can also be filtered to show only the *Complete*, *Incomplete* or *All* Tasks.

![Tasks Page](/img/TasksPage.png)

4. New Tasks can be *created* using the **Add Task** tab, which redirects to a page prompting *name* and *deadline* for the task to be created.

![Add Tasks Page](/img/AddTasksPage.png)

5. Added tasks are marked as *Incomplete* by default.
6. Existing Tasks can be edited using the **Edit** button, which redirects to a page similar to *Add Task* page, but with task details filled in. The Task *name* and *deadline* can be changed from here.

![Edit Tasks Page](/img/EditTasksPage.png)







---

## Advanced Features:

1. The Advanced feature implemented for now is ***Deadlines***.
2. All tasks in the to-do list have deadlines, that they can be sorted by using the **Sort Tasks** button.
3. Overdue tasks can be filtered using the **Show Overdue Tasks** button.
4. Tasks can be also sorted based on *complete* or *incomplete*.

