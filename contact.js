var contactForm = document.getElementById("contactForm")

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    alert('submit')

    var form = e.target
    var formData = new FormData(form) 

    var data = Object.fromEntries(formData.entries())
    console.log(data.phoneNumber)

    var link = document.createElement('a')
    link.href = `mailto:endranio576@gmail.com?subject=&body=selamat siang nama saya${data.name}.Silahkan hubungi saya di ${data.email} atau ${data.phoneNumber}.Skill saya ${data.Subject}.Berikut adalah pesan saya: ${data.massage}`
    link.click()
})













