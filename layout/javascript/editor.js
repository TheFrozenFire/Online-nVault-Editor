$(function() {
	// Make "Load" button load the object
	$("#objectLoader form").submit(function() {
		loadObject($("#nvaultID").val());
		return false;
	});
	
	// Pre-load loading image
	var loadingDiv = $(document.createElement("div"));
	loadingDiv.attr("id", "loading");
	loadingDiv.html("<img src=\"layout/images/loading.png\" alt=\"Loading...\">");
	$("#objectView").after(loadingDiv);
	
	// Cause nvaultID GET parameter to trigger object load on page load
	var nvaultID = $(document).getUrlParam("nvaultID");
	if(nvaultID && nvaultID.length == 13) $("#nvaultID").val(nvaultID).submit();
});

function loadObject(code) {
	$("#loading").show("fast");
	$("#objectLoader form input").attr("disabled", true);
	$("#objectExporter").hide("fast");
	$("#objectView").hide("fast");
	jQuery.getJSON("accessobject.php", { "nvaultID": code }, function (data, textStatus) {
		$("#objectLoaderVaultCode").text(data["code"]);
		$("#objectExporter form input[type=hidden]").attr("value", data["code"]);
		
		var modified = new Date(data["modified"]*1000);
		$("#objectLoaderVaultTime").text(modified.toDateString());
		
		$("#objectLoaderVaultSize").text(data["object"].length+" rows");
		
		$("#objectLoader div").css("visibility", "visible");
		
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
			"sDom": "<\"settingsToolbar\"><\"H\"lfr>t<\"F\"i<\"saveState\">p>"
		});
		
		$("div.settingsToolbar").html("<form><label for=\"objectEditorAutoUpdateModification\">Auto-Update Modification Time</label><input type=\"checkbox\" id=\"objectEditorAutoUpdateModification\" checked></form>");
		$("div.saveState").html("<form><input type=\"submit\" value=\"Save State\"></form>");
		
		$("div.saveState form").submit(function() {
			$("input:submit", this).attr("disabled", true);
			var data = $("#objectEditor").dataTable().fnGetData();
			for(var row = 0; row < data.length; row++) data[row][1] = parseInt(Date.parse(data[row][1])/1000);
		
			$.post("saveobject.php", 
				{
					"data": JSON.stringify(data)
				},
				function(code) {
					$("div.saveState form input:submit").attr("disabled", "false");
					$("#nvaultID").val(code).submit();
				}
			);
	
			return false;
		});
		
		$(".displayOnLoad").show("fast");
		$("#loading").hide("fast");
		$("#objectLoader form input").attr("disabled", false);
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
