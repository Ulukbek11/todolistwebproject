let todos = [];
        let currentFilter = 'all';

        // Load todos from memory on page load
        window.addEventListener('load', () => {
            loadTodos();
            renderTodos();
            updateStats();
        });

        // Add todo on button click
        document.getElementById('add-btn').addEventListener('click', addTodo);

        // Add todo on Enter key
        document.getElementById('todo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                renderTodos();
            });
        });

        function addTodo() {
            const input = document.getElementById('todo-input');
            const text = input.value.trim();

            if (text === '') {
                return;
            }

            const todo = {
                id: Date.now(),
                text: text,
                completed: false
            };

            todos.push(todo);
            saveTodos();
            renderTodos();
            updateStats();
            input.value = '';
        }

        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
            updateStats();
        }

        function toggleTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                saveTodos();
                renderTodos();
                updateStats();
            }
        }

        function renderTodos() {
            const todoList = document.getElementById('todo-list');
            
            let filteredTodos = todos;
            if (currentFilter === 'active') {
                filteredTodos = todos.filter(t => !t.completed);
            } else if (currentFilter === 'completed') {
                filteredTodos = todos.filter(t => t.completed);
            }

            if (filteredTodos.length === 0) {
                todoList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <div>No tasks ${currentFilter !== 'all' ? currentFilter : 'yet'}</div>
                    </div>
                `;
                return;
            }

            todoList.innerHTML = filteredTodos.map(todo => `
                <li class="todo-item ${todo.completed ? 'completed' : ''}">
                    <input 
                        type="checkbox" 
                        class="checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        onchange="toggleTodo(${todo.id})"
                    >
                    <span class="todo-text">${todo.text}</span>
                    <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
                </li>
            `).join('');
        }

        function updateStats() {
            const total = todos.length;
            const completed = todos.filter(t => t.completed).length;
            const active = total - completed;

            document.getElementById('stats').textContent = 
                `Total: ${total} | Active: ${active} | Completed: ${completed}`;
        }

        function saveTodos() {
            // Store in memory (persists during session)
            window.todosData = todos;
        }

        function loadTodos() {
            // Load from memory
            if (window.todosData) {
                todos = window.todosData;
            }
        }