'use client'

import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid2";

import { useSession } from "next-auth/react";

import { Autocomplete, Card, CardContent, TextField } from "@mui/material";

import JobCard from "./JobCard";

import { yearsOpt } from "@/configs/customDataConfig";

const JobsListCard = ({ jobs }) => {

  const [industry, setIndustry] = useState('')
  const [experience, setExperience] = useState('')
  const [status, setStatus] = useState('')
  const [industries, setIndustries] = useState(null);
  const [departments, setExperiences] = useState(null);
  const { data: session } = useSession()
  const token = session?.user?.token

  // useEffect(() => {
  //   const filteredData = tableData?.filter(candidate => {
  //     if (industry && candidate.industry_id != industry) return false
  //     if (department && candidate.department_id != department) return false
  //     if (status && candidate.status != status) return false

  //     return true
  //   })

  //   setData(filteredData || [])
  // }, [industry, department, status, tableData, setData])

  useEffect(() => {

    if(!token) return

    const getIndustry = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/industry`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const jsonData = await response.json();

        setIndustries(jsonData?.industries || []);
        setExperiences(jsonData?.departments || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        setIndustries(null);
      }
    }

    getIndustry()
  }, [token])

  const jobData = [
    {
      id: 1,
      title: "Junior Backend Engineer",
      company: "Tinvio Digital Services",
      location: "Bengaluru",
      experience: "0-2 Yrs",
      salary: "Not disclosed",
      description: "We are looking for a highly technical and detail-oriented Engineer (Fresher) to ensure the developing and reliability of our software applications. The ideal candidate should have a strong development knowledge and a keen interest in development.",
      skills: ["Python", "Golang", "Java", "ChatGPT", "Backend Architecture", "GitHub Copilot", "Github", "Backend"],
      postedDate: "2025-06-10T12:34:56.000000Z"
    },
    {
      id: 2,
      title: "Senior Frontend Developer",
      company: "Tech Innovations Inc.",
      location: "Noida - Sector 62",
      experience: "3-5 Yrs",
      salary: "80,000 - 100,000",
      description: "Looking for an experienced Frontend Developer with a passion for creating dynamic user interfaces and a strong understanding of modern JavaScript frameworks.",
      skills: ["React", "Vue.js", "JavaScript", "CSS", "HTML"],
      postedDate: "2025-06-10T12:34:56.000000Z"
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "Data Insights Ltd.",
      location: "New Delhi - Nehru Place",
      experience: "2-4 Yrs",
      salary: "90,000 - 120,000",
      description: "Seeking a Data Scientist to analyze complex datasets and provide actionable insights to drive business decisions.",
      skills: ["Python", "R", "Machine Learning", "SQL", "Data Visualization"],
      postedDate: "2025-06-12T02:34:56.000000Z"
    }

    // Add more job objects as needed

  ];

  return (
    <Grid container spacing={6}>
      <Card>
        <Grid size={{ xs: 12 }}>
          <CardContent>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField fullWidth label='Enter keyword / designation / companies' size='small'/>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  fullWidth
                  size='small'
                  options={yearsOpt || []}
                  filterOptions={(option) => option?.filter(opt => opt.value !== '31') || []}
                  getOptionLabel={(year) => year?.value == '0' ? 'Fresher (less than 1 year)' : year?.label || ''}
                  value={yearsOpt && yearsOpt.find(opt => opt.id === experience) || null}
                  onChange={(event, value) => {
                    setExperience(value?.id || '');
                  }}
                  getOptionKey={(option => option?.value)}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  renderInput={(params) => (
                    <TextField label='Select experience' {...params}/>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField fullWidth label='Enter location' size='small' />
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={6} className='p-6 border-bs'>
            {jobData?.map((job, index) => (
              <Grid key={index} size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
                <JobCard job={job} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}

export default JobsListCard;
