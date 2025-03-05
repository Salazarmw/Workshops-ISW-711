let currentEditId = null;

// ==================== TEACHER FUNCTIONS ====================

/**
 * Carga los cursos en el combobox del formulario de profesores.
 */
async function populateCourses() {
  const response = await fetch("http://localhost:3001/api/courses");
  const courses = await response.json();
  const select = document.getElementById("course_id");

  select.innerHTML = courses
    .map((course) => `<option value="${course._id}">${course.name}</option>`)
    .join("");
}

/**
 * Obtiene y muestra la lista de profesores.
 */
async function getTeachers() {
  const response = await fetch("http://localhost:3001/api/teachers");
  const teachers = await response.json();
  const tbody = document.getElementById("teachersTable");

  tbody.innerHTML = teachers
    .map(
      (teacher) => `
    <tr>
      <td class="px-6 py-4 whitespace-nowrap">${teacher.first_name} ${
        teacher.last_name
      }</td>
      <td class="px-6 py-4 whitespace-nowrap">${teacher.cedula}</td>
      <td class="px-6 py-4 whitespace-nowrap">${teacher.age}</td>
      <td class="px-6 py-4 whitespace-nowrap">${
        teacher.course?.name || "N/A"
      }</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button onclick="editTeacher('${
          teacher._id
        }')" class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
        <button onclick="deleteTeacher('${
          teacher._id
        }')" class="text-red-600 hover:text-red-900">Delete</button>
      </td>
    </tr>
  `
    )
    .join("");
}

/**
 * Crea un nuevo profesor.
 */
async function createTeacher() {
  const teacher = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    cedula: document.getElementById("cedula").value,
    age: parseInt(document.getElementById("age").value, 10), // Convertir a número
    course: document.getElementById("course_id").value,
  };

  // Validación básica de campos
  if (
    !teacher.first_name ||
    !teacher.last_name ||
    !teacher.cedula ||
    !teacher.age ||
    !teacher.course
  ) {
    alert("All fields are required!");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/api/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teacher),
    });

    if (response.ok) {
      alert("Teacher created successfully");
      getTeachers();
      document.querySelector("form").reset(); // Limpiar el formulario
    } else {
      const errorData = await response.json(); // Obtener detalles del error
      alert(`Error creating teacher: ${errorData.error || "Unknown error"}`);
    }
  } catch (error) {
    console.log("Network or server error:", error);
    alert("An unexpected error occurred.");
  }
}

/**
 * Edita un profesor existente.
 */
async function editTeacher(id) {
  const response = await fetch(`http://localhost:3001/api/teachers?id=${id}`);
  const teacher = await response.json();

  // Llenar el formulario con los datos del profesor
  document.getElementById("first_name").value = teacher.first_name;
  document.getElementById("last_name").value = teacher.last_name;
  document.getElementById("cedula").value = teacher.cedula;
  document.getElementById("age").value = teacher.age;
  document.getElementById("course_id").value = teacher.course?._id;

  // Mostrar botones de actualización y cancelar
  document.getElementById("saveBtn").classList.add("hidden");
  document.getElementById("updateBtn").classList.remove("hidden");
  document.getElementById("cancelBtn").classList.remove("hidden");

  currentEditId = id; // Guardar el ID del profesor en edición
}

/**
 * Actualiza un profesor existente.
 */
async function updateTeacher() {
  // Recolectar los datos del formulario
  const teacher = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    cedula: document.getElementById("cedula").value,
    age: parseInt(document.getElementById("age").value, 10), // Asegurarse de que sea un número
    course: document.getElementById("course_id").value,
  };

  // Validar que todos los campos necesarios están presentes
  if (
    !teacher.first_name ||
    !teacher.last_name ||
    !teacher.cedula ||
    !teacher.age ||
    !teacher.course
  ) {
    alert("All fields are required!");
    return;
  }

  try {
    // Enviar la solicitud PATCH al servidor
    const response = await fetch(
      `http://localhost:3001/api/teachers?id=${currentEditId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacher),
      }
    );

    if (response.ok) {
      alert("Teacher updated successfully");
      getTeachers();
      cancelEdit();
    } else {
      const errorData = await response.json();
      console.error("Error updating teacher:", errorData);
      alert("Error updating teacher: " + (errorData.error || "Unknown error"));
    }
  } catch (error) {
    console.log("Network or server error:", error);
    alert("An unexpected error occurred while updating the teacher.");
  }
}

/**
 * Cancela la edición de un profesor.
 */
function cancelEdit() {
  document.querySelector("form").reset();
  document.getElementById("saveBtn").classList.remove("hidden");
  document.getElementById("updateBtn").classList.add("hidden");
  document.getElementById("cancelBtn").classList.add("hidden");
  currentEditId = null; // Limpiar el ID en edición
}

/**
 * Elimina un profesor.
 */
async function deleteTeacher(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this teacher?"
  );
  if (!confirmDelete) return;

  const response = await fetch(`http://localhost:3001/api/teachers?id=${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("Teacher deleted successfully");
    getTeachers();
  } else {
    alert("Error deleting teacher");
  }
}

