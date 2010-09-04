$(function() {
	// Make "Load" button load the object
	$("#objectLoader input#loadVault").button().click(function() {
		loadObject($("#nvaultID").val());
		$(this).blur();
	});
	$("#objectLoader input#newVault").button().click(function() {
		loadObject("new");
		$(this).blur();
	});
	$("#objectLoader form").submit(function() { return false; });
	
	// Pre-load loading image
	var loadingDiv = $(document.createElement("div"));
	loadingDiv.attr("id", "loading");
	loadingDiv.html("<img src=\"layout/images/loading.png\" alt=\"Loading...\">");
	$("#objectView").after(loadingDiv);
	
	// Cause nvaultID GET parameter to trigger object load on page load
	var nvaultID = $(document).getUrlParam("nvaultID");
	if(nvaultID != undefined && nvaultID.length == 13) {
		$("#nvaultID").val(nvaultID);
		$("#objectLoader input#loadVault").click();
	}
});

function loadObject(code) {
	if(code.length != 13 && code != "new") return;
	$("#loading").show("fast");
	$("#objectLoader form input").attr("disabled", true);
	$("#objectExporter").hide("fast");
	$("#objectView").hide("fast");
	if(code == "new") {
		$("#nvaultID").val("");
		var data = new Array();
		data["code"] = "New";
		var date = new Date();
		data["modified"] = date.getTime()/1000;
		data["object"] = [];
		buildEditor(data);
		$("#objectExporter input").attr("disabled", true);
		$(".displayOnLoad").show("fast");
		$("#loading").hide("fast");
		$("#objectLoader form input").attr("disabled", false);
	} else jQuery.getJSON("accessobject.php", { "nvaultID": code }, function (data, textStatus) {
		$("#objectExporter input").attr("disabled", false);
		$("#objectExporter form input[type=hidden]").attr("value", data["code"]);
		buildEditor(data);
		$(".displayOnLoad").show("fast");
		$("#loading").hide("fast");
		$("#objectLoader form input").attr("disabled", false);
	});
}

function buildEditor(data) {
	$("#objectLoaderVaultCode").text(data["code"]);
	
	var modified = new Date(data["modified"]*1000);
	$("#objectLoaderVaultTime").text(modified.toDateString());
	
	$("#objectLoaderVaultSize").text(data["object"].length+" rows");
	
	$("#objectLoader div").css("visibility", "visible");
	
	var newRowDialog = $(document.createElement("div"));
	newRowDialog.attr("id", "newRowDialog");
	var newRowForm = $(document.createElement("form"));
	newRowDialog.append(newRowForm);
	
	newRowDialog.addClass("ui-dialog");
	
	newRowForm.html("<label for=\"newRowKey\">Key:</label><input type=\"text\" id=\"newRowKey\"><label for=\"newRowValue\">Value:</label><input type=\"text\" id=\"newRowValue\">");
	newRowForm.children("input").css("display", "block");
	
	$("body").append(newRowDialog);
	newRowDialog.dialog({
		"autoOpen": false,
		"height": "300",
		"width": "50%",
		"modal": true,
		"title": "New Entry",
		"buttons": {
			"Add Entry": function() {
				if($("input#newRowKey").val().length > 0) {
					var date = new Date();
					var modified = date.getTime()/1000;
					$("#objectEditor").dataTable().fnAddData([
						$("input#newRowKey").val(),
						modified,
						$("input#newRowValue").val()
					]);
				}
				$(this).dialog("close");
			},
			"Cancel": function() {
				$(this).dialog("close");
			}
		},
		"close": function() {
			$("input#newRowKey, input#newRowValue").val("");
		}
	});
	
	$("#objectEditor").dataTable({
		"aaData": data["object"],
		"aoColumns": [
			{ "sTitle": "Key" },
			{
				"sTitle": "Modified",
				"fnRender": function(obj) {
					var time = obj.aData[ obj.iDataColumn ];
					var date = new Date();
				
					date.setTime(time*1000);
					return date.toLocaleString();
				}
			},
			{ "sTitle": "Value" }
		],
		"fnRowCallback": makeEditable,
		"bDestroy": true,
		"bAutoWidth": false,
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": "<\"settingsToolbar\"><\"H\"lfr>t<\"F\"ip>"
	});
	
	$("div.settingsToolbar").html("<form><label for=\"objectEditorAutoUpdateModification\">Auto-Update Modification Time</label><input type=\"checkbox\" id=\"objectEditorAutoUpdateModification\" checked><input type=\"submit\" id=\"newRow\" value=\"New Entry\"><input type=\"submit\" id=\"saveState\" value=\"Save State\"></form>");
	
	$("div.settingsToolbar form").submit(function() { return false; });
	$("div.settingsToolbar input#newRow").button().click(function() {
		$("#newRowDialog").dialog("open");
		$(this).blur();
	});
	
	$("div.settingsToolbar input#saveState").button().click(function() {
		$("input[type=submit]", this).attr("disabled", true);
		var data = $("#objectEditor").dataTable().fnGetData();
		for(var row = 0; row < data.length; row++) data[row][1] = parseInt(Date.parse(data[row][1])/1000);
	
		$.post("saveobject.php", 
			{
				"data": JSON.stringify(data)
			},
			function(code) {
				$("div.settingsToolbar input#saveState").attr("disabled", "false");
				$("#nvaultID").val(code);
				$("#objectLoader input#loadVault").click();
			}
		);
	});
}

function makeEditable(row, data, displayIndex, displayIndexFull) {

	$("td:eq(0), td:eq(2)", row).dblclick(function() {
		$(this).children("a").remove();
	}).editable(function(value, settings) {
		var aPos = $("#objectEditor").dataTable().fnGetPosition(this);
		$("#objectEditor").dataTable().fnUpdate(value, aPos[0], aPos[1]);
		
		if($("input#objectEditorAutoUpdateModification").attr("checked") == true) {
			var dateObj = new Date;
			var unixTime = parseInt(dateObj.getTime()/1000);
			$("#objectEditor").dataTable().fnUpdate(unixTime, aPos[0], 1);
		}
	}, {
		"width": "100%",
		"event": "dblclick"
	});
	
	$("td:eq(0)", row).hover(
		function() {
			$(this).children("a").remove();
			if($(this).children("form").length > 0) return;
			var removeLink = $(document.createElement("a"));
			removeLink.addClass("rowRemoveLink");
			removeLink.html("<img src=\"layout/images/remove.png\">");
			removeLink.click(function() {
				var row = $("#objectEditor").dataTable().fnGetPosition($(this).parent().get(0));
				$("#objectEditor").dataTable().fnDeleteRow(row[0]);
			});
			$(this).prepend(removeLink);
		},
		function() {
			$(this).children("a").remove();
		}
	);
	
	return row;
}
