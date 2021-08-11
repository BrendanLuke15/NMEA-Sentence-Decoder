/*
By: Brendan Luke

Date: August 11, 2021

Purpose: this Javascript file contains the output function that creates a CSV formatted string and writes it to a .csv file.
*/


// Output function
function outputCSV(data,fileName) {
    data = data.split('\n'); // split data into array by new line
    var csvString = 'NMEA Sentence:,Time & Date:,Validity:,Latitude (deg):,Longitude (deg):,Altitude ASL (m):,True Track (deg):,'
        + 'Magnetic Track (deg):,Ground Speed (kts):,Height Above Geoid (m):,PDOP:,HDOP:,VDOP:,X (m):,Y (m):,Z (m):,Satellites in View (#):,'
        + 'Space Vehicle ID:,Elevation (deg):,Azimuth (deg):,SNR (dB):,Active Satellites:,Magnetic Variation (deg):,Mode:,Fix Type:,Fix Quality:\n'; // initialize final data holder with column headers
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

        // When next sentence is GGA, combine data into one CSV row
        /*
            consider GGA to be the last sentence returned in a set
        */
        if (setComplete) { // write data to CSV row if set complete is TRUE (sentence is GGA; indicating end of set)
            timeDateString = 'future work'; // formatted time & date string

            // Below is all for getting cartesian corrdinates in ECEF coordinate system
            heightAboveEllipsoid = parseFloat(outGGA.GeoidHeight) + parseFloat(outGGA.ASL); // height above WGS-84 ellipsoid
            geocentricLatitude = Math.atan(Math.pow(1-1/298.257223563,2)*Math.tan(parseFloat(outGGA.Latitude)/180*Math.PI)); // convert geodetic latitude to geocentric latitude (radians)
            R = Math.pow(6378137,3)*(1-1/298.257223563)/Math.sqrt(Math.pow(6378137,4)*Math.pow(Math.sin(geocentricLatitude),2) + Math.pow(1-1/298.257223563,2)*Math.pow(6378137,4)*Math.pow(Math.cos(geocentricLatitude),2)*(Math.pow(Math.cos(parseFloat(outGGA.Longitude)/180*Math.PI),2)+Math.pow(Math.sin(parseFloat(outGGA.Longitude)/180*Math.PI),2))) + heightAboveEllipsoid; // distance to center of Earth
            X = R*Math.cos(geocentricLatitude)*Math.cos(parseFloat(outGGA.Longitude)/180*Math.PI);
            Y = R*Math.cos(geocentricLatitude)*Math.sin(parseFloat(outGGA.Longitude)/180*Math.PI);
            Z = R*Math.sin(geocentricLatitude);

            

            // write to output CSV string
            csvString = csvString + "future work," + timeDateString + ',"FQ: ' + outGGA.FixQual + ', RxWarn: ' + outRMC.RxWarn + '",' + outGGA.Latitude
                + "," + outGGA.Longitude + "," + outGGA.ASL + "," + outVTG.GroundTrackTrue + "," + outVTG.MagneticGroundTrack + "," + outVTG.GroundSpeedKts
                + "," + outGGA.GeoidHeight + "," + outGSA.PDOP + "," + outGSA.HDOP + "," + outGSA.VDOP + "," + X + "," + Y + "," + Z + "\n"; // CSV formatted output string
        }            
    }

    let blobFile = new Blob([csvString], {type: 'text/plain'}); // creates new blob data type from 'csvString' string variable
    // below creates file and downloads it to user's computer
    var a = document.createElement("a"),
    url = URL.createObjectURL(blobFile);
    a.href = url;
    a.download = fileName.substring(0,fileName.length-4) + ".csv";
    document.body.appendChild(a);
    a.click(); 
}