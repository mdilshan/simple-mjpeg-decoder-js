const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/stream", (req, res) => {
  const framesDir = path.resolve(__dirname, "media30fps");
  const frames = fs.readdirSync(framesDir);

  res.writeHead(200, {
    "Content-Type": "multipart/x-mixed-replace; boundary=frame",
    "Cache-Control": "no-cache",
    Connection: "close",
  });

  const sendFrame = (index) => {
    if (index >= frames.length) {
      res.end();
      return;
    }

    const frameFilePath = path.join(framesDir, frames[index]);
    const frameStream = fs.createReadStream(frameFilePath);

    if (index != 0) {
        res.write(new TextEncoder().encode("\r\n--frame\r\n"))
    }

    frameStream.pipe(res, { end: false });
    frameStream.on("end", () => {
      setTimeout(() => {
        sendFrame(index + 1);
      }, 1000 / 30); // value 30 is the frame rate of the video
    });
  };

  sendFrame(0);
});

app.listen(3000, () => console.log("server works"));
