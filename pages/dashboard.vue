<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup>
  const toast = useToast()
  const files = ref([]) // Array of {name: string, size: number}
  const selectedFile = ref(null)
  const isUploading = ref(false)
  
  // Fetch initial files when page loads
  onMounted(async () => {
    try {
      const response = await $fetch('/api/files') // Assuming this endpoint exists
      files.value = response
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to load files',
        color: 'red'
      })
    }
  })
  
  const handleFileUpload = (event) => {
    selectedFile.value = event.target.files[0]
  }
  
  const uploadFile = async () => {
    if (!selectedFile.value) {
      toast.add({
        title: 'Error',
        description: 'Please select a file first',
        color: 'red'
      })
      return
    }
  
    isUploading.value = true
    const formData = new FormData()
    formData.append('file', selectedFile.value)
  
    try {
      const response = await $fetch('/api/new', {
        method: 'POST',
        body: formData
      })
  
      files.value.push({
        name: response.name,
        size: selectedFile.value.size
      })
  
      toast.add({
        title: 'Success',
        description: 'File uploaded successfully',
        color: 'green'
      })
      
      selectedFile.value = null // Reset file input
    } catch (error) {
      toast.add({
        title: 'Error',
        description: error.message || 'Failed to upload file',
        color: 'red'
      })
    } finally {
      isUploading.value = false
    }
  }
  
  const deleteFile = async (name) => {
    try {
      await $fetch(`/api/file/${name}`, {
        method: 'DELETE'
      })
  
      files.value = files.value.filter(file => file.name !== name)
      
      toast.add({
        title: 'Success',
        description: 'File deleted successfully',
        color: 'green'
      })
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to delete file',
        color: 'red'
      })
    }
  }
  
  const downloadFile = async (name) => {
    try {
      const response = await $fetch(`/api/file/${name}`, {
        method: 'GET'
      })
      
      // Assuming the response is a blob or URL
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to download file',
        color: 'red'
      })
    }
  }
  
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
</script>

<template>
    <UContainer>
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
            Upload
          </UButton>
        </div>
      </UCard>
  
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Your Files</h2>
        </template>
  
        <UAlert
          v-if="files.length === 0"
          color="gray"
          variant="subtle"
          title="No files yet"
          description="Upload your first file to get started"
        />
  
        <div v-else class="space-y-4">
          <div
            v-for="file in files"
            :key="file.name"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-document" class="w-6 h-6" />
              <div>
                <p class="font-medium">{{ file.name }}</p>
                <p class="text-sm text-gray-500">{{ formatSize(file.size) }}</p>
              </div>
            </div>
  
            <UPopover :popper="{ placement: 'bottom-end' }">
              <UButton
                variant="ghost"
                color="gray"
                icon="i-heroicons-ellipsis-vertical"
              />
              
              <template #panel>
                <div class="p-2 flex flex-col gap-1">
                  <UButton
                    size="sm"
                    variant="ghost"
                    icon="i-heroicons-arrow-down-tray"
                    label="Download"
                    @click="downloadFile(file.name)"
                  />
                  <UButton
                    size="sm"
                    variant="ghost"
                    color="red"
                    icon="i-heroicons-trash"
                    label="Delete"
                    @click="deleteFile(file.name)"
                  />
                </div>
              </template>
            </UPopover>
          </div>
        </div>
      </UCard>
    </UContainer>
</template>