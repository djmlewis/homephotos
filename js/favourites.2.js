

function loadFavourites() {
    if (!localStorage.getItem(ls_favourites)) localStorage.setItem(ls_favourites, JSON.stringify(gvFavouritesObj));
    else gvFavouritesObj = JSON.parse(localStorage.getItem(ls_favourites));
    gvIndexMediaObj[kFavsName] = [];//actually ignored just a placeholder for the tab
}

function saveFavourites() {
    localStorage.setItem(ls_favourites, JSON.stringify(gvFavouritesObj));
}

function addgvImgPhotoFSToFavourites() {
    const fqFavName = gvImgPhotoFS.getAttribute('data-fqfavname');
    gvFavouritesObj[fqFavName] = jpegPathForFQFN(fqFavName);
    saveFavourites();
}

function deleteNameFromFavourites(fqFavName) {
    delete gvFavouritesObj[fqFavName];
    saveFavourites();
}

function isFavourite(fqFavName) {
    return gvFavouritesObj.hasOwnProperty(fqFavName);
}

function updateFavouriteIconForStatus(isFavourite) {
    if(isFavourite) {
        gvImgFavourite.src = "img/filledHeart1.png";
        gvImgFavourite.alt = "Favourite";
        gvImgFavourite.title = "Tap to unfavourite";
    } else {
        gvImgFavourite.src = "img/emptyHeart1.png";
        gvImgFavourite.alt = "";
        gvImgFavourite.title = "Tap to make favourite";
    }
}

function updateFavouriteIconForFQFN(fqFavName) {
    if(isFavourite(fqFavName)) {
        gvImgFavourite.src = "img/filledHeart1.png";
        gvImgFavourite.alt = "Favourite";
        gvImgFavourite.title = "Tap to unfavourite";
    } else {
        gvImgFavourite.src = "img/emptyHeart1.png";
        gvImgFavourite.alt = "";
        gvImgFavourite.title = "Tap to make favourite";
    }
}

function handleFavouriteClicked() {
    const fqFavName = gvImgPhotoFS.getAttribute('data-fqfavname');
    const isFav = isFavourite(fqFavName);
    // toggle the status - so invert actions
    updateFavouriteIconForStatus(!isFav);
    if(isFav) {
        deleteNameFromFavourites(fqFavName);
    } else {
        addgvImgPhotoFSToFavourites(fqFavName);
    }
    // refresh the Favs thumbs if displayed
    const selectedYearDiv = document.getElementById('div-years').getElementsByClassName('cssYearSelected').item(0);
    if(selectedYearDiv && selectedYearDiv.innerText === kFavsName) {
        loadThumbnailsForFavs();
    }
}

function exportFavourites() {
    const data = JSON.stringify(gvFavouritesObj);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'homeMoviesFavourites.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}
function handleFavouritesFileElementChanged(element) {
    if(element.files.length > 0) {
        element.files[0].text().then(text => {
            const favsOj = JSON.parse(String(text));
            if(!!favsOj) {
                for (const [key, value] of Object.entries(favsOj)) gvFavouritesObj[key] = value;
                saveFavourites();
                if(favsIsSelectedYear()) loadThumbnailsForYear(kFavsName);
            }
        });
    }
}

function favsIsSelectedYear() {
    return selectedYearButtonIsNamed(kFavsName);
}

function displayFavouritesFileDialog() {
    document.getElementById('fileElemFavourites').click();
}

function handleClearFavsClicked() {
    for (const prop of Object.getOwnPropertyNames(gvFavouritesObj)) {
        delete gvFavouritesObj[prop];
    }
    saveFavourites();
    if(favsIsSelectedYear()) loadThumbnailsForYear(kFavsName);
}

loadFavourites();
