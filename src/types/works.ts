type Job = {
  role: string
  startDate: Date
  endDate?: Date
  description?: string
}

export type TWorkEntry = {
  company: string
  companyUrl?: string
  location: string
  remote: boolean
  jobs: Job[]
}
