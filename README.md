`expo-video` misbehave with its player `SharedObject` when using `createVideoPlayer()` directly.
Saving it in a state is error prone.
A solution would be to save it in the component's closure, but there are other drawback !

See app/index.js for explanation

Deps :
- "expo": "~53.0.20"
- "expo-video" :"~2.2.2"
