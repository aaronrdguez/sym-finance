import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'

const getSecret = (): string => process.env.JWT_TOKEN!

export function serialize(payload: any, options?: SignOptions): Record<string, any> {
  return { message: 'ok', result: jwt.sign(payload, getSecret(), options) }
}

export function deserialize(token: string, options?: VerifyOptions): Record<string, any> | string {
  try {
    const decoded = jwt.verify(token, getSecret(), options)
    return { message: 'ok', decoded }
  } catch {
    return { message: 'Invalid or expired token' }
  }
}
