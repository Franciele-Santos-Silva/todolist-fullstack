import React from "react";
import { TaskProvider } from "./contexts/TaskContext";
import Sidebar from "./components/Sidebar";
import TaskList from "./components/TaskList";
import TaskDetail from "./components/TaskDetail";
import "./styles.css";

function App() {
  return (
    <TaskProvider>
      <div className="app-container">
        <Sidebar />
        <TaskList />
        <TaskDetail />
      </div>
    </TaskProvider>
  );
}

export default App;
