import TodoItem from "./TodoItem";

function TodoList({ list, onComplete, onDelete, onEdit }) {
  return (
    <div className="todo-list">
      {list.length > 0 &&
        list.map((item) => (
          <TodoItem
            key={item.id}
            name={item.name}
            isCompleted={item.isCompleted}
            onComplete={() => onComplete(item.id)}
            onDelete={() => onDelete(item.id)}
            onEdit={() => onEdit(item.id)}
          ></TodoItem>
        ))}
    </div>
  );
}

export default TodoList;
