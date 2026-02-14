/**
 * THE DRIVE V3 - Google Apps Script Backend
 * Handles all CRUD operations and sheet initialization.
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const ROOT_FOLDER_ID = "1UmuyZ75MmDpKvuxNo-uiujFhp62XDLHT"; // Quality System |The drive2

/**
 * Handle GET requests
 */
function doGet(e) {
  const action = e.parameter.action;

  if (action === "getSystemData") {
    return ContentService.createTextOutput(
      JSON.stringify(getSystemData()),
    ).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "ping") {
    return ContentService.createTextOutput("pong").setMimeType(
      ContentService.MimeType.TEXT,
    );
  }

  return ContentService.createTextOutput("Invalid Action").setMimeType(
    ContentService.MimeType.TEXT,
  );
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || "save";
    const type = data.type;

    let result;

    // Custom Actions
    if (action === "updateTask" && type === "procedures") {
      result = updateProcedureTask(data);
    } else if (action === "markAsRead" && type === "notifications") {
      result = markNotificationAsRead(data.id);
    } else if (action === "delete") {
      result = deleteData(type, data.id);
    } else if (action === "update") {
      result = updateData(type, data.id, data);
    } else if (action === "save") {
      result = saveData(type, data);
    } else {
      result = { success: false, message: "Action not supported" };
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Core: Get all data for the system
 */
function getSystemData() {
  return {
    audit: getSheetData("Audit_Logs"),
    stock: getSheetData("Stock_Entries"),
    receiving: getSheetData("Receiving"),
    health: getSheetData("Health-Card"),
    temp: getSheetData("Temp_Logs"),
    equipment: getSheetData("Equipment"),
    checklists: getSheetData("Checklists"),
    complaints: getSheetData("Complaints"),
    calibration: getSheetData("Calibration"),
    pest: getSheetData("PestControl"),
    training: getSheetData("Training"),
    products: getSheetData("Products"),
    users: getSheetData("Users"),
    notifications: getSheetData("Notifications"),
    ops_stations: getSheetData("Ops_Stations"),
    procedures: getSheetData("Procedures"),
  };
}

/**
 * Helper to get data from a sheet as an array of objects
 */
function getSheetData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  const rows = values.slice(1);

  return rows.map((row) => {
    const obj = {};
    headers.forEach((header, i) => {
      let val = row[i];
      // Convert dates to ISO strings for JS
      if (val instanceof Date) {
        val = val.toISOString();
      }
      obj[header] = val;
    });
    return obj;
  });
}

/**
 * Save data to a sheet
 */
function saveData(type, data) {
  const sheetMap = {
    audit: "Audit_Logs",
    stock: "Stock_Entries",
    receiving: "Receiving",
    health: "Health-Card",
    temp: "Temp_Logs",
    equipment: "Equipment",
    checklist: "Checklists",
    complaints: "Complaints",
    calibration: "Calibration",
    pest: "PestControl",
    training: "Training",
    product: "Products",
    user: "Users",
    notification: "Notifications",
    ops_station: "Ops_Stations",
    procedures: "Procedures",
  };

  const sheetName = sheetMap[type];
  if (!sheetName)
    return { success: false, message: "Sheet not found for type: " + type };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    initSheets(); // Try to initialize if missing
    sheet = ss.getSheetByName(sheetName);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRowData = { ...data };

  // Handle Image Upload(s) to Drive
  if (data.img && data.img.length > 500) {
    const folderName = sheetName;
    const fileNamePrefix = `${type}_${new Date().toLocaleDateString("en-CA")}_${new Date().getTime()}`;
    const images = data.img.split("|||");
    const uploadedUrls = images.map((img, idx) => {
      if (img.length > 500) {
        return uploadToDrive(img, folderName, `${fileNamePrefix}_${idx + 1}`);
      }
      return img;
    });
    newRowData.img = uploadedUrls.join(", ");
  }

  const newRow = headers.map((header) => {
    if (header === "id") return Utilities.getUuid();
    if (header === "timestamp") return new Date();
    if (header === "completed" && type === "procedures") return false;
    if (header === "read" && type === "notifications") return false;
    return newRowData[header] !== undefined ? newRowData[header] : "";
  });

  sheet.appendRow(newRow);
  return { success: true };
}

/**
 * Update procedure task completion
 */
function updateProcedureTask(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Procedures");
  const values = sheet.getDataRange().getValues();
  const idIndex = values[0].indexOf("id");
  const completedIndex = values[0].indexOf("completed");
  const imgIndex = values[0].indexOf("img");

  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] === data.id) {
      sheet.getRange(i + 1, completedIndex + 1).setValue(data.completed);
      if (data.img !== undefined && imgIndex !== -1) {
        let finalImg = data.img;
        if (finalImg.length > 500) {
          const fileNamePrefix = `Procedures_${new Date().toLocaleDateString("en-CA")}_${new Date().getTime()}`;
          const images = finalImg.split("|||");
          const uploadedUrls = images.map((img, idx) => {
            if (img.length > 500) {
              return uploadToDrive(
                img,
                "Procedures",
                `${fileNamePrefix}_${idx + 1}`,
              );
            }
            return img;
          });
          finalImg = uploadedUrls.join(", ");
        }
        sheet.getRange(i + 1, imgIndex + 1).setValue(finalImg);
      }
      return { success: true };
    }
  }
  return { success: false, message: "Task not found" };
}

