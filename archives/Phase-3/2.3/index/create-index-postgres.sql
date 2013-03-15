CREATE INDEX "org-index-org-id-idx1" ON organization_index(organization_id);
CREATE INDEX "ae-index-ae-id-idx1" ON adverseevent_index(adverseevent_id);
CREATE INDEX "eae-index-eae-id-idx1" ON expedited_ae_index(expedited_ae_id);
CREATE INDEX "inv-index-inv-id-idx1" ON investigator_index(investigator_id);
CREATE INDEX "par-index-par-id-idx1" ON participant_index(participant_id);
CREATE INDEX "rs-index-rs-id-idx1" ON researchstaff_index(researchstaff_id);
CREATE INDEX "rp-index-rp-id-idx1" ON reportingperiod_index(reportingperiod_id);
CREATE INDEX "study-index-study-id-idx1" ON study_index(study_id);