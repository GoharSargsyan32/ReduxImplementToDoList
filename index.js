
const createStore = (reducer, initialState) => {
    let state = initialState;
    const callbacks = [];
    const getState = () => state;
    const dispatch = action => {
        state = reducer(state, action);
        callbacks.forEach(cb => cb());
    };
    const subscribe = callback => {
        callbacks.push(callback);
        return () => callbacks.filter(cb => cb !== callback);
    };
    return {
        subscribe: subscribe,
        getState: getState,
        dispatch: dispatch
    };
};


function todoReducer(state, action) {
    switch (action.type) {
        case "ADD_TODO":
            return {
                ...state,
                todos: [...state.todos, { id: Date.now(), text: action.payload }]
            };
        case "REMOVE_TODO":
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload)
            };
            
        default:
            return state;
    }
}


const initialState = {
    todos: []
};


const store = createStore(todoReducer, initialState);


function render() {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = ""; 
    const todos = store.getState().todos;
    todos.forEach(todo => {
        const li = document.createElement("li");
        li.textContent = todo.text;
        li.onclick = () => store.dispatch({ type: "REMOVE_TODO", payload: todo.id });
        todoList.appendChild(li);
    });
}

store.subscribe(render);


function addTodo() {
    const input = document.getElementById("todo-input");
    const errorMessage = document.getElementById("error-message");
    const text = input.value.trim();
    
    if (text) {
        store.dispatch({ type: "ADD_TODO", payload: text });
        input.value = ""; 
        errorMessage.textContent = ""; 
    } else {
        errorMessage.textContent = "Please enter a todo item."; 
    }
}

render();

