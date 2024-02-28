fetch("http://localhost:3000/fetchAllUser", {
  method: "GET",
})
  .then((response) => response.json())
  .then((data) => {
    // Populate the table with data
    const tableBody = document.getElementById("table-body");

    data.results.forEach((record, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${record.firstname}</td>
            <td>${record.lastname}</td>
            <td>${record.email}</td>
            <td>${record.address}</td>
            <td>${record.age}</td>
            <td>
            <button type="button" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#editModal" onclick="populateEditModal('${
              record.firstname
            }', '${record.lastname}', '${record.email}', '${record.address}', ${
        record.age
      })">
            Edit
          </button>
                <button class="btn btn-danger" onclick="deleteRecord('${
                  record.email
                }')">Delete</button>
            </td>
        `;
      tableBody.appendChild(row);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function populateEditModal(firstname, lastname, email, address, age) {
  document.getElementById("editFirstName").value = firstname;
  document.getElementById("editLastName").value = lastname;
  document.getElementById("editEmail").value = email;
  document.getElementById("editAddress").value = address;
  document.getElementById("editAge").value = age;
}
// Function to handle Save Changes button click
function saveChanges() {
  const formData = {
    firstname: document.getElementById("editFirstName").value,
    lastname: document.getElementById("editLastName").value,
    email: document.getElementById("editEmail").value,
    address: document.getElementById("editAddress").value,
    age: document.getElementById("editAge").value,
  };

  console.log("Form Data:", formData);

  const response = fetch("http://localhost:3000/updateuser", {
    method: "POST",
    body: JSON.stringify(formData),
  }).then((response) => {
    response.json().then((res) => {
      if (res.success) {
        location.reload();
      } else {
        alert("Email already exist");
      }
    });
  });
}

function deleteRecord(email) {
  if (confirm("Are you sure you want to delete this user?")) {
    fetch("http://localhost:3000/deleteUser", {
      method: "POST",

      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("User deleted successfully");
          // Refresh the table or update UI as needed
          location.reload();
        } else {
          console.error("Failed to delete user:", data);
          // Handle error accordingly
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        // Handle error accordingly
      });
  }
}
