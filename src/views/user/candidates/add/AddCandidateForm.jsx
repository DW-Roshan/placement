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

import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, Tab } from '@mui/material'

// Components Imports
import classNames from 'classnames'

import { TabContext, TabList, TabPanel } from '@mui/lab'

import { useSession } from 'next-auth/react'

import CustomTextField from '@core/components/mui/TextField'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// import { getCookie } from '@/utils/cookies'

import { experienceData, MenuProps } from '@/configs/customDataConfig'

import { formatCTC } from '@/utils/formatCTC'

import CustomInputVertical from '@/@core/components/custom-inputs/Vertical'

const AddCandidateForm = ({candidateId}) => {
  // States
  const [data, setData] = useState();
  const [cities, setCities] = useState();
  const [industries, setIndustries] = useState();
  const [departments, setDepartments] = useState();
  const [candidateData, setCandidateData] = useState();
  const { data: session } = useSession()
  const token = session?.user?.token

  const router = useRouter();
  const [value, setTabValue] = useState('personal_info')

  const [selected, setSelected] = useState('')

  console.log("candidateId:", candidateId);

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
          setSelected(jsonData.candidate.work_status || '')
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

        // setData(jsonData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setCities(null);
        setIndustries(null);
      }
    };

    fetchData();

  }, [token]);

  const { control, handleSubmit, watch, reset, setValue, setError, formState: { errors } } = useForm({

    values: {
      fullName: candidateData?.full_name || '',
      email: candidateData?.email || '',
      mobileNo: candidateData?.mobile_no || '',
      industry: candidateData?.industry_id || '',
      department: candidateData?.department_id || '',
      city: candidateData?.city_id || '',
      profileTitle: candidateData?.profile_title || '',
      profileSummary: candidateData?.profile_summary || '',
      workStatus: candidateData?.work_status || '',
      totalExperience: candidateData?.total_experience || '',
      currentCTC: candidateData?.current_ctc || '',
      experiences: candidateData?.experiences?.length
      ? candidateData.experiences.map((exp) => ({
          id: exp.id || null,
          company: exp.company_name || '',
          jobTitle: exp.job_title || '',
          location: exp.location || '',
          startDate: exp.start_date ? new Date(exp.start_date) : null,
          endDate: exp.end_date ? new Date(exp.end_date) : null,
          isCurrent: exp.is_current || false
        }))
      : [
        {
          company: '',
          jobTitle: '',
          location: '',
          startDate: null,
          endDate: null,
          isCurrent: false
        }
      ],
      createAccount: Boolean(candidateData?.password)
    }
  });

  // console.log("candidateData", candidateData);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'educations',
  });

  const { fields: experienceField, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experiences',
  });

  const onSubmit = async (data) => {

    console.log("data:", data);

    // Filter out completely blank experiences
    const filteredExperiences = data.experiences?.filter(exp =>
      exp.jobTitle || exp.company || exp.location || exp.startDate
    ) || [];

    const payload = {
      ...data,
      experiences: filteredExperiences
    };

    // const token = await getCookie('token');

    if(token){

      if(candidateId){

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidates/${candidateId}`, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
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

      } else {

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
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleChange = (prop) => {
    setSelected(prop)

    console.log("work status", prop)
  }



  return (
    <Card className='overflow-visible'>
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

                          const cleaned = value.replace(/\D/g, '');
                          const normalized = cleaned.replace(/^(\+91|0)/, '');

                          if (!/^[6-9]\d{9}$/.test(normalized)) {

                            return 'Please enter a valid 10-digit mobile number';
                          }

                          return true;
                        },
                      }
                    }}
                    render={({ field }) => (
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
                        getOptionKey={option => option.id}
                        getOptionLabel={(industry) => industry.name || ''}
                        onChange={(event, value) => {
                            field.onChange(value?.id || '');
                            setDepartments(value?.departments || null);
                            setValue('department', '')
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
                {/* <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="city"
                    control={control}
                    rules={{
                      required: 'This field is required',
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        required={false}
                        label={<>Current City <span className='text-error'>*</span></>}
                        error={!!errors?.city}
                        helperText={errors?.city?.message}
                        {...field}
                      />
                    )}
                  />
                </Grid> */}
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

                          // data={{ ...item, asset }}

                          selected={field.value}

                          // handleChange={(e) => console.log("value change:", e)}

                          handleChange={(e) => {handleChange(e); field.onChange(e)}}
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

                          // data={{ ...item, asset }}

                          selected={field.value}

                          // handleChange={(e) => field.onChange(e)}

                          handleChange={(e) => {handleChange(e); field.onChange(e)}}
                          gridProps={{ size: { xs: 12, sm: 6 } }}
                        />
                      )}
                    />

                    {errors?.workStatus && <FormHelperText error>{errors?.workStatus?.message}</FormHelperText>}
                  </Grid>
                </Grid>
                {selected === 'experienced' &&
                  <Grid container spacing={5} size={{ xs: 12, sm: 6 }}>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="totalExperience"
                        control={control}
                        rules={{
                          required: 'This field is required',
                        }}
                        render={({ field }) => (
                          <CustomTextField
                            select
                            fullWidth
                            label={<>Total Experience {<span className='text-error'>*</span> }</>}
                            {...field}
                            error={Boolean(errors?.totalExperience)}
                            helperText={errors?.totalExperience?.message}
                            SelectProps={{ MenuProps }}
                          >
                            {experienceData && experienceData.length > 0 ? experienceData.map((experience, index) => (
                              <MenuItem key={index} value={experience}>
                                {experience}
                              </MenuItem>
                            )) :(
                              <MenuItem>No records found</MenuItem>
                            )}
                          </CustomTextField>
                        )}
                      />
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

                            // Set placeholder with default formatted CTC

                            placeholder="4,24,000"
                            value={formatCTC(field.value)}  // Apply formatting to the value here
                            onInput={(e) => {

                              // Allow only digits and one dot for decimal separator

                              const sanitizedValue = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');

                              field.onChange(sanitizedValue);  // Update value in form
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
                    {/* <Grid size={{ xs: 12 }}>
                      <Controller
                        name="currentCTC"
                        control={control}
                        rules={{
                          required: 'This field is required',
                          validate: {
                            isValidCTC: (value) => {
                              // Check if the value is a valid number and not negative
                              if (!/^\d+$/.test(value)) {
                                return 'Please enter a valid CTC (numeric value)';
                              }
                              return true;
                            },
                          },
                        }}
                        render={({ field }) => (
                          <CustomTextField
                            fullWidth
                            label={<>Current CTC <span className='text-error'>*</span></>}
                            error={!!errors.currentCTC}
                            helperText={errors.currentCTC?.message}
                            {...field}
                            onInput={(e) => {
                              // Remove any non-digit characters
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                              field.onChange(e); // Manually trigger onChange to update the value in the form
                            }}
                            inputProps={{
                              maxLength: 10, // Limit the length to 10 characters (to support up to 10 digits)
                              pattern: '[0-9]*', // Restrict to numeric input on mobile
                              inputMode: 'numeric', // Optimize for numeric input on mobile
                            }}
                          />
                        )}
                      />
                    </Grid> */}
                  </Grid>

                }

                <Grid size={{ xs: 12 }}>
                  <FormControl error={Boolean(errors.checkbox)}>
                    <Controller
                      name='createAccount'
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label='Create Account' />
                      )}
                    />
                    <FormHelperText>Mobile No. will be default password</FormHelperText>
                    {errors.createAccount && <FormHelperText error>{errors.createAccount}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value='experience'>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                  {experienceField.map((item, index) => {
                    // const fromStation = watch(`journeys[${index}].fromStation`);
                    // const toStation = watch(`journeys[${index}].toStation`);

                    const isCurrentJob = watch(`experiences[${index}].isCurrent`)

                    console.log("isCurrentJob", isCurrentJob);

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
                                  error={!!errors?.experiences?.[index]?.location} helperText={errors?.experiences?.[index]?.jobTitle?.location} {...field} />
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
                {/* <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    label='Username'
                    placeholder='johnDoe'
                    // value={formData.username}
                    // onChange={e => setFormData({ ...formData, username: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    type='email'
                    label='Email'
                    placeholder='johndoe@gmail.com'
                    // value={formData.email}
                    // onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </Grid> */}
                {/* <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    label='Password'
                    placeholder='············'
                    id='form-layout-tabs-password'
                    // type={formData.isPasswordShown ? 'text' : 'password'}
                    // value={formData.password}
                    // onChange={e => setFormData({ ...formData, password: e.target.value })}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={handleClickShowPassword}
                              onMouseDown={e => e.preventDefault()}
                              aria-label='toggle password visibility'
                            >
                              <i className={formData.isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                </Grid> */}
                {/* <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    label='Confirm Password'
                    placeholder='············'
                    id='form-layout-tabs-confirm-password'
                    type={formData.setIsConfirmPasswordShown ? 'text' : 'password'}
                    // value={formData.confirmPassword}
                    // onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={e => e.preventDefault()}
                              aria-label='toggle password visibility'
                            >
                              <i className={formData.setIsConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                </Grid> */}
              </Grid>
            </TabPanel>
            <TabPanel value='education'>
              <Grid container spacing={6}>
                {/* <Grid size={{ xs: 12 }}>
                  {experienceField.map((item, index) => {
                    // const fromStation = watch(`journeys[${index}].fromStation`);
                    // const toStation = watch(`journeys[${index}].toStation`);

                    return (
                      <div
                        key={index}
                        className={classNames('repeater-item flex relative mbe-4 border rounded')}
                      >
                        <Grid container spacing={5} className='flex.5m-0 p-5'>
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
                                  error={!!errors?.experiences?.[index]?.location} helperText={errors?.experiences?.[index]?.jobTitle?.location} {...field} />
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
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <Controller name={`experiences[${index}].endDate`} control={control}
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
                                      label={<>End Date {<span className='text-error'>*</span> }</>}
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
                          <Grid size={{ xs: 12 }}>
                            <FormControl error={Boolean(errors.checkbox)}>
                              <Controller
                                name={`experiences[${index}].isCurrent`}
                                control={control}
                                rules={{ required: false }}
                                render={({ field }) => (
                                  <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label='Currently working in this role' />
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
                    Add More Education
                  </Button>
                </Grid> */}
              </Grid>
              {/* <Grid container spacing={6}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    label='Twitter'
                    placeholder='https://twitter.com/johndoe'
                    // value={formData.twitter}
                    // onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    label='Facebook'
                    placeholder='https://facebook.com/johndoe'
                    // value={formData.facebook}
                    // onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    label='Google+'
                    placeholder='https://plus.google.com/johndoe'
                    // value={formData.google}
                    // onChange={e => setFormData({ ...formData, google: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    label='LinkedIn'
                    placeholder='https://linkedin.com/johndoe'
                    // value={formData.linkedin}
                    // onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    label='Instagram'
                    placeholder='https://instagram.com/johndoe'
                    // value={formData.instagram}
                    // onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    label='Quora'
                    placeholder='https://quora.com/johndoe'
                    // value={formData.quora}
                    // onChange={e => setFormData({ ...formData, quora: e.target.value })}
                  />
                </Grid>
              </Grid> */}
            </TabPanel>
          </CardContent>
          <Divider />
          <CardActions>
            <Button type='submit' variant='contained' className='mie-2'>
              Submit
            </Button>
            <Button type='reset' variant='tonal' color='secondary' onClick={() => {reset(); setSelected(candidateData?.work_status || ''); setDepartments(industries.find( industry =>  industry.id === candidateData?.industry_id)?.departments || [])}}>
              Reset
            </Button>
          </CardActions>
        </form>
      </TabContext>
    </Card>
  )

  // return (
  //   <Card className='overflow-visible'>
  //     <CardHeader title='Add Candidate' />
  //     <Divider />
  //     <form onSubmit={handleSubmit(onSubmit)}>
  //       <CardContent>
  //         <Grid container spacing={5}>
  //           <Grid size={{ xs: 12, sm: 6 }}>
  //             <Controller name="fullName" control={control}
  //               rules={{
  //                 required: 'This field is required.',

  //               }}
  //               render={({ field }) => (
  //                 <CustomTextField fullWidth label={<>Full Name <span className='text-error'>*</span></>}
  //                   required={false}
  //                   error={!!errors?.fullName} helperText={errors?.fullName?.message} {...field} />
  //               )} />
  //           </Grid>
  //           <Grid size={{ xs: 12, sm: 6 }}>
  //             <Controller name="email" control={control}
  //               rules={{
  //                 required: 'This field is required.',
  //                 pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' }
  //               }}
  //               render={({ field }) => (
  //                 <CustomTextField fullWidth required={false} label={<>Email <span className='text-error'>*</span></>} type="email"
  //                   error={!!errors.email} helperText={errors.email?.message} {...field} />
  //               )} />
  //           </Grid>
  //           <Grid size={{ xs: 12, sm: 6 }}>
  //             <Controller
  //               name="mobileNo"
  //               control={control}
  //               rules={{
  //                 required: 'This field is required',
  //                 validate: {
  //                   length: (value) => {
  //                     // First, check the length (should be exactly 10 digits)
  //                     if (value.length !== 10) {
  //                       return 'Please enter your 10 digit Mobile Number';
  //                     }
  //                     return true;
  //                   },
  //                   pattern: (value) => {
  //                     // Then, check if the number starts with 7, 8, or 9 and is followed by 9 digits
  //                     if (!/^[689]\d{9}$/.test(value)) {
  //                       return 'Please enter a valid mobile number';
  //                     }
  //                     return true;
  //                   },
  //                 }
  //               }}
  //               render={({ field }) => (
  //                 <CustomTextField
  //                   fullWidth
  //                   required={false}
  //                   label={<>Mobile No. <span className='text-error'>*</span></>}
  //                   error={!!errors.mobileNo}
  //                   helperText={errors.mobileNo?.message}
  //                   {...field}
  //                   onInput={(e) => {
  //                     // Remove any non-digit characters
  //                     e.target.value = e.target.value.replace(/[^0-9]/g, '');
  //                   }}
  //                   inputProps={{
  //                     maxLength: 10, // Limit the length to 10 characters
  //                     pattern: '[0-9]*', // Prevents non-numeric input on mobile devices
  //                     inputMode: 'numeric', // For better mobile experience
  //                   }}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, sm: 6 }}>
  //             <Controller
  //               name="city"
  //               control={control}
  //               rules={{
  //                 required: 'This field is required',
  //               }}
  //               render={({ field }) => (
  //                 <CustomTextField
  //                   fullWidth
  //                   required={false}
  //                   label={<>Current City. <span className='text-error'>*</span></>}
  //                   error={!!errors?.city}
  //                   helperText={errors?.city?.message}
  //                   {...field}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, sm: 6 }}>
  //             <Controller
  //               name="city"
  //               control={control}
  //               rules={{
  //                 required: 'This field is required',
  //               }}
  //               render={({ field }) => (<>
  //                 <CustomInputVertical
  //                   type='radio'
  //                   data={{
  //                     meta: 'Free',
  //                     title: 'Experienced',
  //                   }}
  //                   // data={{ ...item, asset }}
  //                   // selected={selected}
  //                   name='workStatus'
  //                   // handleChange={handleChange}
  //                   gridProps={{ size: { xs: 12, sm: 4 } }}
  //                 />
  //                 <CustomInputVertical
  //                   type='radio'
  //                   data={{
  //                     meta: 'Free',
  //                     title: 'Experienced',
  //                   }}
  //                   // data={{ ...item, asset }}
  //                   // selected={selected}
  //                   name='workStatus'
  //                   // handleChange={handleChange}
  //                   gridProps={{ size: { xs: 12, sm: 4 } }}
  //                 /></>
  //               )}
  //             />
  //           </Grid>

  //           {/* <Grid size={{ xs: 12 }}>
  //             sdfs
  //             {experienceField.map((item, index) => {
  //               // const fromStation = watch(`journeys[${index}].fromStation`);
  //               // const toStation = watch(`journeys[${index}].toStation`);

  //               return (
  //                 <div
  //                   key={index}
  //                   className={classNames('repeater-item flex relative mbe-4 border rounded')}
  //                 >
  //                   <Grid container spacing={5} className='flex.5m-0 p-5'>
  //                     <Grid size={{ xs: 12, sm: 4 }}>
  //                       <Controller name={`experiences[${index}].jobTitle`} control={control}
  //                         rules={{
  //                           required: 'This field is required.',
  //                         }}
  //                         render={({ field }) => (
  //                           <CustomTextField fullWidth required={false} label={<>Job Title <span className='text-error'>*</span></>}
  //                             error={!!errors?.experiences?.[index]?.jobTitle} helperText={errors?.experiences?.[index]?.jobTitle?.message} {...field} />
  //                         )}
  //                       />
  //                     </Grid>
  //                     <Grid size={{ xs: 12, sm: 4 }}>
  //                       <Controller name={`experiences[${index}].company`} control={control}
  //                         rules={{
  //                           required: 'This field is required.',
  //                         }}
  //                         render={({ field }) => (
  //                           <CustomTextField fullWidth required={false} label={<>Company <span className='text-error'>*</span></>}
  //                             error={!!errors?.experiences?.[index]?.company} helperText={errors?.experiences?.[index]?.company?.message} {...field} />
  //                         )}
  //                       />
  //                     </Grid>
  //                     <Grid size={{ xs: 12, sm: 4 }}>
  //                       <Controller name={`experiences[${index}].location`} control={control}
  //                         rules={{
  //                           required: 'This field is required.',
  //                         }}
  //                         render={({ field }) => (
  //                           <CustomTextField fullWidth required={false} label={<>Location <span className='text-error'>*</span></>}
  //                             error={!!errors?.experiences?.[index]?.location} helperText={errors?.experiences?.[index]?.jobTitle?.location} {...field} />
  //                         )}
  //                       />
  //                     </Grid>
  //                     <Grid size={{ xs: 12, sm: 3 }}>
  //                       <Controller name={`experiences[${index}].startDate`} control={control}
  //                         rules={{
  //                           required: 'This field is required.',
  //                         }}
  //                         render={({ field }) => (
  //                           <AppReactDatepicker
  //                             selected={field.value} onChange={field.onChange}
  //                             showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
  //                             placeholderText="YYYY/MM/DD"
  //                             maxDate={new Date()}
  //                             customInput={
  //                               <CustomTextField
  //                                 {...field}
  //                                 label={<>Start Date {<span className='text-error'>*</span> }</>}
  //                                 fullWidth
  //                                 required
  //                                 error={Boolean(errors?.experiences?.[index]?.startDate)}
  //                                 helperText={errors?.experiences?.[index]?.startDate?.message}
  //                               />
  //                             }
  //                           />
  //                         )}
  //                       />
  //                     </Grid>
  //                     <Grid size={{ xs: 12, sm: 3 }}>
  //                       <Controller name={`experiences[${index}].endDate`} control={control}
  //                         rules={{
  //                           required: 'This field is required.',
  //                         }}
  //                         render={({ field }) => (
  //                           <AppReactDatepicker
  //                             selected={field.value} onChange={field.onChange}
  //                             showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
  //                             placeholderText="YYYY/MM/DD"
  //                             maxDate={new Date()}
  //                             customInput={
  //                               <CustomTextField
  //                                 {...field}
  //                                 label={<>End Date {<span className='text-error'>*</span> }</>}
  //                                 fullWidth
  //                                 required
  //                                 error={Boolean(errors?.experiences?.[index]?.endDate)}
  //                                 helperText={errors?.experiences?.[index]?.endDate?.message}
  //                               />
  //                             }
  //                           />
  //                         )}
  //                       />
  //                     </Grid>
  //                     <Grid size={{ xs: 12 }}>
  //                       <FormControl error={Boolean(errors.checkbox)}>
  //                         <Controller
  //                           name={`experiences[${index}].isCurrent`}
  //                           control={control}
  //                           rules={{ required: false }}
  //                           render={({ field }) => (
  //                             <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label='Currently working in this role' />
  //                           )}
  //                         />
  //                         {errors?.experiences?.[index]?.isCurrent && <FormHelperText error>This field is required.</FormHelperText>}
  //                       </FormControl>
  //                     </Grid>
  //                   </Grid>
  //                   {index !== 0 && (
  //                     <div className='flex flex-col justify-start border-is'>
  //                       <IconButton size='small' color='error' onClick={() => removeExperience(index)}>
  //                         <i className='tabler-x text-2xl' />
  //                       </IconButton>
  //                     </div>
  //                   )}
  //                 </div>
  //               )
  //             })}
  //           </Grid> */}
  //           {/* <Grid size={{ xs: 12 }}>
  //             {fields.map((item, index) => {
  //               const fromStation = watch(`journeys[${index}].fromStation`);
  //               const toStation = watch(`journeys[${index}].toStation`);

  //               return (
  //                 <div
  //                   key={index}
  //                   className={classNames('repeater-item flex relative mbe-4 border rounded')}
  //                 >
  //                   <Grid container spacing={5} className='flex.5m-0 p-5'>
  //                     <Grid size={{ xs: 12, sm: 4 }}>
  //                       <Controller
  //                         name={`journeys[${index}].trainId`}
  //                         control={control}
  //                         rules={{ required: 'This field is required.' }}
  //                         render={({ field }) => (
  //                           <CustomTextField
  //                             select
  //                             fullWidth
  //                             label={<>Train No. {<span className='text-error'>*</span> }</>}
  //                             {...field}
  //                             error={Boolean(errors?.journeys?.[index]?.trainId)}
  //                             helperText={errors?.journeys?.[index]?.trainId?.message}
  //                             SelectProps={{ MenuProps }}
  //                           >
  //                             {data?.trains && data.trains.length ? data.trains.map((train) => (
  //                               <MenuItem key={train.id} value={train.id}>
  //                                 {train.train_no}
  //                               </MenuItem>
  //                             )) :(
  //                               <MenuItem>No records found</MenuItem>
  //                             )}
  //                           </CustomTextField>
  //                         )}
  //                       />
  //                     </Grid>
  //                     <Grid size={{ xs: 12, sm: 4 }}>
  //                       <Controller
  //                         name={`journeys[${index}].fromStation`}
  //                         control={control}
  //                         rules={{ required: 'This field is required.' }}
  //                         render={({ field }) => (
  //                           <CustomTextField
  //                             select
  //                             fullWidth
  //                             label={<>Form Station {<span className='text-error'>*</span> }</>}
  //                             {...field}
  //                             SelectProps={{ MenuProps }}
  //                             helperText={errors?.journeys?.[index]?.fromStation?.message}
  //                             error={Boolean(errors?.journeys?.[index]?.fromStation)}
  //                           >
  //                             {data?.stations && data?.stations.length > 0 ? data?.stations.filter((station) => station.id !== toStation).map((station) => (
  //                               <MenuItem key={station.id} value={station.id}>
  //                                 <div className='w-full flex justify-between gap.5>
  //                                   {station.station_name}
  //                                   <Chip label={station.station_code} size='small' variant='tonal' color='success' />
  //                                 </div>
  //                               </MenuItem>
  //                             )) : (
  //                               <MenuItem>No records found</MenuItem>
  //                             )}
  //                           </CustomTextField>
  //                         )}
  //                       />
  //                     </Grid>
  //                     <Grid size={{ xs: 12, sm: 4 }}>
  //                       <Controller
  //                         name={`journeys[${index}].toStation`}
  //                         control={control}
  //                         rules={{ required: 'This field is required.' }}
  //                         render={({ field }) => (
  //                           <CustomTextField
  //                             select
  //                             fullWidth
  //                             label={<>To Station {<span className='text-error'>*</span> }</>}
  //                             {...field}
  //                             SelectProps={{ MenuProps }}
  //                             helperText={errors?.journeys?.[index]?.toStation?.message}
  //                             error={Boolean(errors?.journeys?.[index]?.toStation)}
  //                           >
  //                             {data?.stations && data?.stations.length > 0 ? data?.stations.filter((station) => station.id !== fromStation).map((station) => (
  //                               <MenuItem key={station.id} value={station.id}>
  //                                 <div className='w-full flex justify-between gap.5>
  //                                   {station.station_name}
  //                                   <Chip label={station.station_code} size='small' variant='tonal' color='success' />
  //                                 </div>
  //                               </MenuItem>
  //                             )) : (
  //                               <MenuItem>No records found</MenuItem>
  //                             )}
  //                           </CustomTextField>
  //                         )}
  //                       />
  //                     </Grid>
  //                     <Grid size={{ xs: 12, sm: 3 }}>
  //                       <Controller name={`journeys[${index}].departureDate`} control={control}
  //                         rules={{
  //                           required: 'This field is required.',
  //                           validate: (_, allValues) => {

  //                             if (index === 0) return true; // Skip first item

  //                             const currentDeparture = allValues?.journeys?.[index]?.departureDate;
  //                             const currentLeftTime = allValues?.journeys?.[index]?.departureTime;

  //                             const prevArrival = allValues?.journeys?.[index - 1]?.arrivedDate;
  //                             const prevArrivedTime = allValues?.journeys?.[index - 1]?.arrivedTime;

  //                             if (!currentDeparture || !prevArrival ) return true;

  //                             return new Date(currentDeparture) > new Date(prevArrival) || 'Departure Time must be greater then previous Arrival Time.';
  //                           }
  //                         }}
  //                         render={({ field }) => (
  //                           <AppReactDatepicker
  //                             selected={field.value} onChange={field.onChange}
  //                             showYearDropdown showMonthDropdown showTimeSelect dateFormat="yyyy/MM/dd HH:mm" timeFormat="HH:mm"
  //                             placeholderText="YYYY/MM/DD HH:mm"
  //                             maxDate={new Date()}
  //                             customInput={
  //                               <CustomTextField
  //                                 {...field}
  //                                 label={<>Departure Date and Time {<span className='text-error'>*</span> }</>}
  //                                 fullWidth
  //                                 required
  //                                 helperText={errors?.journeys?.[index]?.departureDate?.message}
  //                                 error={Boolean(errors?.journeys?.[index]?.departureDate)}
  //                               />
  //                             }
  //                           />
  //                         )}
  //                       />
  //                     </Grid>
  //                     <Grid size={{ xs: 12, sm: 3 }}>
  //                       <Controller
  //                         name={`journeys[${index}].arrivedDate`}
  //                         rules={{
  //                           required: 'This field is required.',
  //                           validate: (_, allValues) => {
  //                             const arrival = allValues?.journeys?.[index]?.arrivedDate;
  //                             const departure = allValues?.journeys?.[index]?.departureDate;

  //                             if (!arrival || !departure) return true;

  //                             return new Date(arrival) > new Date(departure) || 'Arrival time must be greater then departure time.';
  //                           }

  //                         }}
  //                         control={control}
  //                         render={({ field }) => {

  //                           const departureDate = watch(`journeys[${index}].departureDate`);

  //                           return (
  //                             <AppReactDatepicker
  //                               selected={field.value} onChange={field.onChange}
  //                               showYearDropdown showMonthDropdown showTimeSelect dateFormat="yyyy/MM/dd HH:mm" timeFormat="HH:mm"
  //                               placeholderText="YYYY/MM/DD HH:mm"
  //                               minDate={departureDate || undefined}
  //                               maxDate={new Date()}
  //                               customInput={
  //                                 <CustomTextField
  //                                   {...field}
  //                                   label={<>Arrived Date and Time {<span className='text-error'>*</span> }</>}
  //                                   fullWidth
  //                                   required
  //                                   helperText={errors?.journeys?.[index]?.arrivedDate?.message}
  //                                   error={Boolean(errors?.journeys?.[index]?.arrivedDate)}
  //                                 />
  //                               }
  //                             />
  //                           )
  //                         }}
  //                       />
  //                     </Grid>
  //                   </Grid>
  //                   {index !== 0 && (
  //                     <div className='flex flex-col justify-start border-is'>
  //                       <IconButton size='small' color='error' onClick={() => remove(index)}>
  //                         <i className='tabler-x text-2xl' />
  //                       </IconButton>
  //                     </div>
  //                   )}
  //                 </div>
  //               )
  //             })}
  //           </Grid> */}
  //           {/* <Grid size={{ xs: 12 }}>
  //             <Button
  //               size='small'
  //               variant="tonal"
  //               color="primary"
  //               onClick={() =>
  //                 appendExperience({
  //                   jobTitle: '',
  //                   company: '',
  //                   location: '',
  //                   startDate: null,
  //                   endDate: null,
  //                   isCurrent: false
  //                 })
  //               }
  //             >
  //               Add More Experience
  //             </Button>
  //           </Grid> */}
  //           {/* <Grid size={{ xs: 12 }}>
  //             <Button
  //               size='small'
  //               variant="tonal"
  //               color="primary"
  //               onClick={() =>
  //               append({
  //                 departureDate: '',
  //                 trainId: '',
  //                 departureTime: '',
  //                 arrivedDate: '',
  //                 arrivedTime: '',
  //                 fromStation: '',
  //                 toStation: '',
  //               })
  //               }
  //             >
  //               Add More
  //             </Button>
  //           </Grid> */}
  //         </Grid>
  //       </CardContent>
  //       <Divider />
  //       <CardActions>
  //         <Button type="submit" variant="contained">Submit</Button>
  //         <Button type="button" variant="tonal" color="secondary" onClick={() => reset()}>
  //           Reset
  //         </Button>
  //       </CardActions>
  //     </form>
  //   </Card>
  // )
}

export default AddCandidateForm
