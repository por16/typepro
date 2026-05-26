import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  email: string
  role: string
  password: string
  name: string
  surname: string
  phoneNumber: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const isAuthorised = computed(() => user.value !== null)

  function setUser(data: User) {
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  }
  function resetUser() {
    user.value = null
    localStorage.removeItem('user')
  }
  function loadUser() {
    const stored = localStorage.getItem('user')
    if(stored) {
      user.value = JSON.parse(stored)
    }
  }
  
  return { user, isAuthorised, setUser, resetUser, loadUser }
})