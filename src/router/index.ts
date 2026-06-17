import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import Statistics from '@/components/navigation/statistics/Statistics.vue'
import EditInspectorsQuestionnaire from '@/components/navigation/inspectors/EditInspectorsQuestionnaire.vue'
import InspectorsQuestionnairePreview from '@/components/navigation/inspectors/InspectorsQuestionnairePreview.vue'
import Inspector from '@/components/navigation/inspectors/Inspector.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: () => {
      const userStore = useUserStore()
      return userStore.isAuthorised ? '/checks' : '/login'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/components/navigation/register/Registartion.vue'),
    meta: {
      requiresAuthorisation: false
    }
  },
  {
    path: '/register/vk',
    name: 'register-vk',
    component: () => import('@/components/navigation/register/RegistrationVk.vue'),
    meta: {
      requiresAuthorisation: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/navigation/login/Authorization.vue'),
    meta: {
      requiresAuthorisation: false
    }
  },
  {
    path: '/password-recovery',
    name: 'password-recovery',
    component: () => import('@/components/navigation/login/PasswordRecovery.vue'),
    meta: {
      requiresAuthorisation: false
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/components/navigation/profile/Profile.vue'),
    meta: {
      requiresAuthorisation: true,
      title: 'Профиль'
    }
  },
  {
    path: '/profile/edit',
    name: 'edit',
    component: () => import('@/components/navigation/profile/ProfileEdit.vue'),
    meta: {
      requiresAuthorisation: true,
      title: 'Профиль'
    }
  },
  {
    path: '/checks',
    name: 'checks',
    component: () => import('@/components/navigation/checks/Checks.vue'),
    meta: {
      requiresAuthorisation: true,
      title: 'Проверки'
    }
  },
  {
    path: '/templates',
    name: 'taskTemplates',
    component: () => import('@/components/navigation/taskTemplates/taskTemplates.vue'),
    meta: {
      requiresAuthorisation: true,
      title: 'Шаблоны задач'
    }
  },
  {
    path: '/inspectors',
    name: 'inspectors',
    component: () => import('@/components/navigation/inspectors/Inspectors.vue'),
    meta: {
      requiresAuthorisation: true,
      title: 'Проверяющие'
    }
  },
  {
    path: '/inspectors/:id',
    name: 'inspector-info',
    component: Inspector,
    meta: {
      requiresAuthorisation: true,
    }
  },
  {
    path: '/inspectors/questionnaire/edit',
    name: 'questionnaire-edit',
    component: EditInspectorsQuestionnaire,
    meta: {
      requiresAuthorisation: true,
      title: 'Редактирование анкеты'
    }
  },
  {
    path: '/inspectors/questionnaire/preview',
    name: 'questionnaire-preview',
    component: InspectorsQuestionnairePreview,
    meta: { requiresAuthorisation: true }
  },
  {
    path: '/employees',
    name: 'employees',
    component: () => import('@/components/navigation/employees/Employees.vue'),
    meta: {
      requiresAuthorisation: true,
      title: 'Сотрудники'
    }
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: Statistics,
    meta: {
      requiresAuthorisation: true,
      title: 'Статистика'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/components/navigation/notFound/NotFound.vue'),
    meta: { requiresAuthorisation: false }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  userStore.loadUser()
  if (to.meta.requiresAuthorisation) {
    if (userStore.isAuthorised) {
      next()
    } else {
      next({ name: 'login', query: { redirect: to.fullPath } })
    }
  } 
  else if(to.meta.requiresAuthorisation === false) {
    if(userStore.isAuthorised) {
      next({ name: 'checks' })
    }
    else {
      next()
    }
  }
  else {
    next()
  }
})

export default router
