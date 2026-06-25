CATCHMASTER
FISH CATCH MONITORING SYSTEM




USER MANUAL
 
Table of Contents
Overview	4
CatchMaster	4
Core Features	4
Modules and Functions	5
System Benefits	5
Technical Features	5
System Usage Overview	5
Getting Started	6
Main Page Overview	6
Authentication	8
Logging In	8
Register a New Account	9
Logging Out	10
Dashboard	12
Dashboard Overview	12
Statistic Cards	12
Weekly Catch Trends	13
Species Distribution	14
Fishermen Management	15
Fishermen Directory Overview	15
Adding a Fisherman	15
Viewing/Editing a Fisherman	17
Deleting a Fisherman	18
Filtering Fishermen by Barangay	19
Fisherman Detail Page and Catch History	20
Fish Species Directory	21
Directory Overview	21
Adding a Fish Species	21
Viewing/Editing Fish Species	23
Deleting a Fish Species	24
Filtering by Family, Habitat, and Status	24
AI-Powered Species Import	25


Fish Catch Records	28
    Fish Catch Records Overview	28
Adding a Fish Catch Record	28
Viewing/Editing a Fish Catch Record	30
Deleting a Fish Catch Record	31
Batch Delete	31
Reports and Analytics	33
Report Page Overview	33
One-Click Reports	33
Quick Analytics	34
Advanced Analytics-Monthly Trends	34
Batch Data Import	35
Import Page Overview	35
Uploading and Previewing Data	36
Catch Forecasting	37
Forecast Overview	37
Summary Cards	37
Forecast Chart	38
Species-Level Forecast	39
Public Dashboard	40
Public Dashboard Overview	40
Sharing Read-Only Data	40
Admin Profile	41
Profile Overview	41
 
OVERVIEW

CatchMaster 

CatchMaster is a web-based Fish Catch Management System designed for local government fisheries offices. It helps track, manage, and analyze fish catch data from registered fisherfolk across multiple barangays. The system provides data-driven insights through dashboard analytics, one-click report generation, and batch import capabilities to support sustainable fishing practices and informed decision-making.

Core Features

	Secure authentication: Secures the system with email and password login. Single-administrator setup for municipal use.
	Dashboard with real-time statistics: Displays key metrics — total catch weight, active fishermen count, top catch species, and system users — with interactive charts for weekly trends and species distribution.
	Fish species directory:  Manages a catalog of fish species with scientific names, local names, family, habitat classification, conservation status, and images. Supports AI-powered import from PDF and text data.
	Fishermen management:  Maintains a registry of fisherfolk with contact details, barangay assignment, profile photo, and total catch tracking. Supports both grid and table views with search and filter capabilities.
	Fish catch recording: Logs daily catch entries with multiple species per trip. Each entry links to a fisherman, fish species, quantity, weight, and landing location.
	One-click report generation: Generates official reports including BFAR Monthly Report, Municipal Council Summary, Species Analytics, Fisherman Performance, and Weather-Catch Correlation with PDF and CSV formats.
	Catch forecasting: Predicts future catch volumes using statistical models, providing 6-month projections with confidence intervals and species-level trend analysis.
	Batch data import: Upload CSV or JSON files to quickly import historical catch records with preview, validation, and bulk insert capabilities.
	Public dashboard: Provides a shareable read-only link for the Mayor's office and other departments with catch summaries and species rankings.
	AI-powered species import: Paste fish species data from PDFs, tables, or unstructured text; AI automatically extracts and structures all species information.