/**
 * Mark notification as read
 */
function markNotificationAsRead(id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Notifications");
  const values = sheet.getDataRange().getValues();
  const idIndex = values[0].indexOf("id");
  const readIndex = values[0].indexOf("read");

  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] === id) {
      sheet.getRange(i + 1, readIndex + 1).setValue(true);
      return { success: true };
    }
  }
  return { success: false };
}

/**
 * Delete data from a sheet by ID
 */
function deleteData(type, id) {
  const sheetMap = {
    audit: "Audit_Logs",
    stock: "Stock_Entries",
    receiving: "Receiving",
    health: "Health-Card",
    temp: "Temp_Logs",
    equipment: "Equipment",
    checklist: "Checklists",
    complaints: "Complaints",
    calibration: "Calibration",
    pest: "PestControl",
    training: "Training",
    product: "Products",
    user: "Users",
    notification: "Notifications",
    ops_station: "Ops_Stations",
    procedures: "Procedures",
  };

  const sheetName = sheetMap[type];
  if (!sheetName) return { success: false, message: "Type not found" };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const idIndex = values[0].indexOf("id");

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: "ID not found" };
}

/**
 * Update data in a sheet by ID
 */
function updateData(type, id, data) {
  const sheetMap = {
    audit: "Audit_Logs",
    stock: "Stock_Entries",
    receiving: "Receiving",
    health: "Health-Card",
    temp: "Temp_Logs",
    equipment: "Equipment",
    checklist: "Checklists",
    complaints: "Complaints",
    calibration: "Calibration",
    pest: "PestControl",
    training: "Training",
    product: "Products",
    user: "Users",
    notification: "Notifications",
    ops_station: "Ops_Stations",
    procedures: "Procedures",
  };

  const sheetName = sheetMap[type];
  if (!sheetName) return { success: false, message: "Type not found" };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("id");

  const updateDataObj = { ...data };

  // Handle Image Update(s)
  if (data.img && data.img.length > 500) {
    const images = data.img.split("|||");
    const uploadedUrls = images.map((img, idx) => {
      if (img.length > 500) {
        return uploadToDrive(img, sheetName, `${type}_edit_${id}_${idx + 1}`);
      }
      return img;
    });
    updateDataObj.img = uploadedUrls.join(", ");
  }

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) {
      const rowNum = i + 1;
      headers.forEach((header, colIdx) => {
        if (
          updateDataObj[header] !== undefined &&
          header !== "id" &&
          header !== "timestamp"
        ) {
          sheet.getRange(rowNum, colIdx + 1).setValue(updateDataObj[header]);
        }
      });
      return { success: true };
    }
  }
  return { success: false, message: "ID not found" };
}

/**
 * Initialize all sheets and headers (Destructive: Resets everything)
 */
