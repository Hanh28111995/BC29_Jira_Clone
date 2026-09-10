import { Space, Table, Input, Button, Image, Tag, Modal, Popover, AutoComplete } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import parse from 'html-react-parser';
import { useAsyncMutation } from 'hooks/useAsync';
import { setReRenderDetail, setTaskDetail, setTaskModal } from 'store/actions/user.action';
import './index.scss';
import { Editor } from '@tinymce/tinymce-react';
import { DeleteTaskApi, GetDetailTaskApi, UpdateTaskApi } from 'services/task';

export default function ModalEditTask() {  
  const dispatch = useDispatch();
  const { taskDetailModal } = useSelector(state => state.userReducer);
  const userState = useSelector(state => state.userReducer);

  // Lấy trực tiếp từ Redux store (điều chỉnh đường dẫn thuộc tính tùy theo state thực tế của bạn)
  const arrTaskType = userState.detail?.metaData?.taskType || [];
  const priorities = userState.detail?.metaData?.priority || [];
  const statuses = userState.detail?.metaData?.status || [];

  // --- MUTATIONS DỰA TRÊN useAsyncMutation ---

  const { mutateAsync: fetchDetailTask } = useAsyncMutation({
    service: (id) => GetDetailTaskApi(id),
    onSuccess: (data) => {
      dispatch(setTaskDetail(data));
      dispatch(setReRenderDetail(false));
    }
  });

  const { mutate: handleUpdateTask } = useAsyncMutation({
    service: (data) => UpdateTaskApi(data),
    onSuccess: () => {
      if (taskDetailModal?.taskId) {
        fetchDetailTask(taskDetailModal.taskId);
      }
    }
  });

  const { mutate: fetchDeleteTask } = useAsyncMutation({
    service: (id) => DeleteTaskApi(id),
    onSuccess: () => {
      dispatch(setReRenderDetail(false));
      dispatch(setTaskModal(false));
    }
  });

  /////////////////////////////////////////////////////////////////

  const [value, setValue] = useState('');
  
  const renderMemList = () => {
    return (
      <div>
        {
          taskDetailModal.assigness?.map((mem, index) => {
            return (
              <div key={index} style={{ display: 'flex' }} className="item justify-content-center mb-1">
                <div className="avatar">
                  <img src={mem.avatar} alt="avatar" />
                </div>
                <p className="name mt-1 ml-1 text-center" style={{ fontSize: '14px' }}>
                  {mem.name}&nbsp;
                  <button className='delete-btn' type="button">
                    <i className="fa fa-times" style={{ marginRight: 5 }}
                      onClick={() => {
                        let listmem = { ...taskDetailModal };
                        let memList = taskDetailModal.assigness?.filter((ele) => ele.id !== mem.id);
                        listmem.assigness = memList;
                        handleUpdateTask(listmem);
                      }}
                    />
                  </button>
                </p>
              </div>
            );
          })
        }

        <Popover placement='top' title={'Add User'} content={() => {
          return <AutoComplete
            placeholder="Search user..."
            options={userState.projectMemList?.map((user) => ({
              label: user.name,
              value: user.userId.toString()
            }))}
            value={value}
            onChange={(text) => setValue(text)}
            style={{ width: '100%' }}
          />
        }} trigger='click'>
          <Button className='add-btn'>+ Add More</Button>
        </Popover>
      </div>
    );
  };

  const [updateDescription, setUpdateDescription] = useState('');
  const [visibleEditor, setVisibleEditor] = useState(false);

  const renderDescription = () => {
    const jsxDes = parse(` ${taskDetailModal.description || ''} `);
    return (
      <>
        {
          visibleEditor ?
            <div>
              <Editor
                name='description'
                initialValue={taskDetailModal.description}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'],
                  toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onEditorChange={(content) => setUpdateDescription(content)}
              />
              <button className='btn btn-primary m-2'
                onClick={() => {
                  setVisibleEditor(false);
                  let listmem = { ...taskDetailModal };
                  listmem.description = updateDescription;
                  handleUpdateTask(listmem);
                }}>Save</button>

              <button className='btn btn-secondary m-2' onClick={() => setVisibleEditor(false)}>Close</button>
            </div>
            : <div onClick={() => setVisibleEditor(!visibleEditor)}> {jsxDes}</div>
        }
      </>
    );
  };

  const renderTimeTracking = () => {
    const { timeTrackingSpent, timeTrackingRemaining, originalEstimate } = taskDetailModal;
    const max = Number(originalEstimate || 0);
    const spent = Number(timeTrackingSpent || 0);
    const percent = max > 0 ? Math.round((spent / max) * 100) : 0;
    
    return (
      <div className='container'>
        <div className='d-flex' >
          <i className="fa fa-clock" />
          <div style={{ width: '100%' }}>
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: `${percent}%` }}
                aria-valuenow={spent} aria-valuemin={0} aria-valuemax={max} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="logged">{spent}h logged</p>
              <p className="estimate-time">{max - spent}h remaining</p>
            </div>
          </div>
        </div>

        <div className='row' >
          <div className='col-6'>
            <input className='form-control' value={timeTrackingSpent} name='timeTrackingSpent' onChange={(e) => {
              let listmem = { ...taskDetailModal };
              listmem.timeTrackingSpent = e.target.value || 0;
              handleUpdateTask(listmem);
            }}
            onBlur={() => {
              let listmem = { ...taskDetailModal };
              listmem.timeTrackingRemaining = max - Number(listmem.timeTrackingSpent);
              handleUpdateTask(listmem);
            }}
            />
          </div>
          <div className='col-6'>
            <input className='form-control' value={max - spent} name='timeTrackingRemaining' disabled />
          </div>
        </div>
      </div>
    );
  };

  const handleCancel = () => {
    dispatch(setTaskModal(false));
  };

  return (
    <Modal title="Task Detail" open={userState.setTaskModal} onCancel={handleCancel} footer={null} width={800}>
      <div className="modal-header p-0 mb-4" style={{ alignItems: 'center', borderBottom: 'none' }}>
        <div className="task-title" >
          <div className='taskType_boder'>
            {taskDetailModal.taskTypeDetail?.id === 2 ? <i className="fa-solid fa-bookmark ml-4"></i> : (taskDetailModal.taskTypeDetail?.id === 1 ? <i className="fa-solid fa-circle-exclamation ml-4" style={{ color: 'red' }}></i> : '')}
            <select className="custom-select" value={taskDetailModal.taskTypeDetail?.id}
              onChange={(e) => {
                let listmem = { ...taskDetailModal };
                listmem.typeId = e.target.value;
                handleUpdateTask(listmem);
              }}
            >
              {arrTaskType.map((item, index) => (
                <option key={index} value={item.id}>{item.taskType === 'new task' ? 'Task' : 'Bug'}</option>
              ))}
            </select>
          </div>
          <h5 className='ml-3 mb-0'>{taskDetailModal.taskName}</h5>
        </div>
        <div style={{ display: 'flex' }} className="task-click">
          <button type="button" className="close" style={{ fontSize: '20px' }} onClick={() => fetchDeleteTask(taskDetailModal.taskId)}>
            <i className="fa fa-trash-alt" />
          </button>
        </div>
      </div>

      <div className="modal-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-8">
              <div className="description">
                <h6>Description</h6>
                {renderDescription()}
              </div>
            </div>
            <div className="col-4">
              <div className="status">
                <h6>STATUS</h6>
                <select className="custom-select" value={taskDetailModal.statusId} onChange={(e) => {
                  handleUpdateTask({
                    ...taskDetailModal,
                    statusId: e.target.value,
                  });
                }}>
                  {statuses.map((item, index) => (
                    <option key={index} value={item.statusId}>{item.statusName}</option>
                  ))}
                </select>
              </div>

              <div className="assignees mb-3">
                <h6>ASSIGNEES</h6>
                {renderMemList()}
              </div>

              <div className="priority" style={{ marginBottom: 20 }}>
                <h6>PRIORITY</h6>
                <select className="custom-select" value={taskDetailModal.priorityId} onChange={(e) => {
                  handleUpdateTask({
                    ...taskDetailModal,
                    priorityId: e.target.value,
                  });
                }}>
                  {priorities.map((item, index) => (
                    <option key={index} value={item.priorityId}>{item.priority}</option>
                  ))}
                </select>
              </div>

              <div className="estimate">
                <h6>ORIGINAL ESTIMATE (HOURS)</h6>
                <input type="text" className="estimate-hours form-control" value={taskDetailModal.originalEstimate}
                  onChange={(e) => {
                    handleUpdateTask({
                      ...taskDetailModal,
                      originalEstimate: e.target.value || 0
                    });
                  }}
                />
              </div>

              <div className="time-tracking mt-3">
                <h6>TIME TRACKING</h6>
                {renderTimeTracking()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}