<script setup lang="ts">
import { useNavigationStore, useSidebarStore } from "~/stores/app";
import { useAuthStore } from "~/stores/auth";
import { useOrderStore } from "~/stores/shop";

const auth = useAuthStore();
const drawer = useSidebarStore();
const navigation = useNavigationStore();
const order = useOrderStore();
</script>

<template>
  <div class="flex flex-row gap-10 md:gap-0 md:mx-20 text-lg">
    <base-btn
      class="flex place-items-center text-3xl mr-10 lg:hidden"
      color="bg-transparent"
      @click="drawer.toggle"
    >
      <span class="i-mdi-menu" />
    </base-btn>

    <router-link
      class="grow md:grow-0 self-center justify-center md:mr-auto"
      to="/"
    >
      <app-logo />
    </router-link>

    <base-btn
      v-for="option in navigation.options"
      :key="option.label"
      :class="`mr-4 place-content-end hidden lg:block hover:underline`"
      color="bg-transparent"
      :to="option.to"
      @click="option.action"
    >
      {{ option.label }}
    </base-btn>

    <cart-btn
      v-if="order.totalCartItems > 0"
      class="mr-2 hidden lg:block"
    />

    <app-admin-menu
      v-if="auth.isAuthenticated"
      class="mr-2 hidden lg:block"
    />
  </div>
</template>
