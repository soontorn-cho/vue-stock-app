<script setup lang="ts">

import { ref } from 'vue';

// Import VueValidates
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, helpers } from '@vuelidate/validators'

// Import SweetAlert2
import Swal from 'sweetalert2'

// Import AuthServices
import { login  } from '@/services/AuthService'

// สร้างตัวแปร loading เพื่อใช้ในการแสดง Loading
const loading = ref(false)

// กำหนดค่าเริ่มต้น
const formData = ref({
  email: '',
  password: ''
})

// กำหนดกฎการตรวจสอบข้อมูล
const rules = {
  email: {
    required: helpers.withMessage('กรุณากรอกอีเมล์', required),
    email: helpers.withMessage('กรุณากรอกอีเมล์ให้ถูกต้อง', email)
  },
  password: {
    required: helpers.withMessage('กรุณากรอกรหัสผ่าน', required),
    minLength: helpers.withMessage('กรุณากรอกรหัสผ่านอย่างน้อย 6 ตัวอักษร', minLength(6))
  }
}

// กำหนดค่าเริ่มต้นให้กับ Vuelidate
const v$ = useVuelidate(rules, formData)

// ฟังก์ชันสำหรับการส่งข้อมูล
const handleSubmit = () => {

    v$.value.$touch()

    // ตรวจสอบข้อมูลถูกต้อง
    if (!v$.value.$error) {

        // แสดง Loading
        loading.value = true

        // แสดงข้อมูลที่กรอก
        console.log(formData.value)

        // ส่งข้อมูลไปยัง API
        login(
            formData.value.email,
            formData.value.password
        ).then(response => {

            // ปิด Loading
            loading.value = false

            // ถ้าเข้าสู่ระบบสำเร็จ
            if(response.data.status === true){
                
                let timerInterval:unknown = 0
                Swal.fire({
                    title: 'เข้าสู่ระบบสำเร็จ',
                    icon: 'success',
                    html: 'กำลังเข้าสู่หน้า dashboard ใน <b></b> วินาที.',
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        const b = Swal.getHtmlContainer()!.querySelector('b')
                        timerInterval = setInterval(() => {
                        b!.textContent = Swal.getTimerLeft() as unknown as string
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval as number)
                    }
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        
                        // ส่งไปหน้า dashboard
                        // บันทึกข้อมูลลง LocalStorage
                        localStorage.setItem('user', JSON.stringify(response.data.user))
                        localStorage.setItem('token', response.data.token)
                        
                        // ส่งไปหน้า Profile
                        window.location.href = '/backend/dashboard'
                    }
                })   

            } else {
                loading.value = false
                Swal.fire(
                    'เข้าสู่ระบบไม่สำเร็จ',
                    'กรุณาตรวจสอบข้อมูลให้ถูกต้อง',
                    'error'
                )
            }

        }).catch(error => {
            console.log(error)
            loading.value = false
            Swal.fire(
                'เข้าสู่ระบบไม่สำเร็จ',
                'กรุณาตรวจสอบข้อมูลให้ถูกต้อง',
                'error'
            )
        })

    }

}

</script>

<template>
    <div class="flex items-center min-h-screen p-6 pt-32 bg-gray-50 dark:bg-gray-900">
        <div class="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <div class="flex flex-col overflow-y-auto md:flex-row">
                <div class="h-32 md:h-full md:w-1/2">
                    <img aria-hidden="true"
                        class="object-cover w-full h-full dark:block"
                        src="@/assets/img/login-office.webp"
                        alt="Office" />
                </div>

                <div class="flex items-center justify-center p-6 sm:p-12 md:w-1/2">

                    <div class="w-full">

                        <h1 class="mb-4 text-xl font-semibold dark:text-gray-200">เข้าสู่ระบบ</h1>

                        <form @submit.prevent="handleSubmit">

                            <!-- Email -->
                            <label class="block mt-3 mb-2 text-sm dark:text-gray-200"
                                for="email">อีเมล์</label>
                            <input
                                v-model="formData.email"
                                :class="{ 'border-red-600': v$.email.$errors.length}"
                                class="w-full px-3 py-2 leading-tight text-gray-700  border rounded shadow appearance-none"
                                type="text"
                                id="email"
                                name="email">
                                <div v-for="error of v$.email.$errors" :key="error.$uid">
                                    <div class="text-sm mt-2 text-red-700">{{ error.$message }}</div>
                                </div>

                            <!-- password -->
                            <label class="block mt-3 mb-2 text-sm dark:text-gray-200"
                                for="password">รหัสผ่าน</label>
                            <input
                                v-model="formData.password"
                                :class="{ 'border-red-600': v$.password.$errors.length}"
                                class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none"
                                type="password"
                                id="password"
                                name="password">
                                <div v-for="error of v$.password.$errors" :key="error.$uid">
                                    <div class="text-sm mt-2 text-red-700">{{ error.$message }}</div>
                                </div>

                            <p class="my-4"></p>

                            <button
                                class="w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg cursor-pointer active:bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
                                type="submit"
                                :disabled="loading"
                            >
                                <span v-if="loading" class="flex items-center">
                                    <svg class="animate-spin w-5 h-5 mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <circle class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"></circle>
                                        <path class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8s-3.582 8-8 8V4a4 4 0 00-4-4"></path>
                                    </svg>
                                </span>
                                {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
                            </button>

                        </form>

                        <p class="my-8"></p>

                        <button
                            class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray">
                            <svg class="w-4 h-4 mr-2"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                            Github
                        </button>
                        <button
                            class="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium leading-5 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray">
                            <svg class="w-4 h-4 mr-2"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                            </svg>
                            Twitter
                        </button>

                        <p class="mt-4">
                            <router-link to="/forgotpassword"
                                class="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
                                ฉันลืมรหัสผ่าน
                            </router-link>
                        </p>
                        <p class="mt-1">
                            <router-link to="/register"
                                class="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
                                สมัครสมาชิกใหม่
                            </router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>