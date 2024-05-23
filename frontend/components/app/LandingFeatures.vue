<script setup lang="ts">
type Feature = {
	title: string;
	description: string;
	image?: { src: string; alt: string };
};

const features = computed<Feature[]>(() => [
	{
		title: "Low Waste Footprint",
		description:
			"Using recycled materials means less consumption of new materials. This also means less energy is used to produce new materials and less waste in landfills.",
		image: {
			src: getRandomImage(),
			alt: "Random image",
		},
	},
	{
		title: "High Quality Chairs",
		description:
			"Our recycled chairs are made from the highest quality materials. We take pride in our products and we know you will too.",
		image: {
			src: getRandomImage(),
			alt: "Random image",
		},
	},
	{
		title: "Competitive Pricing",
		description:
			"We offer the most competitive pricing on the market. We know you will be satisfied with our prices.",
		image: {
			src: getRandomImage(),
			alt: "Random image",
		},
	},
	{
		title: "Free Shipping",
		description:
			"We offer free shipping on all orders over $100. We know you will be satisfied with our prices.",
		image: {
			src: getRandomImage(),
			alt: "Random image",
		},
	},
	{
		title: "Free Returns",
		description:
			"We offer free returns on all orders. We know you will be satisfied with our prices.",
		image: {
			src: getRandomImage(),
			alt: "Random image",
		},
	},
]);

function getRandomImage(): string {
	const seed = Math.floor(Math.random() * 1000);
	return `https://picsum.photos/seed/${seed}/800/600`;
}
</script>

<template>
  <div
    id="landing-features"
    class="flex flex-col gap-2"
  >
    <h2 class="text-2xl font-semibold">
      Why Choose Us?
    </h2>

    <div class="flex flex-col md:grid md:grid-cols-2 gap-5">
      <base-card
        v-for="feature in features"
        :key="feature.title"
        class="mt-2"
      >
        <template #header>
          <div class="flex flex-col gap-2 md:min-h-24 md:max-h-32">
            <h3 class="text-xl">
              {{ feature.title }}
            </h3>
            <h4>{{ feature.description }}</h4>
          </div>
        </template>
        
        <div
          v-if="feature.image?.src"
          class="min-h-24"
        >
          <base-image
            :src="feature.image?.src"
            :alt="feature.image?.alt"
          />
        </div>
      </base-card>
    </div>
  </div>
</template>
