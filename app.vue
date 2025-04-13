<script setup lang="ts">
import { NuxtLoadingIndicator } from '#components';

</script>

<template>
  <UApp :toaster='{ position: "top-right", duration: 10000 }'>
    <NuxtLoadingIndicator/>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
  </UApp>
</template>
