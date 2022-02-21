

function loadFavourites() {
    if (!localStorage.getItem(ls_favourites)) localStorage.setItem(ls_favourites, JSON.stringify(gvFavouritesObj));
    else gvFavouritesObj = JSON.parse(localStorage.getItem(ls_favourites));
    gvIndexMediaObj[kFavsName] = [];//actually ignored just a placeholder for the tab

}

function saveFavourites() {
    localStorage.setItem(ls_favourites, JSON.stringify(gvFavouritesObj));
}

function fqFavsNameFromYDTarray(ydtArray) {
    return ydtArray.join('\t');
}
function ydtArrayFromFQfavsName(fqFavName) {
    return fqFavName.split('\t');
}
function jpegPathForYDTarray(ydtArray) {
    return gvJPEGfolderName + ydtArray.join('/');
}

function addNameToFavourites() {
    const fqFavName = gvImgPhotoFS.getAttribute('data-fqfavname');
    gvFavouritesObj[fqFavName] = jpegPathForYDTarray(ydtArrayFromFQfavsName(fqFavName));
    saveFavourites();
    // if yearFavs is active then this does nothing so no need to update thumbnails
}

function deleteNameFromFavourites(fqFavName) {
    delete gvFavouritesObj[fqFavName];
    saveFavourites();
    //if(favsIsSelectedYear()) loadThumbnailsForFavs();
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

function handleFavouriteClicked() {
    const fqFavName = gvImgPhotoFS.getAttribute('data-fqfavname');
    const isFav = isFavourite(fqFavName);
    if(isFav) {
        deleteNameFromFavourites(fqFavName);
    } else
    {
        addNameToFavourites(fqFavName);
    }

    /*
    const selectedYearDiv = document.getElementById('div-years').getElementsByClassName('cssYearSelected').item(0);
    // refresh the Favs thumbs if displayed
    if(selectedYearDiv && selectedYearDiv.innerText === kFavsName) {
        loadThumbnailsForYear(kFavsName);
    }
     */
    // have to toggle isFav as we are toggling status based on it
    updateFavouriteIconForStatus(!isFav);
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
