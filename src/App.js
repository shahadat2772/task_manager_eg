import "./App.css";
import Todo from "./pages/Todo/Todo";
import Navbar from "./pages/Shared/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Completed from "./pages/Completed/Completed";
import Calendar from "./pages/Calendar/Calendar";
import AddModal from "./pages/Shared/AddModal/AddModal";
import AddTaskButton from "./pages/Shared/AddTaskButton/AddTaskButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase.init";
import { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import Loader from "./pages/Shared/Loader/Loader";
import { createContext, useEffect, useState } from "react";
import TaskEditModal from "./pages/Shared/TaskEditModal/TaskEditModal";
export const globalContext = createContext();

function App() {
  const [user, loading] = useAuthState(auth);
  const email = user?.email;
  const [taskToEdit, setTaskToEdit] = useState(null);

  const {
    data: tasks,
    tasksLoading,
    refetch: tasksReFetch,
  } = useQuery("getTasks", () =>
    fetch(`http://localhost:5000/getTask/${email}`).then((res) => res.json())
  );

  const {
    data: completedTasks,
    completedTasksLoading,
    refetch: completedTasksReFetch,
  } = useQuery("getCompletedTasks", () =>
    fetch(`http://localhost:5000/getCompletedTasks/${email}`).then((res) =>
      res.json()
    )
  );

  // Refetching the data on email
  useEffect(() => {
    tasksReFetch();
    completedTasksReFetch();
  }, [email]);

  if (loading || tasksLoading || completedTasksLoading) {
    return <Loader></Loader>;
  }

  return (
    <div className="App relative">
      <globalContext.Provider
        value={[
          tasks,
          tasksReFetch,
          completedTasks,
          completedTasksReFetch,
          taskToEdit,
          setTaskToEdit,
        ]}
      >
        <Navbar></Navbar>
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route index="/todo" path="/todo" element={<Todo></Todo>}></Route>
            <Route path="/" element={<Todo></Todo>}></Route>
            <Route path="/completed" element={<Completed></Completed>}></Route>
            <Route path="/calendar" element={<Calendar></Calendar>}></Route>
          </Routes>
        </div>
        {/* Modal and Task adding bu tton */}
        {user && !loading && <AddTaskButton></AddTaskButton>}
        {<AddModal></AddModal>}
        {taskToEdit && <TaskEditModal taskToEdit={taskToEdit}></TaskEditModal>}
      </globalContext.Provider>
      <Toaster></Toaster>
    </div>
  );
}

export default App;
