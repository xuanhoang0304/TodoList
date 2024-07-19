import "./style.css";
import TodoList from "./component/TodoList";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

const defaultTodoList = [
  {
    id: "1",
    name: "Task 1",
    isCompleted: false,
  },
  {
    id: "2",
    name: "Task 2",
    isCompleted: true,
  },
  {
    id: "3",
    name: "Task 3",
    isCompleted: false,
  },
];

const filterTodoOptions = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "incomplete",
    label: "Incomplete",
  },
];
export default function App() {
  // TODO 8: Sau khi có state `status`, tạo 1 biến tên `filteredTodoList` để filter lại todoList với status tương ứng
  // Sau đó bỏ vào prop data của `TodoList` là `filteredTodoList`
  
  const inputRef = useRef(null)
  const Add_UpdateBtnRef = useRef(null)

  const items = JSON.parse(localStorage.getItem("items"));
  
  const [status, setStatus] = useState(2);
  const [todoList, setTodoList] = useState(items ? items : defaultTodoList);
  const [searchText, setSearchText] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [itemEdit,setItemEdit] = useState({}) 
  
  const handleSearchText = debounce((e) => {
    setSearchText(e.target.value);
  }, 100);

  const handleEdit =(id) => {
    if(!isEdit){
      const item = [...todoList].find(item => item.id == id)
      setItemEdit(item)
      setIsEdit(true);
    }else alert("Vui lòng lưu lại task để tiếp tục !")
    
  }
  const handleAddTodoList = () =>{
    if (searchText) {
      const newTodoItem = [
        {
          id: new Date().getTime(),
          name: searchText,
          isCompleted: false,
        },
      ];
      const newTodoList = [...newTodoItem, ...todoList];
      setTodoList(newTodoList);
      inputRef.current.value = "";
      setSearchText("");
    } else {
      alert("Enter new task to add !");
    }
  }
  const AddOrUpdateTodoList = (e) => {
    e.preventDefault();
    // Add
    if (!isEdit) {
        handleAddTodoList();
    } else { //Update
      const cloneList = [...todoList]
      if(inputRef.current.value !== ""){
        const index = cloneList.findIndex(item => item.id == itemEdit.id)
        const newItem = {
          ...itemEdit,
          name : inputRef.current.value
        }
      cloneList.splice(index,1,newItem)
      setTodoList(cloneList)
      setSearchText("")
      setIsEdit(false)
      inputRef.current.value = ""
      }else alert("Tên task đang rỗng !")
    }
  };
  

  const handleDeleteItem = (id) => {
    const cloneList = [...todoList];
    const index = cloneList.findIndex(item => item.id == id)
    cloneList.splice(index, 1);
    setTodoList(cloneList);
  };
  const handleCompleteTask = (id) => {
    const cloneList = [...todoList];
    const index = cloneList.findIndex(item => item.id == id)
    const newItem = {
      ...cloneList[index],
      isCompleted: !cloneList[index].isCompleted,
    };
    cloneList.splice(index, 1, newItem);
    setTodoList(cloneList);
  };
  const handleUpdateSelected = (e) => {
    e.target.value === "all"
      ? setStatus(2)
      : e.target.value === "completed"
      ? setStatus(1)
      : setStatus(0);
  };
 
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(todoList));
   
  }, [todoList]);
  useEffect(() => {
      Add_UpdateBtnRef.current.innerHTML = isEdit
      ? `<p>Save task</p>
          <i class="fas fa-plus-circle fa-lg">`
      : `<p>Add new task</p>
          <i class="fas fa-plus-circle fa-lg" />`;
    inputRef.current.value = isEdit ? itemEdit.name : "";
    
  }, [isEdit]);

  
  return (
    <>
      <header>
        <h1>My To Do List {isEdit ? "true" : "false"}</h1>
      </header>
      <form action="" >
        {/* TODO 5: Dùng onChange để update lại state `searchText` (tạo state tên là searchText) */}
        <input
          ref={inputRef}
          type="text"
          className="todo-input"
          onChange={handleSearchText}
          placeholder="Enter new Task..."
        />
        {/* TODO 6: Thêm onClick để add thêm todo với vào state todoList */}
        <button
          ref={Add_UpdateBtnRef}
          className="todo-button"
          type="submit"
          onClick={AddOrUpdateTodoList}
        >
          <p>Add new task</p>
          <i className="fas fa-plus-circle fa-lg" />
        </button>
        <div className="select" onChange={handleUpdateSelected}>
          {/* TODO 7: Dùng onChange để update lại state `status` (tạo state tên là status) */}
          <select name="todos" className="filter-todo">
            {
              /* TODO 1: Dùng `filterTodoOptions` map qua và render ra UI ==========> Done */
              filterTodoOptions.length > 0 &&
                filterTodoOptions.map((item) => (
                  <option key={item.value} value={`${item.value}`}>
                    {item.label}
                  </option>
                ))
            }
          </select>
        </div>
      </form>
      <div className="todo-container">
        {/* TODO 3: Tách ra component TodoList với prop truyền vào là state todoList (tạo ra state mới là todoList) */}
        {/* TODO 4: Tách tiếp ra component con TodoItem với props truyền vào là name và isCompleted */}
        <TodoList
          list={
            status === 2
              ? todoList
              : status === 1
              ? todoList.filter((item) => item.isCompleted == true)
              : todoList.filter((item) => item.isCompleted == false)
          }
          onDelete={handleDeleteItem}
          onComplete={handleCompleteTask}
          onEdit={handleEdit}
        ></TodoList>
      </div>
    </>
  );
}
