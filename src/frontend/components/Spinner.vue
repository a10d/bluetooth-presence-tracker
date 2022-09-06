<template>
  <svg class="spinner" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <rect class="b"
          fill="#ffffff"
          height="2.5"
          rx="1.25"
          transform="translate(5.403806, 6.050253) rotate(45.000000) translate(-5.403806, -6.050253) "
          width="6.5"
          x="2.15380592"
          y="4.80025253"></rect>
    <rect class="b" fill="#ffffff" height="2.5" rx="1.25" width="6.5" x="0" y="9.5"></rect>
    <rect class="b"
          fill="#ffffff"
          height="2.5"
          rx="1.25"
          transform="translate(5.050253, 15.596194) rotate(-45.000000) translate(-5.050253, -15.596194) "
          width="6.5"
          x="1.80025253"
          y="14.3461941"></rect>
    <rect class="b" fill="#ffffff" height="6.5" rx="1.25" width="2.5" x="8.75" y="13.5"></rect>
    <rect class="b"
          fill="#ffffff"
          height="2.5"
          rx="1.25"
          transform="translate(14.949747, 15.596194) rotate(45.000000) translate(-14.949747, -15.596194) "
          width="6.5"
          x="11.6997475"
          y="14.3461941"></rect>
    <rect class="b" fill="#ffffff" height="2.5" rx="1.25" width="6.5" x="13.5" y="9.5"></rect>
    <rect class="b"
          fill="#ffffff"
          height="2.5"
          rx="1.25"
          transform="translate(14.596194, 6.050253) rotate(-45.000000) translate(-14.596194, -6.050253) "
          width="6.5"
          x="11.3461941"
          y="4.80025253"></rect>
    <rect class="b" fill="#ffffff" height="6.5" rx="1.25" width="2.5" x="8.75" y="0"></rect>
  </svg>
</template>

<style>

.spinner {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;
}

.spinner .b {
  fill: #8e8e93;
}

.spinner .b {
  animation: spinnerBlade 1s linear infinite;
  will-change: opacity;
}

.spinner.light .b {
  fill: #ffffff;
}

.spinner .b:nth-child(8) {
  animation-delay: -1.625s;
}

.spinner .b:nth-child(7) {
  animation-delay: -1.5s;
}

.spinner .b:nth-child(6) {
  animation-delay: -1.375s;
}

.spinner .b:nth-child(5) {
  animation-delay: -1.25s;
}

.spinner .b:nth-child(4) {
  animation-delay: -1.125s;
}

.spinner .b:nth-child(3) {
  animation-delay: -1s;
}

.spinner .b:nth-child(2) {
  animation-delay: -0.875s;
}

.spinner .b:nth-child(1) {
  animation-delay: -0.75s;
}

@keyframes spinnerBlade {
  0% {
    opacity: 0.85;
  }
  50% {
    opacity: 0.25;
  }
  100% {
    opacity: 0.25;
  }
}

</style>
