/*
By: Brendan Luke

Date: August 13, 2021

Purpose: this Javascript file contains the output function that creates a KML formatted string and writes it to a .kml file.
*/


// Output function
function outputKML(data,fileName) {
    data = data.split('\n'); // split data into array by new line
    fileTimeStamp = new Date(); // time stamp for creation of file
    var kmlString = '<?xml version="1.0" encoding="UTF-8"?>\n' + 
                    '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">\n' +
                    '<Document>\n' +
                    '\t<name>KML File</name>\n' +
                    '\t<snippet>Created ' + fileTimeStamp + '</snippet>\n' +
                    '\t<description>\n' +
                    '\t\tThis file was generated via: <link>https://brendanluke15.github.io/NMEA-Sentence-Decoder/NMEA-Sentence-Decoder.html</link>, licensed under the MIT License.\n' +
                    '\t</description>\n' +
                    '\t<Style id="RedLine">\n' +
                    '\t\t<LineStyle>\n' +
                    '\t\t\t<color>ff0000ff</color>\n' +
                    '\t\t\t<width>2</width>\n' +
                    '\t\t</LineStyle>\n' +
                    '\t\t<PolyStyle>\n' +
                    '\t\t\t<fill>0</fill>\n' +
                    '\t\t</PolyStyle>\n' +
                    '\t</Style>\n' +
                    '\t<Folder id="Main">\n' +
                    '\t\t<visibility>1</visibility>\n' + 
                    '\t\t<open>1</open>\n' +
                    '\t\t<name>' + fileName.substring(0,fileName.length-4) + '</name>\n' +
                    '\t\t<Placemark id="3DPathNoExtrude">\n' +
                    '\t\t\t<name>3D Path</name>\n' +
                    '\t\t\t<styleUrl>#RedLine</styleUrl>\n' +
                    '\t\t\t<LineString>\n' +
                    '\t\t\t\t<extrude>0</extrude>\n' +
                    '\t\t\t\t<tessellate>0</tessellate>\n' +
                    '\t\t\t\t<altitudeMode>absolute</altitudeMode>\n' +
                    '\t\t\t\t<coordinates>\n'; // initialize KML output string
    
    var coordinates = ''; // initialize coordinates string
    var timeStamps = ''; // initialize timeStamps string
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

        // When current sentence is GGA, combine data into one KML point
        /*
            consider GGA to be the last sentence returned in a set
        */
        if (setComplete) { // write data to KML point if set complete is TRUE (sentence is GGA; indicating end of set)
            timeDateString = '20'+outRMC.Year+'-'+outRMC.Month+'-'+outRMC.Day+'T'+outGGA.UTC+'Z'; // formatted time & date string           

            // write coordinates
            coordinates = coordinates + '\t\t\t\t\t' + outGGA.Longitude + ',' + outGGA.Latitude + ',' + outGGA.ASL + '\n'; // KML formatted string

            // write time stamps
            timestamps = timeStamps + timeDateString + '\n'; // string of time stamps

            // reset logic bit
            setComplete = false;
        }            
    }

    // Close out open tags
    kmlString = kmlString + coordinates +
        '\t\t\t\t</coordinates>\n' +
        '\t\t\t</LineString>\n' +
        '\t\t</Placemark>\n' +
        '\t</Folder>\n' +
        '</Document>\n' +
        '</kml>';

    let blobFile = new Blob([kmlString], {type: 'text/plain'}); // creates new blob data type from 'kmlString' string variable
    // below creates file and downloads it to user's computer
    var a = document.createElement("a"),
    url = URL.createObjectURL(blobFile);
    a.href = url;
    a.download = fileName.substring(0,fileName.length-4) + ".kml";
    document.body.appendChild(a);
    a.click(); 
}