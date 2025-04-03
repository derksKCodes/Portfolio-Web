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
  
