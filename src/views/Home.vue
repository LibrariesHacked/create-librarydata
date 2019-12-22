<template>
  <div class="home">
    <custom-header
      title="Create."
      subtitle="Tools for building and sharing library data"
    />
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <router-link
              to="/convert"
              class="page-feature convert column has-text-centered"
            >
              <b-icon icon="rotate-right-variant" size="is-large" />
              <p class="title is-4"><strong>Convert</strong></p>
              <p class="subtitle">
                Get it into the right format
              </p>
            </router-link>
            <router-link
              to="/validate"
              class="page-feature validate column has-text-centered"
            >
              <b-icon icon="progress-check" size="is-large" />
              <p class="title is-4"><strong>Validate</strong></p>
              <p class="subtitle">Make sure it is to a standard</p>
            </router-link>
            <router-link
              to="/publish"
              class="page-feature publish column has-text-centered"
            >
              <b-icon icon="publish" size="is-large" />
              <p class="title is-4"><strong>Publish</strong></p>
              <p class="subtitle">Make it available so it can be used</p>
            </router-link>
            <router-link
              to="/maintain"
              class="page-feature maintain column has-text-centered"
            >
              <b-icon icon="sync" size="is-large" />
              <p class="title is-4"><strong>Maintain</strong></p>
              <p class="subtitle">Keep it correct and up to date</p>
            </router-link>
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

<style scoped>
.page-feature {
  border: 1px solid white;
}

.page-feature .subtitle {
  padding-bottom: 1.5em;
}

.page-feature {
  border: 1px solid white;
}

.page-feature.convert .title,
.page-feature.convert span.icon {
  color: #36a2eb;
}

.page-feature.validate .title strong,
.page-feature.validate span.icon {
  color: #4bc0c0;
}

.page-feature.publish .title strong,
.page-feature.publish span.icon {
  color: #ffce56;
}

.page-feature.maintain .title strong,
.page-feature.maintain span.icon {
  color: #fe7190;
}

.page-feature:hover {
  background-color: #f9f9f9;
  border-color: #f5f5f5;
  border-radius: 5px;
}
</style>
