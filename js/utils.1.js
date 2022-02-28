function fqFavsNameFromYDTarray(ydtArray) {
    return ydtArray.join('\t');
}

function ydtArrayFromFQfavsName(fqFavName) {
    return fqFavName.split('\t');
}

function jpegPathForYDTarray(ydtArray) {
    return gvJPEGfolderName + ydtArray.join('/');
}

function jpegPathForFQFN(fqFavName) {
    return jpegPathForYDTarray(ydtArrayFromFQfavsName(fqFavName));
}

function photoFSNameFromFQFN(fqFavName) {
    return ydtArrayFromFQfavsName(fqFavName).join(' • ');
}