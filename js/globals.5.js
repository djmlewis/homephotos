const ls_favourites = "ls_favourites1";
const ls_yearButtonName = "ls_yearButtonName";
const ls_dirDivName = "ls_divButtonName";

const kFavsName = '♥︎';
const kTitlesIndexName = 'Index︎';

let gvResizeTimer;

let gvModalPhotoIsShown = false;
let gvThumbnailSelectedIndx = 0;
let gvThumbnailLastIndx = 0;

let gvBootstrapModalPhoto = null;
let gvColYears = null;
let gvDivYears = null;
let gvDivDirsOuter = null;
let gvDivDirs = null;
let gvColThumbnails = null;
let gvDivThumbnailsouter = null;
let gvDivThumbnails = null;
let gvModalPhoto = null;
let gvDivPhotoFS = null;
let gvImgPhotoFS = null;
let gvDivPhotoFSdivTop = null;
let gvDivPhotoFSdivBottom = null;
let gvDivPhotoFSbtnNext = null;
let gvDivPhotoFSbtnPrev = null;
let gvImgFavourite = null;

const gvJPEGfolderName = 'media/jpegs/';

let gvFavouritesObj = {};
