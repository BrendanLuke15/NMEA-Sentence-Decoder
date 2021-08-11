/*
By: Brendan Luke

Date: August 11, 2021

Purpose: this Javascript file contains the output function that creates a GPX formatted string and writes it to a .gpx file.
*/


// Output function
function outputGPX(data,fileName) {
    data = data.split('\n'); // split data into array by new line
    var gpxString = '<?xml version="1.0" encoding="UTF-8"?>\n' + 
                    '<gpx\n' +
                    '  version="1.1"\n' + 
                    '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
                    '  xmlns="http://www.topografix.com/GPX/1/1"\n' +
                    '  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"\n' +
                    '  xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"\n' +
                    '>\n' +
                    '<metadata>\n' +
                    '' + // NOT COMPLETE!
                    '</metadata>\n'; // initialize final data holder with column headers
    setComplete = false; // initialize logic bit to FALSE
    for (let i = 0; i < data.length; i++) { // start from first line
        var sentenceType = (data[i].substring(0,6)).substring(3,6); // type of NMEA sentence
        //console.log(sentenceType);

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

        // When next sentence is GGA, combine data into one GPX track?
        /*
            consider GGA to be the last sentence returned in a set
        */
        if (setComplete) { // write data to GPX track(?) if set complete is TRUE (sentence is GGA; indicating end of set)
            timeDateString = 'future work'; // formatted time & date string

            // Below is all for getting cartesian corrdinates in ECEF coordinate system
            heightAboveEllipsoid = parseFloat(outGGA.GeoidHeight) + parseFloat(outGGA.ASL); // height above WGS-84 ellipsoid
            geocentricLatitude = Math.atan(Math.pow(1-1/298.257223563,2)*Math.tan(parseFloat(outGGA.Latitude)/180*Math.PI)); // convert geodetic latitude to geocentric latitude (radians)
            R = Math.pow(6378137,3)*(1-1/298.257223563)/Math.sqrt(Math.pow(6378137,4)*Math.pow(Math.sin(geocentricLatitude),2) + Math.pow(1-1/298.257223563,2)*Math.pow(6378137,4)*Math.pow(Math.cos(geocentricLatitude),2)*(Math.pow(Math.cos(parseFloat(outGGA.Longitude)/180*Math.PI),2)+Math.pow(Math.sin(parseFloat(outGGA.Longitude)/180*Math.PI),2))) + heightAboveEllipsoid; // distance to center of Earth
            X = R*Math.cos(geocentricLatitude)*Math.cos(parseFloat(outGGA.Longitude)/180*Math.PI);
            Y = R*Math.cos(geocentricLatitude)*Math.sin(parseFloat(outGGA.Longitude)/180*Math.PI);
            Z = R*Math.sin(geocentricLatitude);

            

            // write to output GPX string
            gpxString = gpxString + "future work," + timeDateString + ',"FQ: ' + outGGA.FixQual + ', RxWarn: ' + outRMC.RxWarn + '",' + outGGA.Latitude
                + "," + outGGA.Longitude + "," + outGGA.ASL + "," + outVTG.GroundTrackTrue + "," + outVTG.MagneticGroundTrack + "," + outVTG.GroundSpeedKts
                + "," + outGGA.GeoidHeight + "," + outGSA.PDOP + "," + outGSA.HDOP + "," + outGSA.VDOP + "," + X + "," + Y + "," + Z + "\n"; // CSV formatted output string
        }            
    }

    let blobFile = new Blob([gpxString], {type: 'text/plain'}); // creates new blob data type from 'gpxString' string variable
    // below creates file and downloads it to user's computer
    var a = document.createElement("a"),
    url = URL.createObjectURL(blobFile);
    a.href = url;
    a.download = fileName.substring(0,fileName.length-4) + ".gpx";
    document.body.appendChild(a);
    a.click(); 
}