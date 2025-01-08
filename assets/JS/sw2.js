const Swal= require("sweetalert2");

function sendAlert(messages) {
  if (messages && messages.message) {
    const { title, text, icon } = messages.message[0]
    return `
      <script>
        Swal.fire({
          title: "${title}" ||"error" ,
          text: "${text}" ||"error",
          icon: "${icon}" || "error"
        });
      </script>
    `;
   
  };
}

module.exports = {
  sendAlert,
};
