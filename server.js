var express = require("express");

const bodyParser = require('body-parser');

var app = express();

var mysql = require("mysql2");

var session = require("express-session");

var bcrypt = require("bcrypt");

var sid = 1;

app.set('views', 'static/views');
app.set('view engine', 'pug');

const SALT_ROUNDS_COUNT = 10;

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'C4131F24S002U6',
    password: 'tbpass1234',
    database: 'C4131F24S002U6',
    port: 3306
});

connection.connect(function (err) {
    if (err) {
        console.log("Error connecting to the database:")
        throw err;
    };
    console.log("Connected to MYSQL database!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', 'static/views')
app.use('/js', express.static('static/js'));
app.use('/css', express.static('static/css'));

app.use(session({
    secret: 'csci4131secret',
    resave: false,
    saveUninitialized: true,
}));

var fs = require("fs");

app.get('/login.html', (req, res) => {
    if (!req.session.value) {
        res.sendFile(__dirname + '/static/html/login.html');
    } else {
        console.log("Already logged in.")
        res.redirect('/mytasks.html');
    }
});

app.post('/login', (req, res) => {
    if (req.session.value) {
        console.log("Already logged in.")
        res.redirect('/mytasks.html');
    }
    const { username, password } = req.body;

    const quer = 'SELECT password FROM users WHERE username=?';
    connection.query(quer, [username], (err, result) => {
        if (err) {
            res.status(401).send('Wrong username or password');
        } else {
            if (result[0] == undefined) {
                res.status(401).send('Wrong username or password');
            } else if (bcrypt.compareSync(password, result[0].password)) {
                req.session.value = sid;
                sid += 1;
                res.status(200).send('Login success');
            } else {
                res.status(401).send('Wrong username or password');
            }
        }
    });
});

app.get('/logout.html', (req, res) => {
    console.log("Attempting to logout");
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				res.status(500).send('Error logging out');
			} else {
				console.log("Session destroyed");
			}
		});
	} else {
		console.log("Not logged in - session not set");
	}
    res.redirect('/login.html');
});

app.get('/mytasks.html', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
    } else {
        res.sendFile(__dirname + '/static/html/mytasks.html');
    }
});


app.get('/get-tasks', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
    } else {
        const sql = 'SELECT * FROM tasks';

        connection.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching tasks:", err);
                return res.status(500).send("Failed to fetch tasks.");
            }

            res.status(200).json(results);
        });
    }
});


app.get('/add-task.html', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
    } else {
        res.sendFile(__dirname + '/static/html/add-task.html');
    }
});

app.post('/add-task', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
    } else {
        const { task, due_date } = req.body;

        // const nameRegex = /^(?! )[a-zA-Z0-9 ]*(?<! )$/;
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const urlRegex = /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/\S*)?$/;

        // if (!name) return res.status(400).send("task name is required.");
        // if (!nameRegex.test(name)) return res.status(400).send("Name must be alphanumeric and cannot start or end with a space.");
        // if (!address) return res.status(400).send("task address is required.");
        // if (!info) return res.status(400).send("task info is required.");
        // if (!email) return res.status(400).send("task email is required.");
        // if (!emailRegex.test(email)) return res.status(400).send("task email must be a valid email address.");
        // if (!url) return res.status(400).send("task URL is required.");
        // if (!urlRegex.test(url)) return res.status(400).send("task URL must be a valid website URL.");

        const sql = 'INSERT INTO tasks (task, due_date, done) VALUES (?, ?, ?)';
        
        connection.query(sql, [task, due_date, false], (err, result) => {
            if (err) {
            console.error("Error inserting task:", err);
            return res.status(500).send("Failed to add task.");
            }
            console.log("task added successfully:", result);
            res.redirect('/mytasks.html');
        });
    }
});

app.delete('/delete-task', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
    } else {
        const taskId = req.query.id;

        if (!taskId || taskId < 0) {
            return res.status(400).send("Valid task ID is required.");
        }

        const sql = 'DELETE FROM tasks WHERE id = ?';

        connection.query(sql, [taskId], (err, result) => {
            if (err) {
            console.error("Error deleting task:", err);
            return res.status(500).send("Failed to delete task.");
            }

            if (result.affectedRows === 0) {
            return res.status(404).send("task not found.");
            }

            console.log(`task with ID ${taskId} deleted.`);
            res.status(200).send("task deleted successfully.");
        });
    }
});

