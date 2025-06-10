// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import { useSession } from 'next-auth/react'
import { Autocomplete, TextField } from '@mui/material'

const TableFilters = ({ setData, tableData }) => {
  // States
  const [industry, setIndustry] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [industries, setIndustries] = useState(null);
  const [departments, setDepartments] = useState(null);
  const { data: session } = useSession()
  const token = session?.user?.token

  useEffect(() => {
    const filteredData = tableData?.filter(candidate => {
      if (industry && candidate.industry_id != industry) return false
      if (department && candidate.department_id != department) return false
      if (status && candidate.status != status) return false

      return true
    })

    setData(filteredData || [])
  }, [industry, department, status, tableData, setData])

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
        setDepartments(jsonData?.departments || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        setIndustries(null);
      }
    }

    getIndustry()
  }, [token])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Autocomplete
            fullWidth
            options={industries || []}
            groupBy={(industry) => industry?.category || ''}
            getOptionLabel={(industry) => industry?.name || ''}
            value={industries && industries.find((opt) => opt.id === industry) || null}
            onChange={(event, value) => {
              setIndustry(value?.id || '');
            }}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={(params) => (
              <TextField label='Select Industry Type' {...params}/>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Autocomplete
            fullWidth
            options={departments || []}
            getOptionLabel={(department) => department?.name || ''}
            value={departments && departments.find(opt => opt.id === department) || null}
            onChange={(event, value) => {
              setDepartment(value?.id || '');
            }}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={(params) => (
              <TextField label='Select Department' {...params}/>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Autocomplete
            fullWidth
            options={[{id: '1', name: 'Active'},{id: '0', name: 'Inactive'}]}
            getOptionLabel={(department) => department?.name || ''}
            value={[{id: '1', name: 'Active'},{id: '0', name: 'Inactive'}].find(opt => opt.id === status) || null}
            onChange={(event, value) => {
              setStatus(value?.id || '');
            }}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={(params) => (
              <TextField label='Select Status' {...params}/>
            )}
          />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
