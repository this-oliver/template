<script setup lang="ts">
import { useNavigationStore, useSidebarStore } from "~/stores/app";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const drawer = useSidebarStore();
const navigation = useNavigationStore();
</script>

<template>
  <base-sidebar
    id="app-sidebar"
    :visible="drawer.visible"
    @close="drawer.visible = false"
  >
    <div class="flex flex-col h-4/5 gap-4 items-center place-content-center">
      <div
        v-for="option in navigation.options"
        :key="option.label"
        class="flex text-4xl font-semibold first:mt-0 my-2"
      >
        <base-btn
          class="grow"
          color="bg-transparent"
          :to="option.to"
          @click="
            option.action;
            drawer.visible = false;
          "
        >
          {{ option.label }}
        </base-btn>
      </div>

      <app-admin-menu
        v-if="auth.isAuthenticated"
        :sidebar="true"
        class="text-4xl font-semibold"
      />
    </div>
  </base-sidebar>
</template>
