interface VersionDto {
  _id: string;
  base_version: string;
  design_system: string;
  number: number;
  publish_core_link?: string;
  /**
   * Version of the core components this design system version was published with. Not populated on older
   * versions since we weren't tracking it.
   * @deprecated This is for the old core components and not applicable anymore.
   */
  publish_core_version?: string;
  publish_docs_link?: string;
  publish_framework_link?: string;
  publish_job_id?: string;
  publish_job_state?:
    | 'active'
    | 'completed'
    | 'delayed'
    | 'failed'
    | 'unknown'
    | 'waiting'
    | 'waiting-children';
  publish_job_stderr?: string[];
  publish_job_stdout?: string[];
  /**
   * Timestamp when the publish started for the version. Not populated on older versions since we weren't tracking it.
   */
  publish_started_at?: string;
  publish_status: 'error' | 'in_progress' | 'published' | 'queued' | 'unpublished';
  publish_version?: string;
  /**
   * Timestamp when the version was published. Not populated on older versions since we weren't tracking it.
   */
  published_at?: string;
}

export type { VersionDto };
