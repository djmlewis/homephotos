// call these functions on DOM loaded
window.addEventListener('DOMContentLoaded', function () {
    buildYearButtons();

});

// call these functions on page fully loaded
    window.addEventListener('load', function () {
        gvModalPhoto = new bootstrap.Modal(document.getElementById('modal-photo'), {});

});

function buildYearButtons() {
    const divYears = document.getElementById('div-years');
    Object.keys(gvIndexMediaObj).sort().forEach(yearName=>{
        let btn = document.createElement('div');
        const favCSS = yearName === kFavsName ? ' cssYearBtnFavs' : '';
        btn.className = 'cssYearBtn cssYearUnselected' + favCSS;
        btn.innerText = yearName;
        btn.setAttribute('data-year',yearName);
        btn.onclick = handleYearClicked;
        divYears.appendChild(btn);
    });
    addIndexYearButton(divYears);
    // set the selected year
    const btns = Array.from(divYears.getElementsByClassName('cssYearBtn'));
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
    const divDirs = document.getElementById('div-dirs');
    const dirs = Array.from(divDirs.getElementsByClassName('cssIndexRow'));
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
    for(const btn of document.getElementById('div-years').getElementsByClassName('cssYearBtn')) toggleYearBtnSelected(btn,false);
}

function loadDirectoriesForYear(year) {
    const divDirs = document.getElementById('div-dirs');
    divDirs.innerHTML = '';
    Object.keys(gvIndexMediaObj[year]).sort().forEach((dirkey,indx) => {
            const div = document.createElement('div');
            div.setAttribute('data-year',year);
            div.setAttribute('data-dirkey',dirkey);
            div.setAttribute('data-indx',String(indx));
            div.innerText = dirkey;
            div.className = "cssIndexRow";
            div.onclick = handleDirDivClicked;
            divDirs.appendChild(div);
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
    const divThumbnails = document.getElementById('div-thumbnailsouter');
    divThumbnails.innerHTML = '';
    // dirkey obj is an array
    const dirkeyObj = gvIndexMediaObj[year][dirkey];
    if(!!dirkeyObj) dirkeyObj.forEach(thumbName => {
        divThumbnails.appendChild(thumnNailDivForNameDirYear(thumbName, dirkey,year));
    });
    divThumbnails.scrollTop = 0;

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
function thumnNailDivForNameDirYear(thumbName,dirkey, year) {
    let imgdiv = document.createElement('div');
    let img = document.createElement('img');
    img.style.width = '100%';
    imgdiv.className = 'cssThumbnailImage ratio ratio-4x3'; //ratio
    img.style.objectFit = 'scale-down';
    const jpegpath = 'media/jpegs/'+year+'/'+dirkey+'/'+thumbName;
    img.src = jpegpath;
    img.setAttribute('data-thumbName',thumbName);
    img.setAttribute('data-year',year);
    img.setAttribute('data-dirkey',dirkey);
    img.setAttribute('data-jpegpath',jpegpath);
    img.onclick = handleThumbnailClicked;
    imgdiv.appendChild(img);
    return imgdiv;
}
function handleThumbnailClicked(ev) {
    gvModalPhoto.show();
}

function handleYearClicked(ev) {
    clearYearButtonSelected();
    toggleYearBtnSelected(ev.target,true);
    const year = ev.target.getAttribute('data-year');
    localStorage.setItem(ls_yearButtonName,year);
    loadDirectoriesForYear(year);
}

function clearAllsDirButtonsSelected() {
    for(const btn of document.getElementById('div-dirs').getElementsByClassName('cssIndexRow')) btn.classList.remove('cssDirSelected');
}

function updateDirDivSelected(btn,selected) {
    if(selected) {
        btn.classList.add('cssDirSelected');
    } else {
        btn.classList.remove('cssDirSelected');
    }
}
