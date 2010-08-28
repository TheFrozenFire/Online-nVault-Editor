$(function() {
	$("#objectEditor").tabs();
	
	$("#objectEditor").bind("tabsselect", function(event, ui) {
		$("#objectEditorTabs li a").removeClass("objectEditorTabCurrent");
		$(ui.tab).addClass("objectEditorTabCurrent");
	});
	
	$("#objectLoader form").submit(function() {
		loadObject($("#nvaultID").val());
		return false;
	});
	
	var nvaultID = $(document).getUrlParam("nvaultID");
	if(nvaultID && nvaultID.length == 13) $("#nvaultID").val(nvaultID).submit();
});

function loadObject(code) {
	jQuery.getJSON("accessobject.php", { "nvaultID": code }, function (data, textStatus) {
		$("#objectEditor").data("nvault", data);
		
		$("#objectLoaderVaultCode").text(data["code"]);
		
		var modified = new Date(data["modified"]*1000);
		$("#objectLoaderVaultTime").text(modified.toDateString());
		
		$("#objectLoaderVaultSize").text(data["object"].length+" rows");
		
		paginate("#objectEditor");
	});
}

function paginate(tab) {
	var perPage = 50;
	var rows = $(tab).data("nvault")["object"].length;
	var pagesList = $(tab).children("ol.objectEditorPages");
	
	for(var page = 0; page < Math.ceil(rows/perPage); page++) {
		var pageElement = document.createElement("li");
		$(pageElement).text((page*perPage)+" - "+(page*perPage+perPage));
		pagesList.add(pageElement);
	}
}
