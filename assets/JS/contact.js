// var contactForm = document.getElementById("contactForm")

// contactForm.addEventListener('submit', (e) => {
//     e.preventDefault();
    
//     alert('submit')

//     var form = e.target
//     var formData = new FormData(form) 

//     var data = Object.fromEntries(formData.entries())
//     console.log(data.phoneNumber)

//     var link = document.createElement('a')
//     link.href = `mailto:endranio576@gmail.com?subject=&body=selamat siang nama saya${data.name}.Silahkan hubungi saya di ${data.email} atau ${data.phoneNumber}.Skill saya ${data.Subject}.Berikut adalah pesan saya: ${data.massage}`
//     link.click()
// })

var contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault(); 

  
  var form = e.target;
  var formData = new FormData(form);
  var data = Object.fromEntries(formData.entries());

 
  Swal.fire({
    title: "Email Sent",
    text: `Thank you, ${data.name}! Your email has been sent successfully.`,
    icon: "success",
    confirmButtonText: "OK",
  }).then(() => {
    
    var link = document.createElement("a");
    link.href = `mailto:endranio576@gmail.com?subject=${encodeURIComponent(
      data.Subject
    )}&body=Selamat siang, nama saya ${data.name}. Silahkan hubungi saya di ${
      data.email
    } atau ${
      data.phoneNumber
    }. Skill saya: ${data.Subject}. Berikut adalah pesan saya: ${data.massage}`;
    link.click();
  });
});













