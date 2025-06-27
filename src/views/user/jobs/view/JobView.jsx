'use client'

import dynamic from "next/dynamic";

import Grid from "@mui/material/Grid2";

import { Avatar, Card, CardContent, Divider, Typography } from "@mui/material"

import { formatDistanceToNow } from "date-fns";

import { getInitials } from "@/utils/getInitials"

import CustomChip from "@/@core/components/mui/Chip";

const JobView = ({ job }) => {

  const JobDescription = dynamic(() => import('../list/JobDescription'), { ssr: false });

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <div className='flex gap-3 justify-between'>
              <div className='flex-1'>
                <Typography variant='h4'>
                  {job?.job_title}
                </Typography>
                <Typography>
                  {job?.company_name}
                </Typography>
              </div>
              <div>
                <Avatar variant='square' sx={{ width: 80, height: 80}} alt={job?.company_name} src={''} >{getInitials(job?.company_name)}</Avatar>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className='flex gap-5'>
              <div className='flex gap-2 items-center'>
                <i className='tabler-briefcase text-[20px]' />
                <Typography>{job?.min_exp}-{job?.max_exp} Years</Typography>
              </div>
              <Divider orientation='vertical' variant="middle" sx={{ height: '18px' }} />
              <div className="flex gap-2 items-center">
                <i className='tabler-currency-rupee text-[20px]' />
                <Typography>{job?.min_ctc}-{job?.max_ctc} Lacs P.A.</Typography>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <i className='tabler-map-pin text-[20px]' />
              <Typography>{job?.locations?.map(loc => loc?.city_name).join(', ')}</Typography>
            </div>
          </Grid>
          <Grid size={{ xs:12 }}>
            <Divider />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className='flex gap-5 items-center'>
              <Typography variant='h6' className='flex gap-2'>Posted: <div className='text-[var(--mui-palette-text-primary)]'>{formatDistanceToNow(job?.created_at, {addSuffix: true})}</div></Typography>
              <Divider orientation='vertical' variant="middle" sx={{ height: '18px' }} />
              <Typography variant="h6" className='flex gap-2'>Openings: <div className='text-[var(--mui-palette-text-primary)]'>{job?.total_positions}</div></Typography>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='h5'>Job Description</Typography>
            <JobDescription html={job?.description} full />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='h5'>Roles and Responsibilities</Typography>
            <JobDescription html={job?.role_responsibility} full></JobDescription>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className='flex gap-2'>
              <Typography variant='h6'>Industry Type:</Typography><Typography>{job?.industry?.name}</Typography>
            </div>
            <div className='flex gap-2'>
              <Typography variant='h6'>Department:</Typography><Typography>{job?.department?.name}</Typography>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='h6'>Education</Typography>
            {job?.education.map((edu, index) => {
              return (
                <div key={index}>{edu}</div>
              )
            })}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='h6'>Key Skills</Typography>
            <div className='flex flex-wrap gap-2 mt-2'>
              {job?.skills?.map((skill, index) => (
                <CustomChip key={index} round='true' variant='tonal' size='small' label={skill?.name} />
              ))}
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='h5'>About Company</Typography>
            <Typography>{job?.about_company}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      {/* <CardHeader
        title={job?.job_title}
        subheader={job?.company_name}
        action={
          <Avatar variant='square' sx={{ width: 100, height: 100}} alt={job?.company_name} src={''} >{getInitials(job?.company_name)}</Avatar>
        }
      /> */}
      {/* <CardContent>
        <div className='flex gap-5'>
          <div className='flex gap-2 items-center'>
            <i className='tabler-briefcase' />
            <Typography>{job?.min_exp}-{job?.max_exp} Years</Typography>
          </div>
          <Divider orientation='vertical' variant="middle" sx={{ height: '20px' }} />
          <div className="flex gap-2 items-center">
            <i className='tabler-currency-rupee' />
            <Typography>{job?.min_ctc}-{job?.max_ctc} Lacs P.A.</Typography>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <i className='tabler-map-pin text-md' />
          <Typography>{job?.locations?.map(loc => loc?.city_name).join(', ')}</Typography>
        </div>
        <Divider />
        <div>
          <JobDescription html={job?.description} full />
        </div>
      </CardContent> */}

    </Card>
  )
}

export default JobView
