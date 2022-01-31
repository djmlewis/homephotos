// call these functions on DOM loaded  -- DOMContentLoaded on DOCUMENT, onload on WINDOW
document.addEventListener('DOMContentLoaded', function () {
    setupGlobals();
    gvBootstrapModalPhoto = new bootstrap.Modal(gvModalPhoto, {});
    gvModalPhoto.addEventListener('hidden.bs.modal', function (ev) {
        gvModalPhotoIsShown = false;
    });
    gvModalPhoto.addEventListener('shown.bs.modal', function (ev) {
        gvModalPhotoIsShown = true;
    });
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
    gvDivThumbnails = document.getElementById('div-thumbnails');
    gvModalPhoto = document.getElementById('modal-photo');
    gvDivPhotoFS = document.getElementById('div-photoFS');
    gvImgPhotoFS = document.getElementById('img-photoFS');
}

function buildYearButtons() {
    gvDivYears.innerHTML = '';
    Object.keys(gvIndexMediaObj).sort().forEach(yearName=>{
        let btn = document.createElement('div');
        const favCSS = yearName === kFavsName ? ' cssYearBtnFavs' : '';
        btn.className = 'cssYearBtn cssYearUnselected' + favCSS;
        btn.innerText = yearName;
        btn.setAttribute('data-year',yearName);
        btn.onclick = handleYearClicked;
        gvDivYears.appendChild(btn);
    });
    addIndexYearButton(gvDivYears);
    // set the selected year
    const btns = Array.from(gvDivYears.getElementsByClassName('cssYearBtn'));
    let prefBtn = btns[0];
    // select the last used if available or keep first button
    const savedYear = localStorage.getItem(ls_yearButtonName);
    if (!!savedYear) {
        const savedBtn = btns.find(element => element.innerText === savedYear);
        if(!!savedBtn) prefBtn = savedBtn;
    }
    toggleYearBtnSelected(prefBtn,true);
    // add its dirs
    loadDirectoriesForYear(prefBtn.getAttribute('data-year'));
    // select prev dir if available
    const dirs = Array.from(gvDivDirs.getElementsByClassName('cssIndexRow'));
    let prefDirDiv = dirs[0];
    const savedDir = localStorage.getItem(ls_dirDivName);
    if (!!savedDir) {
        const savedDirDiv = dirs.find(element => element.getAttribute('data-dirkey') === savedDir);
        if(!!savedDirDiv) {
            prefDirDiv = savedDirDiv;
        }
    }
    updateDirDivSelected(prefDirDiv,true);
    loadThumbnailsForDirectory(prefDirDiv);
}

function addIndexYearButton(divYears) {
    let btn = document.createElement('div');
    btn.className = 'cssYearBtn cssYearUnselected';
    btn.innerText = kTitlesIndexName;
    btn.setAttribute('data-year',kTitlesIndexName);
    btn.onclick = (ev)=>{handleYearClicked(ev)};
    divYears.appendChild(btn);
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

function clearYearButtonSelected() {
    for(const btn of gvDivYears.getElementsByClassName('cssYearBtn')) toggleYearBtnSelected(btn,false);
}

function loadDirectoriesForYear(year) {
    gvDivDirs.innerHTML = '';
    Object.keys(gvIndexMediaObj[year]).sort().forEach((dirkey,indx) => {
            const div = document.createElement('div');
            div.setAttribute('data-year',year);
            div.setAttribute('data-dirkey',dirkey);
            div.setAttribute('data-indx',String(indx));
            div.innerText = dirkey;
            div.className = "cssIndexRow";
            div.onclick = handleDirDivClicked;
        gvDivDirs.appendChild(div);
        });
}

function handleDirDivClicked(ev) {
    const divClicked = ev.target;
    localStorage.setItem(ls_dirDivName,divClicked.getAttribute('data-dirkey'));
    loadThumbnailsForDirectory(divClicked);
    clearAllsDirButtonsSelected();
    updateDirDivSelected(divClicked,true);
}

function loadThumbnailsForDirectory(divClicked) {
    const year = divClicked.getAttribute('data-year');
    const dirkey = divClicked.getAttribute('data-dirkey');
    gvDivThumbnails.innerHTML = '';
    // dirkey obj is an array
    const dirkeyObj = gvIndexMediaObj[year][dirkey];
    if(!!dirkeyObj) dirkeyObj.forEach((thumbName, indx) => {
        gvDivThumbnails.appendChild(thumnNailDivForNameDirYear(thumbName, dirkey,year, indx));
    });
    gvDivThumbnails.scrollTop = 0;

    /*
        divThumbnails.innerHTML = '';
        const btnIndexThumbs = document.getElementById('btn-ThumbsIndex');
        btnIndexThumbs.innerText = 'Show Titles';
        btnIndexThumbs.hidden = true;
        if(year === kTitlesIndexName) {
            btnIndexThumbs.hidden = true;
            divThumbnails.innerHTML = gvIndexHTML;
        } else {
            btnIndexThumbs.hidden = year === kFavsName;//!isLandscape() || year === kFavsName;
            const thumbNamesArray = year === kFavsName ? Object.keys(gvFavouritesObj) : gvIndexMediaObj[year];
            thumbNamesArray.sort().forEach(thumbName => {
                // the year for the favs thumbName is the value of the thumbName key in gvFavouritesObj
                const actualYear = year === kFavsName ? gvFavouritesObj[thumbName] : year;
                divThumbnails.appendChild(thumnNailDivForNameYear(thumbName, actualYear));
            });
            if (year === kFavsName) {
                const favsdiv = document.createElement('div');
                favsdiv.className = 'cssFavsMessage';
                favsdiv.innerHTML = document.getElementById('div-favsbuttons').innerHTML;
                divThumbnails.appendChild(favsdiv);
            }
        }
        divThumbnails.scrollTop = 0;
    */
}
function thumnNailDivForNameDirYear(thumbName,dirkey, year,indx) {
    let imgdiv = document.createElement('div');
    imgdiv.className = "cssThumbnailDiv";
    let img = document.createElement('img');
    img.className = 'cssThumbnailImage'; //ratio ratio-4x3
    const jpegpath = 'media/jpegs/'+year+'/'+dirkey+'/'+thumbName;
    img.src = jpegpath;
    img.setAttribute('data-thumbName',thumbName);
    img.setAttribute('data-year',year);
    img.setAttribute('data-dirkey',dirkey);
    img.setAttribute('data-jpegpath',jpegpath);
    img.setAttribute('data-indx',String(indx));
    img.onclick = handleThumbnailClicked;
    imgdiv.appendChild(img);
    return imgdiv;
}
function handleThumbnailClicked(ev) {
    gvImgPhotoFS.src = ev.target.getAttribute('data-jpegpath');
    gvBootstrapModalPhoto.show();
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
function handleYearClicked(ev) {
    clearYearButtonSelected();
    toggleYearBtnSelected(ev.target,true);
    const year = ev.target.getAttribute('data-year');
    localStorage.setItem(ls_yearButtonName,year);
    loadDirectoriesForYear(year);
}

function clearAllsDirButtonsSelected() {
    for(const btn of gvDivDirs.getElementsByClassName('cssIndexRow')) btn.classList.remove('cssDirSelected');
}

function updateDirDivSelected(btn,selected) {
    if(selected) {
        btn.classList.add('cssDirSelected');
    } else {
        btn.classList.remove('cssDirSelected');
    }
}

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
    const availableHeight = window.innerHeight - gvDivYears.getBoundingClientRect().height;
    if(isLandscape()) {
        //alongside
        gvDivThumbnailsouter.style.height = window.innerHeight + 'px';
        gvDivDirsOuter.style.height = availableHeight + 'px';
    } else {
        // stacked
        gvDivDirsOuter.style.height = (availableHeight * 0.25) + 'px';
        gvDivThumbnailsouter.style.height = (availableHeight * 0.75) + 'px';
    }

    /*
        const colyears = document.getElementById('col-years');
        const colthumbs = document.getElementById('col-thumbnails');
        const innerheight = window.innerHeight;
        // i dont trust reported col heights so have a special div video outer
        const divvideoouter = document.getElementById('div-videoOuter');
        const divYears = document.getElementById('div-years');
        const btnThumbsIndex = document.getElementById('btn-ThumbsIndex');
        btnThumbsIndex.hidden = indexIsSelectedYear() || favsIsSelectedYear();
        if(isLandscape()) {
            //alongside
            colthumbs.style.height = innerheight + 'px';
            colyears.style.height = innerheight + 'px';
            btnThumbsIndex.style.marginTop = '6px';
        } else {
            // stacked
            colthumbs.style.height = (innerheight - divYears.getBoundingClientRect().height - divvideoouter.getBoundingClientRect().height) + 'px';
            colyears.style.height = 'auto';
            btnThumbsIndex.style.marginTop = '0';
        }
    */
}