Modules and Functions

	Authentication Module - Login page, registration with invite code, and logout. Session-based access control with NextAuth.
	Dashboard Module - Statistics cards, weekly catch trends bar chart, species distribution chart, recent catches list, and quick navigation to catch logging.
	Fish Species Directory Module - Add, view, edit, and delete fish species. Search, filter by family/habitat/status. Grid and table view modes. AI-powered import from text/PDF data.
	Fishermen Management Module - Add, view, edit, and delete fisherman records. Search by name or barangay. Filter by barangay. Grid and table view modes. Individual detail page with full catch history.
	Fish Catch Records Module - Add, view, edit, and delete catch entries. Multiple species per trip. Search by fisherman name or location. Batch delete with multi-select.
	Reports Module - One-click report generation with pre-configured templates (BFAR Monthly, Municipal Council Summary, Species Analytics, Fisherman Performance, Weather-Catch Correlation). Report period selection by month/year.
	Analytics Module - Monthly catch trends with year selector. Weekly catch trends on dashboard. Species distribution tracking.
	Forecasting Module - Statistical catch volume predictions using moving averages, linear regression, and seasonal adjustment. 6-month projections with confidence intervals and species-level forecasts.
	Batch Import Module - CSV and JSON file upload. Column mapping and preview. Fisherman and species validation before import.
	Public View Module - Read-only dashboard with shareable link. Total catch, active fishermen, total users, and top 5 species.

System Benefits

	Centralized data management - Keeps fish species, fisherfolk, catch records, and reports in one organized database.
	Data-driven decision making - Dashboard analytics and reports help identify trends and plan resources accordingly.
	Reduced paperwork - Digital recording and bulk CSV imports replace manual logbooks and paper forms.
	Improved traceability - Every catch record is linked to a specific fisherfolk, species, location, and date.
	Easy reporting - Generate official BFAR and municipal reports in one click with PDF and CSV output.
	Predictive insights - Catch forecasting helps anticipate future catch volumes for resource planning and food security monitoring.
	Public transparency - Shareable public dashboard provides read-only access for stakeholders.

Technical Features

	Secure access control - Single-administrator setup with session-protected routes.
	Database-backed storage - All records stored securely in PostgreSQL with Prisma ORM.
	Modern frontend framework - Built with Next.js 16, React 19, and Tailwind CSS 4 for responsive, fast performance.
	CSV/JSON import - Bulk upload catch records with preview and validation.
	AI-powered data extraction - Parse fish species data from unstructured text using AI/LLM integration.
	One-click report generation - Pre-configured report templates for BFAR, municipal, species analytics, and more.
	Statistical forecasting - Predictive analytics using moving averages, linear regression, and seasonal decomposition.
	Public dashboard sharing - Read-only shareable link for stakeholders.

System Usage Overview

1.	Admin logs in to access the dashboard with system-wide statistics and charts.
2.	Admin manages the fish species directory with scientific names, images, and habitat data.
3.	Admin registers fisherfolk with barangay assignments and contact details.
4.	Admin records daily fish catches, linking each entry to a species and fisherfolk.
5.	Admin generates one-click reports for BFAR, municipal council, and other stakeholders.
6.	Admin imports historical catch data in bulk via CSV or JSON.
7.	Admin views catch forecasts to predict future catch volumes and plan accordingly.
8.	Admin shares the public dashboard link with the Mayor's office and planning department.
 
GETTING STARTED

System Requirements

Hardware:
Any device with internet access (computer, tablet, or smartphone)

Software:
A modern web browser: Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari

Prerequisites:
	A valid email address
	Administrative invite code for registration
	Stable internet connection
	Prepared information for data entry (fish species, fisherfolk details, catch records)

Accessing the Platform

To access CatchMaster, open a web browser and navigate to the system URL:
https://catchmaster.netlify.app

 
Figure 1: Entering the system URL in a web browser

Main Page Overview

Upon reaching the platform, you will see the CatchMaster landing page. This page serves as the entry point to the system.
 
Figure 2: CatchMaster landing page


The landing page features:
	The CatchMaster branding with anchor logo
	"Sign In" button for existing users
	"Get Started" button for new user registration
	Hero section describing the system for Agdangan, Quezon
	Features grid showing Catch Logging, Fishermen Registry, Analytics & Reports, Data Insights, Secure & Role-Based, and Local Focus
	Statistics banner (500+ Registered Fishermen, 50k+ Kg Tracked Monthly, etc.)
	"How It Works" section
	Call-to-action section for requesting admin access

 
