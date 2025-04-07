// When the DOM is fully loaded, update skill bars based on skill percentages
document.addEventListener("DOMContentLoaded", function () {
    // Define skill percentages
    const skills = {
        "python": 85, 
        "ethical-hacking": 75, 
        "django": 80, 
        "javascript": 70
    };

    // Loop through each skill bar and apply stroke offset to create progress effect
    document.querySelectorAll(".bar").forEach((bar, index) => {
        const skillName = Object.keys(skills)[index];
        const percentage = skills[skillName];
        // 314 is the circumference of the circle; this calculates the visible part
        bar.style.strokeDashoffset = 314 - (314 * percentage) / 100;
    });
});

// Function to both open and download the CV PDF
function openAndDownload() {
    const fileUrl = 'files/Derrick_Karanja_Resume.pdf';

    // Open the PDF in a new browser tab
    window.open(fileUrl, '_blank');

    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'Derrick_Karanja_Resume.pdf'; // Force download with filename
    document.body.appendChild(link); // Add link to DOM
    link.click(); // Programmatically click to trigger download
    document.body.removeChild(link); // Clean up after download
}

// Change the label text when a profile image is selected
document.getElementById("profile").addEventListener("change", function () {
    // Use ternary to check if a file is selected, otherwise show default label
    let fileName = this.files[0] ? this.files[0].name : "Upload Profile";
    document.querySelector(".file-label").textContent = fileName;
});

// Function to toggle the navigation menu on small screens
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active'); // Show or hide menu

    // Close the menu when a nav link is clicked
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.remove('active');
        });
    });
}



// // Helper function to create a testimonial element
// function createTestimonialElement(testimonial, profileImage) {
//     let newTestimonial = document.createElement('div');
//     newTestimonial.classList.add('testimonial-item');
//     newTestimonial.innerHTML = `
//         <img src="${profileImage}" alt="Profile" class="profile-pic">
//         <p>"${testimonial.feedback}"</p>
//         <p class="author">- ${testimonial.name}, Rating: ${testimonial.rating} Stars</p>
//     `;
//     return newTestimonial;
// }


// Function to fetch and display testimonials
function fetchAndDisplayTestimonials() {
    fetch("http://localhost:8080/get_testimonials")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let testimonialList = document.getElementById("testimonial-results");           
        
            data.forEach(testimonial => {
                let profileImage = testimonial.profile_image
                    ? `http://localhost:8080/static/uploads/${testimonial.profile_image}`
                    : 'https://via.placeholder.com/80';
                let newTestimonial = document.createElement('div');
                newTestimonial.classList.add('testimonial-item');
                newTestimonial.innerHTML = `
                    <img src="${profileImage}" alt="Client Profile" class="profile-pic">
                    <p>"${testimonial.feedback}"</p>
                    <p class="author">- ${testimonial.name}, Rating: ${testimonial.rating} Stars</p>
                `;
                testimonialList.appendChild(newTestimonial);
            });
            
        })
        .catch(error => {
            console.error("Error fetching testimonials:", error);
            alert("Failed to load testimonials: " + error.message);
        });
}


// Handle testimonial form submission
document.getElementById('form_Data').addEventListener('submit', function(event)
 {
    event.preventDefault(); // Stop the form from submitting normally

    // Collect form values
    let name = document.getElementById("name").value;
    let feedback = document.getElementById("feedback").value;
    let rating = document.getElementById("rating").value;
    let profileInput = document.getElementById("profile");

    // Prepare form data for sending (including file)
    let formData = new FormData();
    formData.append("name", name);
    formData.append("feedback", feedback);
    formData.append("rating", rating);

    if (profileInput.files.length > 0) {
        let profile = profileInput.files[0];
        formData.append("profile", profile); // Attach the uploaded file
    }

    // Send form data to backend using Fetch API
    fetch("http://localhost:8080/submit_testimonial", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())    
    .then(data => {
        console.log("Success:", data);
        // Optional: show status message
        let statusDiv = document.getElementById("submission-status");
        statusDiv.textContent = data.message;
        statusDiv.className = "success"; 
        
    
        // Clear the form fields after successful submission
        document.getElementById("name").value = "";
        document.getElementById("feedback").value = "";
        document.getElementById("rating").value = "";
        document.getElementById("profile").value = "";       
       
setTimeout
        // Redirect to testimonials section
        setTimeout(()=>{window.location.href = "#testimonials"},2000)  //changed
          
    })
    .catch(error => {
        console.error("Error:", error);
        let statusDiv = document.getElementById("submission-status");
        statusDiv.textContent = "Failed to submit testimonial: " + error.message;
        statusDiv.className = "error";
    });
});

// Call fetchAndDisplayTestimonials when the page loads
window.onload = fetchAndDisplayTestimonials;


//handle contact from submission
document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Stop default form submission

    const form = e.target;
    const formData = new FormData(form); // Gather all form data

    fetch("http://localhost:8080/submit_contact", {
        method: "POST",
        body: formData // Send as form-data, not JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message); // Success message from server
            form.reset(); // Optional: clear form fields
        } else if (data.error) {
            alert("Error: " + data.error); // Server-side error message
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
        alert("Something went wrong while sending your message. Error details: "+ error.message);
    });
});

