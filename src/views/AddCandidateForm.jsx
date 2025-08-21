'use client'

// React Imports
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'

import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { Autocomplete, Checkbox, CircularProgress, FormControl, FormControlLabel, FormHelperText, FormLabel, Tab } from '@mui/material'

// Components Imports
import classNames from 'classnames'

import { TabContext, TabList, TabPanel } from '@mui/lab'

import { signIn, useSession } from 'next-auth/react'

import { format, parse } from 'date-fns'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// import { getCookie } from '@/utils/cookies'

import { experienceData, MenuProps, monthsOpt, yearsOpt } from '@/configs/customDataConfig'

import { formatCTC } from '@/utils/formatCTC'

import CustomInputVertical from '@/@core/components/custom-inputs/Vertical'

const AddCandidateForm = ({uploadedCV, candidateId, candiData, self, jobId, jobUuid, handleClose, setAppliedSuccess}) => {
  // States
  const [data, setData] = useState();
  const [cities, setCities] = useState();
  const [industries, setIndustries] = useState();
  const [departments, setDepartments] = useState();
  const [loading, setLoading] = useState(false);
  const [candidateData, setCandidateData] = useState(candiData);
  const { data: session } = useSession()
  const token = session?.user?.token

  const router = useRouter();
  const [value, setTabValue] = useState('personal_info')

  // const [selected, setSelected] = useState('')

  const [matchedIndustry, setMatchedIndustry] = useState(null);
  const [matchedDepartment, setMatchedDepartment] = useState(null);
  const [matchedCity, setMatchedCity] = useState(null);

  function getAllMonths(start, end) {
    const months = [];
    const formats = ['dd-MM-yyyy', 'MM-yyyy', 'yyyy-MM-dd', 'yyyy-MM'];

    const parsedStartDate = formats.reduce((acc, format) => {
      const parsed = parse(start, format, new Date());

      return isNaN(parsed) ? acc : parsed;
    }, new Date());

    const parsedEndDate = end && end != 'current_time' ? formats.reduce((acc, format) => {
      const parsed = parse(end, format, new Date());

      return isNaN(parsed) ? acc : parsed;
    }, new Date()) : new Date();

    const date = new Date(parsedStartDate);

    while (date <= parsedEndDate) {
      months.push(format(date, 'yyyy-MM'));
      date.setMonth(date.getMonth() + 1);
    }

    return months;
  }

  const monthSet = new Set();

  candidateData?.experiences?.forEach(job => {
    getAllMonths(job.start_date, job.end_date).forEach(m => monthSet.add(m));
  });

  candidateData?.experience?.forEach(job => {
    getAllMonths(job.start_date, job.end_date).forEach(m => monthSet.add(m));
  });

  const totalMonths = monthSet.size;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  useEffect(() => {
    if (candidateData?.experience) {
      const newStatus = candidateData.experience.length > 0 ? 'experienced' : 'fresher';

      if (candidateData.work_status !== newStatus) {

        // setSelected(newStatus)

        setCandidateData(prev => ({
          ...prev,
          work_status: newStatus
        }));
      }
    }
  }, [candidateData]);

  console.log("candidate data from api:", candidateData)


  function parseDateFromString(dateStr) {
    if (!dateStr) return null;

    const parts = dateStr.split("-");

    // Case 1: "MM-YYYY"
    if (parts.length === 2) {
      const [month, year] = parts;

      return new Date(`${year}-${month}-01`);
    }

    // Case 2: "DD-MM-YYYY"
    if (parts.length === 3) {
      const [day, month, year] = parts;

      return new Date(`${year}-${month}-${day}`);
    }

    // Fallback
    return new Date(dateStr);
  }

  useEffect(() => {

    if(candidateId){
      const fetchCandidateData = async () => {
        // const token = await getCookie('token');

        if(!token) return

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidates/${candidateId}/edit`, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          const jsonData = await response.json();

          setCities(jsonData.cities || []);
          setIndustries(jsonData.industries);
          setDepartments(jsonData.industries.find(industry => industry.id === jsonData.candidate?.industry_id)?.departments)

          // setSelected(jsonData.candidate.work_status || '')

          setCandidateData(jsonData.candidate || null);

          // setData(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
          setCities(null);
        }
      };

      fetchCandidateData();
    }

  }, [candidateId, token])

  useEffect(() => {

    const fetchData = async () => {

      // const token = await getCookie('token');

      if(!token) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidates/add`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const jsonData = await response.json();

        setCities(jsonData.cities || []);
        setIndustries(jsonData.industries);

        setDepartments(jsonData.industryDepartments || null);

      } catch (error) {
        console.error('Error fetching data:', error);
        setCities(null);
        setIndustries(null);
        setDepartments(null);
      }
    };

    fetchData();

  }, [token]);

  useEffect(() => {
    if(self){
      console.log("self candidate upload")

      const fetchData = async () => {

        // const token = await getCookie('token');

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate-register`, {
            headers: {
              'Content-Type': 'application/json',
            }
          });

          const jsonData = await response.json();

          setCities(jsonData.cities || []);
          setIndustries(jsonData.industries);

          setDepartments(jsonData.industryDepartments || null);

        } catch (error) {
          console.error('Error fetching data:', error);
          setCities(null);
          setIndustries(null);
          setDepartments(null);
        }
      };

      fetchData();
    }
  }, [self])

  useEffect(() => {

      if(candidateData) {

        if( industries ){

          let matched = industries ? industries.find(
            (industry) => industry?.name?.toLowerCase() === (candidateData?.industry || '')?.toLowerCase()
          ) : '';

          if(!matched){
            matched = industries ? industries.find(industry =>
              industry?.name?.toLowerCase().includes(candidateData?.industry?.trim()?.toLowerCase() || '')
            ) : '';
          }

          setMatchedIndustry(matched || null);

        }

        if( departments ){

          let matched = departments ? departments.find(
            (department) => department?.name?.toLowerCase() === (candidateData?.department || '')?.toLowerCase()
          ) : '';

          if(!matched){
            matched = departments ? departments.find(department =>
              department?.name?.toLowerCase().includes(candidateData?.department?.trim()?.toLowerCase() || '')
            ) : '';
          }

          setMatchedDepartment(matched || 'Other');

        }

        if( cities ) {
          let matched = cities ? cities.find(
            (city) => city?.city_name?.toLowerCase() === (candidateData?.city || '')?.toLowerCase()
          ) : '';

          if(!matched){
            matched = cities ? cities.find(city =>
              city?.name?.toLowerCase().includes(candidateData?.city?.trim()?.toLowerCase() || '')
            ) : '';
          }

          setMatchedCity(matched || null);
        }

      }

    // }

  }, [candidateData, token, industries, departments, cities]);

  const { control, handleSubmit, watch, reset, setValue, setError, formState: { errors } } = useForm({

    values: {
      fullName: candidateData?.full_name || '',
      email: candidateData?.email || '',
      mobileNo: candidateData?.mobile_no || '',
      industry: candidateData?.industry_id || matchedIndustry?.id || '',
      department: candidateData?.department_id || matchedDepartment?.id || '',
      city: candidateData?.city_id || matchedCity?.id || '',
      profileTitle: candidateData?.profile_title || '',
      profileSummary: candidateData?.profile_summary || '',
      workStatus: candidateData?.work_status || '',
      totalExperience: candidateData?.total_experience || '',
      years: years.toString() ||'',
      months: months.toString() ||'',
      currentCTC: candidateData?.current_ctc || '',
      cv: null || '',
      experiences: candidateData?.experiences?.length > 0
      ? candidateData.experiences.map((exp) => ({
          id: exp.id || null,
          company: exp.company_name || '',
          jobTitle: exp.job_title || '',
          location: exp.location || '',
          startDate: exp.start_date ? new Date(exp.start_date) : null,
          endDate: exp.end_date ? new Date(exp.end_date) : null,
          isCurrent: exp.is_current || false
        }))
      : ( candidateData?.experience?.length > 0 ?
        candidateData?.experience.map((exp) => ({
          company: exp.company || '',
          jobTitle: exp.job_title || '',
          location: exp.location || '',
          startDate: exp.start_date ? parseDateFromString(exp.start_date) : null,
          endDate: exp.end_date != 'current_time' ? parseDateFromString(exp.end_date) : null,
          isCurrent: exp.is_current || false
        })) :
        [
          {
            company: '',
            jobTitle: '',
            location: '',
            startDate: null,
            endDate: null,
            isCurrent: false
          }
        ]
      ),
      educations: candidateData?.educations?.length > 0
        ? candidateData.educations.map((edu) => ({
            id: edu?.id || null,
            educationLevel: edu?.education_level || '',
            branchOrBoard: edu?.branch_or_board || '',
            degree: edu?.degree || '',
            schoolOrInstitute: edu?.school_or_institute || '',
            gradeType: edu?.grade_type || '',
            gradeValue: edu?.grade_value || '',
            passingYear: edu?.passing_year ? parseDateFromString(edu?.passing_year) : null || null,
          }))
        : ( candidateData?.education?.length > 0 ?
          candidateData?.education.map((edu) => ({
            educationLevel: edu?.education_level || '',
            branchOrBoard: edu?.branch_or_board || '',
            degree: edu?.degree || '',
            schoolOrInstitute: edu?.school_or_institute || '',
            gradeType: edu?.grade_type || '',
            gradeValue: edu?.grade_value || '',
            passingYear: edu?.passing_year ? parseDateFromString(edu?.passing_year) : null || null,
          }))
        : [
          {
            educationLevel: '',
            branchOrBoard: '',
            degree: '',
            schoolOrInstitute: '',
            gradeType: '',
            gradeValue: '',
            passingYear: null,
          }
        ]
      ),
      createAccount: true
    }
  });

  console.log("errors:", errors)

  const { fields: educationField, append: appendEducation, remove:removeEducation } = useFieldArray({
    control,
    name: 'educations',
  });

  const { fields: experienceField, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experiences',
  });

  const onSubmit = async (data) => {

    setLoading(true);

    console.log("data:", data);

    // Filter out completely blank experiences
    const filteredExperiences = data.experiences?.filter(exp =>
      exp.jobTitle || exp.company || exp.location || exp.startDate
    ) || [];

    // Create FormData and append fields
    const formData = new FormData();

    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('mobileNo', data.mobileNo);
    formData.append('industry', data.industry);
    formData.append('department', data.department);
    formData.append('city', data.city);
    formData.append('profileTitle', data.profileTitle);
    formData.append('profileSummary', data.profileSummary);
    formData.append('workStatus', data.workStatus);
    formData.append('totalExperience', data.totalExperience);
    formData.append('years', data.years);
    formData.append('months', data.months);
    formData.append('currentCTC', data.currentCTC);
    formData.append('createAccount', data.createAccount ? '1' : '0');
    formData.append('jobId', jobId);
    formData.append('jobUuid', jobUuid);

    // Append JSON stringified experiences and educations
    filteredExperiences.forEach((exp, index) => {
      formData.append(`experiences[${index}][company]`, exp.company || '');
      formData.append(`experiences[${index}][jobTitle]`, exp.jobTitle || '');
      formData.append(`experiences[${index}][location]`, exp.location || '');
      formData.append(`experiences[${index}][startDate]`, exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '');
      formData.append(`experiences[${index}][endDate]`, exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '');

      formData.append(`experiences[${index}][isCurrent]`, exp.isCurrent ? '1' : '0');
    });

    data?.educations.forEach((edu, index) => {
      formData.append(`educations[${index}][educationLevel]`, edu.educationLevel || '');
      formData.append(`educations[${index}][branchOrBoard]`, edu.branchOrBoard || '');
      formData.append(`educations[${index}][degree]`, edu.degree || '');
      formData.append(`educations[${index}][schoolOrInstitute]`, edu.schoolOrInstitute || '');
      formData.append(`educations[${index}][gradeType]`, edu.gradeType || '');
      formData.append(`educations[${index}][gradeValue]`, edu.gradeValue || '');

      // Format passingYear as YYYY-MM-DD or empty string
      formData.append(
        `educations[${index}][passingYear]`,
        edu.passingYear ? new Date(edu.passingYear).toISOString().split('T')[0] : ''
      );
    });

    // formData.append('educations', JSON.stringify(data?.educations));

    if(candidateData?.cv_path){
      formData.append('cv_path', candidateData?.cv_path);
    }

    if(data?.cv){
      formData.append('cv', data?.cv);
    }

    // Append the uploaded PDF file
    // if (uploadedCV) {
    //   formData.append('cv', uploadedCV); // 👈 this attaches the uploaded file
    // }

    const payload = {
      ...data,
      experiences: filteredExperiences,
      jobId: jobId,
      jobUuid: jobUuid
    };

    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/register`, {
    //   method: 'post',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify(payload)
    // });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/register`, {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await res.json();

    if(res.ok){

      // sessionStorage.setItem('success', result.message);


      const res = await signIn('credentials', {
        email: data.mobileNo,
        password: data.mobileNo,
        isCandidate: true,
        redirect: false
      })

      if (res && res.ok && res.error === null) {

        toast.success(result?.message || 'Registered successfully.')

        router.push('/candidate/jobs/applied-success');

        // setAppliedSuccess(true)

        // Vars
        // const redirectURL = searchParams.get('redirectTo') ?? '/dashboard'

        // router.replace(getLocalizedUrl(redirectURL, locale))

      } else {
        toast.error("Registered Login failed!")
      }

      reset();

      handleClose()
      setLoading(false)


    } else if(res.status == 422) {

      toast.error(result?.message || 'Error in Validation')

      // Laravel returns validation errors in the `errors` object
      Object.entries(result.errors).forEach(([field, messages]) => {
        setError(field, {
          type: 'custom',
          message: messages[0], // Use the first error message for each field
        });
      });

    } else {
      // sessionStorage.setItem('error', result.message);

      // router.push('/candidates/list');

      toast.error(result?.message || 'Something went wrong.')


    }

    setLoading(false)
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }


  const selectedYears = watch('years');
  const selectedMonths = watch('months');
  const workStatus = watch('workStatus');

  return (
    <TabContext value={value}>
      <TabList variant='scrollable' onChange={handleTabChange} className='border-be'>
        <Tab label='Personal Info' value='personal_info' />
        <Tab label='Experience' value='experience' />
        <Tab label='Education' value='education' />
      </TabList>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <TabPanel value='personal_info'>
            <Grid container spacing={5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller name="fullName" control={control}
                  rules={{
                    required: 'This field is required.',

                  }}
                  render={({ field }) => (
                    <CustomTextField fullWidth label={<>Full Name <span className='text-error'>*</span></>}
                      required={false}
                      error={!!errors?.fullName} helperText={errors?.fullName?.message} {...field} />
                  )} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller name="email" control={control}
                  rules={{
                    required: 'This field is required.',
                    pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' }
                  }}
                  render={({ field }) => (
                    <CustomTextField fullWidth required={false} label={<>Email <span className='text-error'>*</span></>} type="email"
                      error={!!errors.email} helperText={errors.email?.message} {...field} />
                  )} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="mobileNo"
                  control={control}
                  rules={{
                    required: 'This field is required',
                    validate: {
                      validFormat: (value) => {

                        // Remove non-digit characters
                        const cleaned = value.replace(/\D/g, '');

                        // If it starts with '91' and has 12 digits, remove the '91'
                        let normalized = cleaned;

                        if (cleaned.length === 12 && cleaned.startsWith('91')) {
                          normalized = cleaned.slice(2);
                        } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
                          normalized = cleaned.slice(1);
                        }

                        if (!/^[6-9]\d{9}$/.test(normalized)) {
                          return 'Please enter a valid 10-digit mobile number';
                        }

                        return true;
                      },
                    }
                  }}
                  render={({ field }) => (
                    <>
                    <CustomTextField
                      fullWidth
                      required={false}
                      label={<>Mobile No. <span className='text-error'>*</span></>}
                      error={!!errors.mobileNo}
                      helperText={errors.mobileNo?.message}
                      {...field}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9+]/g, '');
                      }}
                      inputProps={{
                        maxLength: 13,
                        inputMode: 'tel',
                      }}
                    />
                    <FormHelperText>Mobile No. will be default password</FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller name="city" control={control}
                  rules={{ required: 'This field is required.' }}
                  render={({ field }) => (
                    <Autocomplete
                      fullWidth
                      value={cities && cities.length > 0 && cities.find(city => city.id === field.value) || null}
                      options={cities || []}
                      getOptionKey={option => option.id}
                      getOptionLabel={(city) => city.city_name || ''}
                      onChange={(event, value) => {
                          field.onChange(value?.id || '')
                      }}
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          label={<>Current City <span className='text-error'>*</span></>}
                          error={!!errors.city}
                          helperText={errors?.city?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller name="industry" control={control}
                  rules={{ required: 'This field is required.' }}
                  render={({ field }) => (
                    <Autocomplete
                      fullWidth
                      value={industries && industries.length > 0 && industries.find(industry => industry.id === field.value) || null}
                      options={industries || []}
                      groupBy={option => option.category || ''}
                      getOptionKey={option => option.id}
                      getOptionLabel={(industry) => industry.name || ''}
                      onChange={(event, value) => {
                        field.onChange(value?.id || '');
                      }}
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          label={<>Industry <span className='text-error'>*</span></>}
                          error={!!errors.industry}
                          helperText={errors?.industry?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller name="department" control={control}
                  rules={{ required: 'This field is required.' }}
                  render={({ field }) => (
                    <Autocomplete
                      fullWidth
                      value={departments && departments.length > 0 && departments.find(department => department.id === field.value) || null}
                      options={departments || []}
                      getOptionKey={option => option.id}
                      getOptionLabel={(department) => department.name || ''}
                      onChange={(event, value) => {
                          field.onChange(value?.id || '')
                      }}
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          label={<>Department <span className='text-error'>*</span></>}
                          error={!!errors.department}
                          helperText={errors?.department?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="profileTitle"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      label='Profile Title'
                      placeholder='PHP | MERN | Full Stack or Student'
                      error={!!errors?.profileTitle}
                      helperText={errors?.profileTitle?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="profileSummary"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      multiline
                      maxRows={4}
                      label='Profile Summary'
                      error={!!errors?.profileSummary}
                      helperText={errors?.profileSummary?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>Work Status <span className='text-error'>*</span></FormLabel>
                <Grid container spacing={4}>
                  <Controller
                    name="workStatus"
                    control={control}
                    rules={{
                      required: 'This field is required',
                    }}
                    render={({ field }) => (
                      <>
                      <CustomInputVertical
                      {...field}

                        type='radio'

                        data={{
                          meta: 'Free',
                          title: 'Experienced',
                          content: "Candidate have work experience (excluding internships)",
                          value: 'experienced'
                        }}
                        error={true}
                        selected={field.value}
                        handleChange={(e) => {field.onChange(e)}}
                        gridProps={{ size: { xs: 12, sm: 6 } }}
                      /></>
                    )}
                  />
                  <Controller
                    name="workStatus"
                    control={control}
                    rules={{
                      required: 'This field is required',
                    }}
                    render={({ field }) => (
                      <CustomInputVertical

                        type='radio'

                        data={{
                          meta: 'Free',
                          title: 'Fresher',
                          content: "Candidate is a student/ Haven't worked after graduation",
                          value: 'fresher'
                        }}
                        selected={field.value}
                        handleChange={(e) => {field.onChange(e)}}
                        gridProps={{ size: { xs: 12, sm: 6 } }}
                      />
                    )}
                  />

                  {errors?.workStatus && <FormHelperText error>{errors?.workStatus?.message}</FormHelperText>}
                </Grid>
              </Grid>
              {workStatus === 'experienced' &&
                <Grid container spacing={5} size={{ xs: 12, sm: 6 }}>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth error={Boolean(errors?.years || errors?.months)}>
                      <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>
                        Total Experience <span className="text-error">*</span>
                      </FormLabel>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: selectedYears !== '31' ? 6 : 12 }}>
                          <Controller
                            name="years"
                            control={control}
                            rules={{
                              required: 'This field is required',
                            }}
                            render={({ field }) => (
                              <Autocomplete
                                fullWidth
                                {...field}
                                options={yearsOpt ? (selectedMonths === '0' || selectedMonths === ''  ? yearsOpt?.filter(option => option.value !== '0') : yearsOpt) : []}
                                value={
                                  selectedMonths === '0' && field.value === '0'
                                    ? null
                                    : yearsOpt.find(option => option.value === field.value) || null
                                }
                                getOptionKey={option => option.value}
                                getOptionLabel={(option) => option.label || ''}
                                onChange={(event, value) => {
                                  field.onChange(value?.value || '')
                                }}
                                renderInput={(params) => (
                                  <CustomTextField
                                    {...params}
                                    error={!!errors?.years}
                                    helperText={errors?.years?.message}
                                    placeholder='Years'
                                  />
                                )}
                              />
                            )}
                          />
                        </Grid>
                        {selectedYears !== '31' &&
                          <Grid size={{ xs: 6 }}>
                            <Controller
                              name="months"
                              control={control}
                              rules={{
                                required: 'This field is required',
                              }}
                              render={({ field }) => (
                                <Autocomplete
                                  fullWidth
                                  {...field}
                                  getOptionKey={option => option.value}
                                  getOptionLabel={(option) => option.label || ''}
                                  options={selectedYears === '0' ? monthsOpt.filter(option => option.value !== '0') : monthsOpt}
                                  value={
                                    selectedYears === '0' && field.value === '0'
                                      ? null
                                      : monthsOpt.find(option => option.value === field.value) || null
                                  }
                                  onChange={(event, value) => {
                                    field.onChange(value?.value || '')
                                  }}
                                  renderInput={(params) => (
                                    <CustomTextField
                                      {...params}
                                      error={!!errors?.months}
                                      helperText={errors?.months?.message}
                                      placeholder='Months'
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                        }
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="currentCTC"
                      control={control}
                      rules={{
                        required: 'This field is required',
                        validate: {
                          isValidCTC: (value) => {

                            // Remove commas from the value for proper numeric validation
                            const sanitizedValue = value.replace(/,/g, '');

                            // Validate the sanitized value to ensure it's a numeric value with an optional decimal part (up to 2 digits)
                            if (!/^\d+(\.\d{1,2})?$/.test(sanitizedValue)) {

                              return 'Please enter a valid CTC (numeric value, optionally with 2 decimal places)';
                            }

                            return true;
                          },
                        },
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          fullWidth
                          label={
                            <>
                              Current CTC <span className="text-error">*</span>
                            </>
                          }
                          error={!!errors.currentCTC}
                          helperText={errors.currentCTC?.message}
                          {...field}
                          placeholder="Eg. 4,24,000"
                          value={formatCTC(field.value)}
                          onInput={(e) => {

                            const sanitizedValue = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');

                            field.onChange(sanitizedValue);
                          }}
                          inputProps={{
                            maxLength: 12,  // Optional: restrict the length of the number
                            pattern: '[0-9.,]*',  // Allow numbers and one dot for decimal
                            inputMode: 'decimal',  // Enable numeric keypad with decimal on mobile
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              }
              {!candidateData?.cv_path &&
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name='cv'
                    rules={{
                      required: 'This field is required'
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        label={<>Resume <span className='text-error'>*</span></>}
                        onChange={(e) => {
                          const file = e.target.files[0];

                          field.onChange(file);
                        }}
                        accept="application/pdf"
                        type='file'
                        error={!!errors.cv}
                        helperText={errors.cv?.message}
                      />
                    )}
                  />
                </Grid>
              }
            </Grid>
          </TabPanel>
          <TabPanel value='experience'>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                {experienceField.map((item, index) => {

                  const isCurrentJob = watch(`experiences[${index}].isCurrent`)

                  // Function to handle checkbox selection
                  const handleCheckboxChange = (index) => {

                    // Uncheck all checkboxes
                    experienceField.forEach((_, i) => {
                      setValue(`experiences[${i}].isCurrent`, false);
                    });

                    // Check the selected checkbox
                    setValue(`experiences[${index}].isCurrent`, true);
                  };

                  return (
                    <div
                      key={index}
                      className={classNames('repeater-item flex relative mbe-4 border rounded')}
                    >
                      <Grid container spacing={5} className='flex.5m-0 p-5 flex-1'>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller name={`experiences[${index}].jobTitle`} control={control}
                            rules={{
                              required: 'This field is required.',
                            }}
                            render={({ field }) => (
                              <CustomTextField fullWidth required={false} label={<>Job Title <span className='text-error'>*</span></>}
                                error={!!errors?.experiences?.[index]?.jobTitle} helperText={errors?.experiences?.[index]?.jobTitle?.message} {...field} />
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller name={`experiences[${index}].company`} control={control}
                            rules={{
                              required: 'This field is required.',
                            }}
                            render={({ field }) => (
                              <CustomTextField fullWidth required={false} label={<>Company <span className='text-error'>*</span></>}
                                error={!!errors?.experiences?.[index]?.company} helperText={errors?.experiences?.[index]?.company?.message} {...field} />
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller name={`experiences[${index}].location`} control={control}
                            rules={{
                              required: 'This field is required.',
                            }}
                            render={({ field }) => (
                              <CustomTextField fullWidth required={false} label={<>Location <span className='text-error'>*</span></>}
                                error={!!errors?.experiences?.[index]?.location} helperText={errors?.experiences?.[index]?.location?.message} {...field} />
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Controller name={`experiences[${index}].startDate`} control={control}
                            rules={{
                              required: 'This field is required.',
                            }}
                            render={({ field }) => (
                              <AppReactDatepicker
                                selected={field.value} onChange={field.onChange}
                                showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                                placeholderText="YYYY/MM/DD"
                                maxDate={new Date()}
                                customInput={
                                  <CustomTextField
                                    {...field}
                                    label={<>Start Date {<span className='text-error'>*</span> }</>}
                                    fullWidth
                                    required
                                    error={Boolean(errors?.experiences?.[index]?.startDate)}
                                    helperText={errors?.experiences?.[index]?.startDate?.message}
                                  />
                                }
                              />
                            )}
                          />
                        </Grid>
                        {!isCurrentJob && (
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <Controller
                              name={`experiences[${index}].endDate`}
                              control={control}
                              rules={{
                                required: 'This field is required.',
                              }}
                              render={({ field }) => (
                                <AppReactDatepicker
                                  selected={field.value}
                                  onChange={field.onChange}
                                  showYearDropdown
                                  showMonthDropdown
                                  dateFormat="yyyy/MM/dd"
                                  placeholderText="YYYY/MM/DD"
                                  maxDate={new Date()}
                                  customInput={
                                    <CustomTextField
                                      {...field}
                                      label={
                                        <>
                                          End Date <span className='text-error'>*</span>
                                        </>
                                      }
                                      fullWidth
                                      required
                                      error={Boolean(errors?.experiences?.[index]?.endDate)}
                                      helperText={errors?.experiences?.[index]?.endDate?.message}
                                    />
                                  }
                                />
                              )}
                            />
                          </Grid>
                        )}
                        <Grid size={{ xs: 12 }}>
                          <FormControl error={Boolean(errors.checkbox)}>
                            <Controller
                              name={`experiences[${index}].isCurrent`}
                              control={control}
                              rules={{ required: false }}
                              render={({ field }) => (
                                <FormControlLabel control={<Checkbox {...field} checked={field.value} onChange={() => {handleCheckboxChange(index); field.onChange(!field.value); }} />} label='Currently working in this role' />
                              )}
                            />
                            {errors?.experiences?.[index]?.isCurrent && <FormHelperText error>This field is required.</FormHelperText>}
                          </FormControl>
                        </Grid>
                      </Grid>
                      {index !== 0 && (
                        <div className='flex flex-col justify-start border-is'>
                          <IconButton size='small' color='error' onClick={() => removeExperience(index)}>
                            <i className='tabler-x text-2xl' />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  )
                })}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  size='small'
                  variant="tonal"
                  color="primary"
                  onClick={() =>
                    appendExperience({
                      jobTitle: '',
                      company: '',
                      location: '',
                      startDate: null,
                      endDate: null,
                      isCurrent: false
                    })
                  }
                >
                  Add More Experience
                </Button>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value='education'>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                {educationField.map((item, index) => {

                  return (
                    <div
                      key={index}
                      className={classNames('repeater-item flex relative mbe-4 border rounded')}
                    >
                      <Grid container spacing={5} className='flex.5m-0 p-5 flex-1'>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller name={`educations[${index}].educationLevel`} control={control}
                            rules={{
                              required: 'This field is required.',
                            }}
                            render={({ field }) => (
                              <CustomTextField
                                fullWidth
                                select
                                required={false}
                                label={<>Education Level <span className='text-error'>*</span></>}
                                error={!!errors?.educations?.[index]?.educationLevel}
                                helperText={errors?.educations?.[index]?.educationLevel?.message}
                                {...field}
                              >
                                <MenuItem value='10th'>10th</MenuItem>
                                <MenuItem value='12th'>12th</MenuItem>
                                <MenuItem value='UG'>UG</MenuItem>
                                <MenuItem value='PG'>PG</MenuItem>
                                <MenuItem value='PHD'>PHD</MenuItem>
                              </CustomTextField>
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller name={`educations[${index}].degree`} control={control}

                            render={({ field }) => (
                              <CustomTextField fullWidth required={false} label='Degree'
                                error={!!errors?.educations?.[index]?.degree} helperText={errors?.educations?.[index]?.degree?.message} {...field} />
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller name={`educations[${index}].branchOrBoard`} control={control}
                            render={({ field }) => (
                              <CustomTextField fullWidth required={false} label={<>Branch or Board</>}
                                error={!!errors?.educations?.[index]?.company} helperText={errors?.educations?.[index]?.branchOrBoard?.message} {...field} />
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller name={`educations[${index}].schoolOrInstitute`} control={control}
                            render={({ field }) => (
                              <CustomTextField fullWidth required={false} label={<>School or Institute</>}
                                error={!!errors?.educations?.[index]?.schoolOrInstitute} helperText={errors?.educations?.[index]?.schoolOrInstitute?.message} {...field} />
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller name={`educations[${index}].gradeType`} control={control}
                            render={({ field }) => (
                              <CustomTextField fullWidth required={false} label='Grade Type'
                                error={!!errors?.educations?.[index]?.gradeType} helperText={errors?.educations?.[index]?.gradeType?.message} {...field} />
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller name={`educations[${index}].gradeValue`} control={control}
                            render={({ field }) => (
                              <CustomTextField fullWidth required={false} label='Grade Value'
                                error={!!errors?.educations?.[index]?.gradeValue} helperText={errors?.educations?.[index]?.gradeValue?.message} {...field} />
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Controller name={`educations[${index}].passingYear`} control={control}
                            render={({ field }) => (
                              <AppReactDatepicker
                                selected={field.value} onChange={field.onChange}
                                showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                                placeholderText="YYYY/MM/DD"
                                maxDate={new Date()}
                                customInput={
                                  <CustomTextField
                                    {...field}
                                    label='Passing Year'
                                    fullWidth
                                    required
                                    error={Boolean(errors?.educations?.[index]?.passingYear)}
                                    helperText={errors?.educations?.[index]?.passingYear?.message}
                                  />
                                }
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                      {index !== 0 && (
                        <div className='flex flex-col justify-start border-is'>
                          <IconButton size='small' color='error' onClick={() => removeEducation(index)}>
                            <i className='tabler-x text-2xl' />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  )
                })}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  size='small'
                  variant="tonal"
                  color="primary"
                  onClick={() =>
                    appendEducation({
                      educationLevel: '',
                      degree: '',
                      branchOrBoard: '',
                      schoolOrInstitute: '',
                      gradeType: '',
                      gradeValue: '',
                      passingYear: null
                    })
                  }
                >
                  Add More Education
                </Button>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
        <Divider />
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2' disabled={loading}>
            {loading && <CircularProgress size={20} color='inherit' />}
            Submit & Apply
          </Button>
          <Button type='reset' variant='tonal' color='secondary' onClick={() => {reset();}}>
            Reset
          </Button>
        </CardActions>
      </form>
    </TabContext>
  )

}

export default AddCandidateForm
