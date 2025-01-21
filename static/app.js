async function fetchTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; //How is strikethrough happening?

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        if (task.completed) li.classList.add('completed');

        const toggleButton = document.createElement('button');
        toggleButton.textContent = task.completed ? 'Undo' : 'Complete';
        toggleButton.onclick = () => toggleTask(task.id, !task.completed);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.id);

        li.appendChild(toggleButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

async function addTask() {
    const newTaskInput = document.getElementById('new-task');
    const taskName = newTaskInput.value;

    if (!taskName.trim()) return;

    await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: taskName })
    });

    newTaskInput.value = '';
    fetchTasks();
}

async function toggleTask(taskId, completed) {
    await fetch(`/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
    });
    fetchTasks();
}

async function deleteTask(taskId) {
    await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
    fetchTasks();
}

document.addEventListener('DOMContentLoaded', fetchTasks);
