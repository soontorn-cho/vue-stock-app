<script setup lang="ts">
    import Navbar from '@/components/backend/Navbar.vue'
    import Sidebar from '@/components/backend/Sidebar.vue'
</script>

<template>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div class="flex flex-col flex-1 w-full">
            <Navbar />
            <main class="h-full overflow-y-auto">
                 <div class="container grid px-6 mx-auto">
                    <router-view></router-view>
                 </div>
            </main>
        </div>
    </div>
</template>