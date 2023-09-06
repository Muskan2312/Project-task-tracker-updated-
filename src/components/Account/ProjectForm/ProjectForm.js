import React, { useState,useRef } from "react";
import Modal from '../../Modal/Modal';
import styles from './ProjectForm.module.css'
import InputControl from '../../InputControl/InputControl';
import { X } from "react-feather";
import { addProjectInDatabase, updateProjectInDatabase, uploadImage } from "../../../firebase";
import { updateProfile } from "firebase/auth";

function ProjectForm(props) {
  const fileInputRef=useRef();
 const isEdit = props.isEdit ? true : false;
 const defaults =props.default;
const  [values, setValues]=useState({
  thumbnail:defaults?.thumbnail || "",
  title:defaults?.title || "",
  status:defaults?.status || "",
  github:defaults?.github || "",
  link:defaults?.link || "",
  points:defaults?.points || ["",""],

});
const [errorMessage,setErrorMessage]=useState("");
const[imageUploadStarted,setImageUploadStarted]=useState(false);
const[imageUploadProgress,setImageUploadProgress]=useState(0);
const[submitButtonDisabled,setSetSubmitButtonDisabled]=useState(false);
const handlePointUpdate=(value,index)=>{
    const tempPoints=[...values.points];
    tempPoints[index]=value;
    setValues(prev=>({...prev,points:tempPoints}));
};
const handleAddPoint=()=>{
    if (values.points.length > 4) return;
    setValues(prev=>({...prev,points:[...values.points,""]}));
};
const handlePointDelete=(index)=>{
    const tempPoints=[...values.points];
    tempPoints.splice(index,1);
    setValues(prev=>({...prev,points:tempPoints}));
};

const handleFileInputChange=(event)=>{
  const file=event.target.files[0];
  if (!file)return;
  setImageUploadStarted(true);
  uploadImage
  (file,
    (progress)=>{
      setImageUploadProgress(progress);
    },
    (url)=>{
      setImageUploadStarted(false);
      setImageUploadProgress(0);
      setValues(prev=>({...prev,thumbnail:url}))
    },
    (error)=>{
      setImageUploadStarted(false);
      setErrorMessage(error);
    }
  );

};
const validateForm=()=>{
  const actualPoints=values.points.filter(item=>item.trim());
  let isValid=true;
  if(!values.thumbnail){
    isValid=false;
    setErrorMessage("thumbnail for project is required");
  }
  else if(!values.github){
    isValid=false;
    setErrorMessage("Project's Repository link required");
  }
  else if(!values.title){
    isValid=false;
    setErrorMessage("Project's Title  required");
  }
  else if(!values.status){
    isValid=false;
    setErrorMessage("Project's status  required");
  }
  else if(!actualPoints.length){
    isValid=false;
    setErrorMessage("Description of Project is required");
  }
  else if(actualPoints.length < 2){
    isValid=false;
    setErrorMessage("Minimum 2 description points  required");
  }else{ 
  setErrorMessage("");
  }
  return isValid;
};
const handleSubmission= async()=>{
  if( 
  !validateForm()
  )return;
  setSetSubmitButtonDisabled(true);
  if(isEdit)
 await updateProjectInDatabase({...values,refUser:props.uid},defaults.pid);
 else await addProjectInDatabase({...values,refUser:props.uid});
 setSetSubmitButtonDisabled(false);
 if(props.onSubmission)props.onSubmission();
 if(props.onClose)props.onClose();
};
  return (
   
       <Modal onClose={()=>(props.onClose?props.onClose(): "")} >
<div className={styles.container}>
  <input ref={fileInputRef} 
  type="file" 
  style={{display:"none"}} 
  onChange={handleFileInputChange}/>
    <div className={styles.inner}>
    <div container={styles.left}>
        <div className={styles.image}>

        <img src={values.thumbnail || 
        "https://tse4.mm.bing.net/th?id=OIP.C9M1GK1sxmmAVflhsYoBywHaEK&pid=Api&P=0&h=180"} 
        alt="Thumbnail"
         onClick={()=>fileInputRef.current.click()}/>
         {
          imageUploadStarted && ( 
          <p><span>{imageUploadProgress.toFixed(2)}% </span>uploaded</p>
        ) }
        
        </div>
        <InputControl 
        label="Github"
         value={values.github} 
         placeholder=" Project repository link"
        onChange={(event) =>
          setValues((prev) =>  ({
            ...prev,
            github: event.target.value,

        }))
    } 
    />
        <InputControl label="Deployed link" value={values.link} 
        placeholder=" Project Deployed link"
        onChange={(event) =>
            setValues((prev) =>  ({
              ...prev,
              link: event.target.value,
  
          }))
        }
          />

    </div>
    <div className={styles.right}>
        <InputControl label="Project Title" 
        value={values.title}
        placeholder=" Enter project title"
        onChange={(event) =>
            setValues((prev) =>  ({
              ...prev,
              title: event.target.value,
  
          }))
        }
        />
        <InputControl label="Project status" 
        value={values.status}
        placeholder=" Enter project status"
        onChange={(event) =>
            setValues((prev) =>  ({
              ...prev,
              status: event.target.value,
  
          }))
        }
        />
     <div className={styles.description}>
        <div className={styles.top}>
        <p className={styles.title}>Project Description</p>
        <p className={styles.link}onClick={handleAddPoint}>+ Add Point</p>
        </div>
        <div className={styles.inputs}>
            {
                values.points.map((item,index)=> ( 
                    <div className={styles.input} key={index}>
                    <InputControl 
                    key={index} 
                    placeholder="Type something...."
                    value={item} 
                    onChange={(event) => handlePointUpdate(event.target.value,index)}
                    />
                    {index > 1 && <X onClick={()=>handlePointDelete(index) }/>}
                 
                    </div>
                    ))
            }
        
       
        </div>
     </div>
        </div>
    </div>
    <p className={styles.error}>{errorMessage}</p>
    <div className={styles.footer}>
        <p className={styles.cancel}
        onClick={()=>(props.onClose ? props.onClose(): "")}>cancel</p>
        <button className="button" 
        onClick={handleSubmission}
        disabled={submitButtonDisabled}
        >
          Submit
          </button>
    </div>
    </div>
    </Modal>
    
  );
}

export default ProjectForm;
