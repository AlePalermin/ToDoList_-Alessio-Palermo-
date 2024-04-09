// Funzione principale che si avvia quando la finestra è completamente caricata
window.onload = function() {
    // Ottiene la data corrente e la visualizza nell'elemento con id "date"
    const today = new Date();
    document.getElementById("date").innerHTML = today.toDateString();

    // Aggiorna l'orologio ogni secondo
    setInterval(time, 1000);

    // Mostra le attività salvate
    displayTodoItems();

    // Ottiene riferimenti agli elementi del form e dei bottoni
    const todoForm = document.querySelector("#todo-form");
    const todoInput = document.querySelector("#todo-input");
    const todoList = document.querySelector("#todo-list");
    const editForm = document.querySelector("#edit-form");
    const editInput = document.querySelector("#edit-input");
    const cancelEditBtn = document.querySelector("#cancel-edit-btn");

    // Variabili per la gestione della modifica delle attività
    let oldInputValue;
    let editedTodoId;

    // Gestisce l'evento di invio del form per aggiungere nuove attività
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputValue = todoInput.value;

        if (!inputValue) {
            alert("Please fill out the task");
            return;
        }

        saveTodo(inputValue); // Salva la nuova attività
        todoInput.value = ""; // Pulisce l'input del form
    });

    // Gestisce gli eventi sui bottoni delle attività
    todoList.addEventListener("click", (e) => {
        const targetEl = e.target;
        const parentEl = targetEl.closest(".todo");
        let todoTitle;

        // Ottiene il titolo dell'attività cliccata
        if (parentEl && parentEl.querySelector("h3")) {
            todoTitle = parentEl.querySelector("h3").innerText;
        }

        // Gestisce il completamento dell'attività
        if (targetEl.classList.contains("finish-todo")) {
            parentEl.classList.toggle("done"); // Cambia lo stato di completamento
            saveTodos(); // Salva lo stato aggiornato delle attività
            
            // Nasconde o mostra i bottoni di modifica e rimozione a seconda dello stato di completamento
            const editBtn = parentEl.querySelector(".edit-todo");
            const deleteBtn = parentEl.querySelector(".remove-todo");
            const cancelBtn = parentEl.querySelector("#cancel-edit-btn");

            if (parentEl.classList.contains("done")) {
                editBtn.classList.add("hide");
                deleteBtn.classList.add("hide");
                cancelBtn.classList.add("hide");
            } else {
                editBtn.classList.remove("hide");
                deleteBtn.classList.remove("hide");
                cancelBtn.classList.remove("hide");
            }
        }

        // Gestisce la rimozione dell'attività
        if (targetEl.classList.contains("remove-todo")) {
            parentEl.remove(); // Rimuove l'attività dalla pagina
            saveTodos(); // Aggiorna lo stato delle attività salvate
        }

        // Gestisce la modifica dell'attività
        if (targetEl.classList.contains("edit-todo")) {
            toggleForms(); // Mostra il form di modifica
            editInput.value = todoTitle; // Popola l'input di modifica con il testo attuale dell'attività
            oldInputValue = todoTitle; // Salva il testo precedente per un eventuale annullamento della modifica
            editedTodoId = parentEl.getAttribute("data-id"); // Salva l'ID dell'attività in modifica
        }
    });

    // Funzione per mostrare o nascondere i form di aggiunta e modifica delle attività
    const toggleForms = () => {
        editForm.classList.toggle("hide");
        todoForm.classList.toggle("hide");
        todoList.classList.toggle("hide");
    };

    // Gestisce l'evento di clic sul pulsante "Cancel" nel form di modifica
    cancelEditBtn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleForms(); // Nasconde il form di modifica
    });

    // Gestisce l'evento di invio del form di modifica
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const editInputValue = editInput.value;
        if (editInputValue) {
            updateTodo(editInputValue, editedTodoId); // Aggiorna l'attività
            displayTodoItems(); // Mostra le attività aggiornate
        }

        toggleForms(); // Nasconde il form di modifica
    });
};

