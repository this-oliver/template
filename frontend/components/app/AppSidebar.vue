<script setup lang="ts">
import { useNavigationStore } from '~/stores/app';
import { useSidebarStore } from '~/stores/app';
import { useAuthStore } from '~/stores/auth';
import type { ActionItem } from '~/components/base/BaseCard.vue';

const auth = useAuthStore();
const drawer = useSidebarStore();
const navigation = useNavigationStore();

function getOptionColor (option: ActionItem): string {
	return option.color ? `text-${option.color}` : '';
}
</script>

<template>
  <v-dialog
    v-model="drawer.visible"
    fullscreen
  >
    <v-sheet>
      <v-toolbar color="transparent">
        <base-btn
          size="large"
          @click="drawer.visible = false"
        >
          <v-icon size="x-large">
            mdi-close
          </v-icon>
        </base-btn>
      </v-toolbar>

      <v-row
        class="mt-2"
        justify="center"
      >
        <v-col
          v-for="option in navigation.options"
          :key="option.label"
          cols="8"
        >
          <div :class="`sidebar-item ${getOptionColor(option)}`">
            <v-icon
              v-if="option.icon"
              style="margin-right: 1rem"
              :icon="option.icon"
            />
            <base-btn
              text
              :to="option.to"
              :color="option.color"
              @click="
                option.action;
                drawer.visible = false;
              "
            >
              <h2 class="sidebar-items">
                {{ option.label }}
              </h2>
            </base-btn>
          </div>
        </v-col>

        <v-col
          v-if="auth.isAuthenticated"
          cols="8"
        >
          <app-admin-menu
            v-if="auth.isAuthenticated"
            class="sidebar-item"
          />
        </v-col>
      </v-row>
    </v-sheet>
  </v-dialog>
</template>

<style scoped>
.sidebar-item {
	font-size: x-large;
}
</style>
