// call these functions on DOM loaded  -- DOMContentLoaded on DOCUMENT, onload on WINDOW
document.addEventListener('DOMContentLoaded', function () {
    setupGlobals();
    gvBootstrapModalPhoto = new bootstrap.Modal(gvModalPhoto, {});
    gvModalPhoto.addEventListener('hidden.bs.modal', ()=>{gvModalPhotoIsShown = false;});
    gvModalPhoto.addEventListener('shown.bs.modal', ()=>{gvModalPhotoIsShown = true;});
    buildYearButtons();
});
// call these functions on page fully loaded  -- DOMContentLoaded on DOCUMENT, onload on WINDOW
    window.addEventListener('load', function () {
        window.addEventListener('resize',()=>handleWindowResize());
        resizeColumns();
});

function setupGlobals() {
    gvColYears = document.getElementById('col-years');
    gvDivYears = document.getElementById('div-years');
    gvDivDirsOuter = document.getElementById('div-dirsOuter');
    gvDivDirs = document.getElementById('div-dirs');
    gvColThumbnails = document.getElementById('col-thumbnails');
    gvDivThumbnailsouter = document.getElementById('div-thumbnailsouter');
    gvDivThumbnailsFavBtns = document.getElementById('div-thumbnails-favBtns');
    gvDivThumbnails = document.getElementById('div-thumbnails');
    gvModalPhoto = document.getElementById('modal-photo');
    gvDivPhotoFS = document.getElementById('div-photoFS');
    gvImgPhotoFS = document.getElementById('img-photoFS');
    gvDivPhotoFSdivTop = document.getElementById('div-photoFS-divTop');
    gvDivPhotoFSdivBottom = document.getElementById('div-photoFS-divBottom');
    gvDivPhotoFSbtnNext = document.getElementById('btn-next');
    gvDivPhotoFSbtnPrev = document.getElementById('btn-prev');
    gvImgFavourite = document.getElementById('img-favourite');
    gvDivPhotoFSFQFN = document.getElementById('div-photoFS-FQFN');

}

// setup html btns
function buildYearButtons() {
    gvDivYears.innerHTML = '';
    gvDivDirs.innerHTML = '';
    Object.keys(gvIndexMediaObj).sort().forEach(yearName=>{
        let btn = document.createElement('div');
        const favCSS = yearName === kFavsName ? ' cssYearBtnFavs' : '';
        btn.className = 'cssYearBtn cssYearUnselected' + favCSS;
        btn.innerText = yearName;
        btn.setAttribute('data-year',yearName);
        btn.onclick = handleYearClicked;
        gvDivYears.appendChild(btn);
    });

    // set the selected year
    const btns = Array.from(gvDivYears.getElementsByClassName('cssYearBtn'));
    let prefBtn = btns[0];
    // select the last used if available or keep first button
    let savedYear = localStorage.getItem(ls_yearButtonName);
    if (!!savedYear) {
        const savedBtn = btns.find(element => element.innerText === savedYear);
        if(!!savedBtn) prefBtn = savedBtn;
    } else {
        savedYear = prefBtn.innerText;
        localStorage.setItem(ls_yearButtonName,savedYear);
    }
    toggleYearBtnSelected(prefBtn,true);
    // if not Favs add its dirs
    if(savedYear === kFavsName) {
        loadThumbnailsForFavs();
    } else {
        loadDirectoriesForYear(prefBtn.getAttribute('data-year'));
        // select prev dir if available
        const dirs = Array.from(gvDivDirs.getElementsByClassName('cssDivDir'));
        let prefDirDiv = dirs[0];
        const savedDir = localStorage.getItem(ls_dirDivName);
        if (!!savedDir) {
            const savedDirDiv = dirs.find(element => element.getAttribute('data-dirkey') === savedDir);
            if (!!savedDirDiv) {
                prefDirDiv = savedDirDiv;
            }
        }
        updateDirDivSelected(prefDirDiv, true);
        loadThumbnailsForDirectory(prefDirDiv);
    }
}

function addIndexYearButton(divYears) {
    let btn = document.createElement('div');
    btn.className = 'cssYearBtn cssYearUnselected';
    btn.innerText = kTitlesIndexName;
    btn.setAttribute('data-year',kTitlesIndexName);
    btn.onclick = (ev)=>{handleYearClicked(ev)};
    divYears.appendChild(btn);
}

