import { useEffect, useState } from 'react';
import { BiMessageSquareAdd } from 'react-icons/bi';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import Task from './components/Task';
import EditModal from './components/EditModal';
import AddTaskModal from './components/AddTaskModal';
import 'react-toastify/dist/ReactToastify.css';

const serverUrl = process.env.REACT_APP_STRAPI_SERVER;

function App() {
  const [tasks, setTasks] = useState([]);
  const [fetchError, setFetchError] = useState([]);
  const [tasksCompleted, setTasksCompleted] = useState([]);
  const [taskToUpdate, setTaskToUpdate] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // function to update extension badge
  const updateChromeBadge = (value) => {
    const { chrome } = window;
    chrome.action?.setBadgeText({ text: value });
    chrome.action?.setBadgeBackgroundColor({ color: '#fff' });
  };

  // function to get all tasks
  const getAllTask = async () => {
    setFetchError('');
    try {
      // fetch tasks from strapi
      const res = await axios.get(`${serverUrl}/api/tasks`);
      // get result from nested object destructuring
      const { data: { data } } = res;

      // get tasks that have not been completed
      const tasks = data.filter((task) => !task.attributes.completed).map((task) => {
        // check if task has expired
        if (Date.now() > parseInt(task?.attributes?.realTime)) {
          task.attributes.realTime = 0;
          return task;
        }
        return task;
      });

      // get completed tasks
      const completedTasks = data.filter((task) => task.attributes.completed);
      setTasksCompleted(completedTasks);
      updateChromeBadge(completedTasks.length.toString());
      setTasks(tasks.reverse());
    } catch (err) {
      setFetchError(err.messgae);
    }
  };

  useEffect(() => {
    // get all tasks
    getAllTask();
  }, []);

  return (
    <div>
      <div className="w-full flex justify-center rounded">
        <div className="w-96 h-96 sm:w-1/3 overflow-scroll border p-5 mb-20 relative bg-slate-50">
          <div className="">
            <h1 className="text-focus-in text-4xl font-bold text-slate-900">Task Time Tracker</h1>
            <span className="text-slate-400">Seize The Day!</span>
          </div>
          <div>
            <h1 className="font-bold text-lg my-5">Tasks</h1>
            {fetchError && <div className="text-red-500 text-center">Something went wrong</div>}
            <div>
              {tasks.length ? tasks?.map((task) => (
                <Task
                  key={task.id}
                  updateChromeBadge={updateChromeBadge}
                  setTaskToUpdate={setTaskToUpdate}
                  setShowUpdateModal={setShowUpdateModal}
                  showUpdateModal={showUpdateModal}
                  task={task}
                />
              ))
                : <div className="text-center">No tasks at the moment</div>}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg my-5">Completed Tasks</h2>
            {fetchError && <div className="text-red-500 text-center">Something went wrong</div>}
            <div>
              {tasksCompleted.length ? tasksCompleted?.map((task) => <Task key={task.id} task={task} />)
                : <div className="text-center">No completed tasks at the moment</div>}
            </div>
          </div>

          <div className="fixed bottom-5 z-50  rounded  w-full left-0 flex flex-col justify-center items-center">
            <button type="button" onClick={() => { setShowAddTaskModal(true); }} className="bg-white p-3 rounded-full">
              <BiMessageSquareAdd className="text-green-500 bg-white" size={50} />
            </button>
          </div>
        </div>
        {/* Toast Notification, Edit-task and Add-task modals */}
        <ToastContainer />
        <EditModal setShowUpdateModal={setShowUpdateModal} showUpdateModal={showUpdateModal} task={taskToUpdate} />
        <AddTaskModal showAddTaskModal={showAddTaskModal} setShowAddTaskModal={setShowAddTaskModal} />
      </div>
    </div>
  );
}

export default App;
