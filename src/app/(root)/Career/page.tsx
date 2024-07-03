import Careerlanding from '@/components/molecules/CareerLanding/Careerlanding'
import CareerJoinUs from '@/components/molecules/careerJoinUs/CareerJoinUs'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
        <Careerlanding />
        <CareerJoinUs/>
    </div>
  )
}

export default page