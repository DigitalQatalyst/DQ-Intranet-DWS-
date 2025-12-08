import { mediaSupabaseClient } from '@/lib/mediaSupabaseClient'

export interface JobApplicationPayload {
  jobId: string
  jobTitle: string
  name: string
  email: string
  currentRole: string
  location: string
  sfiaLevel: string
  motivation: string
}

export interface JobApplication {
  id: string
  job_id: string
  job_title: string
  name: string
  email: string
  current_role: string
  location: string
  sfia_level: string
  motivation: string
  created_at: string
}

/**
 * Submits a job application to Supabase
 * @param payload - The job application data from the form
 * @returns The created job application record
 * @throws Error if submission fails
 */
export async function submitJobApplication(
  payload: JobApplicationPayload
): Promise<JobApplication> {
  const { data, error } = await mediaSupabaseClient
    .from('job_applications')
    .insert({
      job_id: payload.jobId,
      job_title: payload.jobTitle,
      name: payload.name,
      email: payload.email,
      current_role: payload.currentRole,
      location: payload.location,
      sfia_level: payload.sfiaLevel,
      motivation: payload.motivation
    })
    .select()
    .single()

  if (error) {
    console.error('Error submitting job application to Supabase', error)
    throw new Error(`Failed to submit application: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned from application submission')
  }

  return data as JobApplication
}

/**
 * Fetches all job applications (for admin/HR use)
 * @returns Array of all job applications
 */
export async function fetchAllJobApplications(): Promise<JobApplication[]> {
  const { data, error } = await mediaSupabaseClient
    .from('job_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching job applications from Supabase', error)
    throw error
  }

  return (data ?? []) as JobApplication[]
}

/**
 * Fetches job applications for a specific job
 * @param jobId - The ID of the job
 * @returns Array of job applications for the specified job
 */
export async function fetchJobApplicationsByJobId(
  jobId: string
): Promise<JobApplication[]> {
  const { data, error } = await mediaSupabaseClient
    .from('job_applications')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching job applications by job ID from Supabase', error)
    throw error
  }

  return (data ?? []) as JobApplication[]
}

/**
 * Fetches a single job application by ID
 * @param id - The application ID
 * @returns The job application or null if not found
 */
export async function fetchJobApplicationById(
  id: string
): Promise<JobApplication | null> {
  const { data, error } = await mediaSupabaseClient
    .from('job_applications')
    .select('*')
    .eq('id', id)
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching job application from Supabase', error)
    return null
  }

  return data ? (data as JobApplication) : null
}

