const qrcode1 = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");
const loadingIcon = document.getElementById("loadingIcon");

let scanning = false;

qrcode1.callback = res => {
  if (res) {
    if(res.indexOf("covid19jagratha.kerala.nic.in") > -1){
      confirm("Scan Completed, Continue");
      window.location.href=res;
      outputData.innerText = "Please wait... Redirecting to jagratha portal....";
      scanning = false;

      video.srcObject.getTracks().forEach(track => {
        track.stop();
      });

      qrResult.hidden = false;
      canvasElement.hidden = true;
      btnScanQR.hidden = false;
      loadingIcon.hidden = true;
    }else{
      alert("Invalid QR Code! Please try again");
      outputData.innerText = "Invalid QR Code! Please try again";
      scanning = false;

      video.srcObject.getTracks().forEach(track => {
        track.stop();
      });

      qrResult.hidden = false;
      canvasElement.hidden = true;
      btnScanQR.hidden = false;
      loadingIcon.hidden = true;
    }
    
  }
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      loadingIcon.hidden = false;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode1.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}
