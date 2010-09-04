<?php
$additional_headers[] = "<script type=\"text/javascript\" src=\"layout/javascript/jquery.getUrlParam.js\"></script>";
$additional_headers[] = "<script type=\"text/javascript\" src=\"layout/javascript/editor.js\"></script>";
$additional_headers[] = "<script type=\"text/javascript\" src=\"layout/javascript/jquery.dataTables.min.js\"></script>";
$additional_headers[] = "<script type=\"text/javascript\" src=\"layout/javascript/jquery.jeditable.min.js\"></script>";
$additional_headers[] = "<script type=\"text/javascript\" src=\"layout/javascript/json.js\"></script>";
$additional_headers[] = "<link rel=\"stylesheet\" href=\"layout/css/editor.css\">";
$additional_headers[] = "<link rel=\"stylesheet\" href=\"layout/css/dataTables.css\">";
require_once("includes/layout/header.php");
?>
		<div id="objectLoader" class="ui-corner-top">
			<form>
				<label for="nvaultID">nVault ID:</label>
				<input type="text" id="nvaultID">
				<input type="submit" id="loadVault" value="Load">
				<input type="submit" id="newVault" value="New">
			</form>
			<div>
				Vault Code: <span id="objectLoaderVaultCode"></span>
				Date Added: <span id="objectLoaderVaultTime"></span>
				Vault Size: <span id="objectLoaderVaultSize"></span>
			</div>
		</div>
		<div id="objectExporter" class="ui-corner-bottom displayOnLoad">
			<form method="get" action="accessobject.php">
				<input type="submit" name="format" value="nVault">
				<input type="submit" name="format" value="JSON">
				<input type="submit" name="format" value="XML">
				<input type="submit" name="format" value="Tab-Delimited">
				<input type="hidden" name="nvaultID">
			</form>
		</div>
		<div id="instructions" class="ui-corner-all displayOnLoad">
			<strong>Instructions:</strong> Double-click cells to edit. Hover over key to remove entry. State must be saved to export.
		</div>
		<div id="objectView" class="ui-corner-all displayOnLoad">
			<table id="objectEditor" class="display">
			</table>
		</div>
<?php
require_once("includes/layout/footer.php");
?>