app.get('/edit-task/:id', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
    } else {
        const taskId = req.params.id;

        if (!taskId || taskId < 0) {
            return res.status(400).send("Valid task ID is required.");
        }

        const sql = 'SELECT * FROM tasks WHERE id = ?';

        connection.query(sql, [taskId], (err, result) => {
            if (err) {
                console.error("Error finding task:", err);
                return res.status(500).send("Failed to find task.");
            }


            if (result[0] == undefined) {
                console.error("task not found:", err);
                return res.status(500).send("task not found.");
            }

            const dueDate = new Date(result[0].due_date).toISOString().split('T')[0];

            const taskInfo = {
                id : taskId,
                task : result[0].task,
                due_date: dueDate,
                done: result[0].done
            }

            res.render('edit-task.pug', taskInfo);
        });
    }
});

app.post('/edit-task/:id', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
        return
    } else {
        const taskId = req.params.id;

        connection.query(
            'UPDATE tasks SET task = ?, due_date = ? WHERE id = ?',
            [req.body.task, req.body.due_date, taskId],
			(err,rows) => {
				if (err) {throw err;}
				console.log('values updated');
				// res.redirect('/mytasks.html');  // placeholder for tasks page
                // return
			}
        );

        res.redirect('/mytasks.html');
    }
});

app.get('/complete-task/:id', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
        return
    } else {
        const taskId = req.params.id;

        connection.query(
            'UPDATE tasks SET done=1 WHERE id = ?',
            [taskId],
			(err,rows) => {
				if (err) {throw err;}
				console.log('task marked complete');
				// res.redirect('/mytasks.html');  // placeholder for tasks page
                // return
			}
        );

        res.redirect('/mytasks.html');
    }
});

app.get('/incomplete-task/:id', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
        return
    } else {
        const taskId = req.params.id;

        connection.query(
            'UPDATE tasks SET done=0 WHERE id = ?',
            [taskId],
			(err,rows) => {
				if (err) {throw err;}
				console.log('task marked incomplete');
				// res.redirect('/mytasks.html');  // placeholder for tasks page
                // return
			}
        );

        res.redirect('/mytasks.html');
    }
});

app.get('/sorted-tasks', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
    } else {
        const sql = 'SELECT * FROM tasks ORDER BY due_date ASC';

        connection.query(sql, (err, results) => {
            if (err) {
                console.error("Error sorting tasks:", err);
                return res.status(500).send("Failed to sort tasks.");
            }

            res.status(200).json(results);
        });
    }
});

app.get('/show-complete-tasks', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
    } else {
        const sql = 'SELECT * FROM tasks WHERE done=true';

        connection.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching completed tasks:", err);
                return res.status(500).send("Failed to fetch completed tasks.");
            }

            res.status(200).json(results);
        });
    }
});

app.get('/show-incomplete-tasks', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
    } else {
        const sql = 'SELECT * FROM tasks WHERE done=false';

        connection.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching incomplete tasks:", err);
                return res.status(500).send("Failed fetch incomplete tasks.");
            }

            res.status(200).json(results);
        });
    }
});

app.get('/show-overdue-tasks', (req, res) => {
    if (!req.session.value) {
        console.log("Not logged in.");
        res.redirect('/login.html');
    } else {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        const sql = 'SELECT * FROM tasks WHERE done=0 AND due_date < ?';

        connection.query(sql, [today],(err, results) => {
            if (err) {
                console.error("Error sorting tasks:", err);
                return res.status(500).send("Failed to sort tasks.");
            }

            res.status(200).json(results);
        });
    }
});

app.get('/create-account.html', (req, res) => {
    if (!req.session.value) {
        res.sendFile(__dirname + '/static/html/create-account.html');
    } else {
        console.log("Already logged in.")
        res.redirect('/mytasks.html');
    }
})

app.post('/create-account', (req, res) => {
    if (req.session.value) {
        console.log("Already logged in.");
        res.redirect('/mytasks.html');
    } else {
        const { username, password } = req.body;

        const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS_COUNT);

        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        
        connection.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                console.error("Error creating account.");
                return res.status(401).send("Failed to create account. Maybe try a different username.");
            }
            console.log("Account successfully created.");
            req.session.value = sid;
            sid += 1;
            res.status(200).send("Account created.");
        });
    }
});




const port = 4131;
app.listen(port, () => console.log('Listening on port: ' + port + '!'));
