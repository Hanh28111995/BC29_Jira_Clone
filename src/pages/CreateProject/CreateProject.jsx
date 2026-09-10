import { Editor } from '@tinymce/tinymce-react';
import { withFormik } from 'formik';
import React, { useContext } from 'react';
import { connect, useSelector } from 'react-redux';
import { LoadingContext } from 'contexts/loading.context';
import * as Yup from 'yup';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import { fetchCreateProjectAPI } from 'services/project';

function CreateProject(props) {
  const userState = useSelector((state) => state.userReducer);
  
  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    ListCategory, // Lấy từ mapStateToProps xuống
  } = props;

  const handleEditorChange = (content, editor) => {
    setFieldValue('description', content);
  };

  return (
    <div className=''>
      <h3>Create Project</h3>
      <form className='form_createProject w-100' onSubmit={handleSubmit} onChange={handleChange}>
        <div className='form-group'>
          <p>Name</p>
          <input className='form-control' name='projectName' value={values.projectName} />
        </div>
        <div className='form-group w-100'>
          <p>Description</p>
          <Editor
            name='description'
            value={values.description}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
            onEditorChange={handleEditorChange}
          />
        </div>
        <div className='form-group'>
          <select name="categoryId" className='form-control' value={values.categoryId} onChange={handleChange}>
            {
              ListCategory?.map((item, index) => {
                return <option value={item.id} key={index}>{item.projectCategoryName}</option>
              })
            }
          </select>
        </div>
        <button className='btn btn-outline-primary' type='submit'>Create Project</button>
      </form>
    </div>
  );
}

const CreateProjectForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    return {
      projectName: '',
      description: '',
      categoryId: props.ListCategory[0]?.id || '',
    }
  },
  validationSchema: Yup.object().shape({
    projectName: Yup.string().required('Project name is required!'),
  }),
  handleSubmit: async (values, { props }) => {
    try {
      props.setLoadingState({ isLoading: true });
      await fetchCreateProjectAPI(values);
      props.setLoadingState({ isLoading: false });
      
      notification.success({ description: "Create Project Successfully!" });
      props.navigate('/project-management/project');
    }
    catch (err) {
      props.setLoadingState({ isLoading: false });
      notification.warning({
        description: `${err?.response?.data?.content || "An error occurred"}`,
      });
    }
  },
  displayName: 'CreateProjectFormit',
})(CreateProject);

const CreateProjectWrapper = (props) => {
  const navigate = useNavigate();
  const [_, setLoadingState] = useContext(LoadingContext);

  return <CreateProjectForm navigate={navigate} setLoadingState={setLoadingState} {...props} />;
}

const mapStateToProps = (state) => ({
  // Lấy trực tiếp projectCategory từ metaData trong Redux Store
  ListCategory: state.userReducer.metaData.projectCategory
});

export default connect(mapStateToProps)(CreateProjectWrapper);