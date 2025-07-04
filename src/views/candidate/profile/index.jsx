'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import UserProfileHeader from './UserProfileHeader'
import BasicDetailForm from './forms/BasicDetailForm'
import Experience from './experiences'
import ExperienceForm from './forms/ExperienceForm'
import Education from './educations'
import EducationForm from './forms/EducationForm'
import Skills from './skills'
import SkillForm from './forms/SkillForm'
import BasicDetails from './basicDetails.jsx'

const UserProfile = ({ tabContentList, data }) => {

  // States
  const [openBasicForm, setOpenBasicForm] = useState(false);
  const [openExpForm, setOpenExpForm] = useState(false);
  const [openEduForm, setOpenEduForm] = useState(false);
  const [openSkillForm, setOpenSkillForm] = useState(false);
  const [allData, setData] = useState(data);

  // console.log("all data:", allData);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserProfileHeader data={allData?.candidate} setOpenBasicForm={setOpenBasicForm} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <BasicDetails data={allData?.candidate} />
          </Grid>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Experience data={allData?.candidate?.experiences} setOpenExpForm={setOpenExpForm} />
          </Grid>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Education data={allData?.candidate?.educations} setOpenEduForm={setOpenEduForm} />
          </Grid>
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <Skills data={allData?.candidate?.skills} setOpenSkillForm={setOpenSkillForm} />
          </Grid>
        </Grid>
      </Grid>

      <BasicDetailForm data={allData?.candidate} setData={setData} cities={allData?.cities} industries={allData?.industries} departments={allData?.departments} open={openBasicForm} handleClose={() => setOpenBasicForm(!openBasicForm)} />
      <ExperienceForm data={allData?.candidate?.experiences} setData={setData} open={openExpForm} handleClose={() => setOpenExpForm(!openExpForm)} />
      <EducationForm data={allData?.candidate?.educations} setData={setData} open={openEduForm} handleClose={() => setOpenEduForm(!openEduForm)} />
      <SkillForm data={allData?.candidate?.skills} setData={setData} open={openSkillForm} handleClose={() => setOpenSkillForm(!openSkillForm)} skillsData={allData?.skills} />
    </Grid>
  )
}

export default UserProfile
