ALTER INDEX "org-index-login-id-idx1" REBUILD;
ALTER INDEX "ae-index-login-id-idx1" REBUILD;
ALTER INDEX "eae-index-login-id-idx1" REBUILD;
ALTER INDEX "inv-index-login-id-idx1" REBUILD;
ALTER INDEX "par-index-login-id-idx1" REBUILD;
ALTER INDEX "rs-index-login-id-idx1" REBUILD;
ALTER INDEX "rp-index-login-id-idx1" REBUILD;
ALTER INDEX "study-index-login-id-idx1" REBUILD;

analyze TABLE studies ESTIMATE STATISTICS;
analyze TABLE study_index ESTIMATE STATISTICS FOR ALL INDEXES;


analyze TABLE ae_reporting_periods ESTIMATE STATISTICS;
analyze TABLE reportingperiod_index ESTIMATE STATISTICS FOR ALL INDEXES;


analyze TABLE research_staffs ESTIMATE STATISTICS;
analyze TABLE researchstaff_index ESTIMATE STATISTICS FOR ALL INDEXES;


analyze TABLE participants ESTIMATE STATISTICS;
analyze TABLE participant_index ESTIMATE STATISTICS FOR ALL INDEXES;


analyze TABLE investigators ESTIMATE STATISTICS;
analyze TABLE investigator_index ESTIMATE STATISTICS FOR ALL INDEXES;


analyze TABLE adverse_events ESTIMATE STATISTICS;
analyze TABLE adverseevent_index ESTIMATE STATISTICS FOR ALL INDEXES;


analyze TABLE ae_reports ESTIMATE STATISTICS;
analyze TABLE expedited_ae_index ESTIMATE STATISTICS FOR ALL INDEXES;


analyze TABLE organizations ESTIMATE STATISTICS;
analyze TABLE organization_index ESTIMATE STATISTICS FOR ALL INDEXES;

