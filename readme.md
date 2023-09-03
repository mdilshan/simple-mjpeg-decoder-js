### A Simple MJPEG decoder created with vanilla javascript.

> Note: This decoder is created to teach javascript to beginers so it might not production ready and may have performance issues.

#### Content

- `/server` contains a express server which serve mjpeg stream.
- `/server/media30fps` contains frames from a sample video. I used ffmpeg to generate the frames from a mp4 video.

You can also generate frames using,

```ffmpeg -i input.mp4 -vf "fps=10" -q:v 1 output_%04d.jpg```

You can get the fps of the video using,

```ffprobe -select_streams v:0 -show_entries stream=r_frame_rate sample.mp4```


#### Run the project

To start the project, run the `server/server.js` file using node,

```node server/server.js```

Then start the client side code using `live-server` or using any other development server.