// Funzione per aggiornare l'orologio nella pagina
function time() {
    const data = new Date();
    let h = data.getHours();
    let m = data.getMinutes();

    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }

    document.getElementById("hour").innerHTML = h + ":" + m;
}

// Funzione per salvare una nuova attività
function saveTodo(text) {
    const todo = document.createElement("div");
    const todoId = Date.now();
    todo.setAttribute("data-id", todoId);
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    // Crea i bottoni per completare, modificare e rimuovere l'attività
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");

    // Crea un elemento per contenere i bottoni
    const task_actions_el = document.createElement("div");
    task_actions_el.classList.add("actions");
    task_actions_el.appendChild(doneBtn);
    task_actions_el.appendChild(editBtn);
    task_actions_el.appendChild(deleteBtn);
    todo.appendChild(task_actions_el);

    // Aggiunge l'attività alla lista
    const todoList = document.querySelector("#todo-list");
    todoList.appendChild(todo);

    saveTodos(); // Salva l'attività
}

// Funzione per salvare tutte le attività presenti nella pagina
function saveTodos() {
    const todoItems = [];
    // Ottiene tutte le attività presenti nella pagina
    document.querySelectorAll(".todo").forEach((item) => {
        // Salva le informazioni sull'attività
        const todo = { id: item.getAttribute("data-id"), text: item.querySelector("h3").innerText, completed: item.classList.contains("done") };
        todoItems.push(todo); // Aggiunge l'attività alla lista
    });

    // Salva la lista di attività nel localStorage
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

// Funzione per visualizzare le attività salvate nella pagina
function displayTodoItems() {
    const todoList = document.querySelector("#todo-list");
    todoList.innerHTML = ""; // Cancella tutte le attività presenti
    
    // Ottiene le attività salvate
    const savedTodos = getTodoItems();

    // Per ogni attività salvata, crea un elemento nella pagina
    savedTodos.forEach((item) => {
        const todo = document.createElement("div");
        todo.classList.add("todo");
        todo.setAttribute("data-id", item.id);

        const todoTitle = document.createElement("h3");
        todoTitle.innerText = item.text;
        todo.appendChild(todoTitle);

        // Crea i bottoni per completare, modificare e rimuovere l'attività
        const doneBtn = document.createElement("button");
        doneBtn.classList.add("finish-todo");
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-todo");
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("remove-todo");

        // Crea un elemento per contenere i bottoni
        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");
        task_actions_el.appendChild(doneBtn);
        task_actions_el.appendChild(editBtn);
        task_actions_el.appendChild(deleteBtn);
        todo.appendChild(task_actions_el);

        // Se l'attività è completata, aggiunge la classe "done" e nasconde i bottoni di modifica e rimozione
        if (item.completed) {
            todo.classList.add("done");
            editBtn.classList.add("hide");
            deleteBtn.classList.add("hide");
        }

        // Aggiunge l'attività alla lista nella pagina
        todoList.appendChild(todo);
    });
}

// Funzione per ottenere tutte le attività salvate
function getTodoItems() {
    const storedTodoItems = localStorage.getItem("todoItems");
    return storedTodoItems ? JSON.parse(storedTodoItems) : []; // Se ci sono attività salvate, le restituisce, altrimenti restituisce un array vuoto
}

// Funzione per aggiornare il testo di un'attività
function updateTodo(text, todoId) {
    const storedTodoItems = getTodoItems();

    // Cerca l'attività da aggiornare e sostituisce il testo
    const updatedTodoItems = storedTodoItems.map(item => {
        if (item.id === todoId) {
            return { ...item, text: text };
        }
        return item;
    });

    // Salva le attività aggiornate nel localStorage
    localStorage.setItem("todoItems", JSON.stringify(updatedTodoItems));
}

// Funzione per rimuovere tutte le attività
function deleteAllTasks() {
    const todoList = document.querySelector("#todo-list");
    todoList.innerHTML = ""; // Rimuove tutte le attività dalla pagina
    localStorage.removeItem("todoItems"); // Rimuove tutte le attività salvate nel localStorage
}
