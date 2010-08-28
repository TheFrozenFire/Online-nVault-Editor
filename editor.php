<?php
$additional_headers[] = "<script type=\"text/javascript\" src=\"layout/javascript/jquery.getUrlParam.js\"></script>";
$additional_headers[] = "<script type=\"text/javascript\" src=\"layout/javascript/editor.js\"></script>";
$additional_headers[] = "<link rel=\"stylesheet\" href=\"layout/css/editor.css\"></script>";
require_once("includes/layout/header.php");
?>
		<div id="objectLoader">
			<form>
				<label for="nvaultID">nVault ID:</label>
				<input type="text" id="nvaultID">
				<input type="submit" value="Load">
			</form>
			<div>
				Vault Code: <span id="objectLoaderVaultCode"></span>
				Last Modified: <span id="objectLoaderVaultTime"></span>
				Vault Size: <span id="objectLoaderVaultSize"></span>
			</div>
		</div>
		<div id="objectExporter">
			<form>
				<input type="submit" value="JSON">
				<input type="submit" value="XML">
				<input type="submit" value="Tab-Delimited">
			</form>
		</div>
		<div id="objectEditor">
			<ul id="objectEditorTabs">
				<li><a href="#objectEditorTabMain" class="objectEditorTabCurrent">Main</a></li>
				<li><a href="#objectEditorTabSearch">Search</a></li>
			</ul>
			<div id="objectEditorTabMain" class="objectEditorTab">
				
			</div>
			<div id="objectEditorTabSearch" class="objectEditorTab">
				Search.
			</div>
		</div>
<?php
require_once("includes/layout/footer.php");
?>
