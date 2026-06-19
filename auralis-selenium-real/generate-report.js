const XLSX = require("xlsx");

const testResults = [
    ["Test ID","Test Name","Expected Result","Actual Result","Status"],

    ["TC001","Smoke Test",
     "Application should open",
     "Application opened successfully",
     "PASS"],

    ["TC002","Login Test",
     "User should login successfully",
     "Login successful",
     "PASS"],

    ["TC003","Dashboard Test",
     "Dashboard should load",
     "Dashboard loaded successfully",
     "PASS"],

    ["TC004","Navigation Test",
     "Navigation routes should work",
     "Map, Chat, Notifications, Profile accessible",
     "PASS"],

    ["TC005","Notifications Test",
     "Notifications page should display alerts",
     "Safety Alert, AI Safety Tip, Check-in Reminder displayed",
     "PASS"],

    ["TC006","Profile Test",
     "Profile page should load",
     "Profile details and emergency contacts displayed",
     "PASS"],

    ["TC007","Emergency Services Test",
     "Emergency numbers should be visible",
     "100, 108, 101, 1091 verified",
     "PASS"],

    ["TC008","SOS Feature Test",
     "SOS button should be present",
     "SOS Hold-to-Activate button found",
     "PASS"],

    ["TC009","Route Discovery Test",
     "Application routes should be identified",
     "Home, Map, Chat, Alerts, Profile discovered",
     "PASS"],

    ["TC010","Module Discovery Test",
     "Dashboard modules should exist",
     "Journey, Guardian, Analytics, Incidents, Modes, Community, Report found",
     "PASS"],

    ["TC011","Dashboard Modules Validation",
     "All dashboard modules should be available",
     "All modules verified successfully",
     "PASS"],

    ["TC012","Settings Validation",
     "Settings page should exist",
     "No separate settings page; integrated into Profile",
     "INFO"]
];

const wb = XLSX.utils.book_new();

const ws = XLSX.utils.aoa_to_sheet(testResults);

XLSX.utils.book_append_sheet(
    wb,
    ws,
    "Test Results"
);

XLSX.writeFile(
    wb,
    "Auralis_Test_Report.xlsx"
);

console.log(
    "Auralis_Test_Report.xlsx generated successfully"
);