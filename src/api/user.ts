import http from '@/lib/http'

import { UpdateUserBodyType, UserResType } from '@/schema/user.schema'

const userApiRequest = {
  me: (sessionToken: string) =>
    http.get<UserResType>('token', {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  meClient: () => http.get<UserResType>('token'),
  updateMe: (body: UpdateUserBodyType) => http.put<UserResType>('account/me', body),
}

export default userApiRequest
