import React from 'react'
import ContentMain from './ContentMain'
import InfoMain from './InfoMain'
import "./index.scss";
import { useParams } from 'react-router-dom';
import { useAsync } from 'hooks/useAsync';
import { fetchProjectDetailAPI } from 'services/project';
import { useEffect } from 'react';
import { useState } from 'react';
import parse from 'html-react-parser';
import { useDispatch, useSelector } from 'react-redux';
import { setProjectMemList, setReRenderDetail } from 'store/actions/user.action';
import { DragDropContext } from 'react-beautiful-dnd';

export default function DetailBoard() {
  const param = useParams();
  const dispatch = useDispatch()
  const userState = useSelector(state => state.userReducer)
  const [projectDetail, setProjectDetail] = useState({})
  
  const { state: data = [] } = useAsync({
    dependencies: [userState.reRenderDetail],
    service: () => fetchProjectDetailAPI(param.projectId),
  })

  useEffect(() => {
    if (data.length !== 0) {
      setProjectDetail(data)
      dispatch(setProjectMemList(data.members))
      // console.log(data)
    }

  }, [data])

  useEffect(() => {
    if (data.length !== 0) {
      dispatch(setReRenderDetail(true))
    }
  }, [userState.reRenderDetail])

  return (
    <div className='main'>
      <h3>{projectDetail?.projectName}</h3>
      <section className='mb-4'>
        {
          parse(` ${projectDetail?.description} `)
        }
      </section>
      <InfoMain members={projectDetail?.members} />
      <ContentMain projectDetail={projectDetail} />

    </div>
  )
}

