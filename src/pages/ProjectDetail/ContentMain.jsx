import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setTaskDetail, setTaskModal } from 'store/actions/user.action';
import { LoadingContext } from 'contexts/loading.context';
import { useContext } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useState } from 'react';
import { useEffect } from 'react';
import { Avatar, notification, Tooltip } from 'antd';
import {
  BugOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { GetDetailTaskApi } from 'services/task';

const taskTypeIcon = (task) => {
  const typeName = (
    task.taskTypeDetail?.taskTypeName ||
    task.taskTypeName ||
    ''
  ).toLowerCase();
  const typeId = Number(task.taskTypeDetail?.id ?? task.taskTypeId);

  if (typeName === 'bug' || typeId === 2) return <BugOutlined className="task-type-icon is-bug" />;
  if (typeName === 'story' || typeId === 3) return <FileTextOutlined className="task-type-icon is-story" />;
  if (typeName === 'epic' || typeId === 4) return <ThunderboltOutlined className="task-type-icon is-epic" />;
  return <CheckSquareOutlined className="task-type-icon is-task" />;
};

const priorityColor = (priorityName, priorityRank) => {
  const name = (priorityName || '').toLowerCase();
  const rank = Number(priorityRank);
  if (name === 'urgent' || rank >= 4) return '#de350b';
  if (name === 'high' || rank === 3) return '#ff8f00';
  if (name === 'medium' || rank === 2) return '#ffab00';
  if (name === 'low' || rank === 1) return '#4c9aff';
  return '#8590a2';
};

const getCurrentAssigneeIds = (task) =>
  (task.assigness || []).map((assignee) => String(assignee.id ?? assignee.userId));

function ContentMain(props) {
  const dispatch = useDispatch();
  const priorities = useSelector((reduxState) => reduxState.userReducer?.metaData?.priority || []);
  const [, setLoadingState] = useContext(LoadingContext);
  const { projectDetail, searchTerm = '', onlyMyIssues = false, currentUserId } = props
  const [state, setState] = useState()
  const [priorityDropTarget, setPriorityDropTarget] = useState(null)
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const fetchDetailTask = async (x) => {
    setLoadingState({ isLoading: true });
    try {
      const result = await GetDetailTaskApi(projectDetail.id, x);
      const taskDetail =
        result?.data?.resultObject ??
        result?.resultObject ??
        result?.data?.content ??
        result?.content;

      if (!taskDetail) {
        throw new Error('Task details were not returned by the API.');
      }

      dispatch(setTaskDetail(taskDetail));
    } catch (error) {
      notification.error({
        message: 'Không thể tải chi tiết công việc',
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setLoadingState({ isLoading: false });
    }
  }

  const handleDragEnd = (result) => {
    if (normalizedSearch || onlyMyIssues) return;
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return;
    };
    setState((currentState) => {
      if (!currentState?.lstTask) return currentState;

      const sourceColumn = currentState.lstTask.find(
        (column) => String(column.statusId) === source.droppableId,
      );
      const destinationColumn = currentState.lstTask.find(
        (column) => String(column.statusId) === destination.droppableId,
      );
      if (!sourceColumn || !destinationColumn) return currentState;

      const nextColumns = currentState.lstTask.map((column) => ({
        ...column,
        lstTaskDeTail: [...(column.lstTaskDeTail || [])],
      }));
      const nextSource = nextColumns.find(
        (column) => String(column.statusId) === source.droppableId,
      );
      const nextDestination = nextColumns.find(
        (column) => String(column.statusId) === destination.droppableId,
      );
      const [movedTask] = nextSource.lstTaskDeTail.splice(source.index, 1);
      if (!movedTask) return currentState;

      nextDestination.lstTaskDeTail.splice(destination.index, 0, movedTask);
      return { ...currentState, lstTask: nextColumns };
    });
  }

  const handlePriorityDrop = (event, taskId) => {
    event.preventDefault();
    event.stopPropagation();
    setPriorityDropTarget(null);
    const priorityId = event.dataTransfer.getData('application/x-task-priority');
    if (!priorityId) return;

    const priority = priorities.find(
      (item) => String(item.id ?? item.priorityId) === priorityId,
    );
    if (!priority) return;

    setState((currentState) => ({
      ...currentState,
      lstTask: currentState.lstTask.map((column) => ({
        ...column,
        lstTaskDeTail: column.lstTaskDeTail.map((task) =>
          String(task.taskId) === String(taskId)
            ? {
                ...task,
                priorityId: priority.id ?? priority.priorityId,
                priorityTask: {
                  ...task.priorityTask,
                  id: priority.id ?? priority.priorityId,
                  priority: priority.priorityName || priority.priority,
                  priorityRank: priority.priorityRank,
                },
              }
            : task,
        ),
      })),
    }));
  };

  const handlePriorityDragStart = (event, priority) => {
    const priorityId = priority.id ?? priority.priorityId;
    event.dataTransfer.setData('application/x-task-priority', String(priorityId));
    event.dataTransfer.setData('text/plain', priority.priorityName || priority.priority);
    event.dataTransfer.effectAllowed = 'copy';
  };

  useEffect(() => {
    if (projectDetail) {
      setState(projectDetail)
    }
  }, [projectDetail])

  const visibleColumns = (state?.lstTask || []).map((column) => ({
    ...column,
    lstTaskDeTail: (column.lstTaskDeTail || []).filter((task) => {
      const assignees = task.assigness || []
      const matchesSearch = !normalizedSearch || [
        task.taskName,
        task.taskTypeDetail?.taskTypeName,
        task.priorityTask?.priority,
        ...assignees.map((assignee) => assignee.name || assignee.userName),
      ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch))
      const matchesAssignee = !onlyMyIssues ||
        (currentUserId != null && getCurrentAssigneeIds(task).includes(String(currentUserId)))
      return matchesSearch && matchesAssignee
    }),
  }))

  const renderColumns = () => (
      <>
        {visibleColumns.map((taskListDetail) => {
          return (<Droppable droppableId={String(taskListDetail.statusId)} key={taskListDetail.statusId}>
            {(provided, snapshot) => {
              return (
                <section className={`project-board-column${snapshot.isDraggingOver ? ' is-dragging-over' : ''}`}>
                  <div className="project-board-column-header">
                    <h4>{taskListDetail.statusName}</h4>
                    <span className="project-board-column-count">{taskListDetail.lstTaskDeTail.length}</span>
                  </div>
                  <div className="project-board-task-list" ref={provided.innerRef} {...provided.droppableProps}>
                    {taskListDetail.lstTaskDeTail.map((task, index) => {
                      return (
                        <Draggable
                          key={String(task.taskId)}
                          index={index}
                          draggableId={String(task.taskId)}
                          isDragDisabled={Boolean(normalizedSearch || onlyMyIssues)}
                        >
                          {(provided, snapshot) => {
                            return (
                              <article
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                role="button"
                                tabIndex={0}
                                aria-label={`Mở công việc: ${task.taskName}`}
                                className={`project-board-task${snapshot.isDragging ? ' is-dragging' : ''}${priorityDropTarget === String(task.taskId) ? ' is-priority-drop-target' : ''}`}
                                style={provided.draggableProps.style}
                                onDragOver={(event) => {
                                  if (event.dataTransfer.types.includes('application/x-task-priority')) {
                                    event.preventDefault();
                                    event.dataTransfer.dropEffect = 'copy';
                                    setPriorityDropTarget(String(task.taskId));
                                  }
                                }}
                                onDragLeave={() => setPriorityDropTarget(null)}
                                onDrop={(event) => handlePriorityDrop(event, task.taskId)}
                                onClick={() => {
                                  dispatch(setTaskModal(true))
                                  fetchDetailTask(task.taskId)
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault()
                                    dispatch(setTaskModal(true))
                                    fetchDetailTask(task.taskId)
                                  }
                                }}
                              >
                                <span className="project-board-task-type">
                                  {taskTypeIcon(task)}
                                  {task.taskTypeDetail?.taskTypeName || task.taskTypeName || 'Task'}
                                </span>
                                <span className="project-board-task-name">{task.taskName}</span>
                                <div className="project-board-task-footer">
                                  <span className="project-board-task-priority">
                                    <span
                                      className="project-board-priority-dot"
                                      style={{
                                        backgroundColor: priorityColor(
                                          task.priorityTask?.priority,
                                          task.priorityTask?.priorityRank,
                                        ),
                                      }}
                                    />
                                    {task.priorityTask?.priority || 'Chưa ưu tiên'}
                                  </span>
                                  <div className="project-board-assignees">
                                    {task.assigness?.map((member) => (
                                      <Tooltip key={member.id || member.userId} title={member.name || member.userName || 'Thành viên'}>
                                        <Avatar size="small" src={member.avatar || undefined}>
                                          {(member.name || member.userName || '?').charAt(0).toUpperCase()}
                                        </Avatar>
                                      </Tooltip>
                                    ))}
                                  </div>
                                </div>
                              </article>
                            )
                          }}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                    {taskListDetail.lstTaskDeTail.length === 0 && (
                      <div className="project-board-empty-column">
                        {normalizedSearch || onlyMyIssues ? 'Không có công việc phù hợp' : 'Thả công việc vào đây'}
                      </div>
                    )}
                  </div>
                </section>
              )
            }}
          </Droppable>
          )
        })}
      </>
    )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="project-board-workspace">
        <div className="project-board-columns">
          {visibleColumns.length > 0 ? renderColumns() : (
            <div className="project-board-empty">
              {normalizedSearch || onlyMyIssues
                ? 'Không tìm thấy công việc phù hợp với bộ lọc.'
                : 'Dự án này chưa có công việc.'}
            </div>
          )}
        </div>
        <aside className="project-board-priority-panel">
          <h4>Priority</h4>
          <p>Kéo màu vào thẻ để đổi mức ưu tiên</p>
          <div className="project-board-priority-list">
            {[...priorities]
              .sort((left, right) => (left.priorityRank || 0) - (right.priorityRank || 0))
              .map((priority) => {
                const name = priority.priorityName || priority.priority;
                const color = priorityColor(name, priority.priorityRank);
                return (
                  <div
                    key={priority.id ?? priority.priorityId}
                    className="project-board-priority-option"
                    draggable
                    onDragStart={(event) => handlePriorityDragStart(event, priority)}
                    title={`Kéo ${name} vào thẻ công việc`}
                  >
                    <span className="project-board-priority-dot" style={{ backgroundColor: color }} />
                    <span>{name}</span>
                  </div>
                );
              })}
          </div>
          {priorities.length === 0 && (
            <span className="project-board-priority-empty">Chưa có dữ liệu Priority</span>
          )}
        </aside>
      </div>
    </DragDropContext>
  )
}

export default ContentMain