Figure 3: Click "Sign In" to log in or "Get Started" to register

AUTHENTICATION

Logging In
1.	On the landing page, click "Sign In". You will be directed to the CatchMaster Login page.

 
Figure 4: CatchMaster Login page

2.	Enter your registered email address in the email field.
3.	Enter your password in the password field
4.	Click the "Sign In" button.

  
   Figure 5: Filled login form

5.	If the credentials are correct, you will be redirected to the Dashboard. If the credentials are incorrect, an error message will appear.

 
 
   Figure 6: Dashboard after successful login

> Note: If you see a green success banner saying "Registration successful! Please sign in.", this means you have just completed registration and are logging in for the first time.

Registering a New Account
1. On the landing page, click "Get Started" or "Request Admin Access".

 
Figure 7: Admin Registration page


2. Fill in the following fields:
Field	Description	Required
First Name	Your first name	Yes
Last Name	Your last name	Yes
Email Address	A valid email address	Yes
Password	Minimum 8 characters	Yes
Administrative Invite Code	Contact super administrator to obtain this code	Yes

 
   Figure 8: Registration form with invite code field

3. Click "Complete Registration" 
4. If successful, you will be redirected to the login page with a green success banner.

> Note: Registration is invite-only. You must obtain an administrative invite code from the system super administrator.


Logging Out 
1. In the sidebar navigation, scroll to the bottom.

 
Figure 9: Sidebar Logout button

2. Click the "Logout" button.

 
Figure 10: Clicking Logout

3. You will be logged out and redirected to the login page. Your session will be terminated.

 
DASHBOARD

Dashboard Overview

After logging in, you will land on the **Dashboard** page. The Dashboard provides a high-level view of the fisheries data through statistics cards and interactive charts.

 
Figure 11: CatchMaster Dashboard

The Dashboard includes the following sections:
	Welcome Section - Greeting message with "Record New Catch" button
	Statistics Cards - Four key metric cards
	Weekly Catch Trends - Bar chart for the last 7 days
	Top Species Distribution - Species ranking with bars
	Recent Catches - Latest catch records with details

Statistics Cards

The top of the Dashboard displays four statistics cards that summarize key data:

Card	Description
Total Catch (kg)	Aggregate weight of all recorded catches
Active Fishermen	Total number of fishermen registered in the system
Top Catch Species	Top 3 fish species by total catch weight
System Users	Total number of registered system users

 
Figure 12: Dashboard statistics cards

 
Weekly Catch Trends
The Weekly Catch Trends section displays a bar chart showing catch data for the last 7 days.
 
Figure 13: Weekly Catch Trends chart

	Horizontal Bars - Each bar represents a day of the week
	Bar width - Proportional to the catch weight for that day
	Labels - Day name, weight in kilograms, and number of catches

This chart gives a quick visual comparison of catch activity across the current week.

Species Distribution
The Top Species Distribution section shows the top fish species ranked by total catch weight.
 
Figure 14: Species distribution chart
	Horizontal Bars - Each bar represents a fish species
	Bar width - Proportional to the species' total catch weight
	Labels - Species name and total weight in kilograms

Recent Catches

Below the charts, the Recent Catches section lists the 5 most recent catch records.
 
Figure 15: Recent Catches list

Each record displays:
	Fisherman's full name
	Catch date
	Landing location
	Total weight in kilograms
	Fish species caught

Click "View All" to navigate to the full catches management page.

 
FISHERMEN MANAGEMENT

Fishermen Directory Overview

The Fishermen Management page maintains a registry of all fisherfolk registered in the system. Each record includes personal details, contact information, barangay assignment, and a profile photo.

 
Figure 16: Fishermen Management page