function loadDirectoriesForYear(year) {
    gvDivThumbnailsFavBtns.hidden = true;
    gvDivDirs.innerHTML = '';
    gvDivThumbnails.innerHTML = '';
    Object.keys(gvIndexMediaObj[year]).sort().forEach((dirkey,indx) => {
            const div = document.createElement('div');
            div.setAttribute('data-year',year);
            div.setAttribute('data-dirkey',dirkey);
            div.setAttribute('data-indx',String(indx));
            div.innerText = dirkey;
            div.className = "cssDivDir";
            div.onclick = handleDirDivClicked;
        gvDivDirs.appendChild(div);
        });
}

function loadThumbnailsForDirectory(divClicked) {
    const year = divClicked.getAttribute('data-year');
    const dirkey = divClicked.getAttribute('data-dirkey');
    gvDivThumbnails.innerHTML = '';
    // dirkey obj is an array
    const dirkeyObj = gvIndexMediaObj[year][dirkey];
    if(!!dirkeyObj) {
        gvThumbnailSelectedIndx = 0;
        gvThumbnailLastIndx = dirkeyObj.length - 1;
        dirkeyObj.forEach((thumbName, indx) => {
            gvDivThumbnails.appendChild(thumnNailDivForNameDirYear(year,dirkey,thumbName,indx));
        });
        gvDivThumbnails.scrollTop = 0;
    }
}

function loadThumbnailsForFavs() {
    gvDivThumbnailsFavBtns.hidden = false;
    gvDivDirs.innerHTML = '';
    gvDivThumbnails.innerHTML = '';
    gvThumbnailSelectedIndx = 0;
    const favouritesObjKeys = Object.keys(gvFavouritesObj);
    gvThumbnailLastIndx = favouritesObjKeys.length - 1;
    favouritesObjKeys.forEach((fqfn, indx) => {
        gvDivThumbnails.appendChild(thumnNailDivForFQFN(fqfn, indx));
    });
    gvDivThumbnails.scrollTop = 0;
}

// clear toggle btns
function clearYearButtonsSelected() {
    for(const btn of gvDivYears.getElementsByClassName('cssYearBtn')) toggleYearBtnSelected(btn,false);
}

function toggleYearBtnSelected(btn,selected) {
    if(selected) {
        btn.classList.add('cssYearSelected');
        btn.classList.remove('cssYearUnselected');
    } else {
        btn.classList.remove('cssYearSelected');
        btn.classList.add('cssYearUnselected');
    }
}

function clearAllsDirButtonsSelected() {
    for(const btn of gvDivDirs.getElementsByClassName('cssDivDir')) btn.classList.remove('cssDirSelected');
}

function updateDirDivSelected(btn,selected) {
    if(selected) {
        btn.classList.add('cssDirSelected');
    } else {
        btn.classList.remove('cssDirSelected');
    }
}

// handle btn clicks
function handleYearClicked(ev) {
    clearYearButtonsSelected();
    toggleYearBtnSelected(ev.target,true);
    const year = ev.target.getAttribute('data-year');
    localStorage.setItem(ls_yearButtonName,year);
    if(year === kFavsName) loadThumbnailsForFavs();
    else loadDirectoriesForYear(year);
    resizeColumns();// to account for divDirs being different height
}

function handleDirDivClicked(ev) {
    const divClicked = ev.target;
    localStorage.setItem(ls_dirDivName, divClicked.getAttribute('data-dirkey'));
    loadThumbnailsForDirectory(divClicked);
    clearAllsDirButtonsSelected();
    updateDirDivSelected(divClicked,true);
}

function handleThumbnailClicked(ev) {
    setPhotoFSImageWithThumbnail(ev.target);
    gvThumbnailSelectedIndx = parseInt(ev.target.getAttribute('data-indx'));
    showModalPhotoFS();
}

// window resize
function handleWindowResize() {
    clearTimeout(gvResizeTimer);
    gvResizeTimer = setTimeout(()=>{handleResizeTimer()},100);
}

function handleResizeTimer() {
    if(gvModalPhotoIsShown) {
        resizeImgFS();
    }
    resizeColumns();
}

function isLandscape() {
    //gvColThumbnails is 2/3 of width
    return gvColThumbnails.getBoundingClientRect().width / window.innerWidth < 0.7;
}

function resizeColumns() {
    if(isLandscape()) {
        //alongside
        gvDivDirsOuter.style.height = (window.innerHeight - gvDivYears.getBoundingClientRect().height) + 'px';
        gvDivThumbnailsouter.style.height = window.innerHeight + 'px';
    } else {
        // stacked
        gvDivDirsOuter.style.height = "";
        //const availableHeight = window.innerHeight - gvColYears.getBoundingClientRect().height;// gvDivYears.getBoundingClientRect().height;
        gvDivThumbnailsouter.style.height = (window.innerHeight - gvColYears.getBoundingClientRect().height) + 'px'; //(availableHeight * 0.75) + 'px';
    }
}

