
import React from 'react'
import { Avatar, Button, Input, Tooltip } from 'antd'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'

function InfoMain(props) {
    return (
        <div className="project-board-toolbar">
            <Input
                allowClear
                className="project-board-search"
                placeholder="Tìm công việc, loại hoặc người được giao"
                prefix={<SearchOutlined />}
                value={props.searchTerm}
                onChange={(event) => props.onSearch(event.target.value)}
            />
            <Button
                className={props.onlyMyIssues ? 'project-board-filter is-active' : 'project-board-filter'}
                icon={<UserOutlined />}
                aria-pressed={props.onlyMyIssues}
                onClick={props.onToggleMyIssues}
            >
                Việc của tôi
            </Button>
            <div className="project-board-members" aria-label="Thành viên dự án">
                {props.members?.map((user) => (
                    <Tooltip key={user.id} title={user.name || user.userName || 'Thành viên'}>
                        <Avatar
                            src={user.avatar || undefined}
                            alt={user.name || user.userName || 'Thành viên'}
                        >
                            {(user.name || user.userName || '?').charAt(0).toUpperCase()}
                        </Avatar>
                    </Tooltip>
                ))}
            </div>
        </div>
    )
}

export default InfoMain

