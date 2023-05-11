export const useLogin = () => {
    const user = useUserStore()
    const username = $computed(() => user.username)
    const avatarUrl = $computed(() => user.avatarUrl)
    const phone = $computed(() => user.phone)
    const id = $computed(() => user.id)
    const department = $computed(() => user.department)
    const specialty = $computed(() => user.specialty)
    const { token, userList, permissionList, likeList, fansList } = storeToRefs(user)
    return $$({ token, username, userList, permissionList, user, id, likeList, fansList, avatarUrl, phone, department, specialty })
}