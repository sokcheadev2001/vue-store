import type { MenuItem } from '@/domains/common/interface'
import { useRoute } from 'vue-router'

export const useApp = () => {
  const route = useRoute()
  const isMenuActive = (menu: MenuItem) => menu.url === route.path

  return { isMenuActive }
}
