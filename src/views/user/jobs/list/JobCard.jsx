'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Chip, Divider, Grid2, IconButton, Rating, Typography } from '@mui/material'

import { formatDistanceToNow } from 'date-fns'

import { useKeenSlider } from 'keen-slider/react'

import CustomChip from '@/@core/components/mui/Chip'

import { getInitials } from '@/utils/getInitials'

import CustomIconButton from '@/@core/components/mui/IconButton'
import dynamic from 'next/dynamic'
import { getLocalizedUrl } from '@/utils/i18n'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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

  const { lang: locale } = useParams()
  const JobDescription = dynamic(() => import('./JobDescription'), { ssr: false });

  return (
    <Card variant='outlined'>
      <CardHeader title={job?.job_title}
        subheader={
          <Typography variant='h6'>{job?.company_name}</Typography>
        }
        action={
          <Avatar variant='square' sx={{ width: 50, height: 50}} alt={job?.company_name} src={''} >{getInitials(job?.company_name)}</Avatar>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }} className='flex flex-wrap gap-2'>
            {job?.min_exp && job?.max_exp ? <Chip label={job?.min_exp && job?.max_exp ? `${job?.min_exp}-${job?.max_exp} Yrs ` : '' } color='primary' variant='tonal' icon={ <i className='tabler-briefcase' /> } /> : ''}
            <Chip label={job?.min_ctc && job?.max_ctc ? `${job?.min_ctc}-${job?.max_ctc} Lacs PA` : 'Not disclosed' } color='success' variant='tonal' icon={ <i className='tabler-currency-rupee' /> } />
            <Chip
              label={
                Array.isArray(job?.locations) && job.locations.length > 0
                  ? job.locations.length === 1
                    ? job.locations[0].city_name
                    : `${job.locations[0].city_name} +${job.locations.length - 1} more`
                  : ''
              }
              color="warning"
              variant="tonal"
              icon={<i className="tabler-map-pin" />}
            />


          </Grid>
          <Grid size={{ xs: 12 }} className='flex items-center gap-2'>
            <div className='flex'>
              <i className='tabler-align-box-left-top text-xl text-textSecondary' />
            </div>
            <JobDescription html={job?.description} />
            {/* <Typography variant='body1' className='overflow-hidden whitespace-nowrap text-ellipsis' dangerouslySetInnerHTML={{ __html: job?.description }} /> */}
          </Grid>
          <Grid ref={skillRef} size={{ xs: 12 }} className='relative keen-slider flex overflow-hidden'>
            {job?.skills?.map((skill, index) => (
              <CustomChip key={index} round='true' size='small' className='keen-slider__slide' label={skill?.name} />
            ))}
            <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-[var(--mui-palette-background-paper)] pointer-events-none" />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className='justify-between'>
        <Typography variant='body2' >{formatDistanceToNow(job?.created_at, {addSuffix: true})}</Typography>
        <div className='flex gap-2'>
          <Link href={getLocalizedUrl(`/jobs/${job?.id}/edit`, locale)}><CustomIconButton variant='tonal' color='primary' size='small'><i className='tabler-edit' /></CustomIconButton></Link>
          <CustomIconButton variant='tonal' color='error' size='small'><i className='tabler-trash' /></CustomIconButton>
          {/* <Button variant='contained' color='primary' size='small'>Apply</Button> */}
        </div>
      </CardActions>
    </Card>
  )
}

export default JobCard
