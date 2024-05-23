<script setup lang="ts">

function goToDashboard() {
	const router = useRouter();
	router.push('/');
}
</script>

<template>
  <base-page title="Register">
    <div class="flex flex-col gap-4">
      <AuthForm
        mode="register"
        @authenticated="goToDashboard()"
      />

      <p>
        Don't have an account? Login <nuxt-link
          class="font-bold hover:underline"
          to="/auth/login"
        >
          here
        </nuxt-link>.
      </p>
    </div>
  </base-page>
</template>
