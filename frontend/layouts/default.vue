<template>
  <v-app>
    <!-- navigation -->
    <app-nav />
    <app-sidebar />
    <cart-sidebar-card />

    <!-- main content -->
    <v-main id="main-container">
      <v-container>
        <v-row justify="center">
          <v-col
            cols="11"
            md="10"
          >
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- footer -->
    <app-footer />

    <!-- notification -->
    <Toaster />
  </v-app>
</template>

<style scoped>
#main-container{
  min-height: 90vh;
}
</style>