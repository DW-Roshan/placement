'use client';

import { useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';


import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@mui/material';

import Grid from '@mui/material/Grid2';

import DialogCloseButton from '@/components/dialogs/DialogCloseButton';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const InviteCandidateDialog = ({ open, jobId, handleClose }) => {

  const {data:session} = useSession();
  const token = session?.user?.token;

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
    reset,
    trigger,
    setError,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      sendSMS: true,
      sendEmail: false,
    },
  });

  const email = watch('email');
  const mobile = watch('mobile');
  const sendEmail = watch('sendEmail');

  // Watch email and mobile to dynamically enable/disable checkboxes
  useEffect(() => {
    trigger(['email', 'mobile']); // re-validate when email/mobile changes
  }, [email, mobile, trigger]);

  const onSubmit = async (data) => {

    if(!token) return null;

    if (!data.email && !data.mobile) return;

    console.log({
      jobId,
      ...data,
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invite-job/${jobId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    })

    const result = await res.json();

    if (res.ok) {
      toast.success(result?.message || 'Candidate invited successfully');
    } else if (res.status === 422) {
      Object.entries(result.errors).forEach(([field, messages]) => {
        setError(field, {
          type: 'custom',
          message: messages[0], // Use the first error message for each field
        });
      });
      return
    } else {
      toast.error(result?.message || 'Failed to invite candidate');
      console.log('Error inviting candidate:', result);
    }

    reset();

    handleClose();
  };

  // useEffect(() => {
  //   if (open) {
  //     reset({
  //       name: '',
  //       email: '',
  //       mobile: '',
  //       sendEmail: false,
  //       sendSMS: false,
  //     }, {
  //       keepErrors: false,
  //       keepDirty: false,
  //       keepTouched: false,
  //     });
  //   }
  // }, [open, reset]);

  return (
    <Dialog
      fullWidth
      open={open}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
      closeAfterTransition={false}
    >
      <DialogCloseButton onClick={handleClose}>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle>Invite Candidates</DialogTitle>
      <Divider />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'Name is required'
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Name"
                    required
                    placeholder="John Doe"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="mobile"
                control={control}
                rules={{
                  validate: (value) => {

                    if (!value && !email) return 'Email or mobile is required';
                    if (value && !/^\d{10}$/.test(value)) return 'Mobile must be 10 digits';

                    return true;
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Mobile No."
                    placeholder="9876543210"
                    error={!!errors.mobile}
                    helperText={errors.mobile?.message}
                    slotProps={{ htmlInput: { maxLength: 10 } }}
                  />
                )}
              />
            </Grid>
            {sendEmail && (
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    validate: (value) => {

                      if (!value && !mobile) return 'Email or mobile is required';
                      if (value && !/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
                      if (value && value.length < 5) return 'Email is too short';
                      if (value && value.length > 100) return 'Email is too long';

                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Email ID"
                      placeholder="user@example.com"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <FormGroup row>
                <Controller
                  name="sendSMS"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label="Send SMS"
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}

                          // disabled={!mobile}

                        />
                      }
                    />
                  )}
                />
                <Controller
                  name="sendEmail"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label="Send Email"
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                    />
                  )}
                />
              </FormGroup>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                type="submit"

                // disabled={!email && !mobile || !isValid}

              >
                Invite
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteCandidateDialog;
