/*
By: Brendan Luke

Date: August 12, 2021

Purpose: this Javascript file contains the output function that creates a GPX formatted string and writes it to a .gpx file.
*/


// Output function
function outputGPX(data,fileName) {
    data = data.split('\n'); // split data into array by new line
    fileTimeStamp = new Date().toISOString(); // UTC formatted time stamp for creation of file
    var gpxString = '<?xml version="1.0" encoding="UTF-8"?>\n' + 
                    '<gpx\n' +
                    '  version="1.1"\n' + 
                    '  creator="From https://brendanluke15.github.io/NMEA-Sentence-Decoder/NMEA-Sentence-Decoder.html"\n' + 
                    '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
                    '  xmlns="http://www.topografix.com/GPX/1/1"\n' +
                    '  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"\n' +
                    '  xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"\n' +
                    '>\n' +
                    '<metadata>\n' +
                    '  <name>' + fileName.substring(0,fileName.length-4) + '</name>\n' +
                    '  <desc>This file was generated via https://brendanluke15.github.io/NMEA-Sentence-Decoder/NMEA-Sentence-Decoder.html</desc>\n' +
                    '  <copyright>The software that generated this file is licensed under the MIT License.</copyright>\n' +
                    '  <date>' + fileTimeStamp + '</date>\n' +
                    '</metadata>\n' +
                    '<trk>\n' +
                    '  <trkseg>\n'; // initialize GPX output string
    setComplete = false; // initialize logic bit to FALSE
    for (let i = 0; i < data.length; i++) { // start from first line
        var sentenceType = (data[i].substring(0,6)).substring(3,6); // type of NMEA sentence

        // Parse sentences & return data (only GGA, RMC, VTG for now, GSA for DOP's)
        if (sentenceType === "GGA") {
            outGGA = GGA(data[i]); // call GGA parsing function
            setComplete = true; // set logic bit to TRUE
        } else if (sentenceType === "GSV") {
            outGSV = GSV(data[i]); // call GSV parsing function
        } else if (sentenceType === "GSA") {
            outGSA = GSA(data[i]); // call GSA parsing function
        } else if (sentenceType === "VTG") {
            outVTG = VTG(data[i]); // call VTG parsing function
        } else if (sentenceType === "RMC") {
            outRMC = RMC(data[i]); // call RMC parsing function
        } else { // invalid sentence type
            // alert?
        }

        // When next sentence is GGA, combine data into one GPX track(?)
        /*
            consider GGA to be the last sentence returned in a set
        */
        if (setComplete) { // write data to GPX track(?) if set complete is TRUE (sentence is GGA; indicating end of set)
            timeDateString = '20'+outRMC.Year+'-'+outRMC.Month+'-'+outRMC.Day+'T'+outGGA.UTC+'Z'; // formatted time & date string           

            // write to output GPX string
            gpxString = gpxString + 
                '<trkpt lat="' + outGGA.Latitude + '" lon="' + outGGA.Longitude + '">\n' +
                '  <ele>' + outGGA.ASL + '</ele>\n' +
                '  <time>' + timeDateString + '</time>\n' +
                '</trkpt>\n'; // GPX formatted output string

            // reset logic bit
            setComplete = false;
        }            
    }

    // Close out open tags
    gpxString = gpxString +
        '  </trkseg>\n' +
        '</trk>\n' +
        '</gpx>';

    let blobFile = new Blob([gpxString], {type: 'text/plain'}); // creates new blob data type from 'gpxString' string variable
    // below creates file and downloads it to user's computer
    var a = document.createElement("a"),
    url = URL.createObjectURL(blobFile);
    a.href = url;
    a.download = fileName.substring(0,fileName.length-4) + ".gpx";
    document.body.appendChild(a);
    a.click(); 
}