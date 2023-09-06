import React, { useEffect, useState } from 'react'
import {ArrowRight} from 'react-feather';
import { useNavigate } from 'react-router-dom';
import designIcon from "../../assets/designer.svg";
import styles from "./Home.module.css";
import Spinner from '../Spinner/Spinner';
import { getAllProjects } from '../../firebase';
import ProjectModal from './ProjectModal/ProjectModal';

function Home(props) {
    const navigate = useNavigate();
    const isAuthenticated =props.auth ? true : false;
    const[projectsLoaded,setProjectsLoaded]=useState(false);
    const[projects,setProjects]=useState([]);
    const[showProjectModal,setShowProjectModal]=useState(false);
    const [projectDetails,setProjectDetails]=useState({});

    const handleNextButtonClick = () =>{ 
    if(isAuthenticated) navigate("/account");
   else navigate("/login");
    };
    const fetchAllProjects = async()=>{
      const result = await getAllProjects();
      setProjectsLoaded(true);
      if(!result){
       
        return;
      }
       const tempProjects=[];
       result.forEach(doc=>tempProjects.push({...doc.data(),pid:doc.id}));
       setProjects(tempProjects);
    };
    const handleProjectCardClick=(project)=>{
    setShowProjectModal(true);
    setProjectDetails(project);
    };
    useEffect(()=>{
fetchAllProjects();
    },[]);
  return (
    <div className={styles.container}>
      {
        showProjectModal &&
        <ProjectModal onClose={()=>setShowProjectModal(false)} details={projectDetails}/>
      }
         <div className={styles.header}>
         <div className={styles.left}>
         <p className={styles.heading}>Project Fair</p>
        <p className={styles.subHeading}>
            One stop destination for all software development Projects
            </p>
         <button onClick={handleNextButtonClick}>
            {isAuthenticated ? "Manage your Projects": "Get Started"} {" "}
            <ArrowRight />{" "}
            </button>
         </div>
         <div className={styles.right}>
        <img src={designIcon} alt="Projects" />
        </div>
         </div>
         <div className={styles.body}>
          <p className={styles.title}>All Projects</p>
          <div className={styles.projects}>
            {
              projectsLoaded ? (
              projects.length > 0 ? ( 
              projects.map((item=>
                <div className={styles.project} key={item.pid} onClick={()=>handleProjectCardClick(item)}>
            <div className={styles.image}>
              <img src={item.thumbnail ||"https://tse1.mm.bing.net/th?id=OIP.oSSQTOcjQZvxI-6fa3iMxgHaE8&pid=Api&rs=1&c=1&qlt=95&w=150&h=100"} alt="Project thumbnail"/>
            </div>
            <p className={styles.title}>{item.title}</p>
          </div>
                ))
             ) : (
             <p>No projects found</p>
             )
             ) :(<Spinner />
           ) }
          
         </div>
    </div>
    </div>
  );
  };

export default Home
