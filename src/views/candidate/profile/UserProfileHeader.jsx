// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { Avatar, IconButton } from '@mui/material'

import { format } from 'date-fns'

const UserProfileHeader = ({ data, setOpenBasicForm }) => {

  return (
    <Card>
      <CardMedia image={'/images/pages/profile-banner.png'} className='bs-[250px]' />
      <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
        <div className='flex rounded-full mbs-[-40px] border-[5px] mis-[-5px] border-be-0  border-backgroundPaper bg-backgroundPaper'>
          <Avatar sx={{ height: 120, width: 120 }} src={data?.profile_image} />
          {/* <img height={120} width={120} src={data?.profile} className='rounded-full' alt='Profile Background' /> */}
        </div>
        <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Typography variant='h4'>{data?.full_name}
              <IconButton onClick={() => setOpenBasicForm(true)} aria-label='edit' color='secondary'>
                <i className='tabler-edit' />
              </IconButton>
            </Typography>
            <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
              <div className='flex items-center gap-2'>
                {<i className={'tabler-palette'} />}
                <Typography className='font-medium'>{data?.profile_title}</Typography>
              </div>
              <div className='flex items-center gap-2'>
                <i className='tabler-map-pin' />
                <Typography className='font-medium'>{data?.city?.city_name}</Typography>
              </div>
              <div className='flex items-center gap-2'>
                <i className='tabler-calendar' />
                <Typography className='font-medium'>{data?.created_at && format(data?.created_at, 'MMMM yyyy')}</Typography>
              </div>
            </div>
          </div>
          {/* <Button variant='contained' className='flex gap-2'>
            <i className='tabler-user-check !text-base'></i>
            <span>Connected</span>
          </Button> */}
        </div>
      </CardContent>

    </Card>
  )
}

export default UserProfileHeader
