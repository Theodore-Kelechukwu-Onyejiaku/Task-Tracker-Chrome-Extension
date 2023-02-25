import React, { useRef, useState } from 'react';
import axios from 'axios';
import showFieldsError from '../utils/showFieldsError';

const serverUrl = process.env.REACT_APP_STRAPI_SERVER;

export default function AddTaskModal({ showAddTaskModal, setShowAddTaskModal }) {
  const [task, setTask] = useState({ title: '', taskTime: 0, realTime: 0 });
  const formRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // check all fields are complete
      if (task.title.trim() === '' || task.taskTime === '') {
        showFieldsError();
        return;
      }
      // convert to milliseconds
      const realTime = Date.now() + 1000 * 60 * task.taskTime;
      task.realTime = realTime;
      // create a task
      const res = await axios.post(`${serverUrl}/api/tasks`, {
        data: task,
      });
      formRef.current.reset();
      setTask({ title: '', taskTime: 0 });
      setShowAddTaskModal(false);
      window.location.reload(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    setTask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={`${showAddTaskModal ? 'visible opacity-100 ' : 'invisible opacity-0  '} bg-black bg-opacity-40 h-screen fixed w-full flex justify-center items-center transition-all duration-500`}>
      <div className="p-10 shadow-md bg-white rounded relative">
        <span className="font-bold">Add Task</span>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="relative  my-5 mb-3 ">
            <label>Title</label>
            <textarea minLength={0} maxLength={50} onChange={handleChange} value={task.title} name="title" className="w-full rounded-md border h-32 p-3 mb-5" />
            <span className="text-sm absolute bottom-0 right-0 font-thin text-slate-400">
              {task.title.length}
              /50
            </span>
          </div>
          <div>
            <label>duration</label>
            <div className="flex justify-between items-center">
              <input onChange={handleChange} value={task.taskTime} name="taskTime" type="number" className="w-2/3 border rounded-md p-2" />
              <span>(minutes)</span>
            </div>
          </div>
          <button type="submit" className="p-1 text-green-500 border border-green-500 bg-white rounded my-5">Add Task</button>
        </form>
        <button type="button" onClick={() => { setShowAddTaskModal(false); }} className="absolute top-2 right-2 border border-red-500 p-1 text-red-500">Close</button>
      </div>
    </div>
  );
}