Breadcrumb navigation: Sidebar > Fishermen

Page elements:
	Page title: "Fishermen Management
	"Add Fisherman" button - Opens the add modal
	Search bar - Search by name or barangay
	Barangay filter dropdown - Filter by barangay
	View Toggle - Switch between Grid view and Table view
	Fishermen cards/table - Displays all fisherfolk records
	Batch selection - Checkboxes for bulk operations

Adding a Fisherman
1. On the Fishermen Management page, click the "Add Fisherman" button.

 
Figure 17: Click "Add Fisherman"

 
2. The Add New Fisherman modalform will appear.
 
Figure 18: Add Fisherman modal form

3. Fill in the following fields:
Field	Description	Required
First Name	Fisherman's first name	Yes
Last Name	Fisherman's last name	Yes
Email Address	Email address (optional) 	No
Barangay	Select from: Poblacion, Ilayang Polo, Kanlurang Calutan, Silangang Calutan 	Yes
Contact Number	Phone number	Yes
Profile Picture	Upload a photo	No

4. Click "Save Fisherman" to register the fisherman.
 
Figure 19: Completed form with Save button

5. A success notification will appear, and the new fisherman will appear in the list.

Viewing / Editing a Fisherman
1. In the fishermen list, locate the fisherman you want to edit.
2. In Grid view: Hover over the card and click the pencil icon that appears in the top-right corner.

 
Figure 20: Edit button on fisherman card

In Table view: Click the pen/pencil icon in the Actions column.

3. The Edit Fisherman modal will appear with the current data pre-filled.

 
Figure 21: Edit Fisherman modal
 
4. Update any fields as needed. The profile picture can be changed by clicking the image upload area.
5. Click "Save Fisherman" to save your changes.
6. A success notification will confirm the update.

Deleting a Fisherman
1. In the fishermen list, locate the fisherman you want to delete.
2. In Grid view: Hover over the card and click the trash icon that appears in the top-right corner.

 
   Figure 22: Delete button on fisherman card

In table view: Click the trash icon in the Actions column.

3. A confirmation dialog will appear asking you to confirm the deletion.

 
   
Figure 23: Delete confirmation prompt

4. Click "Confirm" to proceed with deletion.
5. The fisherman record will be permanently removed from the directory.

> Warning: Deleting a fisherman may affect associated catch records.
Filtering Fishermen by Barangay

The Fishermen Management page provides filter options to narrow down the list.

 
Figure 24: Search and filter controls

Search by name or barangay:
1. Type a keyword in the search bar.
2. The list will filter in real-time as you type.

Filter by Barangay: 
1. Select a barangay from the dropdown:
	All barangays (deafult)
	Poblacion
	Ilayang Polo
	Kanlurang Calutan
	Silangang Calutan
	Etc.

2. The list will update to show only fisherfolk from the selected barangay.
View Toggle: 
	Click the Grid icon for card view
	Click the Table icon for table view

 
Figure 25: Grid and Table view toggles

Batch Operations: 
	Select multiple fishermen using checkboxes
	Click "Deleted Selected" to remove all selected records at once
 
Figure 26: Batch delete for selected fishermen
 
Fisherman Detail Page and Catch History

1. Click "View Profile" on any fisherman card to open the detailed view.
 

Figure 27: Fisherman Detail page

2. The detail page displays:
	Profile photo or initials
	Full name
	Barangay assignment
	Contact number
	Number of fishing trips
	Total catch weight(kg)

3. Below the profile header, the Catch History section shows all catch records for this fisherman.
    
Figure 28: Catch History for a fisherman

	Search - Filter by species, date, or location
	Trip count - Shows number of trips and total weight
	Trip cards - Each shows date, location, weather, weight, and fish species breakdown with quantities

FISH SPECIES DIRECTORY

Directory Overview 
The Fish Species Directory maintains a catalog of all fish species tracked in the system. Each entry includes scientific information, habitat classification, conservation status, and an optional image.
 