function resizeImgFS() {
    const hwRatioImg = gvImgPhotoFS.naturalHeight / gvImgPhotoFS.naturalWidth;
    const divrect = gvDivPhotoFS.getBoundingClientRect();
    const imgWidthUsingWindowheight = divrect.height / hwRatioImg;


    if(imgWidthUsingWindowheight <= divrect.width) {
        // set height to divrect h as width fits
        gvImgPhotoFS.height = divrect.height;
        gvImgPhotoFS.width = imgWidthUsingWindowheight;
    } else {
        gvImgPhotoFS.height = divrect.width * hwRatioImg;
        gvImgPhotoFS.width = divrect.width;
    }

    gvImgPhotoFS.style.marginLeft = ((divrect.width - gvImgPhotoFS.width) / 2) + 'px';
    gvImgPhotoFS.style.marginTop = ((divrect.height - gvImgPhotoFS.height) / 2) + 'px';


}

// FS image
function setPhotoFSImageWithThumbnail(img) {
    gvImgPhotoFS.src = img.getAttribute('data-jpegpath');
    const fqFavName = img.getAttribute('data-fqfavname');
    gvImgPhotoFS.setAttribute('data-fqfavname',fqFavName);
    updateFavouriteIconForFQFN(fqFavName);
    gvDivPhotoFSFQFN.innerText = photoFSNameFromFQFN(fqFavName);
}

function showModalPhotoFS() {
    hidePhotoFStoolbars(false);
    updatePrevNextButtons();
    gvBootstrapModalPhoto.show();
}

function closePhotoFS() {
    gvBootstrapModalPhoto.hide();
}

function handleBtnPhotoFSClicked() {
    toggleDisplayPhotoFStoolbars();
}

function hidePhotoFStoolbars(hide) {
    gvDivPhotoFSdivTop.hidden = hide;
    gvDivPhotoFSdivBottom.hidden = hide;
}

function toggleDisplayPhotoFStoolbars() {
    hidePhotoFStoolbars(!gvDivPhotoFSdivTop.hidden);
}

function changePhotoFSSelIndx(direction) {
    const increment = direction === 'next' ? 1 : -1;
    gvThumbnailSelectedIndx = Math.max(0, Math.min(gvThumbnailLastIndx, gvThumbnailSelectedIndx + increment));
    setPhotoFSImageWithThumbnail(gvDivThumbnails.children[gvThumbnailSelectedIndx]);
    updatePrevNextButtons();
}

function updatePrevNextButtons() {
    gvDivPhotoFSbtnNext.style.visibility = gvThumbnailSelectedIndx === gvThumbnailLastIndx ? 'hidden' : 'visible';
    gvDivPhotoFSbtnPrev.style.visibility = gvThumbnailSelectedIndx === 0 ? 'hidden' : 'visible';
}

function sharePhotoFS() {
    const imgDownload = gvDivThumbnails.children[gvThumbnailSelectedIndx];
    const anchor = document.createElement('a');
    anchor.href = imgDownload.getAttribute('data-jpegpath');
    anchor.download = imgDownload.getAttribute('data-thumbname');
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

// Div creators
function thumnNailDivForFQFN(fqfn, indx) {
    let img = document.createElement('img');
    img.className = 'cssThumbnailImage'; //ratio ratio-4x3
    const jpegpath = gvFavouritesObj[fqfn];
    img.src = jpegpath;
    const ydtArray = ydtArrayFromFQfavsName(fqfn);
    img.setAttribute('data-year',ydtArray[0]);
    img.setAttribute('data-dirkey',ydtArray[1]);
    img.setAttribute('data-fqfavname',fqfn);
    img.setAttribute('data-jpegpath',jpegpath);
    img.setAttribute('data-indx',String(indx));
    img.onclick = handleThumbnailClicked;
    return img;
}

function thumnNailDivForNameDirYear(year,dirkey,thumbName,indx) {
    let img = document.createElement('img');
    img.className = 'cssThumbnailImage'; //ratio ratio-4x3
    const jpegpath = jpegPathForYDTarray([year,dirkey,thumbName]);
    img.src = jpegpath;
    img.setAttribute('data-year',year);
    img.setAttribute('data-dirkey',dirkey);
    img.setAttribute('data-fqfavname',fqFavsNameFromYDTarray([year, dirkey,thumbName]));
    img.setAttribute('data-jpegpath',jpegpath);
    img.setAttribute('data-indx',String(indx));
    img.onclick = handleThumbnailClicked;
    return img;
}

