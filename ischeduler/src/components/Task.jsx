import React, { useState } from 'react';
import './Task.css';
function Task({id,task,importance, deadline,updateTask})  {

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);

  // Editable states
  const [taskName, setTaskName] = useState(task);
  const [taskImportance, setTaskImportance] = useState(importance);


  const handleEdit = () => {
    setEdit(true);
  };

  const handleSave = () => {
  updateTask(id, {
    name: taskName,
    importance: taskImportance,
  });

  setEdit(false);
};

  return (
    <>
      <div
        className='task-wrapper'
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >

        <div className={`task-container ${taskImportance}`}>

          <h3 className='task-name'>
            {taskName}
          </h3>

          <div className='task-info'>

            <p className='task-deadline'>
              {deadline}
            </p>

            <p className={`task-importance ${taskImportance}`}>
              {taskImportance}
            </p>

          </div>
        </div>

        {show && (
          <button
            className='task-edit'
            onClick={handleEdit}
          >
            Edit
          </button>
        )}
      </div>

      {edit && (
        <div className='edit-form'>

          <input
            type="text"
            placeholder='Task name'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />

          <select
            value={taskImportance}
            onChange={(e) => setTaskImportance(e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button onClick={handleSave}> Save </button>

        </div>
      )}
    </>
  );
}

export default Task;