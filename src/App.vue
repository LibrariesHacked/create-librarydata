<template>
  <div id="app">
    <div class="container">
      <b-navbar>
        <template slot="brand"></template>
        <template slot="start">
          <b-navbar-item tag="router-link" to="/">Home</b-navbar-item>
          <b-navbar-item tag="router-link" to="convert">Convert</b-navbar-item>
        </template>
        <template slot="end"></template>
      </b-navbar>
    </div>
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view></router-view>
  </div>
</template>
