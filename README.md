# Bouchard Production Application 
Bouchard Production - C#

# Installation Guide

## Introduction

## Installation Process

## Application Installation

## Running the Application

## Web View API
```cs
////////////////////////////////////////////////////////////////////////
/// <summary>
/// Print ZPL data format to the zebra printer.
/// Deprecated. Use printJSONArray(string jsonArray, int copies, bool reprint)
/// </summary>
/// <param name="jsonArray">Array of ZPL data to be printed</param>
/// <param name="copies">Total copies per ZPL data</param>
void printJSONArray(string jsonArray, int copies)

////////////////////////////////////////////////////////////////////////
/// <summary>
/// Print Base64 data format to the hp printer.
/// Deprecated. Use standardPrintJSONArray(string jsonArray, int copies, bool reprint)
/// </summary>
/// <param name="jsonArray">Array of Base64 data to be printed</param>
/// <param name="copies">Total copies per Base64 data</param>
void standardPrintJSONArray(string jsonArray, int copies)
        
////////////////////////////////////////////////////////////////////////
/// <summary>
/// Print ZPL data format to the zebra printer.
/// </summary>
/// <param name="jsonArray">Array of ZPL data to be printed</param>
/// <param name="copies">Total copies per ZPL data</param>
/// <param name="reprint">ZPL data is to be reprinted </param>
void printJSONArray(string jsonArray, int copies, bool reprint)

////////////////////////////////////////////////////////////////////////
/// <summary>
/// Print Base64 data format to the hp printer.
/// </summary>
/// <param name="jsonArray">Array of Base64 data to be printed</param>
/// <param name="copies">Total copies per Base64 data</param>
/// <param name="reprint">Base64 data is to be reprinted </param>
void standardPrintJSONArray(string jsonArray, int copies, bool reprint)

////////////////////////////////////////////////////////////////////////
/// <summary>
/// Print Base64 data format to the hp printer.
/// </summary>
/// <param name="jsonArray">Array of Base64 data to be printed</param>
/// <param name="copies">Total copies per Base64 data</param>
/// <param name="reprint">Base64 data is to be reprinted </param>
void printPallet(string jsonArray, int copies, bool reprint)

////////////////////////////////////////////////////////////////////////
/// <summary>
/// Get the scale data being read from the weighing scale.
/// </summary>
string getScaleWeight()
   
////////////////////////////////////////////////////////////////////////
/// <summary>
/// Get the selected device MAC address.
/// </summary>
string getMACAddress()
        
////////////////////////////////////////////////////////////////////////
/// <summary>
/// Get the elapsed time between each data from the weighing scale.
/// </summary>
long getScaleMillisTimeout()
        
////////////////////////////////////////////////////////////////////////
/// </summary>
/// Show popup message to the application.
/// </summary>
void alert(string message)
       
////////////////////////////////////////////////////////////////////////
/// <summary>
/// Get the station name of the device location.
/// </summary>
string getStationName()
```
**_Usage: Windows.<api_name>_**

## Limitation
	- Only USB-SERIAL CH340 cable is fully supported.

## Revision History

	v1.3.5.0 ( 01/17/2018 )
			- Added fix for serial port issues when application is minimized or device is
			put to sleep.
			- Added fix for serial monitor icon to be red by default when no message from
			the serial monitor is received.
			
	v1.3.4.0 ( 01/16/2018)
			- Application name changed from "Bouchard Chocolatier" to "Halloren Production"
			- Visual assets changed to accent the new application name (splash screen, logo)
			- UI Command bar buttons bolded for easier access.			

	v1.3.3.0 ( 01/15/2018 )
			- UI Launch buttons enlarged for easier access.
			- Page backgrounds reverted to white to support older windows os versions.
			- Added fix for parser null errors when data from api is incomplete.
	v1.3.0.0 ( 01/13/2018 )
			- Significant change on the user interface, especially on the launching portion.
			- Launching flow now changed from (weighing scale -> barcode printer -> workstation) 
			to (workstation & workorder -> barcode printer -> weighing scale -> summary)
			- User can now choose a workstation followed by the work orders of the selected
			station. Information about the selected station and order will be displayed once
			chosen. 
			- Setup for weighing scale and barcode printer follows the same flow (not a must)
			with changes on their presentation. Information about the barcode printer is shown 
			when a barcode printer is chosen.
			- A summary page is available for the user to review and change or resetup the previous
			stated information.
			- Added a progress ring together with text to signify what the application is doing
			behind the scenes. (to signify that the app is doing something and not crashing)
			- Added a wait screen for visual flavor while loading the necessary components.
			- The selected workstation has a bundled redirect url, which minimizes the interaction
			of the user with the settings. Once the launching flow is done and the user presses
			start, the application immediately presents the intended page for the work station.
			- This version will be released in two version v1.3.0.0_QA and v1.3.0.0_PROD.
			
			
	v1.2.0.0 ( 01/05/2018 )
			- User will no longer press buttons during weighing scale setup. Instructions are 
			provided on what to do incase setup fails e.g. "Please plug the weighing scale 
			USB cable". And everything is automatic after 
			  following instructions.
			- Setting up the weighing scale is no longer a must, a skip button is provided.
			- Setting up the barcode printer (zebra) is not mandatory, a skip button is provided.
			- The user will also be asked to choose a work station.
			- Setup buttons are hidden in the command bar so as to avoid tempting the user 
			to meddle with the settings.
			- Setup buttons include setup for weighing scale, barcode printer, and work station.			

	v1.0.0.0 ( 12/31/2017 )
			- Initial Release
			
			
# User Manual

https://github.com/hnapoles/bouchardproduction/blob/master/Halloren%20Production%20App%20Manual.pdf