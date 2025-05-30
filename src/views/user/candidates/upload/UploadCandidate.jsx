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

import { Controller, useForm } from 'react-hook-form'

import { Autocomplete, Card, CardContent, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, MenuItem } from '@mui/material'

import AppReactDropzone from '@/libs/styles/AppReactDropzone'

// import AddCandidateForm from '../add/AddCandidateForm'

import { formatCTC } from '@/utils/formatCTC'

import CustomTextField from '@/@core/components/mui/TextField'
import CustomInputVertical from '@/@core/components/custom-inputs/Vertical'

import { experienceData, MenuProps } from '@/configs/customDataConfig'

const UploadCandidate = () => {
  // States
  const [files, setFiles] = useState([])
  const [uploadedData, setUploadedData] = useState([]);
  const [selected, setSelected] = useState();
  const [cities, setCities] = useState();
  const [industries, setIndustries] = useState();
  const [departments, setDepartments] = useState();
  const { data: session } = useSession();
  const token = session?.user?.token;
  const router = useRouter();

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 2000000, // 2 MB
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop: async (acceptedFiles) => {
      // setFiles(acceptedFiles.map(file => Object.assign(file)))

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

          setFiles(acceptedFiles.map(file => Object.assign(file)))

          const data = await resCV.json();
          const workStatus = data?.experience ? 'experienced' : 'fresher';

          setUploadedData(data);
          setSelected(workStatus);
          console.log('Upload successful:', data);


          // You can show a success toast or update state here

        } catch (error) {
          console.error('Upload error:', error);
          toast.error('Upload failed. Please try again.', { autoClose: 3000 });
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


  const candidateForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5} className='mt-6'>
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

                    // Remove all non-digit characters to sanitize input
                    // Remove optional prefixes

                    const cleaned = value.replace(/\D/g, '');
                    const normalized = cleaned.replace(/^(\+91|0)/, '');

                    if (!/^[6-9]\d{11}$/.test(normalized)) {

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
                    // Allow digits and "+" only, prevent all other characters
                    e.target.value = e.target.value.replace(/[^0-9+]/g, '');
                  }}
                  inputProps={{
                    maxLength: 13, // Max: +91 + 10 digits = 13 characters
                    inputMode: 'tel', // best suited for phone numbers on mobile
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
                  options={ cities || [] }
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
                    // handleChange={(e) => console.log("value change:", e)}

                    selected={field.value}
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
                    // handleChange={(e) => field.onChange(e)}

                    selected={field.value}
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

          <Grid size={{ xs: 12 }}>
            <div className='buttons'>
              <Button type='submit' variant='contained' className='mie-2'>
                Upload Candidate
              </Button>
              <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                Remove All
              </Button>
            </div>
          </Grid>

        </Grid>
      </form>
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
              <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                <i className='tabler-upload' />
              </Avatar>
              <Typography variant='h4' className='mbe-2.5'>
                Drop files here or click to upload.
              </Typography>
              <Typography>Allowed *.pdf</Typography>
              <Typography>Only 1 file and max size of 2 MB</Typography>
            </div>
          </div>
          {files.length ? (
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
