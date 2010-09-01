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
						return date.toUTCString();
					}
				},
				{ "sTitle": "Value" }
			],
			"fnRowCallback": makeEditable,
			"bDestroy": true,
			"bAutoWidth": false
		});
		
		$("#objectExporter").show("fast");
		$("#objectView").show("fast");
		$("#loading").hide("fast");
		$("#objectLoader form input").attr("disabled", false);
	});
}

function makeEditable(row, data, displayIndex, displayIndexFull) {
	$("td:eq(0), td:eq(2)", row).editable(function(value, settings) {
		var dateObj = new Date;
		var unixTime = parseInt(dateObj.getTime()/1000);
		var aPos = $("#objectEditor").dataTable().fnGetPosition(this);
		$("#objectEditor").dataTable().fnUpdate(value, aPos[0], aPos[1])
		$("#objectEditor").dataTable().fnUpdate(unixTime, aPos[0], 1);
	}, {
		"width": "80%"
	});
	
	return row;
}
