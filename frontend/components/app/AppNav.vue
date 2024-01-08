<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { useNavigationStore, useSidebarStore } from '~/stores/app';
import { useAuthStore } from '~/stores/auth';
import { useOrderStore } from '~/stores/shop';
import type { ActionItem } from '~/components/base/BaseCard.vue';

const { smAndDown } = useDisplay();
const auth = useAuthStore();
const drawer = useSidebarStore();
const navigation = useNavigationStore();
const order = useOrderStore();

const options = computed<ActionItem[]>(() => smAndDown.value ? [] : navigation.options);
</script>

<template>
  <v-app-bar
    id="app-nav"
    app
    flat
    color="transparent"
  >
    <v-app-bar-nav-icon
      v-if="smAndDown"
      @click="drawer.toggle"
    />

    <router-link
      class="plain"
      to="/"
    >
      <app-logo />
    </router-link>

    <v-spacer />

    <base-btn
      v-for="option in options"
      :key="option.label"
      class="mx-1 plain"
      :color="option.color"
      :to="option.to"
      @click="option.action"
    >
      {{ option.label }}
    </base-btn>

    <cart-btn
      v-if="!smAndDown && order.totalCartItems > 0"
      class="mx-1"
    />

    <app-admin-menu
      v-if="!smAndDown && auth.isAuthenticated"
      class="mx-1"
    />
  </v-app-bar>
</template>

<style scoped>
@media (min-width: 600px) {
	#app-nav {
		padding: 0 2rem;
	}
}
</style>
