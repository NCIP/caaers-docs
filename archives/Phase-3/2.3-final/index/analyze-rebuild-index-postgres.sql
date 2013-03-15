vacuum full verbose study_index;
reindex table study_index;
analyze verbose studies;
analyze verbose study_index;

vacuum full verbose reportingperiod_index;
reindex table reportingperiod_index;
analyze verbose ae_reporting_periods;
analyze verbose reportingperiod_index;

vacuum full verbose researchstaff_index;
reindex table researchstaff_index;
analyze verbose research_staffs;
analyze verbose researchstaff_index;


vacuum full verbose participant_index;
reindex table participant_index;
analyze verbose participants;
analyze verbose participant_index;


vacuum full verbose investigator_index;
reindex table investigator_index;
analyze verbose investigators;
analyze verbose investigator_index;

vacuum full verbose adverseevent_index;
reindex table adverseevent_index;
analyze verbose adverse_events;
analyze verbose adverseevent_index;


vacuum full verbose expedited_ae_index;
reindex table expedited_ae_index;
analyze verbose ae_reports;
analyze verbose expedited_ae_index;


vacuum full verbose organization_index;
reindex table organization_index;
analyze verbose organizations;
analyze verbose organization_index;