function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheetsDef = {
    Audit_Logs: [
      "id",
      "date",
      "time",
      "area",
      "observation",
      "score",
      "responsible",
      "img",
      "timestamp",
    ],
    Stock_Entries: [
      "id",
      "date",
      "productName",
      "code",
      "expiry",
      "quantity",
      "status",
      "user",
      "timestamp",
    ],
    Receiving: [
      "id",
      "date",
      "productName",
      "code",
      "supplier",
      "quantity",
      "expiry",
      "temp",
      "user",
      "timestamp",
    ],
    "Health-Card": [
      "id",
      "name",
      "role",
      "issue",
      "expiry",
      "status",
      "img",
      "timestamp",
    ],
    Temp_Logs: [
      "id",
      "date",
      "time",
      "equipment",
      "reading",
      "status",
      "user",
      "timestamp",
    ],
    Equipment: [
      "id",
      "name",
      "type",
      "minTemp",
      "maxTemp",
      "status",
      "timestamp",
    ],
    Checklists: ["id", "date", "area", "status", "notes", "user", "timestamp"],
    Complaints: [
      "id",
      "date",
      "customer",
      "phone",
      "product",
      "details",
      "action",
      "status",
      "img",
      "timestamp",
    ],
    Calibration: ["id", "date", "device", "result", "operator", "timestamp"],
    PestControl: [
      "id",
      "date",
      "type",
      "findings",
      "action",
      "img",
      "timestamp",
    ],
    Training: [
      "id",
      "date",
      "topic",
      "trainer",
      "trainees",
      "img",
      "timestamp",
    ],
    Products: ["id", "name", "code", "category", "unit", "timestamp"],
    Users: [
      "id",
      "fullName",
      "email",
      "password",
      "role",
      "access",
      "status",
      "timestamp",
    ],
    Notifications: [
      "id",
      "date",
      "title",
      "message",
      "type",
      "priority",
      "read",
      "timestamp",
    ],
    Ops_Stations: [
      "id",
      "station",
      "employeeName",
      "shift",
      "date",
      "user",
      "timestamp",
    ],
    Procedures: [
      "id",
      "date",
      "taskName",
      "taskTime",
      "taskFrequency",
      "procedureType",
      "responsible",
      "completed",
      "img",
      "timestamp",
    ],
  };

  // 1. Create a temporary sheet to allow deleting all others
  const tempSheet = ss.insertSheet("RESET_IN_PROGRESS_" + new Date().getTime());

  // 2. Delete all existing sheets
  const existingSheets = ss.getSheets();
  existingSheets.forEach((sheet) => {
    if (sheet.getName() !== tempSheet.getName()) {
      ss.deleteSheet(sheet);
    }
  });

  // 3. Create new sheets from definition
  for (let name in sheetsDef) {
    const sheet = ss.insertSheet(name);
    sheet
      .getRange(1, 1, 1, sheetsDef[name].length)
      .setValues([sheetsDef[name]])
      .setFontWeight("bold")
      .setBackground("#f3f3f3");
    sheet.setFrozenRows(1);
  }

  // 4. Create default admin user
  const userSheet = ss.getSheetByName("Users");
  userSheet.appendRow([
    "admin-id",
    "مدير النظام",
    "admin",
    "123",
    "Admin",
    "all",
    "active",
    new Date(),
  ]);

  // 5. Delete temporary sheet
  ss.deleteSheet(tempSheet);

  return "Database Reset Complete. All sheets recreated.";
}

/**
 * Upload base64 image to Google Drive
 */
function uploadToDrive(base64Data, folderName, fileName) {
  try {
    const rootFolder = DriveApp.getFolderById(ROOT_FOLDER_ID);
    let targetFolder;

    // Check if subfolder exists, otherwise create it
    const subfolders = rootFolder.getFoldersByName(folderName);
    if (subfolders.hasNext()) {
      targetFolder = subfolders.next();
    } else {
      targetFolder = rootFolder.createFolder(folderName);
    }

    // Split base64 data to get content
    const splitData = base64Data.split(",");
    const contentType = splitData[0].match(/:(.*?);/)[1];
    const bytes = Utilities.base64Decode(splitData[1]);
    const blob = Utilities.newBlob(bytes, contentType, fileName);

    // Create file in target folder
    const file = targetFolder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Return the view URL
    // Format: https://lh3.googleusercontent.com/d/[FILE_ID] is often better for direct embedding
    return `https://drive.google.com/uc?export=view&id=${file.getId()}`;
  } catch (e) {
    Logger.log("Drive Upload Error: " + e.toString());
    return base64Data; // Fallback to base64 if upload fails
  }
}
