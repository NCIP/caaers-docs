*********** Deleting existing data ***********************************
delete from sites;
delete from study_sites;
delete from identifiers;
delete from studies;

*********** Inserting three healthcare sites **************************

insert into sites (id, name, version, grid_id) values 
(10001, 'default', 0, ''), 
(10002, 'Duke University Comprehensive Cancer Center', 0, 'Duke Grid ID'), 
(10003, 'National Cancer Institute', '0', 'NCI Grid ID'), (10004, 'Warren Grant Magnuson Clinical Center - NCI', 0, 'NCI');

*********** Inserting Demo Study record *******************************

insert into studies (id, version, short_title, long_title, description, multi_institution_indicator, primary_sponsor_code, phase_code, precis, disease_code, monitor_code, status, grid_id) values 
(10001, 0, 'LMB-2 Immunotoxin in Treating Patients With Chronic Lymphocytic Leukemia or Prolymphocytic Leukemia', 'A Phase II Clinical Trial of Anti-Tac(Fv)-PE38 (LMB-2) Immunotoxin for Treatment of CD25 Positive Chronic Lymphocytic Leukemia', 'Patients receive LMB-2 immunotoxin IV over 30 minutes on days 1, 3, and 5. Treatment repeats every 28 days for up to 6 courses in the absence of disease progression, neutralizing antibodies (i.e., > 75% of the activity of 1µg/mL of LMB-2 immunotoxin), or unacceptable toxicity.

Patients who achieve a complete response receive up to 2 additional courses of LMB-2 immunotoxin. Patients who relapse after achieving a complete or partial response for more than 2 months are eligible for retreatment as described above.

Patients are followed every 3-12 months until disease progression.', false, 'National Cancer Institute', 'Phase II Trail', '', 'Cancer', 'Cancer Therapy Evaluation Program', 'Active - Trial is open to accrual', 'b13b207a-2289-4350-9883-25492fc0e8ea');

*********** Inserting three identifiers for the demo Study *************
insert into identifiers(id, value, type, source, version, primary_indicator, stu_id) values 
(10001, '04_C_0121', 'C3D Identifier', 'National Cancer Institute', 0, false, 10001), 
(10002, 'NCT00080821', 'ClinicalTrails.gov Identifier', 'National Cancer Institute', 0, false, 10001), 
(10003, 'NCI-04-C-0121', 'Protocol Authority Identifier', 'National Cancer Institute', 0, true, 10001);

********** Inserting one study site ************************************
insert into study_sites(id, site_id, study_id, version, role_code, status_code, irb_approval_date, start_date, end_date) values 
(10001, 10004, 10001, 0, 'Site', 'Active', '2004-01-09', '2004-02-09', '2008-01-01');
