const Swal = require("sweetalert2");

function sendAlert(type,massage) {
    Swal.fire({
        title: "Oops!",
        text: massage,
        icon: type
      });
}

module.exports = {
  sendAlert,
};
