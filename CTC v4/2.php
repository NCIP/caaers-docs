<?
	$if = "CTCAE_4.02_2009-10-06-1.csv";
	$of = "out.txt";
    $fSize = filesize($if);

	$f = fopen("./" . $if, "r");
	$txt = fread($f, $fSize);

    $txt = ereg_replace('([0-9]{8})', '@\\1', $txt);

    $f2 =   fopen("./out.txt", "w");
    fwrite($f2, $txt);
    
?>
