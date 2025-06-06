'use client'

// React Imports
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { toast } from 'react-toastify'

// Icon Imports
import { useDropzone } from 'react-dropzone'

import Grid from '@mui/material/Grid2'

import { useSession } from 'next-auth/react'

import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { Autocomplete, Card, CardContent, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, MenuItem, Tab } from '@mui/material'

import { TabContext, TabList, TabPanel } from '@mui/lab'

import classNames from 'classnames'

import AppReactDropzone from '@/libs/styles/AppReactDropzone'

// import AddCandidateForm from '../add/AddCandidateForm'

import { formatCTC } from '@/utils/formatCTC'

import CustomTextField from '@/@core/components/mui/TextField'
import CustomInputVertical from '@/@core/components/custom-inputs/Vertical'

import { experienceData, MenuProps } from '@/configs/customDataConfig'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import AddCandidateForm from '../add/AddCandidateForm'


const demoData = {
    "full_name": "Abhishek Jaishwal",
    "email": "Abhishekjaishwal22@gmail.com",
    "mobile_no": "+918960222573",
    "date_of_birth": null,
    "father_name": null,
    "gender": null,
    "address": "Jagatpuri Extension, New Delhi, 110093",
    "city": "New Delhi",
    "latest_company_name": "Go Digit General Insurance Company Ltd",
    "industry": "Insurance",
    "department": "Sales",
    "key_responsibilities": [
      "Handling Renewals of all LOB as well as All channel Agency & Retail Brokings",
      "Approaching Channel Partner for best renewal Ratio over the call and visits",
      "Handling pricing negotiation and policy processing"
    ],
    "profile_title": "Renewal Sales Manager",
    "education": [
      {
        "degree": "Graduation",
        "branch_or_board": "B.com",
        "school_or_institute": "Dr. RMLA University",
        "passing_year": "04-2015",
        "grade_type": "",
        "grade_value": ""
      },
      {
        "degree": "Intermediate",
        "branch_or_board": "PCM",
        "school_or_institute": "Gov. Jubilee Inter College Gorakhpur, UP",
        "passing_year": "06-2010",
        "grade_type": "",
        "grade_value": ""
      },
      {
        "degree": "High School",
        "branch_or_board": "",
        "school_or_institute": "MG Inter College Gorakhpur, UP",
        "passing_year": "06-2008",
        "grade_type": "",
        "grade_value": ""
      }
    ],
    "total_work_experience": null,
    "current_ctc": null,
    "experience": [
      {
        "job_title": "Branch Renewal Head",
        "company": "Go Digit General Insurance Company Ltd",
        "start_date": "10-2019",
        "end_date": "current_time",
        "is_current": true,
        "location": "New Delhi",
        "total_experience": null
      },
      {
        "job_title": "Agency Sales Manager",
        "company": "Bajaj Allianz General Insurance Co. Ltd",
        "start_date": "01-2019",
        "end_date": "09-2019",
        "is_current": false,
        "location": "Noida, Delhi/NCR",
        "total_experience": null
      },
      {
        "job_title": "Renewal Operations Support",
        "company": "Bajaj Allianz General Insurance Company Limited",
        "start_date": "05-2017",
        "end_date": "12-2019",
        "is_current": false,
        "location": "Noida, Delhi/NCR",
        "total_experience": null
      }
    ],
    "skills": [
      "Ccc",
      "Excel",
      "Microsoft Office",
      "Ms excel",
      "Ms word"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "hobbies": [
      "Adventurous",
      "Fun and outgoing",
      "Hollywood movies",
      "Listening to all types of music",
      "Sports activity lover"
    ]
  };

const UploadCandidate = () => {
  // States
  const [files, setFiles] = useState([])
  const [uploadedData, setUploadedData] = useState();

  const [selected, setSelected] = useState();
  const [cities, setCities] = useState();
  const [industries, setIndustries] = useState();
  const [departments, setDepartments] = useState();
  const { data: session } = useSession();
  const token = session?.user?.token;
  const router = useRouter();
  const [tabValue, setTabValue] = useState('personal_info')

  const [isLoadingFile, setLoadingFile] = useState(false);

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 2000000, // 2 MB
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop: async (acceptedFiles) => {
      // setFiles(acceptedFiles.map(file => Object.assign(file)))

      setLoadingFile(true)

      const formData = new FormData();

      formData.append('file', acceptedFiles[0])

      if(acceptedFiles){
        try {
          // const res = await fetch(`${process.env.NEXT_PUBLIC_CV_API}`, {
          //   method: 'POST',
          //   body: formData
          // });

          // if (!res.ok) {
          //   throw new Error('Upload failed');
          // }

          // setFiles(acceptedFiles.map(file => Object.assign(file)))

          // const data = await res.json();
          // const workStatus = data?.experience ? 'experienced' : 'fresher';

          // setUploadedData(data);
          // setSelected(workStatus);
          // console.log('Upload successful:', data);

          const resCV = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parse-cv`, {
            method: 'post',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData,
          });

          if(!resCV.ok){
            console.error('CV error:', resCV.statusText);
            throw new Error('CV parsing failed: ', resCV.statusText);
          }


          const data = await resCV.json();

          if(data[0]){

            const workStatus = data[0]?.experience ? 'experienced' : 'fresher';

            setFiles(acceptedFiles.map(file => Object.assign(file)))
            setUploadedData(data[0]);
            setSelected(workStatus);
            console.log('Upload successful:', data[0]);
            setLoadingFile(false);
          } else {
            toast.error('Upload failed. Can not extract data from file.', { autoClose: 3000 });

            setLoadingFile(false);
          }


          // You can show a success toast or update state here

        } catch (error) {
          console.error('Upload error:', error);
          toast.error('Upload failed. Please try again.', { autoClose: 3000 });
          setFiles([])
          setUploadedData([])
          setLoadingFile(false);
        }
      }

    },
    onDropRejected: () => {
      toast.error('Only one PDF file is allowed, and the size must be under 2 MB.', {
        autoClose: 3000
      })
    }
  });

  const renderFilePreview = file => {
    if (file.type === 'application/pdf') {
      return <i className='tabler-file-type-pdf' style={{ fontSize: 38 }} />
    } else {
      return <i className='tabler-alert-circle' style={{ fontSize: 38, color: 'red' }} />
    }
  }

  useEffect(() => {

    const fetchCity = async () => {
      // const token = await getCookie('token');

      if(!token) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/city`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const citiesData = await response.json();

        setCities(citiesData || []);

        // setData(jsonData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setCities(null);
      }
    };

    fetchCity();

  }, [token]);

  useEffect(() => {

    const fetchCity = async () => {
      // const token = await getCookie('token');

      if(!token) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/industry`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        setIndustries(data?.industries || []);

        // setData(jsonData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setIndustries(null);
      }
    };

    fetchCity();

  }, [token]);

  const matchedCity = cities ? cities.find(
    (city) => city?.city_name.toLowerCase() === (uploadedData?.city || '').toLowerCase()
  ) : '';

  const { control, handleSubmit, watch, reset, setError, setValue, formState: { errors } } = useForm({
    values: {
      fullName: uploadedData?.full_name || '',
      email: uploadedData?.email || '',
      mobileNo: uploadedData?.mobile_no || '',
      city: matchedCity?.id || '',
      profileTitle: uploadedData?.profile_title || '',
      profileSummary: uploadedData?.profile_summary || '',
      workStatus: uploadedData?.experience ? 'experienced' : '' || '',
      totalExperience: uploadedData?.total_experience || '',
      currentCTC: uploadedData?.current_ctc || '',
      experiences: [
        {
          company: '',
          jobTitle: '',
          location: '',
          startDate: null,
          endDate: null,
          isCurrent: true
        }
      ],
      createAccount: Boolean(uploadedData?.password)
    }
  });


  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)

    setFiles([...filtered])
  }

  const fileList = files.map(file => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='tabler-x text-xl' />
      </IconButton>
    </ListItem>
  ))

  const handleChange = (prop) => {
    setSelected(prop)

    // console.log("work status", prop)
  }

  const onSubmit = async (data) => {

    console.log("data:", data);

    // const token = await getCookie('token');

    if(token){

      // if(candidateId){

      //   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidates/${candidateId}`, {
      //     method: 'put',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${token}`
      //     },
      //     body: JSON.stringify(data)
      //   });

      //   const result = await res.json();

      //   if(res.ok){

      //     sessionStorage.setItem('success', result.message);

      //     router.push('/candidates/list');

      //     reset();


      //   } else if(res.status == 422) {

      //     // Laravel returns validation errors in the `errors` object
      //     Object.entries(result.errors).forEach(([field, messages]) => {
      //       setError(field, {
      //         type: 'custom',
      //         message: messages[0], // Use the first error message for each field
      //       });
      //     });

      //   } else {
      //     sessionStorage.setItem('error', result.message);

      //     router.push('/candidates/list');

      //   }

      // } else {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidates/store`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        if(res.ok){

          sessionStorage.setItem('success', result.message);

          router.push('/candidates/list');

          reset();


        } else if(res.status == 422) {

          // Laravel returns validation errors in the `errors` object
          Object.entries(result.errors).forEach(([field, messages]) => {
            setError(field, {
              type: 'custom',
              message: messages[0], // Use the first error message for each field
            });
          });

        } else {
          sessionStorage.setItem('error', result.message);

          router.push('/candidates/list');

        }

      // }

    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const { fields: experienceField, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experiences',
  });

  // const candiData =
  //   {
  //   "full_name": "Abhishek Jaishwal",
  //   "email": "Abhishekjaishwal22@gmail.com",
  //   "mobile_no": "+918960222573",
  //   "date_of_birth": null,
  //   "father_name": null,
  //   "gender": null,
  //   "address": "Jagatpuri Extension, New Delhi, 110093",
  //   "city": "New Delhi",
  //   "latest_company_name": "Go Digit General Insurance Company Ltd",
  //   "industry": "Insurance",
  //   "department": "Sales",
  //   "key_responsibilities": [
  //     "Handling Renewals of all LOB as well as All channel Agency & Retail Brokings",
  //     "Approaching Channel Partner for best renewal Ratio over the call and visits",
  //     "Handling pricing negotiation and policy processing"
  //   ],
  //   "profile_title": "Renewal Sales Manager",
  //   "education": [
  //     {
  //       "degree": "Graduation",
  //       "branch_or_board": "B.com",
  //       "school_or_institute": "Dr. RMLA University",
  //       "passing_year": "04-2015",
  //       "grade_type": "",
  //       "grade_value": ""
  //     },
  //     {
  //       "degree": "Intermediate",
  //       "branch_or_board": "PCM",
  //       "school_or_institute": "Gov. Jubilee Inter College Gorakhpur, UP",
  //       "passing_year": "06-2010",
  //       "grade_type": "",
  //       "grade_value": ""
  //     },
  //     {
  //       "degree": "High School",
  //       "branch_or_board": "",
  //       "school_or_institute": "MG Inter College Gorakhpur, UP",
  //       "passing_year": "06-2008",
  //       "grade_type": "",
  //       "grade_value": ""
  //     }
  //   ],
  //   "total_work_experience": null,
  //   "current_ctc": null,
  //   "experience": [
  //     {
  //       "job_title": "Branch Renewal Head",
  //       "company": "Go Digit General Insurance Company Ltd",
  //       "start_date": "10-2019",
  //       "end_date": "current_time",
  //       "is_current": true,
  //       "location": "New Delhi",
  //       "total_experience": null
  //     },
  //     {
  //       "job_title": "Agency Sales Manager",
  //       "company": "Bajaj Allianz General Insurance Co. Ltd",
  //       "start_date": "01-2019",
  //       "end_date": "09-2019",
  //       "is_current": false,
  //       "location": "Noida, Delhi/NCR",
  //       "total_experience": null
  //     },
  //     {
  //       "job_title": "Renewal Operations Support",
  //       "company": "Bajaj Allianz General Insurance Company Limited",
  //       "start_date": "05-2017",
  //       "end_date": "12-2019",
  //       "is_current": false,
  //       "location": "Noida, Delhi/NCR",
  //       "total_experience": null
  //     }
  //   ],
  //   "skills": [
  //     "Ccc",
  //     "Excel",
  //     "Microsoft Office",
  //     "Ms excel",
  //     "Ms word"
  //   ],
  //   "languages": [
  //     "English",
  //     "Hindi"
  //   ],
  //   "hobbies": [
  //     "Adventurous",
  //     "Fun and outgoing",
  //     "Hollywood movies",
  //     "Listening to all types of music",
  //     "Sports activity lover"
  //   ]
  // }

  // const candiData = {
  //   "full_name": "Neha Kumari",
  //   "email": "Nehamandy28@gmail.com",
  //   "mobile_no": "7740077567",
  //   "date_of_birth": "29-09-1996",
  //   "father_name": "Mr. Joginder Singh",
  //   "gender": "Female",
  //   "address": "Panchkula, Haryana - 133302",
  //   "city": "Panchkula",
  //   "latest_company_name": "Axis Bank Ltd",
  //   "industry": "Banking",
  //   "department": "Personal Loan",
  //   "key_responsibilities": [
  //     "Generate new leads for Personal Loan through walk-in customers",
  //     "Generate business through pre-approved data",
  //     "Cross-sell banking products like Casa, FD, Credit card & insurance",
  //     "Process physical loan applications and follow up with credit & ops for disbursement",
  //     "Collect physical documents regarding loans",
  //     "Complete operational work in customer loan files"
  //   ],
  //   "profile_title": "Relationship Executive",
  //   "education": [
  //     {
  //       "degree": "B. Com",
  //       "branch_or_board": "",
  //       "school_or_institute": "Jammu University",
  //       "passing_year": "2019",
  //       "grade_type": "",
  //       "grade_value": ""
  //     }
  //   ],
  //   "total_work_experience": null,
  //   "current_ctc": null,
  //   "experience": [
  //     {
  //       "job_title": "Relationship Executive",
  //       "company_name": "Axis Bank Ltd",
  //       "start_date": "01-11-2024",
  //       "end_date": "current_time",
  //       "is_current": true,
  //       "location": "",
  //       "total_experience": null
  //     }
  //   ],
  //   "skills": [
  //     "Handling external and internal communication",
  //     "Use of computer",
  //     "Proficiency in MS Excel",
  //     "Proficiency in VLOOKUP"
  //   ],
  //   "languages": [
  //     "English",
  //     "Hindi",
  //     "Punjabi"
  //   ],
  //   "hobbies": [
  //     "Cooking",
  //     "Gardening",
  //     "Dancing",
  //     "Singing"
  //   ]
  // }



  const candidateForm = () => {
    return (<>
      <Card className='overflow-visible mt-5' variant='outlined'>
        <AddCandidateForm candiData={uploadedData} />
      </Card>
      </>
    )
  }

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Card>
      <CardContent>
        <AppReactDropzone>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='flex items-center flex-col'>
              {isLoadingFile ? (<>
              <Avatar variant="rounded" className="bs-12 is-12 mbe-9">
                <i className="tabler-loader animate-spin" />
              </Avatar>
              <Typography variant="h5" className="mbe-2.5">
                Uploading and parsing CV...
              </Typography>
              </>) : (<>
              <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                <i className='tabler-upload' />
              </Avatar>
              <Typography variant='h4' className='mbe-2.5'>
                Drop files here or click to upload.
              </Typography>
              <Typography>Allowed *.pdf</Typography>
              <Typography>Only 1 file and max size of 2 MB</Typography>
              </>
              )}
            </div>
          </div>
          {/* {candidateForm()} */}
          {!isLoadingFile && files.length ? (
            <>
              <List>{fileList}</List>
              {candidateForm()}
              {/* <AddCandidateForm /> */}
              {/* <div className='buttons'>
                <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                  Remove All
                </Button>
                <Button type='submit' variant='contained' className='mie-2'>
                  Upload Candidate
                </Button>
              </div> */}
            </>
          ) : null}
        </AppReactDropzone>
      </CardContent>
    </Card>
  )
}

export default UploadCandidate
