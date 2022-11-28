export type WithId<T> = T & { _id: string };

export interface CommonShape {
  name: string;
  email: string;
}

export interface Account extends WithId<CommonShape> {
  cre_date: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegistryPayload extends CommonShape {
  password: string;
}
