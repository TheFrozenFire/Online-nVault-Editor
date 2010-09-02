<?php
if(!isset($_POST["data"]) || !$data = json_decode($_POST["data"])) {
	header("HTTP/1.0 400 Bad Request");
} else {
	require("includes/lobstore.class.php");
	$lobstore = new lobstore();
	if($id = $lobstore->newObject(json_encode($data))) echo $id;
}
?>
