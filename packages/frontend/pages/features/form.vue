<script setup lang="ts">
useSeoSetup({ title: "Forms" });

const editor = ref<string>("hey");
const textInput = ref<string>("");
const passwordInput = ref<string>("");
const dateInput = ref<string>("");
const timeInput = ref<string>("");
const filesInput = ref<File[]>([]);
const multipleFiles = ref<boolean>(false);
</script>

<template>
  <base-page title="Forms">
    <div class="flex flex-col md:grid md:grid-cols-2 mx-auto gap-4">
      <div class="md:col-span-2 bg-slate-50 p-2">
        <h3 class="font-semibold">
          Text Editor
        </h3>
        <input-editor
          v-model="editor"
          label="Enter text"
        />

        <h4>Output</h4>
        <div class="p-3 bg-slate-100">
          <p>{{ editor }}</p>
        </div>
      </div>

      <div class="bg-slate-50 p-2">
        <h3 class="font-semibold">
          Text Input
        </h3>
        <input-text
          v-model="textInput"
          label="Enter text"
          place-holder="This is a placeholder"
        />
      </div>

      <div class="bg-slate-50 p-2">
        <h3 class="font-semibold">
          Password Input
        </h3>
        <input-text
          v-model="passwordInput"
          label="Enter password"
          place-holder="This is a placeholder"
          type="password"
        />
      </div>

      <div class="bg-slate-50 p-2">
        <h3 class="font-semibold">
          Date Input
        </h3>
        <input-text
          v-model="dateInput"
          label="Enter a date"
          type="date"
        />
      </div>

      <div class="bg-slate-50 p-2">
        <h3 class="font-semibold">
          Time Input
        </h3>
        <input-text
          v-model="timeInput"
          label="Enter a time"
          type="time"
        />
      </div>

      <div class="bg-slate-50 p-2 flex flex-col gap-2">
        <h3 class="font-semibold">
          File Upload
        </h3>

        <input-text
          v-model="filesInput"
          label="Upload a file"
          type="file"
          :multiple="multipleFiles"
          class="grow self-start"
        />

        <div class="flex gap-2">
          <span class="text-sm">Multiple files?</span>
          <input
            v-model="multipleFiles"
            type="checkbox"
          >
        </div>
      </div>
    </div>
  </base-page>
</template>
