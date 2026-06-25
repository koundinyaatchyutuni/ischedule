import React, { useState } from 'react';
import './Task.css';
import editIcon from '../assets/edit-icon2.png';
import deleteIcon1 from '../assets/delete-icon1.png';
import deleteIcon2 from '../assets/delete-icon2.png';
import Clock from './Clock';

function Task({id,task,importance,scheduleTime,selectedDays,updateTask,deleteTask})  {

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);

  // Editable states
  const [taskName, setTaskName] = useState(task);
  const [taskImportance, setTaskImportance] = useState(importance);
  const [taskscheduleTime, setTaskscheduleTime] = useState(scheduleTime);

  const handleEdit = () => {
    setEdit(true);
  };

  const handleSave = () => {
  updateTask(id, {
    name: taskName,
    importance: taskImportance,
    scheduleTime: taskscheduleTime
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
              {taskscheduleTime}
            </p>
            <p className='task-days'>
              {selectedDays.join(', ')}
            </p>
            <p className='task-importance'>
              {taskImportance}
            </p>
          </div>
            {show && (
              <img src={editIcon} alt="Edit" className='edit-icon' onMouseEnter={(e)=> e.target.style.filter = "brightness(1.2)"} onMouseLeave={(e)=> e.target.style.filter = "brightness(1)"} onClick={handleEdit} style={{ cursor: 'pointer', width: '36px', height: 'auto', marginLeft: '1.5px' , marginRight: '0px'}}/>
            )}
        </div>
        {show && (
              <img src={deleteIcon1} alt="Delete" className='delete-icon1' onMouseEnter={(e) => (e.target.src = deleteIcon2)} onMouseLeave={(e) => (e.target.src = deleteIcon1)} onClick={() => deleteTask(id)} style={{ cursor: 'pointer', width: 'auto', height: '36px',marginTop:'10px' }} />
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
          <Clock scheduleTime={taskscheduleTime} setScheduleTime={setTaskscheduleTime} />
          <button onClick={handleSave}> Save </button>
        </div>
      )}
    </>
  );
}

export default Task;