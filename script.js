document.addEventListener("DOMContentLoaded", function () {
    const skills = {
        "python": 85, "ethical-hacking": 75, "django": 80, "javascript": 70
    };

    document.querySelectorAll(".bar").forEach((bar, index) => {
        const skillName = Object.keys(skills)[index];
        const percentage = skills[skillName];
        bar.style.strokeDashoffset = 314 - (314 * percentage) / 100;
    });
});


// change profile placeholder
document.getElementById("profile").addEventListener("change", function() {
//Ternary Operator Structure (condition ? valueIfTrue : valueIfFalse)
let fileName = this.files[0] ? this.files[0].name : "Upload Profile";
document.querySelector(".file-label").textContent = fileName;
});


function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');

    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
          // Remove active class if it's applied (closing the menu)
          document.querySelector('.nav-links').classList.remove('active');
        });
      });
  }
  


  document.getElementById('form_Data').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    let name = document.getElementById("name").value;
    let feedback = document.getElementById("feedback").value;
    let rating = document.getElementById("rating").value;
    let profileInput = document.getElementById("profile");

    let formData = new FormData();
    formData.append("name", name);
    formData.append("feedback", feedback);
    formData.append("rating", rating);

    if (profileInput.files.length > 0) {
        let profile = profileInput.files[0];
        formData.append("profile", profile); // Append the file
    }

    fetch("http://localhost:8080/submit_testimonial", {
            method: "POST",
            body: formData, // Send the FormData object
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            // Optionally, clear the form here:
            document.getElementById("name").value = "";
            document.getElementById("feedback").value = "";
            document.getElementById("rating").value = "";
            document.getElementById("profile").value = ""; // Clear file input

            // Dynamically add the new testimonial to the testimonials section
        let testimonialList = document.getElementById("testimonial-results");

        // Create new testimonial item element
        let newTestimonial = document.createElement('div');
        newTestimonial.classList.add('testimonial-item');

        let profileImage = data.profile_image ? `http://localhost:8080/static/uploads/${data.profile_image}` : 'https://via.placeholder.com/80';
        newTestimonial.innerHTML = `
            <img src="${profileImage}" alt="Profile" class="profile-pic">
            <p>"${data.feedback}"</p>
            <p class="author">- ${data.name}, Rating: ${data.rating} Stars</p>
        `;

        // Append the new testimonial to the list
        testimonialList.appendChild(newTestimonial);
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to submit testimonial: " + error.message); // Improved user feedback
        });
});


