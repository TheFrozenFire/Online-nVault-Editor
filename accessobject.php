<?php
if(is_string($_GET['nvaultID']) && strlen($_GET['nvaultID']) == 13) {
	require("includes/lobstore.class.php");
	
	$lobstore = new lobstore();
	
	if($object = $lobstore->getObject($_GET['nvaultID'])) {
		if($_GET['format'] === "nVault") {
			require("includes/nvault.class.php");
			header("Content-Type: application/octet-stream");
			$nvault = new nVault();
			$nvault->endian = TRUE;
			echo $nvault->generateVault(json_decode($object['object']));
		} elseif($_GET['format'] === "XML") {
			header("Content-Type: application/xml");
			$xml = new SimpleXMLElement("<nvault></nvault>");
			$xml->addAttribute("modified", $object["time"]);
			$data = json_decode($object["object"]);
			
			foreach($data as $entry) {
				$xmlEntry = $xml->addChild("entry");
				$xmlEntry->addChild("key", $entry[0]);
				$xmlEntry->addChild("time", $entry[1]);
				$xmlEntry->addChild("value", $entry[2]);
			}
			echo $xml->asXML();
		} elseif($_GET['format'] === "Tab-Delimited") {
			header("Content-Type: text/plain");
			$data = json_decode($object['object']);
			
			$last = count($data)-1;
			foreach($data as $key=>$entry) {
				echo "{$entry[0]}\t{$entry[1]}\t{$entry[2]}";
				if($key != $last) echo "\n";
			}
		} else {
			header("Content-Type: application/json");
			echo json_encode(array("code"=>$object['id'], "modified"=>$object['time'], "object"=>json_decode($object['object'])));
		}
	} else header("HTTP/1.0 404 Not Found");
} else header("HTTP/1.0 404 Not Found");
?>
