<script setup lang="ts">
import { NuxtLoadingIndicator } from '#components';

</script>

<template>
  <UApp>
    <NuxtLoadingIndicator/>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
  </UApp>
</template>
