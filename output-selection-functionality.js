/*
By: Brendan Luke

Date: September 8, 2021

Purpose: this Javascript file contatins the functionality for selecting the output type (CSV, GPX, or KML).
*/


// Output Selection functions
function selectCSV() {
    // set logic index
    outputFlag = 1;

    // change 'button' stylings
    document.getElementById('CSV').className = 'header-select-icon-active';
    document.getElementById('GPX').className = 'header-select-icon';
    document.getElementById('KML').className = 'header-select-icon';
    document.getElementById('Stationary').className = 'header-select-icon';
}

function selectGPX() {
    // set logic index
    outputFlag = 2;

    // change 'button' stylings
    document.getElementById('GPX').className = 'header-select-icon-active';
    document.getElementById('CSV').className = 'header-select-icon';
    document.getElementById('KML').className = 'header-select-icon';
    document.getElementById('Stationary').className = 'header-select-icon';
}

function selectKML() {
    // set logic index
    outputFlag = 3;

    // change 'button' stylings
    document.getElementById('KML').className = 'header-select-icon-active';
    document.getElementById('CSV').className = 'header-select-icon';
    document.getElementById('GPX').className = 'header-select-icon';
    document.getElementById('Stationary').className = 'header-select-icon';
}

function selectStationary() {
    // set logic index
    outputFlag = 4;

    // change 'button' stylings
    document.getElementById('Stationary').className = 'header-select-icon-active';
    document.getElementById('CSV').className = 'header-select-icon';
    document.getElementById('GPX').className = 'header-select-icon';
    document.getElementById('KML').className = 'header-select-icon';
}