// ==================== COURSE FUNCTIONS ====================

/**
 * Obtiene y muestra la lista de cursos.
 */
async function getCourses() {
  const response = await fetch("http://localhost:3001/api/courses");
  const courses = await response.json();
  const tbody = document.getElementById("coursesTable");

  tbody.innerHTML = courses
    .map(
      (course) => `
    <tr>
      <td class="px-6 py-4 whitespace-nowrap">${course.name}</td>
      <td class="px-6 py-4 whitespace-nowrap">${course.credits}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button onclick="editCourse('${course._id}')" ...>Edit</button> <!-- Quitar .$oid -->
        <button onclick="deleteCourse('${course._id}')" ...>Delete</button>
      </td>
    </tr>
  `
    )
    .join("");
}

/**
 * Crea un nuevo curso.
 */
async function createCourse() {
  const course = {
    name: document.getElementById("course_name").value,
    credits: document.getElementById("credits").value,
  };

  const response = await fetch("http://localhost:3001/api/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });

  if (response.ok) {
    alert("Course created successfully");
    getCourses();
    document.querySelector("form").reset();
  } else {
    alert("Error creating course");
  }
}

/**
 * Edita un curso existente.
 */
async function editCourse(id) {
  const response = await fetch(`http://localhost:3001/api/courses?id=${id}`);
  const course = await response.json();

  document.getElementById("course_name").value = course.name;
  document.getElementById("credits").value = course.credits;

  document.getElementById("saveCourseBtn").classList.add("hidden");
  document.getElementById("updateCourseBtn").classList.remove("hidden");
  document.getElementById("cancelCourseBtn").classList.remove("hidden");

  currentEditId = id;
}

/**
 * Actualiza un curso existente.
 */
async function updateCourse() {
  const course = {
    name: document.getElementById("course_name").value,
    credits: document.getElementById("credits").value,
  };

  const response = await fetch(
    `http://localhost:3001/api/courses?id=${currentEditId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    }
  );

  if (response.ok) {
    alert("Course updated successfully");
    getCourses();
    cancelCourseEdit(); // Limpiar el formulario y restaurar botones
  } else {
    alert("Error updating course");
  }
}

/**
 * Cancela la edición de un curso.
 */
function cancelCourseEdit() {
  document.querySelector("form").reset();
  document.getElementById("saveCourseBtn").classList.remove("hidden");
  document.getElementById("updateCourseBtn").classList.add("hidden");
  document.getElementById("cancelCourseBtn").classList.add("hidden");
  currentEditId = null; // Limpiar el ID en edición
}

/**
 * Elimina un curso.
 */
async function deleteCourse(id) {
  const confirmDelete = confirm("Are you sure you want to delete this course?");
  if (!confirmDelete) return;

  const response = await fetch(`http://localhost:3001/api/courses?id=${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("Course deleted successfully");
    getCourses();
  } else {
    alert("Error deleting course");
  }
}

async function login() {
  const user = document.getElementById("user").value;
  const password = document.getElementById("password").value;
  const auth = btoa(`${user}:${password}`);
  sessionStorage.setItem("token", auth);
}

// ==================== INITIALIZATION ====================

/**
 * Inicializa la página según la URL.
 */
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("index.html")) {
    getTeachers();
    populateCourses();
  } else if (window.location.pathname.endsWith("teachers.html")) {
    getTeachers();
    populateCourses();
  } else if (window.location.pathname.endsWith("courses.html")) {
    getCourses();
  }
});
