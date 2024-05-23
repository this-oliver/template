<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import type { User, ActionItem } from "~/types";

const props = defineProps({
	user: {
		type: Object as PropType<User>,
		required: true,
	},
});

const emit = defineEmits(["updated"]);

const authStore = useAuthStore();
const { notify } = useNotification();

// user with password confirmation and without _id
type UserForm = Omit<User, "password" | "_id"> & {
	password: string;
	passwordConfirmation: string;
	oldPassword: string;
};

const form = reactive<UserForm>({
	username: props.user?.username || "",
	password: "",
	passwordConfirmation: "",
	oldPassword: "",
});

const validForm = computed<boolean>(() => {
	// if password is empty, we don't want to validate it
	if (form.password.length === 0) {
		return form.username.length > 0;
	}

	return (
		form.username.length > 0 &&
		form.password.length > 0 &&
		form.password === form.passwordConfirmation &&
		form.oldPassword.length > 0
	);
});

const options = computed<ActionItem[]>(() => {
	return [
		{
			label: "Update",
			disabled: !validForm.value,
			color: validForm.value ? "bg-success" : undefined,
			hint: 'hint hint',
			action: async () => {
				try {
					const user: User = await updateUser();
					emit("updated", user);
				} catch (error) {
					notify("User Error", (error as Error).message, "error");
				}
			},
		},
	];
});

async function updateUser(): Promise<User> {
	let user: User | undefined;

	// update username if it has changed
	if (form.username !== props.user.username) {
		user = await authStore.updateUser(props.user._id, { username: form.username, });
	}

	// update password if it exists
	else if (form.password.length > 0) {
		user = await authStore.updateUserPassword(props.user._id, {
			oldPassword: form.oldPassword,
			newPassword: form.password,
		});
	}

	if (!user) {
		throw new Error("No changes were made");
	}

	return user;
}
</script>

<template>
  <base-form :actions="options">
    <input-text
      v-model="form.username"
      label="Username"
    />
    <input-text
      v-model="form.oldPassword"
      type="password"
      label="Old Password"
    />
    <input-text
      v-model="form.password"
      type="password"
      label="Password"
    />
    <input-text
      v-model="form.passwordConfirmation"
      type="password"
      label="Confirm password"
    />
  </base-form>
</template>
