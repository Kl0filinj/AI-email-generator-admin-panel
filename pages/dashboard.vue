<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang='ts'>
import type { DropdownMenuItem } from '@nuxt/ui';
import type { FileEntity } from '~/types';

definePageMeta({
  middleware: ['protected'],
});

const toast = useToast()
const authStore = useAuthStore();

  // const files = ref<FileEntity[]>([])
  const selectedFile = ref(null)
const isUploading = ref(false)

const allowedExtensions = ['.xlsx', '.xlsm', '.xlsb', '.xls'];
const isFileHaveAcceptedFormat = (file: FileEntity) => allowedExtensions.includes(file.name.slice(file.name.lastIndexOf('.')).toLowerCase())
const getFileDropdownItems = (file: FileEntity): DropdownMenuItem[] => {
    return [
  {
    label: 'Download',
    color: 'primary',
    icon: 'solar:download-minimalistic-outline',
    onSelect() {
        downloadFile(file.name)
      },
  },
  {
    label: 'Delete',
    color: 'error',
    icon: 'solar:trash-bin-2-bold',
    onSelect() {
        deleteFile(file.name)
      },
    }
  ]
  }

  const { $afetch } = useNuxtApp();

  
  // onMounted(async () => {
  //   try {
  //     const storedFiles = await $afetch<any>(useUrl().files(), { method: 'GET' });
  //     console.log('@@ storedFiles : ', storedFiles)
  //     files.value = [...storedFiles]
  //   } catch (error) {
  //     toast.add({
  //       title: 'Error',
  //       description: 'Failed to load files',
  //       color: 'error'
  //     })
  //   }
// })

const { data: files, refresh } = await useAsyncData('getUsers', async () => {
    // isLoading.value = true
    const storedFiles = await $afetch<FileEntity[]>(useUrl().files(), {
      method: 'get',
      ignoreResponseError: true
    })
    // isLoading.value = false
    return storedFiles
  },
    {
      default: (): any[] => [],
      transform: (files) => files.filter(item => isFileHaveAcceptedFormat(item)),
      // watch: [currentPage, pageSize, appliedSearchTerm]
    }
)
  
const handleFileUpload = (event: any) => {
  const input = event.target;
  if (!input.files?.length) {
    return
  }

  if (input.files.length > 1) {
    toast.add({
        title: 'Error',
        description: 'You are allowed to upload only 1 file',
        color: 'error'
    })
    input.value = "";
    return
  }

  const file = input.files[0]

  if (!isFileHaveAcceptedFormat(file)) {
    toast.add({
        title: 'Error',
        description: `File ${file.name} have unacceptable type`,
        color: 'error'
    })
    input.value = "";
    return
  }

    selectedFile.value = file
    return
  }
  
  const uploadFile = async () => {
    if (!selectedFile.value) {
      toast.add({
        title: 'Error',
        description: 'Please select a file first',
        color: 'error'
      })
      return
    }
  
    isUploading.value = true
    const formData = new FormData()
    formData.append('file', selectedFile.value)
  
    try {
      const uploadFilesResp = await $afetch<FileEntity>(useUrl().files(), { method: 'POST', body: formData });
      files.value.push({
        name: uploadFilesResp.name,
        size: uploadFilesResp.size
      })
  
      toast.add({
        title: 'Success',
        description: 'File uploaded successfully',
        color: "success"
      })
      
      selectedFile.value = null
    } catch (error: any) {
      toast.add({
        title: 'Error',
        description: error.message || 'Failed to upload file',
        color: 'error'
      })
    } finally {
      isUploading.value = false
    }
  }
  
  const deleteFile = async (name: string) => {
    try {
      await $afetch(useUrl().files(name), { method: 'DELETE' });
      files.value = [...files.value.filter(file => file.name !== name)]
      
      toast.add({
        title: 'Success',
        description: 'File deleted successfully',
        color: "primary"
      })
    } catch (error: any) {
      toast.add({
        title: 'Error',
        description: error.message ||  'Failed to delete file',
        color: 'error'
      })
    }
  }
  
const downloadFile = async (name: string) => {
    try {
      const response = await $afetch<Blob>(useUrl().files(name), { method: 'GET', responseType: 'blob' });

      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.log('@@ ERROR: ', {error})
      toast.add({
        title: 'Error',
        description: error.message || 'Failed to download file',
        color: 'error'
      })
    }
  }
  
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
</script>

<template>
    <UContainer class="mt-12">
    <div class="flex justify-end mb-6 px-0">
      <UButton size="xl" color="error" trailing-icon="i-lucide-arrow-right" @click="authStore.signOut">Sign Out</UButton>
    </div>
      <UCard class="mb-6">
        <template #header>
          <h2 class="text-xl font-semibold">Upload New File</h2>
        </template>
        
        <div class="flex items-center gap-4">
          <UInput
            type="file"
            variant="outline"
            color="primary"
            class="flex-1"
            @change="handleFileUpload"
          />
          <UButton
            :loading="isUploading"
            color="primary"
            @click="uploadFile"
          >
            Start
          </UButton>
        </div>
      </UCard>
  
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Your Files</h2>
        </template>
  
        <UAlert
          v-if="files.length === 0"
          color="neutral"
          variant="subtle"
          title="No files yet"
          description="Upload your first file to get started"
        />
  
        <div v-else class="space-y-4">
          <div
            v-for="file in files"
            :key="file.name"
            class="flex items-center justify-between p-3 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-document" class="w-6 h-6" />
              <div>
                <p class="font-medium">{{ file.name }}</p>
                <p class="text-sm text-gray-500">{{ formatSize(file.size) }}</p>
              </div>
            </div>

            <UDropdownMenu :items="getFileDropdownItems(file)" size="xl">
                <UButton color='primary' variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
            </UDropdownMenu>
          </div>
        </div>
      </UCard>
    </UContainer>
</template>