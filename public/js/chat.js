const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  if (message === "") return;
  document.querySelector("input").value = "";
  socket.emit("sendMessage", message, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("SUCCESS!");
  });
});

document.querySelector("#send-location").addEventListener("click", (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      },
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Location shared!");
      }
    );
  });
});
