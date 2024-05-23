<script setup lang="ts">
import type { Image } from '~/types';

const props = defineProps({
	images: {
		type: Array as PropType<Image[]>,
		required: true,
	},
	mode: {
		type: String as PropType<'list' | 'click'>,
		default: 'list'
	},
});

type CarouselItem = Image & { id: string };
const items = computed<CarouselItem[]>(() => {
	return props.images.map((image, index) => {
		return {
			...image,
			id: `item${index + 1}`
		};
	});
});

const getCarouselStyle = computed<string>(() => {
	let style = "carousel-item w-full";

	if (props.mode === 'click') {
		style += " relative";
	}

	return style;
});

</script>

<template>
  <div class="flex flex-col justify-center">
    <div class="carousel w-full">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        :id="item.id"
        :class="getCarouselStyle"
      >
        <base-image
          :src="item.src"
          :alt="item.alt"
        />

        <div
          v-if="props.mode === 'click'"
          class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 text-slate-50 text-lg font-bold"
        >
          <a :href="`#${index !== 0 ? items[index - 1].id : item.id}`">
            <span class="i-mdi-arrow-left" />
          </a> 
          <a :href="`#${index < items.length - 1 ? items[index + 1].id : item.id}`">
            <span class="i-mdi-arrow-right" />
          </a>
        </div>
      </div> 
    </div> 
    <div
      v-if="props.mode === 'list'"
      class="flex justify-center w-full py-2 gap-2"
    >
      <a
        v-for="(item, index) in items"
        :key="item.id"
        :href="`#${item.id}`"
        class="outline outline-1 p-1 text-xs rounded-badge"
      >{{ index + 1 }}</a>
    </div>
  </div>
</template>