<?
	$if = "out.txt";
	$of = "out.groovy";

    $fSize = filesize($if);

	$f = fopen("./" . $if, "r");
	$txt = fread($f, $fSize);

    $f2 =   fopen("./" . $of, "w");

    $a = explode('@',$txt);
    echo "Found " . count($a) . " lines.\n\n";


    //

    $categoryText = "";
    $categoryID = 400;
    $strCategory =  "\ninsert('ctc_categories', [version_id: 4, id: %d, name: '%s'], primaryKey: false)\n";
    $strTerm =      "insert('ctc_terms', [category_id: %d, id: %d, term: \"%s\", ctep_term: \"%s\", ctep_code: %d, definition: \"%s\"], primaryKey: false)\n";
    $strGrades =    "insert('ctc_grades', [id: %d, term_id: %d, grade_code: \"%d\", grade_text: \"%s\"])\n";

    $category = "";
    $termsInCategory = 0;

    $termID = 4100;
    $gradeID = 43000;

    for ($i=0; $i<count($a); $i++) {
        $line = $a[$i];
        $b = explode('|', $line);

        $meddraCode = trim($b[0]);
        $ctcCategory = trim($b[1]);
        $ctcTerm = trim($b[2]);
        $g[1] = trim($b[3]);
        $g[2] = trim($b[4]);
        $g[3] = trim($b[5]);
        $g[4] = trim($b[6]);
        $g[5] = trim($b[7]);
        $definition = trim($b[8]);

        if ($ctcCategory != $categoryText) {

/*
            if ($categoryText != "") {
                fwrite($f2, "// Terms in te previous category: " . $termsInCategory);
            }
*/

            $categoryID++;
            $categoryText = $ctcCategory;
            $termsInCategory = 1;
            $string = sprintf($strCategory, $categoryID, $categoryText);
            fwrite($f2, $string);
            
        } else {
            $termsInCategory++;
        }

        if ($meddraCode != "") {
            $termID++;

            $string = sprintf($strTerm, $categoryID, $termID, $ctcTerm, $ctcTerm, $meddraCode, str_replace('\n\r', '*', $definition));
            fwrite($f2, $string);
            for ($x = 1; $x<=5; $x++) {
		if (trim($g[$x]) == "-" || trim($g[$x]) == "") continue;
                $gradeID ++;
                $string = sprintf($strGrades, $gradeID, $termID, $x, $g[$x]);
                fwrite($f2, $string);
            }

        }
        
    }

    // print_r($matches);
    echo "\n";
?>
