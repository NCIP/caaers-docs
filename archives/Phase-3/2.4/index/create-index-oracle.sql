CREATE INDEX "org-index-login-id-idx1" ON organization_index(login_id);
CREATE INDEX "ae-index-login-id-idx1" ON adverseevent_index(login_id);
CREATE INDEX "eae-index-login-id-idx1" ON expedited_ae_index(login_id);
CREATE INDEX "inv-index-login-id-idx1" ON investigator_index(login_id);
CREATE INDEX "par-index-login-id-idx1" ON participant_index(login_id);
CREATE INDEX "rs-index-login-id-idx1" ON researchstaff_index(login_id);
CREATE INDEX "rp-index-login-id-idx1" ON reportingperiod_index(login_id);
CREATE INDEX "study-index-login-id-idx1" ON study_index(login_id);
