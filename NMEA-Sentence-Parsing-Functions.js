/*
By: Brendan Luke

Date: August 11, 2021

Purpose: this Javascript file contatins the NMEA sentence parsing functions for the 5 sentence types supported:
    - GGA: Fix data (lat, lon, alt, time, HDOP)
    - VTG: track, ground speed
    - RMC: Recommended minimum specific GPS/Transit data (date)

    // NOT YET FULLY SUPPORTED \\
    - GSV: Sats in view
    - GSA: Dillution of precision + active Sats
*/


// GGA Parsing Function
function GGA(sentence) {
    var temp = sentence.split(","); // split sentence by commas
    const outObject = {UTC:"", Latitude:"", Longitude:"", FixQual:"", NumSatsUse:"", HDOP:"", ASL:"", GeoidHeight:""}; // declare empty object

    // Write data from sentence to object
    outObject.UTC = temp[1].substring(0,2).concat(":",temp[1].substring(2,4),":",temp[1].substring(4,100)); // write time in 'hh:mm:ss.ss' format
    // Lat & Lon Logic:
    if (temp[3] == "N") { // North latitude
        outObject.Latitude = parseFloat(temp[2].substring(0,2)) + parseFloat(temp[2].substring(2,100))/60; // write Latitude (fixed to actual #)
    } else { // South latitude
        outObject.Latitude = -1*parseFloat(temp[2].substring(0,2)) + parseFloat(temp[2].substring(2,100))/60; // write Latitude (fixed to actual #)
    }
    if (temp[5] == "E") { // East longtitude
        outObject.Longitude = parseFloat(temp[4].substring(0,3)) + parseFloat(temp[4].substring(3,100))/60; // write Longitude (fixed to actual #)
    } else { // West longitude
        outObject.Longitude = -1*(parseFloat(temp[4].substring(0,3)) + parseFloat(temp[4].substring(3,100))/60); // write Longitude (fixed to actual #)
    }
    outObject.FixQual = temp[6]; // write fix quality
    outObject.NumSatsUse = temp[7]; // write # of Sats used
    outObject.HDOP = temp[8]; // write HDOP
    outObject.ASL = temp[9]; // write height ASL
    outObject.GeoidHeight = temp[11]; // write height above geoid

    return outObject; // return output
}

// GSV Parsing Function
function GSV(sentence) {
    var temp = sentence.split(","); // split by commas

}

// GSA Parsing Function
function GSA(sentence) {
    var temp = sentence.split(","); // split by commas
    const outObject = {PDOP:"", HDOP:"", VDOP:""}; // declare empty outObject

    // Write data from sentence to object
    outObject.PDOP = temp[15]; // write PDOP
    outObject.HDOP = temp[16]; // write HDOP
    outObject.VDOP = temp[17]; // write VDOP

    return outObject; //return output
}

// VTG Parsing Function
function VTG(sentence) {
    var temp = sentence.split(","); // split by commas
    const outObject = {GroundTrackTrue:"", MagneticGroundTrack:"", GroundSpeedKts:"", GroundSpeedKM:""}; // declare empty outObject

    // Write data from sentence to object
    outObject.GroundTrackTrue = temp[1]; // write ground track (true)
    outObject.MagneticGroundTrack = temp[3]; // write ground track (magnetic)
    outObject.GroundSpeedKts = temp[5]; // write ground speed in knots
    outObject.GroundSpeedKM = temp[7]; // write ground speed in km/h

    return outObject; // return output
}

// RMC Parsing Function
function RMC(sentence) {
    var temp = sentence.split(","); // split by commas
    const outObject = {UTC:"", RxWarn:"", Latitude:"", Longitude:"", GroundSpeedKts:"", GroundTrackTrue:"", Day:"", Month:"", Year:"", MagneticVariation:"", GeoidHeight:""}; // declare empty object

    // Write data from sentence to object
    outObject.UTC = temp[1].substring(0,2).concat(":",temp[1].substring(2,4),":",temp[1].substring(4,100)); // write time in 'hh:mm:ss.ss' format
    outObject.RxWarn = temp[2]; // write receiver warning
    // Lat & Lon Logic:
    if (temp[3] == "N") { // North latitude
        outObject.Latitude = parseFloat(temp[2].substring(0,2)) + parseFloat(temp[2].substring(2,100))/60; // write Latitude (fixed to actual #)
    } else { // South latitude
        outObject.Latitude = -1*parseFloat(temp[2].substring(0,2)) + parseFloat(temp[2].substring(2,100))/60; // write Latitude (fixed to actual #)
    }
    if (temp[5] == "E") { // East longtitude
        outObject.Longitude = parseFloat(temp[4].substring(0,3)) + parseFloat(temp[4].substring(3,100))/60; // write Longitude (fixed to actual #)
    } else { // West longitude
        outObject.Longitude = -1*(parseFloat(temp[4].substring(0,3)) + parseFloat(temp[4].substring(3,100))/60); // write Longitude (fixed to actual #)
    }
    outObject.GroundSpeedKts = temp[7]; // write ground speed in knots
    outObject.GroundTrackTrue = temp[8]; // write ground track (true)
    outObject.Day = temp[9].substring(0,2); // write day of month (#)
    outObject.Month = temp[9].substring(2,4); // write month of year (#)
    outObject.Year = temp[9].substring(4,6); // write year (last 2 digits)
    if (temp[11] == "E") { // East variation
        outObject.MagneticVariation = temp[10]; // write magnetic variation
    } else { // West variation
        outObject.MagneticVariation = -1*parseFloat(temp[10]); // write magnetic variation
    }

    return outObject; // return output
}