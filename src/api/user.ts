import http from '@/lib/http'

import { UpdateUserBodyType, UserResType } from '@/schema/user.schema'

const userApiRequest = {
  me: (sessionToken: string) =>
    http.get<UserResType>('auth/me', {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  meClient: () => http.get<UserResType>('auth/me'),
  updateMe: (body: UpdateUserBodyType) => http.put<UserResType>('account/me', body),
}

export default userApiRequest
