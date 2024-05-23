<template>
  <div class="min-h-svh flex flex-col">
    <app-nav class="mt-1" />
    <app-sidebar class="z-50" />
    <cart-sidebar-card class="z-50" />

    <main class="grow mx-auto pa-3 w-11/12 md:w-vw-70">
      <slot />
    </main>

    <app-footer class="mx-auto w-full" />
    <!-- notification -->
    <Toaster />
  </div>
</template>
