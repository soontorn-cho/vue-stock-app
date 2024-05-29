import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import FrontendLayout from "@/layouts/FrontendLayout.vue"
import Home from "@/views/frontend/Home.vue"
import About from "@/views/frontend/About.vue"
import Portfolio from "@/views/frontend/Portfolio.vue"
import Service from "@/views/frontend/Service.vue"
import Contact from "@/views/frontend/Contact.vue"
import ForgotPassword from "@/views/frontend/ForgotPassword.vue"
import Register from "@/views/frontend/Register.vue"
import Login from "@/views/frontend/Login.vue"
import BackendLayout from "@/layouts/BackendLayout.vue"
import Dashboard from "@/views/backend/Dashboard.vue"
import Product from "@/views/backend/Product.vue"

// ฟังก์ชันสำหรับทำ Route Guard
function authGuard(_to: any, _from: any, next: any) {
  // อ่านค่า token จาก localStorage
  let token = ""
  // ตรวจสอบว่ามี token หรือไม่
  try {
      token = localStorage.getItem('token') || ""
      if(token != ""){
        next() // ไปต่อ
      }else{
        next({name: 'Login'}) // ไปหน้า login
      }
  } catch (error) {
      console.log(error)
  }
}

const routes: Array<RouteRecordRaw> = [
    // Frontend Route
    {
        // เรียกตัว Frontend Layout (แม่)
        path: "/",
        name: "Frontend",
        component: FrontendLayout,
        // เรียกตัวลูกมาใส่
        children: [
            {
                path: "",
                name: "Home",
                component: Home,
                meta: {
                    title: "Home"
                }
            },
            {
                path: "about",
                name: "About",
                component: About,
                meta: {
                  title: "About",
                },
              },
              {
                path: "portfolio",
                name: "Portfolio",
                component: Portfolio,
                meta: {
                  title: "ผลงานของเรา",
                },
              },
              {
                path: "service",
                name: "Service",
                component: Service,
                meta: {
                  title: "บริการของเรา",
                },
              },
              {
                path: "contact",
                name: "Contact",
                component: Contact,
                meta: {
                  title: "ติดต่อเรา",
                },
              },
              {
                path: "register",
                name: "Register",
                component: Register,
                meta: {
                  title: "สมัครสมาชิก",
                },
              },
              {
                path: "login",
                name: "Login",
                component: Login,
                meta: {
                  title: "เข้าสู่ระบบ",
                },
              },
              {
                path: "forgotpassword",
                name: "ForgotPassword",
                component: ForgotPassword,
                meta: {
                  title: "ลืมรหัสผ่าน",
                },
              },
        ]
    },
    {
      path: "/backend",
      component: BackendLayout,
      beforeEnter: authGuard,
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: Dashboard,
          meta: {
            title: "Dahsboard",
          },
        },
        {
          path: "product",
          name: "Product",
          component: Product,
          meta: {
            title: "Product",
          },
        }
      ],
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.URL),
    routes,
  })

  // การเรียกทำงานก่อนที่ route จะโหลด
router.beforeEach((to, _, next) => {
  if (typeof to.meta.title == "string") {
    document.title = to.meta.title
  }
  next()
})

  export default router