Figure 29: Fish Species Directory page

Breadcrumb navigation: Sidebar > Fish Directory

Page Elements: 
	Page title: "Fish Directory"
	"Add Fish Species" button - Opens the add modal
	"Import with AI" button - AI-powered import from text
	Search bar - Search by name, local name, or scientific name
	Filter dropdowns - Filter by family, habitat, and status
	View toggle - Switch between Grid view and Table view
	Species cards/table - Lists all species with details
	Batch selection - Checkboxes for bulk operations

Adding a Fish Species
1. On the Fish Species Directory page, click the "Add Fish Species" button.
 
Figure 30: Click "Add Fish Species"

 
2. The Add New Fish Species modal form will appear.


    
Figure 31: Add Fish Species modal form

3. Fill in the following fields:
Field	Description	Required
Species Name	Common English name of the fish	Yes
Local Name	Local name used in the area	Yes
Scientific Name	Scientific/Latin name 	No
Family	Fish family classification (e.g., Acanthuridae)	No
Habitat	 e.g., reef-associated 	No
Length(cm)	 Average length of the species	No
Trophic Level	Position in the food chain 	No
Status	Conservation status: Native, Endangered, Threatened, Introduced	No
Fish Image	Upload an image of the fish	No

4. Click "Save Fish Species" to add the species.

 
Figure 32: Completed form and Save button
5. A success notification will appear, and the new species will be added to the directory.

Viewing / Editing a Fish Species
1. In the species list, locate the fish species you want to edit.
2. In Grid view: Hover over the card and click the pencil icon in the top-right corner.

  
   Figure 33: Edit button on species card

In Table view: Click the pen icon in the Actions column.

3. The Edit Fish Species modal will appear with the current data pre-filled.

    

Figure 34: Edit Fish Species modal
4. Update any fields as needed.
5. Click "Save Fish Species" to save your changes.
6. A success notification will confirm the update.


Deleting a Fish Species
1. In the species list, locate the fish species you want to delete.
2. In Grid view: Hover over the card and click the trash icon in the top-right corner.

 
Figure 35: Delete button on species card

In Table view: Click the trash icon in the Actions column.

3. A confirmation dialog will appear.

 
Figure 36: Delete confirmation prompt

4. Click "Confirm" to proceed.
5. The species will be permanently removed from the directory.

> Warning: Deleting a fish species may affect associated catch records.

Filtering by Family, Habitat, and Status
The Fish Species Directory provides three filter options to narrow down the list.

 
Figure 37: Search and filter controls for fish species
Search:
- Type in the search bar to filter by name, local name, or scientific name in real-time.

Filter by Family:
- Select a family from the dropdown (e.g., Acanthuridae)
- "All Families" shows all species

Filter by Habitat:
- Select a habitat from the dropdown (e.g., reef-associated)
- "All Habitats" shows all species

Filter by Status:
- Select a conservation status: Native, Endangered, Threatened, Introduced
- "All Status" shows all species

View Toggle:
- Click Grid icon for card view with family, habitat, length, trophic level, and status
- Click Table icon for table view with all columns

 
Figure 38: Grid view (left) and Table view (right)

Batch Operations:
- Select multiple species using checkboxes
- Click "Delete Selected" to remove all selected records at once

AI-Powered Species Import

The Import with AI feature allows you to add multiple fish species at once by pasting data from PDFs, tables, or any text format.

1. Click the "Import with AI" button (blue, with sparkle icon).

 
Figure 39: Import with AI button

2. The Import Fish Species with AI modal will open.

 
Figure 40: AI-powered import modal

3. In the text area, paste your fish species data. The system accepts:
   - Tables with columns (Species Name, Family, Habitat, Length, etc.)
   - CSV-formatted data
   - Raw text from PDF documents
   - Any structured or semi-structured format

4. As you type, the AI will automatically analyze and extract the data.

    
Figure 41: AI processing data


