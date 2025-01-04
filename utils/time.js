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
    let diffInHours = Math.floor(diffInMinutes/60)
    if(diffInHours < 24){
      return`${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    }
    let diffInDays = Math.floor(diffInHours/24)
    if(diffInDays < 30){
      return`${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    }
  }

  module.exports={
   Time,getRelativeTime
  }