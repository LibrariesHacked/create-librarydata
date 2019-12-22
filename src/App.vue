<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #36a2eb;
$primary-invert: findColorInvert($primary);

$success: #4bc0c0;
$success-invert: findColorInvert($success);

$warning: #ffce56;
$warning-invert: findColorInvert($warning);

$danger: #fe7190;
$danger-invert: findColorInvert($danger);

$colors: (
  "white": (
    $white,
    $black
  ),
  "black": (
    $black,
    $white
  ),
  "light": (
    $light,
    $light-invert
  ),
  "dark": (
    $dark,
    $dark-invert
  ),
  "primary": (
    $primary,
    $primary-invert
  ),
  "info": (
    $info,
    $info-invert
  ),
  "success": (
    $success,
    $success-invert
  ),
  "warning": (
    $warning,
    $warning-invert
  ),
  "danger": (
    $danger,
    $danger-invert
  )
);

// Links
$link: $danger;
$link-invert: $danger-invert;
$link-focus-border: $danger;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>

<style>
.hero {
  border-bottom: 1px solid #e5e5e5 !important;
}
</style>
