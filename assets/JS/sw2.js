const Swal = require("sweetalert2")

function sendAlert(title,message){
    Swal.fire({
        title: "Oops!",
        text: message,
        icon: "success"
      });
}

module.exports = {
    sendAlert
}