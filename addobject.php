<?php
require_once("includes/layout/header.php");
if(!isset($_FILES['nvault']) || $_FILES['nvault']['size']['nVaultFile'] < 5) {
?>
	No file was uploaded.
<?php
} else {
	require("includes/nvault.class.php");
	require("includes/lobstore.class.php");
	$vault = new nVault($_FILES['nvault']['tmp_name']['nVaultFile']);
	if($vault instanceof nVault && count($vault->vault) > 0) {
		if(!$json = json_encode($vault->vault)) {
?>
	Vault could not be encoded.
<?php
		} else {
			$lobstore = new lobstore();
			$id = $lobstore->newObject($json);
?>
	Your nvault identifier is <?php echo $id; ?>.
	<a href="editor.php?nvaultID=<?php echo urlencode($id); ?>">Edit Vault</a>
<?php
		}
	}
}
require_once("includes/layout/footer.php");
?>
