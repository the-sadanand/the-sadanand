# animations/

| File              | Format | Purpose                              |
|-------------------|--------|--------------------------------------|
| `nebula.webm`     | WebM   | Background video loop for preview.html |
| `particles.json`  | JSON   | tsParticles / particles.js config    |
| `orbit.json`      | JSON   | 3D orbital ring system config        |

## How to use nebula.webm in preview.html

```html
<video autoplay muted loop playsinline id="bg-video">
  <source src="./animations/nebula.webm" type="video/webm" />
</video>
```

## How to use particles.json

```html
<script src="https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js"></script>
<script>
  tsParticles.load("particles-container", "./animations/particles.json");
</script>
```

> You can generate a free nebula.webm from [Motionarray](https://motionarray.com)
> or record one using [OBS Studio](https://obsproject.com) with a Space screensaver.
