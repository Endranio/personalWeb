let project = []

function addBlog(e){
    e.preventDefault()
    
    let title = document.getElementById("input-project-name").value
    let startDate = new Date(document.getElementById("input-start-date").value)
    let endDate = new Date(document.getElementById("input-end-date").value)
    let massage = document.getElementById("massage").value
    let imageInput = document.getElementById("input-project-image")
    let checkboxes = document.querySelectorAll("input[type='checkbox']")
    let checkedValues = []
    checkboxes.forEach(checkbox =>{
        if (checkbox.checked) {
            checkedValues.push(checkbox.value)
        }
    })
   

    if(title == '' || startDate == '' || endDate == '' || massage == '' || checkedValues.length === 0 || imageInput.files.length === 0) {
        return alert("isi semua")

    }

    let image = URL.createObjectURL(imageInput.files[0])
    let duration = Math.ceil(
       (endDate-startDate) /(1000*60*60*24*30)
    )

    

    let blog={
       images:image,
       title:title,
       durasi:duration,
       massage:massage,
       checkbok:checkedValues,
       posteAdt:new Date(),

    }

    project.push(blog)
    renderBlog()
}

function renderBlog() {
    console.log(project)

    let ProjectListElement = document.getElementById("project-list")
    let NoProject = document.getElementById("noPost")
    NoProject.innerHTML= deleteText()
    // ProjectListElement.innerHTML = iniProjectnya()

    for(let i = 0; i < project.length; i++){
      let formatedDate = Time(project[i].posteAdt)
        console.log(project[i])
       
        ProjectListElement.innerHTML +=`
         <div class="card project-card">
                  <div class="card-image">
                    <img src="${project[i].images}" alt="">
                    <a href="">${project[i].title}</a>
                    <p>Durasi ${project[i].durasi} Bulan</p>
                     <p>${formatedDate}</p>
                  </div>
                  <div class="real"><p>${project[i].massage}</p>
                  <p class="real-time">${getRelativeTime(project[i].posteAdt)}</p></div>
                  <div class="card-content">
                    <div class="card-icons">
                      ${project[i].checkbok.map(logo => `<i class="${logo}"></i>`).join('')}
                    </div>
    
                    <div class="button-card">
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                  </div>`
    }

}
function deleteText(){
  return`<h3 style="margin: auto;text-align: center;color: rgb(189, 189, 189); display:none;">Deploy your project</h3>`
}
function iniProjectnya(){
    return `
    `
}

function Time(date) {
  let months = [
    "Jan", // 0
    "Feb", // 1
    "Mar", // 2
    "Apr", // 3
    "Mei", // 4
    "Jun", // 5
    "Jul", // 6
    "Aug", // 7
    "Sep", // 8
    "Okt", // 9
    "Nov", // 10
    "Des", // 11
  ];

  let day = date.getDate().toString()
  let month = months[date.getMonth()]  
  let year = date.getFullYear()
  let hours = date.getHours().toString().padStart(2,"0")
  let minutes = date.getMinutes().toString().padStart(2,"0")


  let formatedDate = `${day} ${month} ${year} ${hours}:${minutes}WIB`

  return formatedDate
}

function getRelativeTime(targetDate){
  let now = new Date()
  let diffInSeconds = Math.floor((now - targetDate) / 1000)
  console.log(diffInSeconds)

  if (diffInSeconds < 60){
    return`${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`
  }

  let diffInMinutes = Math.floor(diffInSeconds/60)
  if(diffInMinutes < 60){
    return`${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  }
}