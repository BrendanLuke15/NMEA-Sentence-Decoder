/*
By: Brendan Luke

Date: August 11, 2021

Purpose: this Javascript file contatins the functionality for selecting the output type (CSV or GPX).
*/


// Output Selection functions
function selectCSV() {
    // set logic bit
    outputFlag = true;

    // change 'button' stylings
    document.getElementById('CSV').className = 'header-select-icon-active';
    document.getElementById('GPX').className = 'header-select-icon';
}

function selectGPX() {
    // set logic bit
    outputFlag = false;

    // change 'button' stylings
    document.getElementById('GPX').className = 'header-select-icon-active';
    document.getElementById('CSV').className = 'header-select-icon';
}