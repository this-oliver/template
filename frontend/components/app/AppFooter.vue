<script setup lang="ts">
type Link = {label: string, url: string};
const internalLinks: Link[] = [
	{ label: 'Features', url: '/features' }
];
const externalLinks: Link[] = [
	{ label: 'GitHub', url: 'https://github.com/this-oliver/template' }
];
</script>

<template>
  <v-footer
    id="app-footer"
    app
  >
    <div>
      <nuxt-link
        v-for="link in internalLinks"
        :key="link.url"
        :to="link.url"
        class="mx-1"
      >
        {{ link.label }}
      </nuxt-link>
      <a
        v-for="link in externalLinks"
        :key="link.url"
        :href="link.url"
        target="_blank"
        class="mx-1"
      >
        {{ link.label }}
      </a>
    </div>

    <div>
      template made by <a
        href="www.oliverrr.net"
        target="_blank"
      >oliverrr 🤠</a>
    </div>
  </v-footer>
</template>

<style scoped>
#app-footer {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 600px) {
  #app-footer {
    flex-direction: column;
  }
}
</style>
