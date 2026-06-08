
// array
let allData = [];

fetch("./js/school.json")
  .then(response => response.json())
  .then(data => {
    //نخزن البيانات في متغير allData
    allData = data;
    displayData(allData);
    updateAlert(allData);
  })
  .catch(error => console.error("Error loading JSON:", error));

function getLicenseStatus(expiryDate) {
  const today = new Date();
  const licenseEnd = new Date(expiryDate);

  const diffTime = licenseEnd - today;
  //math.ceil تستخدم لتقريب لاعلى 2.3->3
  //math.roundتستخدم لتقريب لاسفل  2.3-> 2
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "منتهي", color: "red" };
  } else if (diffDays <= 30) {
    return { text: `ينتهي خلال ${diffDays} يوم`, color: "#ffa200" };
  } else {
    return { text: "ساري", color: "green" };
  }
}

function displayData(data) {
  let table = document.getElementById("tableData");
  table.innerHTML = "";

  data.forEach(item => {
    const status = getLicenseStatus(item.license_end);

    table.innerHTML += `
      <tr>
        <td>${item.code}</td>
        <td>${item.name}</td>
        <td>${item.wilayate}</td>
        <td>${item.type}</td>
        <td>${item.license_end}</td>
        <td style="color:${status.color}; font-weight:bold;">
          ${status.text}
        </td>
      </tr>
    `;
  });
}

function updateAlert(data) {
  const today = new Date();

  const expiring = data.filter(item => {
    const diffDays = Math.ceil((new Date(item.license_end) - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  });

  document.getElementById("alertBox").innerHTML =
    ` يوجد ${expiring.length}  مدارس تنتهي تراخيصها خلال 30 يوم`;

  document.getElementById("alertBox").style.display =
    expiring.length > 0 ? "block" : "none";
}

///عرض الكل

function showAll() {
  displayData(allData);
}
/////
function showExpiring() {
  const today = new Date();

  const filtered = allData.filter(item => {
    const diffDays = Math.ceil((new Date(item.license_end) - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  });

  displayData(filtered);
}

/// diffDays < 0 تكون بالسالب يعني التاليخ انتهى
function showExpiringAllready() {
  const today = new Date();

  const filtered = allData.filter(item => {
    const diffDays = Math.ceil((new Date(item.license_end) - today) / (1000 * 60 * 60 * 24));
    return diffDays < 0 ;
  });

  displayData(filtered);
}
