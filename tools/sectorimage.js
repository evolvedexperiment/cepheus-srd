function removeBeforeDoubleLF(str) {
	const doubleLFIndex = str.indexOf('\n\n');
	if (doubleLFIndex !== -1) {
		return str.substring(doubleLFIndex + 2);
	}
	return str;
}

function getSectorImage(el, ct, st, sectorData) {
// el is the element the PNG image will be appended to, the innerHTML is overwritten
// ct is the content-type to retrieve
// Depending on the ct parameter, this function can do 3 different things
// ct == "": PNG image
// ct == "pdf": PDF opened in new window
// ct == "svg": SVG opened in new window
// st is the style, passed as-is
// sectorData is the planet data in SEC format, but it has some explanation and headers

	let contentType = "";
	let accept = "image/png";
	if (ct == "pdf") accept = "application/pdf";
	if (ct == "svg") accept = "image/svg+xml";

	if (sectorData === "") return;
	if (el) el.innerHTML = "Retrieving image...";

	// get to the actual planet data to send
	sectorData = removeBeforeDoubleLF(sectorData);
	sectorData = removeBeforeDoubleLF(sectorData);

	const sectorImageUrl = "https://travellermap.com/api/poster?scale=64&subsector=A&style="+st;
	// const sectorImageUrl = "https://travellermap.com/api/poster?scale=64&subsector=A";
	fetch(sectorImageUrl, {
		method: "POST",
		headers: {
			"Content-Type": "text/plain",
			"Accept": accept
		},
		body: sectorData
	}).then((response) => {
		if (response.ok) {
			contentType = response.headers.get("content-type");
			return response.blob();
		}
		el.innerHTML = response.body;
	}).then((blob) => {
		if (!blob) {
			console.log("getSectorImage got nothing back");
			return;  
		}

		if (ct == "png" || contentType == "image/svg+xml" || contentType == "application/pdf") {
			const objectUrl = URL.createObjectURL(blob);
			const newWindow = window.open(objectUrl, "_blank");
			newWindow.focus();
			return;
		}

		const imageUrl = URL.createObjectURL(blob);
		const imgElement = document.createElement("img");
		imgElement.src = imageUrl;
		el.innerHTML = "";
		el.appendChild(imgElement);
	}).catch((error) => {
		el.innerHTML = "Error:" + error.message;
	});
}

