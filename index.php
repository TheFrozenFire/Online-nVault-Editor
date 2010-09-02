<?php
require_once("includes/layout/header.php");
?>
		<div id="content" class="ui-corner-all">
			<form method="GET" action="editor.php" title="Edit Existing nVault" id="nvaultEdit">
				<label for="nvaultID">nVault ID:</label>
				<input type="text" id="nvaultID" name="nvaultID">
				<input type="submit" value="Edit nVault">
			</form>
			<br />
			<form method="POST" enctype="multipart/form-data" action="addobject.php" title="Decode nVault" id="nvaultUpload">
				<input type="hidden" name="MAX_FILE_SIZE" value="10485760">
				<input type="hidden" name="nvault[action]" value="upload">
			
				<label for="nVaultFile">nVault File:</label>
				<input type="file" id="nVaultFile" name="nvault[nVaultFile]">
			
				<input type="submit" value="Decode nVault">
			</form>
		</div>
<?php
require_once("includes/layout/footer.php");
?>
