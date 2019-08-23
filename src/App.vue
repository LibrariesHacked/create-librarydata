<template>
  <div id="app">
    <div class="container">
      <b-navbar>
        <template slot="brand"></template>
        <template slot="start">
          <b-navbar-item tag="router-link" to="home">Home</b-navbar-item>
          <b-navbar-item tag="router-link" to="schemas">Schemas</b-navbar-item>
        </template>
        <template slot="end"></template>
      </b-navbar>
    </div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Create</h1>
          <h2 class="subtitle">Tools for creating library data</h2>
        </div>
      </div>
    </section>
  </div>
</template>
