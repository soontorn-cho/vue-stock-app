<script setup lang="ts">

    import { ref, watchEffect } from 'vue'
    import { getAllProducts } from '@/services/BackendService'

    // -------- ส่วนของการดึงข้อมูลมาแสดง ----------
    const products: any = ref([])

    // Pagination
    const page = ref(1)
    const rowsPerPage = ref(20)
    const totalItems = ref(0)

    // เรียกใช้งานฟังก์ชัน getAllProducts จาก BackendService
    const fetchProducts = async () => {
        const res = await getAllProducts(page.value, rowsPerPage.value)
        products.value = res.data.products
        totalItems.value = res.data.total
        console.log(res.data)
    }

    // Watch for changes and fetch products
    watchEffect(() => {
        fetchProducts()
    })

    // Method to format the date 28/02/2022 12:00:00
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        const formattedDate = date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
        return formattedDate
    }

</script>

<template>
    
    <div class="flex items-center justify-between my-8">
        <h2 class="my-6 text-sm font-semibold text-gray-700 md:text-xl dark:text-gray-200">
            Product list ({{ totalItems }} items)
        </h2>

        <div class="flex justify-center flex-1 lg:mr-32">
            <div class="relative w-full max-w-xl ml-4 mr-6 focus-within:text-gray-500">
                <div class="absolute inset-y-0 flex items-center pl-2">
                    <svg
                    class="w-4 h-4"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"></path>
                    </svg>
                </div>
                <form>
                    <input
                        class="w-full py-2 pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-200 border-0 rounded-md"
                        type="text"
                        placeholder="ป้อนชื่อสินค้าที่ต้องการค้นหา"
                        aria-label="Search"
                    />
                    <button type="submit" class="hidden">Submit</button>
                </form>
            </div>

            <div>
                <button class="flex items-center justify-between px-4 py-1.5 mx-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-yellow-500 border border-transparent rounded-lg active:bg-purple-600 hover:bg-yellow-700 focus:outline-none focus:shadow-outline-purple">
                    <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>ล้าง</span>
                </button>
            </div>
        </div>

        <button class="flex items-center justify-between px-4 py-2 mx-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-500 border border-transparent rounded-lg active:bg-purple-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-purple">
            <svg class="w-4 h-4 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>เพิ่ม</span>
        </button>
    </div>

    <!-- Pagination Controls -->
    <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800 mb-2">
        <span class="flex items-center col-span-3">
            Showing {{ (page - 1) * rowsPerPage + 1 }}-{{ Math.min(page * rowsPerPage, totalItems) }} of {{ totalItems }}
        </span>
        <span class="col-span-2"></span>
        <!-- Pagination -->
        <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
            <nav aria-label="Table navigation">
                <ul class="inline-flex items-center">
                    <li>
                        <button @click="page--" :disabled="page === 1"
                            class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                            aria-label="Previous">
                            <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                            </svg>
                        </button>
                    </li>
                    <li v-for="p in Math.ceil(totalItems / rowsPerPage)" :key="p">
                        <button @click="page = p" :class="{'bg-purple-600 text-white': page === p}"
                            class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                            {{ p }}
                        </button>
                    </li>
                    <li>
                        <button @click="page++" :disabled="page === Math.ceil(totalItems / rowsPerPage)"
                            class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                            aria-label="Next">
                            <svg class="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </span>
    </div>

    <!-- ตารางแสดงสินค้า -->
    <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="w-full overflow-x-auto">
            <table class="w-full whitespace-no-wrap">
                <thead>
                    <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                        <th class="px-4 py-3">ID</th>
                        <th class="px-4 py-3">Name</th>
                        <th class="px-4 py-3">Price</th>
                        <th class="px-4 py-3">Category</th>
                        <th class="px-4 py-3">Create at</th>
                        <th class="px-4 py-3">Create by</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    
                    <tr v-for="product in products" :key="product.id" class="text-gray-700 dark:text-gray-400 hover:bg-blue-100">
                        <td class="px-4 py-3 text-sm">{{ product.id }}</td>
                        <td class="px-4 py-3">
                            <div class="flex items-center text-sm">
                                <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                    <img class="object-cover w-full h-full rounded-full" src="https://geniusdevlab.com/laravelstoreapp/public/uploads/noimg.jpg" alt="" loading="lazy"/>
                                    <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                                </div>
                                <div>
                                    <p class="font-semibold">{{ product.name }}</p>
                                    <p class="text-xs text-gray-600 dark:text-gray-400">Created {{ formatDate(product.created_at) }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-sm">{{ product.price }}</td>
                        <td class="px-4 py-3 text-sm">{{ product.category_name }}</td>
                        <td class="px-4 py-3 text-sm">{{ formatDate(product.created_at) }}</td>
                        <td class="px-4 py-3 text-sm">{{ product.user_fullname }}</td>                        
                    </tr>

                </tbody>
            </table>            
        </div>
    </div>

    <!-- Pagination Controls -->
    <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800 mb-2">
        <span class="flex items-center col-span-3">
            Showing {{ (page - 1) * rowsPerPage + 1 }}-{{ Math.min(page * rowsPerPage, totalItems) }} of {{ totalItems }}
        </span>
        <span class="col-span-2"></span>
        <!-- Pagination -->
        <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
            <nav aria-label="Table navigation">
                <ul class="inline-flex items-center">
                    <li>
                        <button @click="page--" :disabled="page === 1"
                            class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                            aria-label="Previous">
                            <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                            </svg>
                        </button>
                    </li>
                    <li v-for="p in Math.ceil(totalItems / rowsPerPage)" :key="p">
                        <button @click="page = p" :class="{'bg-purple-600 text-white': page === p}"
                            class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                            {{ p }}
                        </button>
                    </li>
                    <li>
                        <button @click="page++" :disabled="page === Math.ceil(totalItems / rowsPerPage)"
                            class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                            aria-label="Next">
                            <svg class="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </span>
    </div>

</template>

<style scoped>

</style>