// utils
function favsIsSelectedYear() {
    const selectedYearDiv = gvDivYears.getElementsByClassName('cssYearSelected').item(0);
    return (selectedYearDiv && selectedYearDiv.innerText === kFavsName);
}

function FQFNisFavourite(fqFavName) {
    return gvFavouritesObj.hasOwnProperty(fqFavName);
}

// cached
function loadFavourites() {
    if (!localStorage.getItem(ls_favourites)) localStorage.setItem(ls_favourites, JSON.stringify(gvFavouritesObj));
    else gvFavouritesObj = JSON.parse(localStorage.getItem(ls_favourites));
    gvIndexMediaObj[kFavsName] = [];//actually ignored just a placeholder for the tab
}

function saveFavourites() {
    localStorage.setItem(ls_favourites, JSON.stringify(gvFavouritesObj));
}

// add remove Favourite
function handleFavouriteClicked() {
    const fqFavName = gvImgPhotoFS.getAttribute('data-fqfavname');
    const isFav = FQFNisFavourite(fqFavName);
    // toggle the status - so invert actions
    updateFavouriteIconForStatus(!isFav);
    if(isFav) {
        deleteNameFromFavourites(fqFavName);
    } else {
        addgvImgPhotoFSToFavourites(fqFavName);
    }
    // refresh the Favs thumbs if displayed
    if(favsIsSelectedYear()) {
        loadThumbnailsForFavs();
    }
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

// fav Icon status
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
    if(FQFNisFavourite(fqFavName)) {
        gvImgFavourite.src = "img/filledHeart1.png";
        gvImgFavourite.alt = "Favourite";
        gvImgFavourite.title = "Tap to unfavourite";
    } else {
        gvImgFavourite.src = "img/emptyHeart1.png";
        gvImgFavourite.alt = "";
        gvImgFavourite.title = "Tap to make favourite";
    }
}

// import export clear Btns
function handleClearFavsClicked() {
    if (window.confirm("Clear favourites? This cannot be undone.")) {
        for (const prop of Object.getOwnPropertyNames(gvFavouritesObj)) {
            delete gvFavouritesObj[prop];
        }
        saveFavourites();
        if (favsIsSelectedYear()) loadThumbnailsForFavs();
    }
}

function handleFavsImportExportClicked(itemID) {
    switch (itemID) {
        case 'savefavs':
            exportFavourites();
            break;
        case 'loadfavs':
            displayFavouritesFileDialog();
            break;
    }
}

function exportFavourites() {
    const data = JSON.stringify(gvFavouritesObj);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'homePhotosFavourites.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

function displayFavouritesFileDialog() {
    document.getElementById('fileElemFavourites').click();
}

function handleFavouritesFileElementChanged(element) {
    if(element.files.length > 0) {
        element.files[0].text().then(text => {
            const favsOj = JSON.parse(String(text));
            if(!!favsOj) {
                for (const [key, value] of Object.entries(favsOj)) gvFavouritesObj[key] = value;
                saveFavourites();
                if(favsIsSelectedYear()) loadThumbnailsForFavs();
            }
        });
    }
}

// INDEX
function handleDivIndexRowClicked(ev) {
    // dont respond to clicks on the div (although css prevents them too)
    if(ev.target !== this) {
        loadThumbnailsForYearDir(ev.target.getAttribute('data-year'),ev.target.getAttribute('data-dir'));
    }
}

function loadThumbnailsForYearDir(year,dir) {
    const yearBtn = Array.from(gvDivYears.getElementsByClassName('cssYearBtn')).find(e=>e.innerHTML === year);
    if(!!yearBtn) {
        yearBtn.click();
        const dirBtn = Array.from(gvDivDirs.getElementsByClassName('cssDivDir')).find(e=>e.innerHTML === dir);
        if(!!dirBtn) dirBtn.click();
        resizeColumns();// to account for divDirs being different height
    }
}



loadFavourites();
