'use client'

import { useState } from "react";

import classNames from "classnames";

import frontCommonStyles from '../app/jobs/styles.module.css'

import JobView from "@/views/user/jobs/view/JobView";

import JobAppliedSuccess from "./JobAppliedSuccess";

const InviteJobViewPage = ({ data, id }) => {

  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if(appliedSuccess){
    return (
      <JobAppliedSuccess />
    )
  }

  return (
    <section className={classNames('plb-6', frontCommonStyles.layoutSpacing)}>
      <JobView job={data?.job} isCandidate={data?.isCandidate} jobUuid={id} setAppliedSuccess={setAppliedSuccess} />
    </section>
  )

}

export default InviteJobViewPage
