<script setup lang="ts">

function goToDashboard() {
	const router = useRouter();
	router.push('/');
}

</script>

<template>
  <base-page title="Login">
    <div class="flex flex-col gap-4">
      <AuthForm
        mode="login"
        @authenticated="goToDashboard()"
      />

      <p>
        Don't have an account? Register <nuxt-link
          class="font-bold hover:underline"
          to="/auth/register"
        >
          here
        </nuxt-link>.
      </p>
    </div>
  </base-page>
</template>
