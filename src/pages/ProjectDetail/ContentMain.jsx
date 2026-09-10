import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setTaskDetail, setTaskModal } from 'store/actions/user.action';
import { LoadingContext } from 'contexts/loading.context';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useState } from 'react';
import _ from 'lodash';
import { useEffect } from 'react';
import { GetDetailProjectApi } from 'services/project';

function ContentMain(props) {
  const dispatch = useDispatch();
  const [_, setLoadingState] = useContext(LoadingContext);
  const { projectDetail } = props
  const [state, setState] = useState()
  const fetchDetailTask = async (x) => {
    setLoadingState({ isLoading: true });
    const result = await GetDetailProjectApi(x);
    setLoadingState({ isLoading: false });
    dispatch(setTaskDetail(result.data.content));
  }
  const userState = useSelector((state) => state.userReducer);

  const handleDragEnd = (result) => {
    console.log(result);
    let { destination, source } = result;
    if (!destination) {
      return;
    }
    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return;
    };
    let itemCopy = { ...state.lstTask[source.droppableId - 1].lstTaskDeTail[source.index] };
    console.log('itemcopy', itemCopy)
    let index = state.lstTask[source.droppableId-1].lstTaskDeTail.findIndex(item => item.taskId == itemCopy.taskId);

    // // console.log('dropSource', dropSource)
    state.lstTask[source.droppableId-1].lstTaskDeTail.splice(index,1); 

    let dropDestination = state.lstTask[destination.droppableId-1].lstTaskDeTail;
    dropDestination.splice(destination.index, 0, itemCopy)
    setState(state)
    // console.log(destination);
    // console.log(source);

  }

  useEffect(() => {
    if (projectDetail) {
      setState(projectDetail)
      // console.log(projectDetail)
    }
  }, [projectDetail])

  const renderCard = () => {
    return <DragDropContext onDragEnd={handleDragEnd}>
      {
        state?.lstTask?.map((taskListDetail, index) => {
          return (<Droppable droppableId={taskListDetail.statusId} key={index}>
            {(provided) => {
              return (
                <div key={index} className="card pb-2 col-12 col-sm-6 col-md-3" style={{ width: '17rem', height: 'auto' }}>
                  <div className="card-header">
                    {taskListDetail.statusName}
                  </div>
                  <ul className="list-group list-group-flush" ref={provided.innerRef}  {...provided.droppableProps}>
                    {taskListDetail.lstTaskDeTail.map((task, index) => {
                      return (

                        <Draggable key={task.taskId.toString()} index={index} draggableId={task.taskId.toString()}>
                          {(provided) => {
                            return (
                              <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={index} className="list-group-item" data-toggle="modal" data-target="#infoModal"
                                onClick={() => {
                                  dispatch(setTaskModal(true))
                                  fetchDetailTask(task.taskId)
                                  console.log(state)
                                }}
                              >
                                <p className='font-weight-300'>
                                  {(task.taskTypeDetail.id === 2) ? (<i className="fa-solid fa-bookmark"></i>) : (<i className="fa-solid fa-circle-exclamation" style={{ color: 'red' }}></i>)}
                                  &nbsp;
                                  {task.taskName}
                                </p>
                                <div className="block" style={{ display: 'flex' }}>
                                  <div className="block-left">
                                    <p className='text-danger'>{task.priorityTask.priority}</p>
                                    {/* <i className="fa fa-bookmark" /> */}
                                    {/* <i className="fa fa-arrow-up" /> */}
                                  </div>
                                  <div className="block-right">
                                    <div className="avatar-group" style={{ display: 'flex' }}>
                                      {
                                        task.assigness?.map((mem, index) => {
                                          return (
                                            <div className="avatar" key={index}>
                                              <img src={mem.avatar} alt={mem.avatar} />
                                            </div>
                                          )
                                        })
                                      }
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )
                          }}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </ul>
                </div>
              )
            }}
          </Droppable>
          )
        })
      }
    </DragDropContext>
  }
  return (

    <div className="content w-100 row" style={{ display: 'flex' }}>
      {renderCard()}
    </div>
  )
}

export default ContentMain