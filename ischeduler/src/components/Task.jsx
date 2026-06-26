import React, { useState } from 'react';
import './Task.css';
import editIcon from '../assets/edit-icon2.png';
import deleteIcon1 from '../assets/delete-icon1.png';
import deleteIcon2 from '../assets/delete-icon2.png';
import Clock from './Clock';
import Repeat from './Repeat';

function Task({id,task,startTime,endTime,selectedDays,updateTask,deleteTask})  {

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // Editable states
  const [taskName, setTaskName] = useState(task);
  const [taskstartTime, setTaskscheduleTime] = useState(startTime);
  const [taskendTime, setTaskendTime] = useState(endTime);
  const [taskselectedDays, settaskSelectedDays] = useState(selectedDays);
  
  const toggleDay = (day) => {
    settaskSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const handleSave = () => {
  updateTask(id, {
    name: taskName,
    startTime: taskstartTime,
    endTime: taskendTime,
    selectedDays: taskselectedDays,
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

        <div className={`task-container`}>

          <h3 className='task-name'>
            {taskName}
          </h3>

          <div className='task-info'>

            <p className='task-deadline'>
              {taskstartTime.format("hh:mm A")}
            </p>
            <p className='task-days'>
              {selectedDays.join(', ')}
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
          <p>starttime: </p>
          <Clock scheduleTime={taskstartTime} setScheduleTime={setTaskscheduleTime} />
          <p>endtime: </p>
          <Clock scheduleTime={taskendTime} setScheduleTime={setTaskendTime} />
          <p>selected days: </p>
          <Repeat
            days={days}
            selectedDays={taskselectedDays}
            toggleDay={toggleDay}
          />
          <button onClick={handleSave}> Save </button>
        </div>
      )}
    </>
  );
}

export default Task;