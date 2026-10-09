import React, { useEffect, useMemo, useState } from 'react'
import { Avatar, Tag, Typography } from 'antd'
import { CheckCircleOutlined, ProjectOutlined } from '@ant-design/icons'
import ContentMain from './ContentMain'
import InfoMain from './InfoMain'
import "./index.scss";
import { useParams } from 'react-router-dom';
import { useAsync } from 'hooks/useAsync';
import { fetchProjectDetailAPI } from 'services/project';
import parse from 'html-react-parser';
import { useDispatch, useSelector } from 'react-redux';
import { setProjectMemList, setReRenderDetail } from 'store/actions/user.action';

const mapProjectDetail = (project, availableStatuses = [], availableTaskTypes = []) => {
  if (!project || typeof project !== 'object') return {};

  const taskTypeNames = new Map(
    (Array.isArray(availableTaskTypes) ? availableTaskTypes : [])
      .map((taskType) => [
        String(taskType.id ?? taskType.taskTypeId),
        taskType.taskTypeName || taskType.name || taskType.taskType,
      ]),
  );
  const columnsByStatus = new Map();
  (Array.isArray(availableStatuses) ? availableStatuses : []).forEach((status) => {
    const statusId = status.statusId ?? status.id;
    if (statusId == null) return;

    const key = String(statusId);
    columnsByStatus.set(key, {
      statusId: key,
      statusName: status.statusName || status.status || status.name || `Trạng thái ${key}`,
      lstTaskDeTail: [],
    });
  });

  (Array.isArray(project.tasks) ? project.tasks : []).forEach((task) => {
    const statusId = String(task.statusId);
    if (!columnsByStatus.has(statusId)) {
      columnsByStatus.set(statusId, {
        statusId,
        statusName: task.statusName || `Trạng thái ${statusId}`,
        lstTaskDeTail: [],
      });
    }

    const column = columnsByStatus.get(statusId);
    if (!column.statusName && task.statusName) column.statusName = task.statusName;
    column.lstTaskDeTail.push({
      ...task,
      taskId: task.id,
      taskTypeDetail: {
        id: task.taskTypeId,
        taskTypeName:
          task.taskTypeName ||
          task.taskType?.taskTypeName ||
          taskTypeNames.get(String(task.taskTypeId)),
      },
      priorityTask: {
        id: task.priorityId,
        priority: task.priorityName,
        priorityRank: task.priorityRank,
      },
      assigness: task.assignee ? [task.assignee] : [],
    });
  });

  return {
    ...project,
    members: Array.isArray(project.members) ? project.members : [],
    lstTask: Array.from(columnsByStatus.values()),
  };
};

export default function DetailBoard() {
  const param = useParams();
  const dispatch = useDispatch()
  const userState = useSelector(state => state.userReducer)
  const availableStatuses = userState?.metaData?.status || []
  const availableTaskTypes = userState?.metaData?.taskType || []
  const [projectDetail, setProjectDetail] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [onlyMyIssues, setOnlyMyIssues] = useState(false)
  const currentUser = userState?.userInfor?.user || userState?.userInfor
  const currentUserId = currentUser?.id
  
  const { state: data } = useAsync({
    dependencies: [userState.reRenderDetail],
    service: () => fetchProjectDetailAPI(param.projectId),
  })

  useEffect(() => {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const mappedProject = mapProjectDetail(data, availableStatuses, availableTaskTypes);
      setProjectDetail(mappedProject)
      dispatch(setProjectMemList(mappedProject.members))
    }

  }, [data, availableStatuses, availableTaskTypes, dispatch])

  useEffect(() => {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      dispatch(setReRenderDetail(true))
    }
  }, [userState.reRenderDetail])

  const taskCount = useMemo(
    () => projectDetail.lstTask?.reduce(
      (count, column) => count + (column.lstTaskDeTail?.length || 0),
      0,
    ) || 0,
    [projectDetail.lstTask],
  )

  return (
    <div className="project-board-page">
      <header className="project-board-header">
        <div className="project-board-heading">
          <div className="project-board-icon"><ProjectOutlined /></div>
          <div>
            <Typography.Title level={3} className="project-board-title">
              {projectDetail?.projectName || 'Đang tải dự án...'}
            </Typography.Title>
            {projectDetail?.description && (
              <Typography.Paragraph className="project-board-description">
                {parse(projectDetail.description)}
              </Typography.Paragraph>
            )}
          </div>
        </div>
        <Tag className="project-board-total" icon={<CheckCircleOutlined />}>
          {taskCount} công việc
        </Tag>
      </header>

      <InfoMain
        members={projectDetail?.members}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        onlyMyIssues={onlyMyIssues}
        onToggleMyIssues={() => setOnlyMyIssues((active) => !active)}
      />
      <ContentMain
        projectDetail={projectDetail}
        searchTerm={searchTerm}
        onlyMyIssues={onlyMyIssues}
        currentUserId={currentUserId}
      />
    </div>
  )
}
