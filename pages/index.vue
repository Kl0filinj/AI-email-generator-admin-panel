<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import Joi from 'joi'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['guest'],
});

const loginSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string()
        .min(8)
        .required()
})

const authStore = useAuthStore()
const router = useRouter()

const loginState = reactive({
    login: 'ordr[jQ%uWy7S%]^',
    password: '9rvQdxg2g{z]$$3@'
})
const loading = ref(false)
const error = ref('')

async function onSubmit(event: FormSubmitEvent<any>) {
    loading.value = true
    error.value = ''

  try {
    const success = await authStore.login(loginState.login, loginState.password)

    if (success) {
      router.push('/dashboard')
    } else {
      error.value = 'Invalid credentials'
    }
  } catch (e) {
    error.value = 'An error occurred'
  } finally {
    loading.value = false
  }
}

</script>

<template>
    <div class="flex items-center justify-center min-h-screen">
        <div class="w-full max-w-md p-6 bg-blue-500 rounded-lg shadow-md">

            <h1 class="text-5xl font-bold mb-4 text-center">Login page</h1>
            <UForm :schema="loginSchema" :state="loginState" class="space-y-4" @submit="onSubmit">
                <UFormField label="Login" name="login" class="text-xl" size="xl">
                    <UInput v-model="loginState.login" class="w-full" />
                </UFormField>

                <UFormField label="Password" name="password" class="text-xl" size="xl">
                    <UInput v-model="loginState.password" type="password" class="w-full" />
                </UFormField>

                <UButton :loading="loading" type="submit" class="w-full flex items-center justify-center text-xl font-bold">
                    Log in
                </UButton>
                <p v-if="error" color="error">{{error}}</p>
            </UForm>

        </div>
    </div>
</template>