5. A preview will appear showing the number of fish species found and a list of parsed entries.

    
Figure 42: Preview of parsed fish species

6. Click "Import N Species" to add all parsed species to the directory.
7. The page will refresh, and the new species will appear in the directory.

> Tip: You can import data from any source — PDF tables, spreadsheets, or plain text. The AI will figure out the structure automatically.

 
FISH CATCH RECORDS

Fish Catch Records Overview
The Fish Catch Records page (Catch Logging) is where you log and manage all fish catch entries. Each record can include multiple fish species per fishing trip.
 
Figure 43: Catches Management page
Breadcrumb navigation: Sidebar > Catch Logging

Page elements:
	Page title: "Catches Management"
	Catch Logging Form — Add new catch records with fisherman selection and fish entries
	Recent Catches section — Below the form, lists all recorded catches
	Search bar — Search by fisherman name or location
	Edit/Delete buttons — For each catch record
	Batch selection — Checkboxes for bulk delete

Adding a Fish Catch Record
1. On the Catches Management page, locate the Catch Logging Form at the top.

  
   Figure 44: Catch Logging form
2. Step 1: Select Fisherman
  - Choose a fisherman from the dropdown list
   - Optionally enter the Landing Location (e.g., "Brgy. Poblacion Pier")
 
Figure 45: Fisherman selection and location


3. Step 2: Add Fish Entries
   - Select a Fish Species from the dropdown
   - Enter Quantity (number of fish)
   - Enter Weight in kilograms
   - Click "Add Row" to add more species (supports multiple species per trip)
   - Click the trash icon on a row to remove it
 
Figure 46: Fish entries with multiple species

4. The Total Weight is calculated automatically at the bottom.
5. Click "Save Catch Record" to record the entry.

    
Figure 47: Save Catch Record button

6. A success confirmation screen will appear.

    
Figure 48: Catch recorded successfully

7. Click "Log Another Catch" to record another entry.

Viewing / Editing a Fish Catch Record
1. In the Recent Catches section below the form, locate the catch record you want to edit.
2. Hover over the catch card and click the pencil icon that appears in the top-right corner.
    
Figure 49: Edit button on catch card

3. The Edit Catch Record modal will appear with the current data pre-filled.

    
Figure 50: Edit Catch Record modal
4. Update the following fields as needed:
Field	Description
Fisherman	Select a different fisherman
Location	Landing location
Weather Condition	e.g., Sunny, Rainy, Cloudy
Temperature (℃)	Water/air temperature
Wind Speed (km/h)	Wind speed during catch
Tide Level	High, Medium, or Low
Fish Entries	Add, remove, or modify species/quantity/weight

5. Click "Save Changes" to update the record.

Deleting a Fish Catch Record
1. In the Recent Catches section, locate the catch record you want to delete.
2. Hover over the catch card and click the trash icon in the top-right corner.

 
Figure 51: Delete button on catch card

3. A confirmation dialog will appear.

 
Figure 52: Delete confirmation

4. Click "Confirm" to proceed.
5. The record will be permanently removed.


Batch Delete

1. Select multiple catch records using the checkboxes on the left side of each card.

    
   Figure 53: Batch selection of catch records

2. A red banner will appear at the top showing the number of selected records.
3. Click "Delete Selected" to remove all selected records at once.

 
Figure 54: Batch delete banner

4. Confirm the deletion in the dialog.

> Warning: Batch deletion is permanent and cannot be undone.

Filtering Catches by Fisherman and Location

The Recent Catches section includes a search bar to filter records.

 Figure 55: Search bar for catches

Search by fisherman or location:
1. Type a keyword in the search bar.
2. The list will filter in real-time as you type, matching against:
   - Fisherman's full name
   - Landing location

 
REPORTS AND ANALYTICS

Reports Page Overview

The Reports & Analytics page provides one-click report generation and quick analytics for data analysis.

