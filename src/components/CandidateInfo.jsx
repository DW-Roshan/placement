import { IconButton, Tooltip } from "@mui/material"

const CandidateInfo = ({ info }) => {

  return (
    <Tooltip title={'Interview with: ' + (info?.interviewed_by || '')} arrow>
      <IconButton color='info' size='small' className='p-0.5 ml-1' disableRipple>
        <i className='tabler-info-circle' />
      </IconButton>
    </Tooltip>
  )

}

export default CandidateInfo
