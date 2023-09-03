async function* Decoder(url) {
  const response = await fetch(url);
  const reader = response.body.getReader();

  let partialData = new Uint8Array(0);

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const videoData = new Uint8Array(partialData.length + value.length);
    videoData.set(partialData, 0);
    videoData.set(value, partialData.length);

    partialData = videoData;

    const delimter = new TextEncoder().encode("\r\n--frame\r\n");

    let frameStartIndex = 0;
    let frameEndIndex = indexOfSubarray(partialData, delimter);

    while (frameEndIndex !== -1) {
      const frameData = partialData.subarray(frameStartIndex, frameEndIndex);

      yield frameData;

      frameStartIndex = frameEndIndex + delimter.length;
      frameEndIndex = partialData.indexOf(delimter, frameStartIndex);

      partialData = partialData.subarray(frameStartIndex);
    }
  }
}

// KNP algorithm
function indexOfSubarray(mainArray, subArray) {
  const mainLength = mainArray.length;
  const subLength = subArray.length;

  for (let i = 0; i <= mainLength - subLength; i++) {
    let found = true;

    for (let j = 0; j < subLength; j++) {
      if (mainArray[i + j] !== subArray[j]) {
        found = false;
        break;
      }
    }

    if (found) {
      return i;
    }
  }

  return -1;
}

function drawImage(data) {
  const blob = new Blob([data], { type: "image/jpeg" });
  const img = document.getElementById("cont");
  const reader = new FileReader();
  reader.onload = function () {
    const dataurl = reader.result;
    img.src = dataurl;
  };

  reader.readAsDataURL(blob);
}

(async () => {
  const decoder = Decoder("http://localhost:3000/stream");
  for await (const frame of decoder) {
    drawImage(frame);
  }
})();