**IMAGE PLACEHOLDER: Full screenshot of the Reports page**
*Figure 56: Reports & Analytics page*

Breadcrumb navigation: Sidebar > Reports

Page elements:
	Two tabs: "One-Click Reports" and "Quick Analytics"
	Report period selector — Month and year picker
	Report template cards — Pre-configured report types
	Analytics cards — Quick statistics view

One-Click Report Templates

The One-Click Reports tab displays five report template cards.

 
Figure 57: One-Click Reports with month selector

1. Select the Report Period by choosing a month and year using the calendar picker.
2. Choose a report template:
Template	Description	Format
BFAR Monthly Report	Official BFAR format for monthly catch reporting to Provincial Government	PDF
Municipal Council Summary	Executive summary for Mayor and Council presentations	PDF
Species Analytics Report	Detailed breakdown by species with trends and charts	CSV
Fisherman Performance	Individual and group performance metrics	CSV
Weather-Catch Correlation	Analysis of weather patterns vs catch volume	PDF

3. Click "Generate Report" on the desired template.
  
Figure 58: Generate Report button

4. The report will be generated and downloaded automatically.

Quick Analytics
Switch to Quick Analytics tab for a summary view.

 
Figure 59: Quick Analytics view

The Quick Analytics tab shows:
	Total Catch — Aggregate weight in kilograms
	Active Fishermen — Total registered fisherfolk
	Registered Users — Total system users

If no data is available, a prompt will guide you to the Catch Logging or Import Data pages.

Advanced Analytics - Monthly Trends
Navigate to Analytics in the sidebar for advanced monthly trend analysis.

 
Figure 60: Advanced Analytics page
1. Select a year from the dropdown (2024, 2025, or 2026).

 
Figure 61: Year selector

2. The Monthly Trends chart displays horizontal bars for each month.
3. Each bar's width is proportional to the catch weight, with the exact value displayed.

BATCH DATA IMPORT

Import Page Overview

The Batch Data Import page allows you to upload historical catch records in bulk using CSV or JSON files.

 

Figure 63: Batch Data Import page

Breadcrumb navigation: Sidebar > Import Data

Page elements:
	Upload area — Drag-and-drop or click to select file
	Expected columns guide — Shows required column names
	Preview step — Shows first 10 records before import
	Import confirmation — Success message with record count



Uploading and Previewing Data
1. On the Import Data page, click the upload area or drag and drop a file.    
2.  Figure 64: File upload area

3. Supported file formats:
   - CSV (.csv)
   - JSON (.json)

4. Expected columns in your file:
Column	Description	Example
Fisherman	Fisherman's full name	Juan Dela Cruz
Date	Catch date	2026-01-15
Location	Landing site	Agdangan
Species	Fish species name	Tuna
Quantity	Number of fish	10
Weight	Weight in kilograms	45.5
Weather	Weather condition	Sunny

5. Once the file is loaded, a Preview will show the first 10 records.
6. Review the data for accuracy.

CATCH FORECASTING

Forecast Overview

The Catch Forecasting page provides predictive analytics for future catch volumes using statistical models. The system analyzes historical catch data to generate forecasts for the next 6 months.

Breadcrumb navigation: Sidebar > Forecast

**IMAGE PLACEHOLDER: Catch Forecasting page**
*Figure 65: Catch Forecasting page overview*

The Forecasting page includes the following sections:
	Summary Cards — Four key prediction metrics
	Historical & Forecast Trend Chart — Combined line chart of actual and projected catch
	Species-Level Forecast — Table of predicted catch by species
	Methodology Note — Explanation of how forecasts are calculated

Requirements:
- A minimum of 3 months of catch data is required to generate a forecast.
- Forecast accuracy improves with more historical data (12+ months for high confidence).

Summary Cards

The top of the Forecasting page displays four summary cards:

