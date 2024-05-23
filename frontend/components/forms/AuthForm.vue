<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import type { User } from "~/types";

type AuthMode = "login" | "register";

interface AuthForm {
	username: string;
	password: string;
	passwordConfirmation?: string;
}

const props = defineProps({
	mode: {
		type: String as PropType<AuthMode>,
		default: "login",
	},
});

const emit = defineEmits(["authenticated"]);

const { notify } = useNotification();
const { login, register } = useAuthStore();

const form = reactive<AuthForm>({
	username: "",
	password: "",
	passwordConfirmation: "",
});

const validUsername = computed<boolean>(() => form.username.length > 0);
const validPassword = computed<boolean>(() => form.password.length > 0);
const validPasswordConfirmation = computed<boolean>(
	() =>
		form.passwordConfirmation !== undefined &&
		form.passwordConfirmation.length > 0 &&
		form.passwordConfirmation === form.password
);

const validForm = computed<boolean>(() => {
	if (props.mode === "login") {
		return validUsername.value === true && validPassword.value === true;
	} else {
		return (
			validUsername.value === true && validPasswordConfirmation.value === true
		);
	}
});

async function authenticate() {
	try {
		let user: User;
		if (props.mode === "login") {
			user = await login(form.username, form.password);
		} else {
			user = await register(form.username, form.password);
		}

		if (user) {
			emit("authenticated", user);
		}
	} catch (error) {
		notify("Authentication", (error as Error).message, "error");
	}
}
</script>

<template>
  <base-form>
    <input-text
      v-model="form.username"
      label="Username"
    />
    <input-text
      v-model="form.password"
      type="password"
      label="Password"
    />
    <input-text
      v-if="props.mode === 'register'"
      v-model="form.passwordConfirmation"
      type="password"
      label="Password Confirmation"
    />

    <template #action>
      <div class="mt-2 flex">
        <base-btn
          class="w-full"
          :disabled="!validForm"
          @click="authenticate()"
        >
          {{ props.mode === "login" ? "Login" : "Register" }}
        </base-btn>
      </div>
    </template>
  </base-form>
</template>
