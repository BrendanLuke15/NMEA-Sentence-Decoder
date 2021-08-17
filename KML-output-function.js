/*
By: Brendan Luke

Date: August 17, 2021

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
                    '\t<Style id="track">\n' +
                    '\t\t<IconStyle>\n' +
                    '\t\t\t<scale>1.2</scale>\n' +
                    '\t\t\t<Icon>\n' +
                    '\t\t\t\t<href>http://earth.google.com/images/kml-icons/track-directional/track-0.png</href>\n' +
                    '\t\t\t</Icon>\n' +
                    '\t\t</IconStyle>\n' +
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
    var whens = ''; // initialize whens string
    var points = ''; // initialize points string
    var gxCoords = ''; // initialize gxCoords string
    var j = 0; // increment counter to name track points
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

            // write points (with data table (description), timestamp, look at)
            points = points + 
                '\t\t\t<Placemark>\n' +
                '\t\t\t\t<name>' + j + '</name>\n' +
                '\t\t\t\t<snippet></snippet>\n' + // need blank snippet to prevent description being used in Places panel
                '\t\t\t\t<visibility>0</visibility>\n' + // default hide contents
                '\t\t\t\t<description>\n' +
                '\t\t\t\t\t<![CDATA[<table>\n' +
                '\t\t\t\t\t\t<tr><td>Longitude: ' + outGGA.Longitude + '° </td></tr>\n' +
                '\t\t\t\t\t\t<tr><td>Latitude: ' + outGGA.Latitude + '° </td></tr>\n' +
                '\t\t\t\t\t\t<tr><td>Altitude: ' + outGGA.ASL + 'm </td></tr>\n' +
                '\t\t\t\t\t\t<tr><td>Ground Speed: ' + outVTG.GroundSpeedKts + ' kts </td></tr>\n' +
                '\t\t\t\t\t\t<tr><td>True Heading: ' + outVTG.GroundTrackTrue + '° </td></tr>\n' +
                '\t\t\t\t\t\t<tr><td>Time: ' + timeDateString + ' </td></tr>\n' +
                '\t\t\t\t\t</table>]]>\n' +
                '\t\t\t\t</description>\n' +
                '\t\t\t\t<TimeStamp><when>' + timeDateString + '</when></TimeStamp>\n' +
                '\t\t\t\t<Point>\n' +
                '\t\t\t\t\t<styleUrl>#track</styleUrl>\n' +
                '\t\t\t\t\t<altitudeMode>absolute</altitudeMode>\n' +
                '\t\t\t\t\t<coordinates>' + outGGA.Longitude + ',' + outGGA.Latitude + ',' + outGGA.ASL + '</coordinates>\n' +
                '\t\t\t\t</Point>\n' +
                '\t\t\t\t<LookAt>\n' +
                '\t\t\t\t\t<longitude>' + outGGA.Longitude + '</longitude>\n' +
                '\t\t\t\t\t<latitude>' + outGGA.Latitude + '</latitude>\n' +
                '\t\t\t\t\t<altitude>' + outGGA.ASL + '</altitude>\n' +
                '\t\t\t\t\t<heading>' + outVTG.GroundTrackTrue + '</heading>\n' +
                '\t\t\t\t\t<tilt>66</tilt>\n' +
                '\t\t\t\t\t<range>400</range>\n' +
                '\t\t\t\t</LookAt>\n' +
                '\t\t\t</Placemark>\n'; // KML formatted string for logging track points

            // write whens & gxCoords for <gx:Track>
            whens = whens + '<when>' + timeDateString + '</when>\n'; // string of <when> time stamps
            gxCoords = gxCoords + '<gx:coord>' + outGGA.Longitude + ',' + outGGA.Latitude + ',' + outGGA.ASL + '</gx:coord>\n'; // string of gx:coords

            // reset logic bit & increment counter
            setComplete = false;
            j = j+1;
        }            
    }

    // Write products & close out open tags
    kmlString = kmlString + coordinates +
        '\t\t\t\t</coordinates>\n' +
        '\t\t\t</LineString>\n' +
        '\t\t</Placemark>\n' +
        // Ground path
        '\t\t<Placemark id="GroundTrack">\n' +
        '\t\t\t<name>Ground Track</name>\n' +
        '\t\t\t<styleUrl>#RedLine</styleUrl>\n' +
        '\t\t\t<LineString>\n' +
        '\t\t\t\t<extrude>0</extrude>\n' +
        '\t\t\t\t<tessellate>1</tessellate>\n' +
        '\t\t\t\t<altitudeMode>clampToGround</altitudeMode>\n' +
        '\t\t\t\t<coordinates>\n' + coordinates +
        '\t\t\t\t</coordinates>\n' +
        '\t\t\t</LineString>\n' +
        '\t\t</Placemark>\n' +
        // 3D Path with extend to ground
        '\t\t<Placemark id="3DPathExtrude">\n' +
        '\t\t\t<name>3D Path Extended to Ground</name>\n' +
        '\t\t\t<styleUrl>#RedLine</styleUrl>\n' +
        '\t\t\t<LineString>\n' +
        '\t\t\t\t<extrude>1</extrude>\n' +
        '\t\t\t\t<tessellate>1</tessellate>\n' +
        '\t\t\t\t<altitudeMode>absolute</altitudeMode>\n' +
        '\t\t\t\t<coordinates>\n' + coordinates +
        '\t\t\t\t</coordinates>\n' +
        '\t\t\t</LineString>\n' +
        '\t\t</Placemark>\n' +
        // GX Track
        '\t\t<Placemark id="gxTrack">\n' +
        '\t\t\t<name>Track</name>\n' +
        '\t\t\t<description></description>\n' +
        '\t\t\t<styleUrl>#track</styleUrl>\n' +
        '\t\t\t<gx:Track>\n' + 
        '\t\t\t\t<altitudeMode>absolute</altitudeMode>\n' + whens + gxCoords +
        '\t\t\t</gx:Track>\n' +
        '\t\t</Placemark>\n' +
        // Folder of Points
        '\t\t<Folder id="TrackPoints">\n' +
        '\t\t<open>0</open>\n' + // default closed
        '\t\t<visibility>0</visibility>\n' + // default hide contents
        '\t\t<name>Track Points</name>\n' + points +
        '\t\t</Folder>\n'
    // Closing tags
    kmlString = kmlString +
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