Card	Description
Next Month	Predicted total catch weight for the upcoming month
Next Quarter	Predicted total catch weight for the next 3 months combined
Confidence	Forecast confidence level (Low, Medium, or High)
Overall Trend	Direction of the predicted trend (Increasing, Decreasing, or Stable)

Each card includes:
- The predicted value with trend indicator (up/down/stable arrow)
- Percentage change compared to recent average
- Confidence level explanation (e.g., "Based on 12+ months of data")

**IMAGE PLACEHOLDER: Summary cards on the forecast page**
*Figure 66: Forecast summary cards*

Forecast Chart

The Historical & Forecast Trend Chart visualizes catch data over time.

**IMAGE PLACEHOLDER: Forecast line chart**
*Figure 67: Historical & Forecast trend chart*

Chart elements:
	Solid line — Actual historical catch data (last 12 months)
	Dashed line — Predicted future catch (next 6 months)
	Shaded area — Confidence interval (forecast uncertainty range)
	X-axis — Time (months)
	Y-axis — Catch weight (kg)

The confidence interval widens for longer projections, reflecting increased uncertainty for predictions further into the future.

Species-Level Forecast

Below the chart, the Species-Level Forecast table shows predicted trends for individual fish species.

**IMAGE PLACEHOLDER: Species forecast table**
*Figure 68: Species-Level Forecast table*

Table columns:
Column	Description
Species	Name and local name of the fish species
Current Avg (kg/mo)	Average monthly catch weight over the past 12 months
Predicted Next (kg)	Predicted catch weight for the next month
Trend	Predicted direction: Up, Down, or Stable

Species are ranked by predicted catch volume, helping identify which species are expected to increase or decline.

Methodology

The forecast is generated using a blended statistical approach:

1. Moving Averages — 3-month and 6-month rolling averages smooth out short-term fluctuations
2. Linear Regression — A trend line is calculated from all historical data points
3. Seasonal Adjustment — Monthly patterns are identified by comparing each month against the annual average
4. Weighted Blend — The final prediction combines regression (40%) and smoothed averages (60%), multiplied by the seasonal factor

Formula:
```
Forecast = (Regression × 0.4 + Smoothed Average × 0.6) × Seasonal Factor
```

> Note: This is a statistical estimate and should be used alongside local knowledge and expert judgment for decision-making.

PUBLIC DASHBOARD

Public Dashboard Overview
The Public Dashboard Overview page provides a shareable read-only view of catch summaries for stakeholders.

 
Figure 69: Public Dashboard page

Breadcrumb navigation: Sidebar > Public Dashboard
Page elements:
	Shareable link section — Copyable URL for sharing
	Stat cards — Total Catch, Active Fishermen, Top Species, Monthly Growth
	Top 5 Species table — Read-only ranking

Sharing Read-Only Data
1. On the Public Dashboard page, locate the Shareable Link section.
 
Figure 70: Shareable link with copy button

2. Click "Copy" to copy the public URL to your clipboard.
3. Share the link with the Mayor's office, Planning Department, or other stakeholders.
4. The public view displays:
    

Figure 71: Public View page

  Total Catch — Aggregate weight in kilograms
  Active Fishermen — Total registered fisherfolk
  Total Users — System users count
  Top 5 Species — Ranked list with catch weights

> Note: The public dashboard is read-only and does not require authentication to view.
ADMIN PROFILE

Profile Overview

Your profile information is displayed in the top-right header of the dashboard.

 
Figure 72: Header bar with user profile

The header displays:
User name — Your full name
Role — Your role (Admin)
User icon — Profile avatar placeholder

The sidebar footer contains the Logout button to end your session.

Help and Settings

For assistance with CatchMaster:

	System Administrator - Contact your system administrator for account issues, password resets, and user management.
	Documentation - Refer to this user manual for step-by-step instructions on all system features.
	Feedback - Report issues or suggest improvements to the development team.


End of User Manual

CatchMaster v2.0.0 - Fish Catch Management System
Municipality of Agdangan, Province of Quezon
