<?
	// Receives a request with a data URL, decodes it
	// and sends it back to the browser as an image
	
	header("Content-Disposition: attachment; filename=" . strtolower(str_replace(' ', '_', $_POST['imageFileName'])));
	header("Content-type: image/png");
	
	// Remove the leading data header
	echo file_get_contents($_POST['imageData']); 
?>