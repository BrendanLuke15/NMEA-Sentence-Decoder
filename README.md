# NMEA-Sentence-Decoder
This project provides a tool to translate raw GNSS module outputs (NMEA-0183 Sentences) to CSV, GPX, or KML file formats.

## Current Status:
<ul>
  <li>Accepts .txt or raw text inputs (no input checks)</li>
  <li>CSV return (default):
    <ul>
      <li>Time & Date (yyyy-mm-ddThh:mm:ss.ssZ)</li>
      <li>Validity (GGA Fix Quality & RMC Receiver Warning)</li>
      <li>Position (Lat (geodetic), Long, Alt (ASL), Cartesian (ECEF), Geoid Separation)</li>
      <li>Dilution of Precision (PDOP, HDOP, VDOP)</li>
      <li>Ground Track (true & magnetic) & Speed (knots)</li>
    </ul>
  </li>
  <li>GPX return:
    <ul>
      <li>Time & Date (yyyy-mm-ddThh:mm:ss.ssZ)</li>
      <li>Position (Lat (geodetic), Long, Alt (ASL))</li>
    </ul>
  </li>
  <li>KML return:
    <ul>
      <li>3D Path</li>
      <li>Ground Path</li>
      <li>3D Path w/ extend to ground</li>
      <li>Track points (hidden by default)</li>
      <li>Track (gx namespace)</li>
    </ul>
  </li>
  <li>Stationary Mode:
    <ul>
      <li>Button :)</li>
    </ul>
  </li>
</ul>
