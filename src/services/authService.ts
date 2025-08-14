import axios from "axios";

export interface LoginPayload {
  username: string;
  password: string;
}

export async function loginUser(payload: LoginPayload) {
  const response = await axios.post(
    "/user/login",
    {
      "params[username]": payload.username,
      "params[password]": payload.password,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    }
  );

  return response.data;
}
