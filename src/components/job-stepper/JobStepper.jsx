"use client";

import { act, useState } from "react";

import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

import StepperWrapper from "@/@core/styles/stepper";
import StepperCustomDot from '@components/stepper-dot';
import DialogCloseButton from "@/components/dialogs/DialogCloseButton";
import InvitedCandidates from "./dialog-content/InvitedCandidates";
import AppliedCandidates from "./dialog-content/ApppliedCandidates";
import ApprovedCandidates from "./dialog-content/ApprovedCandidates";
import InterviewScheduled from "./dialog-content/InterviewScheduled";

const steps = {
  invite: "Invited Candidates",
  applied: "Applied",
  hr_review: "HR reviews and approves the profile",
  interview_scheduled: "Interview Lined up",
  selected: "Candidate Selected / Job selection",
  offer_accepted: "Accepting the offer letter",
  onboarded: "Onboarding / Joining",
};

// Stage mapping (1-based)
const statusToStep = {
  invite: 0,
  applied: 1,
  hr_review: 2,
  interview_scheduled: 3,
  selected: 4,
  offer_accepted: 5,
  onboarded: 6,
};

export default function JobStepper({ job, setJobData }) {
  const stepKeys = Object.keys(steps);
  const activeStep = job?.job_stage ?? 0; // 0-based for Stepper
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStepKey, setDialogStepKey] = useState(null);

  // Handle step click
  const handleStepClick = (key) => {
    // Allow clicking only up to the current job_stage
    if (statusToStep[key] <= activeStep) {
      setDialogStepKey(key);
      setDialogOpen(true);
    }
  };

  // Render dialog content based on step
  const renderDialogContent = () => {
    switch (dialogStepKey) {
      case "invite":
        return (
          <InvitedCandidates candidateData={job?.all_invited_candidates} />
        );
      case "applied":
        return (
          <AppliedCandidates candidateData={job?.candidates} jobId={job?.id} />
        );
      case "hr_review":
        return (
          <ApprovedCandidates handleClose={() => setDialogOpen(false)} setJobData={setJobData} candidateData={job?.candidates} approvedCandidateIds={job?.approved_candidates?.map(c => c.id) || []} jobId={job?.id}  />
        );
      case "interview_scheduled":
        return (
          <InterviewScheduled handleClose={() => setDialogOpen(false)} setJobData={setJobData} candidateData={job?.approved_candidates} jobId={job?.id} />
        );
      case "selected":
        return (
          <>
            <DialogTitle>Selected Candidates</DialogTitle>
            <DialogContent>
              <Typography>Selected candidates for the job.</Typography>
            </DialogContent>
          </>
        );
      case "offer_accepted":
        return (
          <>
            <DialogTitle>Offer Accepted</DialogTitle>
            <DialogContent>
              <Typography>Candidates who accepted the offer.</Typography>
            </DialogContent>
          </>
        );
      case "onboarded":
        return (
          <>
            <DialogTitle>Onboarded</DialogTitle>
            <DialogContent>
              <Typography>Candidates who joined the company.</Typography>
            </DialogContent>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <StepperWrapper>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ overflowX: "auto" }}>
          {stepKeys.map((key, index) => {
            // Count for specific steps
            let count = 0;

            if (key === "invite") count = job?.all_invited_candidates?.length || 0;
            if (key === "applied") count = job?.candidates?.length || 0;
            if (key === "hr_review") count = job?.approved_candidates?.length || 0;
            if (key === "interview_scheduled") count = job?.interview_scheduled_candidates?.length || 0;

            return (
              <Step
                key={key}
                completed={statusToStep[key] < activeStep}
                sx={{ minWidth: '150px' }}
              >
                <StepLabel
                  onClick={() => handleStepClick(key)}
                  slots={{ stepIcon: StepperCustomDot }}
                  className={statusToStep[key] <= activeStep ? 'cursor-pointer' : 'cursor-not-allowed'}
                >
                  <Typography variant="h4">{count}</Typography>
                  {steps[key]}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </StepperWrapper>

      {/* <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="h6">
          Current Status: {steps[stepKeys[activeStep]]}
        </Typography>
      </Box> */}

      {/* Dialog for each step */}
      {/* <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm"> */}
        <Dialog
          fullWidth
          open={dialogOpen}
          maxWidth='xl'
          onClose={() => setDialogOpen(false)}
          sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
          <DialogCloseButton onClick={() => setDialogOpen(false)}>
            <i className='tabler-x' />
          </DialogCloseButton>
          {renderDialogContent()}
        {/* <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
}
