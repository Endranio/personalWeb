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


    }

    project.push(blog)
    renderBlog()
}

function renderBlog() {
    console.log(project)

    let ProjectListElement = document.getElementById("project-list")

    ProjectListElement.innerHTML = iniProjectnya()

    for(let i = 0; i < project.length; i++){
        console.log(project[i])
       
        ProjectListElement.innerHTML +=`
         <div class="project-card">
                  <div class="card-image">
                    <img src="${project[i].images}" alt="">
                    <a href="">${project[i].title}</a>
                    <p>Durasi ${project[i].durasi} Bulan</p>
                  </div>
                  <div><p>${project[i].massage}</p></div>
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

function iniProjectnya(){
    return `
    <div  class="project-card">
              <div class="card-image">
                <img src="../image/blog-img.png" alt="">
                <a href="">Dumbways Mobile - 2021</a>
                <p>Durasi 3 Bulan</p>
              </div>
              <div><p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit maiores ipsa omnis, itaque quaerat atque repudiandae ea, autem quisquam molestias nulla temporibus iure fugit. Quos maiores fuga laboriosam. Sunt, cupiditate?</p></div>
              <div class="card-content">
                <div class="card-icons">
                  <i class="lni lni-nodejs"></i>
                  <i class="lni lni-nextjs"></i>
                  <i class="lni lni-react"></i>
                  <i class="lni lni-typescript"></i>
                </div>

                <div class="button-card">
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
              </div>
    `
}