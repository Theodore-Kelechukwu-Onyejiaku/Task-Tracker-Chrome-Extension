import { useState } from 'react';
import axios from 'axios';

const serverUrl = process.env.REACT_APP_STRAPI_SERVER;

export default function EditModal({ setShowUpdateModal, showUpdateModal, task }) {
  const [title, setTitle] = useState(task?.attributes?.title);
  const [taskTime, setTaskTime] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (title === '') {
        alert('Please enter a title');
        return;
      }

      const taskTimeToNumber = parseInt(taskTime) || task?.attributes?.taskTime;
      const realTime = Date.now() + 1000 * 60 * parseInt(taskTimeToNumber);
      const res = await axios.put(`${serverUrl}/api/tasks/${task?.id}`, {
        data: {
          taskTime: taskTimeToNumber,
          realTime,
          title: title?.toString().trim(),
        },
      });

      setShowUpdateModal(false);
      window.location.reload(false);
    } catch (err) {
      alert('Somethind went wrong');
    }
  };
  return (
    <div className={`${showUpdateModal ? 'visible opacity-100 ' : 'invisible opacity-0  '} bg-black bg-opacity-40 h-screen fixed w-full flex justify-center items-center transition-all duration-500`}>
      <div className="p-10 shadow-md bg-white rounded relative">
        <span className="font-bold">Update Task</span>
        <form onSubmit={handleSubmit}>
          <div className="relative  my-5 ">
            <label>Title</label>
            <textarea onChange={(e) => { setTitle(e.target.value); }} defaultValue={task?.attributes?.title} className="w-full border h-32 p-3 mb-5" />
            <span className="text-sm absolute bottom-0 right-0 font-thin text-slate-400">
              {title?.length ? title?.length : task?.attributes?.title?.length}
              /50
            </span>
          </div>
          <div>
            <label>duration</label>
            <div className="flex justify-between items-center">
              <input min={0} onChange={(e) => { setTaskTime(e.target.value); }} defaultValue={task?.attributes?.taskTime} name="taskTime" type="number" className="w-2/3 border rounded-md p-2" />
              <span>(minutes)</span>
            </div>
          </div>
          <button className="p-1 text-green-500 border border-green-500 bg-white rounded my-5" type="submit">Update</button>
        </form>
        <button type="button" onClick={() => { setShowUpdateModal(false); }} className="absolute top-2 right-2 border border-red-500 p-1">Close</button>
      </div>
    </div>
  );
}
