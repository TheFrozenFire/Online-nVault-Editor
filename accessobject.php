<?php
if(is_string($_GET['nvaultID']) && strlen($_GET['nvaultID']) == 13) {
	require("includes/lobstore.class.php");
	
	$lobstore = new lobstore();
	
	if($object = $lobstore->getObject($_GET['nvaultID'])) {
		header("Content-Type: application/json");
		echo json_encode(array("code"=>$object['id'], "modified"=>$object['time'], "object"=>json_decode($object['object'])));
	} else header("HTTP/1.0 404 Not Found");
} else header("HTTP/1.0 404 Not Found");
?>
