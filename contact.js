var contactForm = document.getElementById(`contactForm`)

contactForm.addEventListener(
    'submit', (e) => {
        e.preventDefault();
        
        var form = e.target
        var formData = new FormData(form)

        var data = Object.fromEntries(formData.entries())
        
        console.log(data)
        console.log(data.phoneNumber)

        var link=document.createElement('a')
        link.href=`mailto:endranio576@gmail.com`
        link.click()
    })



