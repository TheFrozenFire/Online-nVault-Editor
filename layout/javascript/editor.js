$(function() {
	$("#objectLoader form").submit(function() {
		loadObject($("#nvaultID").val());
		return false;
	});
	
	var nvaultID = $(document).getUrlParam("nvaultID");
	if(nvaultID && nvaultID.length == 13) $("#nvaultID").val(nvaultID).submit();
});

function loadObject(code) {
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
			"bDestroy": true,
			"bAutoWidth": false
		});
		$("#objectExporter").css("visibility", "visible");
		$("#objectView").css("visibility", "visible");
	});
}
