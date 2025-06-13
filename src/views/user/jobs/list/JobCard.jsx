'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Chip, Divider, Grid2, IconButton, Rating, Typography } from '@mui/material'

import { formatDistanceToNow } from 'date-fns'

import { useKeenSlider } from 'keen-slider/react'

import CustomChip from '@/@core/components/mui/Chip'

import { getInitials } from '@/utils/getInitials'

import CustomIconButton from '@/@core/components/mui/IconButton'

const JobCard = ({job}) => {

  const [skillRef] = useKeenSlider({
    slides: {
      perView: 'auto',
      loop: false,
      mode: "snap",
      rtl: false,
      spacing: 6
    }
  })

  return (
    <Card variant='outlined'>
      <CardHeader title={job?.title}
        subheader={
          <Typography variant='h6'>{job?.company}</Typography>
        }
        action={
          <Avatar variant='square' sx={{ width: 50, height: 50}} alt={job?.company} src={''} >{getInitials(job?.company)}</Avatar>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }} className='flex flex-wrap gap-2'>
            <Chip label={job?.experience} color='primary' variant='tonal' icon={ <i className='tabler-briefcase' /> } />
            <Chip label={job?.salary} color='success' variant='tonal' icon={ <i className='tabler-currency-rupee' /> } />
            <Chip label={job?.location} color='warning' variant='tonal' icon={ <i className='tabler-map-pin' /> } />
          </Grid>
          <Grid size={{ xs: 12 }} className='flex items-center gap-2'>
            <div className='flex'>
              <i className='tabler-align-box-left-top text-xl text-textSecondary' />
            </div>
            <Typography variant='body1' className='overflow-hidden whitespace-nowrap text-ellipsis'>{job?.description}</Typography>
          </Grid>
          <Grid ref={skillRef} size={{ xs: 12 }} className='relative keen-slider flex overflow-hidden'>
            {job?.skills?.map((skill, index) => (
              <CustomChip key={index} round='true' size='small' className='keen-slider__slide' label={skill} />
            ))}
            <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-[var(--mui-palette-background-paper)] pointer-events-none" />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className='justify-between'>
        <Typography variant='body2' >{formatDistanceToNow(job?.postedDate, {addSuffix: true})}</Typography>
        <div>
          <CustomIconButton variant='tonal' color='primary' size='small'><i className='tabler-edit' /></CustomIconButton>
          <CustomIconButton variant='tonal' color='error' size='small'><i className='tabler-trash' /></CustomIconButton>
          {/* <Button variant='contained' color='primary' size='small'>Apply</Button> */}
        </div>
      </CardActions>
    </Card>
  )
}

export default JobCard
