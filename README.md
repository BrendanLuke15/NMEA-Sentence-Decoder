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

## Future Work:
<ul>
  <li>UI:
    <ul>
      <li><i>work in progress</i></li>
    </ul>
  </li>
  <li>CSV:
    <ul>
      <li>Information about satellites</li>
      <li>Distance</li>
      <li>Elevation Gain/Loss</li>
    </ul>
  </li>
  <li>GPX:
    <ul>
      <li>Track, speed, distance</li>
    </ul>
  </li>
  <li>KML:
    <ul>
      <li>distance(?), time elapsed(?)</li>
      <li>Cameras & Animations</li>
      <li>Aviation Units (ft, kts)</li>
      <li>Customization (colours, thickness, etc)</li>
    </ul>
  </li>
  <li>Other features:
    <ul>
      <li>Stationary mode (drift and positional averaging)</li>
      <li>In browser data visualization</li>
    </ul>
  </li>
</ul>



