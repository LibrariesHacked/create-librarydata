<template>
  <div class="home">
    <custom-header
      title="Create."
      subtitle="Tools for sharing good library data."
    />
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column has-text-centered features">
              <b-icon icon="rotate-right-variant" size="is-large" />
              <p class="title is-4"><strong>Convert</strong></p>
              <p class="subtitle">Get data into formats people will want it.</p>
            </div>
            <div class="column has-text-centered features">
              <b-icon icon="progress-check" size="is-large" />
              <p class="title is-4"><strong>Validate</strong></p>
              <p class="subtitle">Make sure the data can be used.</p>
            </div>
            <div class="column has-text-centered features">
              <b-icon icon="publish" size="is-large" />
              <p class="title is-4"><strong>Publish</strong></p>
              <p class="subtitle">Make the data widely available.</p>
            </div>
            <div class="column has-text-centered features">
              <b-icon icon="sync" size="is-large" />
              <p class="title is-4"><strong>Maintain</strong></p>
              <p class="subtitle">Keep the data up to date.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <custom-footer />
  </div>
</template>
<script>
import Footer from "../components/Footer";
import Header from "../components/Header";

export default {
  data() {
    return {};
  },
  methods: {},
  components: { "custom-footer": Footer, "custom-header": Header }
};
</script>
