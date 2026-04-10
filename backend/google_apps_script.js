/**
 * DENDO Employee Portal - Google Apps Script Backend
 * ----------------------------------------------------
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code into "Code.gs", overwriting any existing code.
 * 4. Click "Deploy" > "Manage deployments".
 * 5. Click the top-right Pencil icon (Edit).
 * 6. Under "Version", select "New version".
 * 7. Click Deploy.
 * IT IS CRITICAL YOU SELECT NEW VERSION OR CHANGES WON'T APPLY TO THE PUBLIC URL!
 */

function doOptions(e) {
  // Respond to Preflight CORS requests
  return _createCorsResponse();
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Dendo Employee Portal Backend is running successfully.");
}

function doPost(e) {
  if (typeof e !== 'undefined') { 
    try {
      const postData = JSON.parse(e.postData.contents);
      const action = postData.action;

      let result;
      if (action === "login") {
        result = loginUser(postData.email, postData.phone);
      } else if (action === "getTasks") {
        result = getTasks(postData.name);
      } else if (action === "getAllTasks") {
        result = getAllTasks();
      } else if (action === "updateTask") {
        result = updateTask(postData.sno, postData.status, postData.remarks);
      } else {
        result = { success: false, message: "Unknown action provided." };
      }

      return _createCorsResponse(result);
    } catch(err) {
      return _createCorsResponse({ success: false, message: "Error: " + err.toString() });
    }
  }
}

function _createCorsResponse(payload = {}) {
  // JSON Output
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
}

function loginUser(emailInput, phoneInput) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Employee Details");
  if (!sheet) return { success: false, message: "Employee Details sheet not found." };
  
  const data = sheet.getDataRange().getValues();
  const emailToMatch = String(emailInput).trim().toLowerCase();
  const phoneToMatch = String(phoneInput).trim();
  
  // Start from row 2 (index 1) to skip header
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const emailInfo = String(row[5]).trim().toLowerCase(); // Email is in Column F (index 5)
    const contactInfo = String(row[6]).trim(); // Contact Number is in Column G (index 6)
    
    if (emailInfo === emailToMatch && emailInfo !== "") {
      if (contactInfo === phoneToMatch) {
         const user = {
           name: row[1],
           role: row[2],
           product: row[3],
           specialization: row[4],
           email: row[5]
         };
         return { success: true, user: user };
      } else {
         return { success: false, message: "Incorrect password (phone number)." };
      }
    }
  }
  
  return { success: false, message: "No employee found with this email." };
}

function getTasks(employeeName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product Work Schedule");
  if (!sheet) return { success: false, message: "Product Work Schedule sheet not found." };
  
  const data = sheet.getDataRange().getValues();
  let tasks = [];
  
  // Start from row 2 (index 1) to skip header
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const assigned = String(row[2]).trim(); // Assigned is Column C (index 2)
    
    if (assigned === String(employeeName).trim() && assigned !== "") {
      tasks.push({
        sno: row[0],
        taskDesc: row[1],
        assigned: row[2],
        estdDays: row[3],
        deadline: row[4],
        completedDate: row[5],
        status: row[6],
        remarks: row[7],
        driveLink: row[8]
      });
    }
  }
  
  return { success: true, tasks: tasks };
}

function getAllTasks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product Work Schedule");
  if (!sheet) return { success: false, message: "Product Work Schedule sheet not found." };
  
  const data = sheet.getDataRange().getValues();
  let tasks = [];
  
  // Start from row 2 (index 1) to skip header
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // Push all valid tasks (even if unassigned)
    if (String(row[0]).trim() !== "" && String(row[1]).trim() !== "") {
      tasks.push({
        sno: row[0],
        taskDesc: row[1],
        assigned: row[2] || "Unassigned",
        estdDays: row[3],
        deadline: row[4],
        completedDate: row[5],
        status: row[6] || "Pending",
        remarks: row[7],
        driveLink: row[8]
      });
    }
  }
  
  return { success: true, tasks: tasks };
}

function updateTask(sno, newStatus, newRemarks) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product Work Schedule");
  if (!sheet) return { success: false, message: "Product Work Schedule sheet not found." };
  
  const data = sheet.getDataRange().getValues();
  
  // Search for the Sno
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(sno).trim()) {
      const rowNum = i + 1; // Apps script is 1-indexed for ranges
      
      // Update Status (Col G = 7)
      sheet.getRange(rowNum, 7).setValue(newStatus);
      // Update Remarks (Col H = 8)
      sheet.getRange(rowNum, 8).setValue(newRemarks);
      
      // Automatically update Completed Date if marked 'Done'
      if (newStatus.toLowerCase().includes('done') || newStatus.toLowerCase().includes('complet')) {
         const today = new Date();
         const dateString = today.toLocaleDateString('en-GB'); // DD/MM/YYYY format
         sheet.getRange(rowNum, 6).setValue(dateString); // Col F = 6
      }
      SpreadsheetApp.flush(); // Force changes to be written immediately
      
      return { success: true, message: "Task successfully updated." };
    }
  }
  
  return { success: false, message: "Task ID (Sno) not found." };
}
